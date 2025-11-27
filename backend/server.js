import express from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '192006',
  database: process.env.DB_NAME || 'urbancare',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Initialize database
async function initializeDatabase() {
  const connection = await pool.getConnection();
  try {
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        mobile VARCHAR(20),
        role ENUM('citizen', 'admin', 'central-admin') DEFAULT 'citizen',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create predefined admins if they don't exist
    const adminEmail = 'admin@city.gov';
    const centralAdminEmail = 'central.admin@city.gov';

    const [adminExists] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [adminEmail]
    );

    if (adminExists.length === 0) {
      const hashedPassword = await bcrypt.hash('demo123', 10);
      await connection.execute(
        'INSERT INTO users (email, password, name, mobile, role) VALUES (?, ?, ?, ?, ?)',
        [adminEmail, hashedPassword, 'Sarah Martinez', '+1234567890', 'admin']
      );
      await connection.execute(
        'INSERT INTO users (email, password, name, mobile, role) VALUES (?, ?, ?, ?, ?)',
        [centralAdminEmail, hashedPassword, 'Sarah Johnson', '+1234567891', 'central-admin']
      );
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  } finally {
    connection.release();
  }
}

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, mobile } = req.body;

  if (!email || !password || !name || !mobile) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const connection = await pool.getConnection();
    
    // Check if user exists
    const [existingUser] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await connection.execute(
      'INSERT INTO users (email, password, name, mobile, role) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, name, mobile, 'citizen']
    );

    connection.release();

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
    const connection = await pool.getConnection();

    // Find user
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    connection.release();

    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found. Please register first.' });
    }

    const user = users[0];

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
    const connection = await pool.getConnection();

    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    connection.release();

    res.json({
      exists: users.length > 0,
      user: users.length > 0 ? {
        id: users[0].id,
        name: users[0].name,
        role: users[0].role
      } : null
    });
  } catch (error) {
    console.error('Check email error:', error);
    res.status(500).json({ error: 'Check failed' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Initialize and start server
initializeDatabase().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
