const express = require('express');
const { getDatabase } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get transaction history
router.get('/', authenticateToken, (req, res) => {
  try {
    const db = getDatabase();
    const transactions = db.prepare(`
      SELECT id, type, currencyCode, amount, rate, plnChange, createdAt
      FROM transactions
      WHERE userId = ?
      ORDER BY createdAt DESC
      LIMIT 100
    `).all(req.user.userId);

    res.json({ transactions });
  } catch (error) {
    console.error('Transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;
