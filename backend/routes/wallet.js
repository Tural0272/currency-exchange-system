const express = require('express');
const { getDatabase } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get wallet balances
router.get('/balances', authenticateToken, (req, res) => {
  try {
    const db = getDatabase();
    const wallets = db.prepare('SELECT currencyCode, balance FROM wallets WHERE userId = ? ORDER BY currencyCode')
      .all(req.user.userId);

    res.json({ balances: wallets });
  } catch (error) {
    console.error('Balances error:', error);
    res.status(500).json({ error: 'Failed to fetch balances' });
  }
});

// Fund PLN wallet (simulated)
router.post('/fund', authenticateToken, (req, res) => {
  try {
    const { amountPLN } = req.body;

    if (!amountPLN || typeof amountPLN !== 'number' || amountPLN <= 0) {
      return res.status(400).json({ error: 'Valid positive amount is required' });
    }

    const db = getDatabase();
    
    // Get or create PLN wallet
    let wallet = db.prepare('SELECT id, balance FROM wallets WHERE userId = ? AND currencyCode = ?')
      .get(req.user.userId, 'PLN');

    if (!wallet) {
      const result = db.prepare('INSERT INTO wallets (userId, currencyCode, balance) VALUES (?, ?, ?)')
        .run(req.user.userId, 'PLN', amountPLN);
      wallet = { id: result.lastInsertRowid, balance: amountPLN };
    } else {
      db.prepare('UPDATE wallets SET balance = balance + ? WHERE id = ?')
        .run(amountPLN, wallet.id);
      wallet.balance += amountPLN;
    }

    // Record transaction
    db.prepare(`
      INSERT INTO transactions (userId, type, currencyCode, amount, rate, plnChange)
      VALUES (?, 'FUND', 'PLN', ?, 1, ?)
    `).run(req.user.userId, amountPLN, amountPLN);

    res.json({
      success: true,
      balance: wallet.balance,
      funded: amountPLN
    });
  } catch (error) {
    console.error('Fund error:', error);
    res.status(500).json({ error: 'Failed to fund wallet' });
  }
});

module.exports = router;
