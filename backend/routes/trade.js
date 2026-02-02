const express = require('express');
const axios = require('axios');
const { getDatabase } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const NBP_BASE_URL = 'https://api.nbp.pl/api/exchangerates';

// Buy currency
router.post('/buy', authenticateToken, async (req, res) => {
  try {
    const { code, amountForeign } = req.body;

    if (!code || !amountForeign) {
      return res.status(400).json({ error: 'Currency code and amount are required' });
    }

    if (typeof amountForeign !== 'number' || amountForeign <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    // Get current rate from NBP
    const response = await axios.get(`${NBP_BASE_URL}/rates/c/${code.toLowerCase()}/?format=json`);
    const askRate = response.data.rates[0].ask; // Buy price
    const plnNeeded = amountForeign * askRate;

    const db = getDatabase();

    // Check PLN balance
    const plnWallet = db.prepare('SELECT id, balance FROM wallets WHERE userId = ? AND currencyCode = ?')
      .get(req.user.userId, 'PLN');

    if (!plnWallet || plnWallet.balance < plnNeeded) {
      return res.status(400).json({ 
        error: 'Insufficient PLN balance',
        details: {
          required: plnNeeded,
          available: plnWallet?.balance || 0
        }
      });
    }

    // Execute transaction
    db.transaction(() => {
      // Deduct PLN
      db.prepare('UPDATE wallets SET balance = balance - ? WHERE id = ?')
        .run(plnNeeded, plnWallet.id);

      // Add foreign currency
      let foreignWallet = db.prepare('SELECT id, balance FROM wallets WHERE userId = ? AND currencyCode = ?')
        .get(req.user.userId, code.toUpperCase());

      if (!foreignWallet) {
        const result = db.prepare('INSERT INTO wallets (userId, currencyCode, balance) VALUES (?, ?, ?)')
          .run(req.user.userId, code.toUpperCase(), amountForeign);
        foreignWallet = { id: result.lastInsertRowid, balance: amountForeign };
      } else {
        db.prepare('UPDATE wallets SET balance = balance + ? WHERE id = ?')
          .run(amountForeign, foreignWallet.id);
        foreignWallet.balance += amountForeign;
      }

      // Record transaction
      db.prepare(`
        INSERT INTO transactions (userId, type, currencyCode, amount, rate, plnChange)
        VALUES (?, 'BUY', ?, ?, ?, ?)
      `).run(req.user.userId, code.toUpperCase(), amountForeign, askRate, -plnNeeded);
    })();

    res.json({
      success: true,
      currencyCode: code.toUpperCase(),
      amountForeign,
      rate: askRate,
      plnSpent: plnNeeded
    });
  } catch (error) {
    console.error('Buy error:', error.message);
    if (error.response?.status === 404) {
      res.status(404).json({ error: 'Currency not found' });
    } else {
      res.status(500).json({ error: 'Transaction failed' });
    }
  }
});

// Sell currency
router.post('/sell', authenticateToken, async (req, res) => {
  try {
    const { code, amountForeign } = req.body;

    if (!code || !amountForeign) {
      return res.status(400).json({ error: 'Currency code and amount are required' });
    }

    if (typeof amountForeign !== 'number' || amountForeign <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    // Get current rate from NBP
    const response = await axios.get(`${NBP_BASE_URL}/rates/c/${code.toLowerCase()}/?format=json`);
    const bidRate = response.data.rates[0].bid; // Sell price
    const plnReceived = amountForeign * bidRate;

    const db = getDatabase();

    // Check foreign currency balance
    const foreignWallet = db.prepare('SELECT id, balance FROM wallets WHERE userId = ? AND currencyCode = ?')
      .get(req.user.userId, code.toUpperCase());

    if (!foreignWallet || foreignWallet.balance < amountForeign) {
      return res.status(400).json({ 
        error: 'Insufficient currency balance',
        details: {
          required: amountForeign,
          available: foreignWallet?.balance || 0
        }
      });
    }

    // Execute transaction
    db.transaction(() => {
      // Deduct foreign currency
      db.prepare('UPDATE wallets SET balance = balance - ? WHERE id = ?')
        .run(amountForeign, foreignWallet.id);

      // Add PLN
      let plnWallet = db.prepare('SELECT id, balance FROM wallets WHERE userId = ? AND currencyCode = ?')
        .get(req.user.userId, 'PLN');

      if (!plnWallet) {
        const result = db.prepare('INSERT INTO wallets (userId, currencyCode, balance) VALUES (?, ?, ?)')
          .run(req.user.userId, 'PLN', plnReceived);
        plnWallet = { id: result.lastInsertRowid, balance: plnReceived };
      } else {
        db.prepare('UPDATE wallets SET balance = balance + ? WHERE id = ?')
          .run(plnReceived, plnWallet.id);
        plnWallet.balance += plnReceived;
      }

      // Record transaction
      db.prepare(`
        INSERT INTO transactions (userId, type, currencyCode, amount, rate, plnChange)
        VALUES (?, 'SELL', ?, ?, ?, ?)
      `).run(req.user.userId, code.toUpperCase(), amountForeign, bidRate, plnReceived);
    })();

    res.json({
      success: true,
      currencyCode: code.toUpperCase(),
      amountForeign,
      rate: bidRate,
      plnReceived
    });
  } catch (error) {
    console.error('Sell error:', error.message);
    if (error.response?.status === 404) {
      res.status(404).json({ error: 'Currency not found' });
    } else {
      res.status(500).json({ error: 'Transaction failed' });
    }
  }
});

module.exports = router;
