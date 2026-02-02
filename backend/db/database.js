const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'currency_exchange.db');
let db = null;

function initDatabase() {
  if (db) return db;
  
  db = new Database(DB_PATH);
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');
  
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      name TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
    
    CREATE TABLE IF NOT EXISTS wallets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      currencyCode TEXT NOT NULL,
      balance REAL NOT NULL DEFAULT 0,
      UNIQUE(userId, currencyCode),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('BUY', 'SELL', 'FUND')),
      currencyCode TEXT,
      amount REAL NOT NULL,
      rate REAL,
      plnChange REAL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
    
    CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(userId);
    CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(createdAt DESC);
    CREATE INDEX IF NOT EXISTS idx_wallets_user ON wallets(userId);
  `);
  
  // Seed demo user if not exists
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get('demo@example.com');
  if (!existingUser) {
    const passwordHash = bcrypt.hashSync('demo123', 10);
    const result = db.prepare('INSERT INTO users (email, passwordHash, name) VALUES (?, ?, ?)')
      .run('demo@example.com', passwordHash, 'Demo User');
    const userId = result.lastInsertRowid;
    
    // Create PLN wallet with 1000.00
    db.prepare('INSERT INTO wallets (userId, currencyCode, balance) VALUES (?, ?, ?)')
      .run(userId, 'PLN', 1000.00);
    
    // Create empty wallets for common currencies
    const currencies = ['USD', 'EUR', 'GBP'];
    const insertWallet = db.prepare('INSERT INTO wallets (userId, currencyCode, balance) VALUES (?, ?, ?)');
    currencies.forEach(code => {
      insertWallet.run(userId, code, 0.00);
    });
    
    console.log('Demo user created: demo@example.com / demo123');
  }
  
  return db;
}

function getDatabase() {
  if (!db) {
    return initDatabase();
  }
  return db;
}

module.exports = { initDatabase, getDatabase };
