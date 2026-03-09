import db, { runQuery } from './database.js';

/**
 * Initialize database schema
 */
export const initializeDatabase = async () => {
  try {
    // Users table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Auctions table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS auctions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        startPrice REAL NOT NULL,
        currentBid REAL NOT NULL,
        image TEXT,
        condition TEXT,
        seller_id INTEGER NOT NULL,
        status TEXT DEFAULT 'active',
        startTime DATETIME DEFAULT CURRENT_TIMESTAMP,
        endTime DATETIME NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES users(id)
      )
    `);

    // Bids table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS bids (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        auction_id INTEGER NOT NULL,
        bidder_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        bidTime DATETIME DEFAULT CURRENT_TIMESTAMP,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (auction_id) REFERENCES auctions(id),
        FOREIGN KEY (bidder_id) REFERENCES users(id)
      )
    `);

    // Watchlist table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS watchlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        auction_id INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, auction_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (auction_id) REFERENCES auctions(id)
      )
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};
