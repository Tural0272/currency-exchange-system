const express = require('express');
const bcrypt = require('bcryptjs');
const { getDatabase } = require('../db/database');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const db = getDatabase();
    
    // Check if user exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: 'Account already exists' });
    }

    // Hash password
    const passwordHash = bcrypt.hashSync(password, 10);

    // Create user
    const result = db.prepare('INSERT INTO users (email, passwordHash, name) VALUES (?, ?, ?)')
      .run(email, passwordHash, name || null);
    const userId = result.lastInsertRowid;

    // Create PLN wallet
    db.prepare('INSERT INTO wallets (userId, currencyCode, balance) VALUES (?, ?, ?)')
      .run(userId, 'PLN', 0.00);

    const token = generateToken(userId, email);

    res.status(201).json({
      token,
      user: {
        id: userId,
        email,
        name: name || null
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = getDatabase();
    const user = db.prepare('SELECT id, email, passwordHash, name FROM users WHERE email = ?').get(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = bcrypt.compareSync(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.email);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
