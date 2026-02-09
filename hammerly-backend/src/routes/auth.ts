import { Router, Request, Response } from 'express';
import { getOne, getAll, runQuery } from '../db/database.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: string;
}

// POST register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user exists
    const existingUser = await getOne<User>('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    await runQuery(
      'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword]
    );

    // Get the created user
    const newUser = await getOne<User>('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!newUser) {
      return res.status(500).json({
        success: false,
        message: 'Error creating user'
      });
    }

    // Generate token
    const token = generateToken(newUser.id, newUser.email);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await getOne<User>('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST logout (client-side token removal, but we can still provide endpoint)
router.post('/logout', authMiddleware, (req: Request, res: Response) => {
  // Token verification happens in middleware
  // Client should remove token from storage
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// GET debug endpoint - show all database tables info and last 10 rows
router.get('/', async (req: Request, res: Response) => {
  try {
    // Get all table names
    const tables = await getAll<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );

    const dbInfo: any = {
      success: true,
      tables: [],
      totalTables: tables.length
    };

    // Get info for each table
    for (const table of tables) {
      const tableName = table.name;
      
      // Get table schema
      const schema = await getAll<any>(`PRAGMA table_info(${tableName})`);
      
      // Get last 10 rows
      const rows = await getAll<any>(`SELECT * FROM ${tableName} ORDER BY id DESC LIMIT 10`);
      
      // Get row count
      const count = await getOne<{ count: number }>(
        `SELECT COUNT(*) as count FROM ${tableName}`
      );

      dbInfo.tables.push({
        name: tableName,
        rowCount: count?.count || 0,
        columns: schema.map((col: any) => ({
          name: col.name,
          type: col.type,
          notnull: col.notnull,
          primaryKey: col.pk
        })),
        lastRows: rows.reverse() // Show oldest first (reverse to show 10 oldest)
      });
    }

    res.json(dbInfo);
  } catch (error) {
    console.error('Database info error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching database info',
      error: (error as Error).message
    });
  }
});

export default router;
