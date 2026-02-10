const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = process.resourcesPath
  ? path.join(process.resourcesPath, 'erp.db')
  : path.join(__dirname, 'erp.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT,
      price REAL,
      cost REAL,
      category TEXT,
      stock INTEGER,
      minStock INTEGER,
      image TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      items TEXT,
      subtotal REAL,
      tax REAL,
      total REAL,
      profit REAL,
      timestamp INTEGER,
      paymentMethod TEXT,
      staffId TEXT DEFAULT NULL,
      status TEXT DEFAULT 'completed'
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS staff (
      id TEXT PRIMARY KEY,
      name TEXT,
      role TEXT,
      isClockedIn INTEGER,
      lastClockIn INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS config (
      id INTEGER PRIMARY KEY,
      name TEXT,
      currency TEXT,
      taxRate REAL
    )
  `);

});

module.exports = db;