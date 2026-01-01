import express from 'express';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize database
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        mobile VARCHAR(20),
        role VARCHAR(50) DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin', 'central-admin')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create issues table
    await client.query(`
      CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        location_address VARCHAR(255),
        location_lat DECIMAL(10, 8),
        location_lng DECIMAL(11, 8),
        category VARCHAR(100),
        priority VARCHAR(50),
        status VARCHAR(50) DEFAULT 'submitted',
        department VARCHAR(100),
        user_id INT,
        images TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Create predefined admins if they don't exist
    const adminEmails = ['admin@city.gov', 'mike@city.gov'];
    const centralAdminEmails = ['system.admin@city.gov', 'central.admin@city.gov'];
    const citizenEmails = [
      { email: 'alex@example.com', name: 'Alex Johnson' },
      { email: 'maria@example.com', name: 'Maria Garcia' }
    ];

    const hashedPassword = await bcrypt.hash('demo123', 10);

    // Insert citizen users
    for (const citizen of citizenEmails) {
      const result = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [citizen.email]
      );
      
      if (result.rows.length === 0) {
        const mobile = citizen.email === 'alex@example.com' ? '+1234567894' : '+1234567895';
        
        await client.query(
          'INSERT INTO users (email, password, name, mobile, role) VALUES ($1, $2, $3, $4, $5)',
          [citizen.email, hashedPassword, citizen.name, mobile, 'citizen']
        );
      }
    }

    // Insert admin users
    for (const email of adminEmails) {
      const result = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      
      if (result.rows.length === 0) {
        const name = email === 'admin@city.gov' ? 'Sarah Martinez' : 'Mike Johnson';
        const mobile = email === 'admin@city.gov' ? '+1234567890' : '+1234567891';
        
        await client.query(
          'INSERT INTO users (email, password, name, mobile, role) VALUES ($1, $2, $3, $4, $5)',
          [email, hashedPassword, name, mobile, 'admin']
        );
      }
    }

    // Insert central admin users
    for (const email of centralAdminEmails) {
      const result = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      
      if (result.rows.length === 0) {
        const name = email === 'system.admin@city.gov' ? 'System Admin' : 'Sarah Johnson';
        const mobile = email === 'system.admin@city.gov' ? '+1234567892' : '+1234567893';
        
        await client.query(
          'INSERT INTO users (email, password, name, mobile, role) VALUES ($1, $2, $3, $4, $5)',
          [email, hashedPassword, name, mobile, 'central-admin']
        );
      }
    }

    console.log('Database initialized successfully ✅');
  } catch (error) {
    console.error('Database initialization error:', error);
  } finally {
    client.release();
  }
}

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, mobile } = req.body;

  if (!email || !password || !name || !mobile) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if user exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await pool.query(
      'INSERT INTO users (email, password, name, mobile, role) VALUES ($1, $2, $3, $4, $5)',
      [email, hashedPassword, name, mobile, 'citizen']
    );

    res.json({ 
      success: true, 
      message: 'Registration successful. Please login.' 
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    // Find user
    const query = role
      ? 'SELECT * FROM users WHERE email = $1 AND role = $2'
      : 'SELECT * FROM users WHERE email = $1';
    const params = role ? [email, role] : [email];

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found. Please register first.' });
    }

    const user = result.rows[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Check role if provided
    if (role && user.role !== role) {
      return res.status(401).json({ error: `This account is registered as ${user.role}, not ${role}` });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Check email exists
app.post('/api/auth/check-email', async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    res.json({
      exists: result.rows.length > 0,
      user: result.rows.length > 0 ? {
        id: result.rows[0].id,
        name: result.rows[0].name,
        role: result.rows[0].role
      } : null
    });
  } catch (error) {
    console.error('Check email error:', error);
    res.status(500).json({ error: 'Check failed' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running ✅' });
});

// Initialize and start server
initializeDatabase().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} ✅`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
