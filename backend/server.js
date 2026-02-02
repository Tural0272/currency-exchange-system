const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const ratesRoutes = require('./routes/rates');
const walletRoutes = require('./routes/wallet');
const tradeRoutes = require('./routes/trade');
const transactionRoutes = require('./routes/transactions');
const { initDatabase } = require('./db/database');

const app = express();
const PORT = 3010;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDatabase();

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Routes
app.use('/auth', authRoutes);
app.use('/rates', ratesRoutes);
app.use('/wallet', walletRoutes);
app.use('/trade', tradeRoutes);
app.use('/transactions', transactionRoutes);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
