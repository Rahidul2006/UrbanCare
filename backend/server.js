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

    // Drop existing issues table if it exists without updated_at
    try {
      await client.query(`ALTER TABLE issues ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
      console.log('✅ Added updated_at column to issues table');
    } catch (e) {
      console.log('ℹ️  updated_at column already exists');
    }

    // Create issues table if it doesn't exist
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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

// =======================
// ISSUE REPORTING ROUTES
// =======================

// Submit a new issue (citizen)
app.post('/api/issues', async (req, res) => {
  const { title, description, category, location, userId } = req.body;

  console.log('📩 Received issue submission:', { title, description, category, location, userId });

  // Validate required fields
  if (!title || !description || !category || !userId) {
    console.log('❌ Validation failed - missing required fields');
    return res.status(400).json({ error: 'Title, description, category, and user ID are required' });
  }

  if (!location || !location.address) {
    console.log('❌ Validation failed - missing location');
    return res.status(400).json({ error: 'Location with address is required' });
  }

  try {
    console.log('🔍 Validating with database...');
    // Check if user exists
    const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      console.log('❌ User not found:', userId);
      return res.status(400).json({ error: 'User not found in database' });
    }
    
    // Determine department based on category
    const categoryMap = {
      pothole: 'Public Works',
      streetlight: 'Electrical Services',
      trash: 'Sanitation',
      graffiti: 'Parks & Recreation',
      signage: 'Public Works',
      water: 'Public Works',
      sidewalk: 'Public Works',
      other: 'General Services'
    };

    const department = categoryMap[category] || 'General Services';

    console.log('💾 Inserting issue into database...');
    // Insert issue into database (WITHOUT images)
    const result = await pool.query(
      `INSERT INTO issues (
        title, description, category, location_address, 
        location_lat, location_lng, department, user_id, 
        status, priority
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        title,
        description,
        category,
        location.address || '',
        location.latitude || null,
        location.longitude || null,
        department,
        userId,
        'submitted',
        'medium'
      ]
    );

    const issue = result.rows[0];
    console.log('✅ Issue created with ID:', issue.id);

    // Get user info
    const userResult = await pool.query('SELECT name, email FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0] || { name: 'Unknown', email: 'unknown@example.com' };

    console.log('📤 Sending response...');
    res.status(201).json({
      success: true,
      issue: {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        category: issue.category,
        status: issue.status,
        priority: issue.priority,
        location: {
          address: issue.location_address,
          latitude: issue.location_lat,
          longitude: issue.location_lng
        },
        reportedBy: {
          id: issue.user_id,
          name: user.name,
          email: user.email
        },
        department: issue.department,
        createdAt: issue.created_at,
        updatedAt: issue.updated_at
      }
    });
  } catch (error) {
    console.error('❌ Issue submission error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: 'Failed to submit issue: ' + (error.message || 'Unknown database error') });
  }
});  

// Get all issues with filters (admin & central admin)
app.get('/api/issues', async (req, res) => {
  const { status, priority, department, userId, limit = 100, offset = 0 } = req.query;

  try {
    let query = 'SELECT * FROM issues WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (priority) {
      paramCount++;
      query += ` AND priority = $${paramCount}`;
      params.push(priority);
    }

    if (department) {
      paramCount++;
      query += ` AND department = $${paramCount}`;
      params.push(department);
    }

    if (userId) {
      paramCount++;
      query += ` AND user_id = $${paramCount}`;
      params.push(userId);
    }

    query += ' ORDER BY created_at DESC';

    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(limit);

    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await pool.query(query, params);
    const issues = result.rows;

    // Get user info for each issue
    const issuesWithUsers = await Promise.all(
      issues.map(async (issue) => {
        const userResult = await pool.query('SELECT name, email FROM users WHERE id = $1', [issue.user_id]);
        const user = userResult.rows[0];

        return {
          id: issue.id,
          title: issue.title,
          description: issue.description,
          category: issue.category,
          status: issue.status,
          priority: issue.priority,
          location: {
            address: issue.location_address,
            latitude: issue.location_lat,
            longitude: issue.location_lng
          },
          reportedBy: {
            id: issue.user_id,
            name: user?.name || 'Unknown',
            email: user?.email || 'unknown@example.com'
          },
          department: issue.department,
          createdAt: issue.created_at,
          updatedAt: issue.updated_at,
          resolvedAt: issue.resolved_at
        };
      })
    );

    res.json({
      success: true,
      issues: issuesWithUsers
    });
  } catch (error) {
    console.error('Get issues error:', error);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

// Get single issue by ID
app.get('/api/issues/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM issues WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    const issue = result.rows[0];

    // Get user info
    const userResult = await pool.query('SELECT name, email FROM users WHERE id = $1', [issue.user_id]);
    const user = userResult.rows[0];

    res.json({
      success: true,
      issue: {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        category: issue.category,
        status: issue.status,
        priority: issue.priority,
        location: {
          address: issue.location_address,
          latitude: issue.location_lat,
          longitude: issue.location_lng
        },
        photos: issue.images,
        reportedBy: {
          id: issue.user_id,
          name: user?.name || 'Unknown',
          email: user?.email || 'unknown@example.com'
        },
        department: issue.department,
        createdAt: issue.created_at,
        updatedAt: issue.updated_at,
        resolvedAt: issue.resolved_at
      }
    });
  } catch (error) {
    console.error('Get issue error:', error);
    res.status(500).json({ error: 'Failed to fetch issue' });
  }
});

// Update issue (admin & central admin)
app.put('/api/issues/:id', async (req, res) => {
  const { id } = req.params;
  const { status, priority, department } = req.body;

  try {
    const result = await pool.query('SELECT * FROM issues WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    const issue = result.rows[0];
    const updateData = {
      status: status || issue.status,
      priority: priority || issue.priority,
      department: department || issue.department
    };

    // Set resolved_at if status is being set to resolved
    const resolvedAt = updateData.status === 'resolved' ? new Date() : issue.resolved_at;

    const updateResult = await pool.query(
      `UPDATE issues 
       SET status = $1, priority = $2, department = $3, resolved_at = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [updateData.status, updateData.priority, updateData.department, resolvedAt, id]
    );

    const updatedIssue = updateResult.rows[0];

    // Get user info
    const userResult = await pool.query('SELECT name, email FROM users WHERE id = $1', [updatedIssue.user_id]);
    const user = userResult.rows[0];

    res.json({
      success: true,
      issue: {
        id: updatedIssue.id,
        title: updatedIssue.title,
        description: updatedIssue.description,
        category: updatedIssue.category,
        status: updatedIssue.status,
        priority: updatedIssue.priority,
        location: {
          address: updatedIssue.location_address,
          latitude: updatedIssue.location_lat,
          longitude: updatedIssue.location_lng
        },
        reportedBy: {
          id: updatedIssue.user_id,
          name: user?.name || 'Unknown',
          email: user?.email || 'unknown@example.com'
        },
        department: updatedIssue.department,
        createdAt: updatedIssue.created_at,
        updatedAt: updatedIssue.updated_at,
        resolvedAt: updatedIssue.resolved_at
      }
    });
  } catch (error) {
    console.error('Update issue error:', error);
    res.status(500).json({ error: 'Failed to update issue' });
  }
});

// Get issue statistics (for central admin)
app.get('/api/issues/stats/overview', async (req, res) => {
  try {
    const totalResult = await pool.query('SELECT COUNT(*) FROM issues');
    const resolvedResult = await pool.query("SELECT COUNT(*) FROM issues WHERE status = 'resolved'");
    const byStatusResult = await pool.query(
      "SELECT status, COUNT(*) as count FROM issues GROUP BY status"
    );
    const byDepartmentResult = await pool.query(
      "SELECT department, COUNT(*) as count FROM issues GROUP BY department"
    );

    res.json({
      success: true,
      stats: {
        totalIssues: parseInt(totalResult.rows[0].count),
        resolvedIssues: parseInt(resolvedResult.rows[0].count),
        byStatus: byStatusResult.rows,
        byDepartment: byDepartmentResult.rows
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
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
