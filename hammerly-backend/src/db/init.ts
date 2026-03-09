import db, { runQuery, getOne } from './database.js';
import { auctionListings } from '../mocks/auctions.js';

export const initializeDatabase = async () => {
  try {
    // Create tables
    await runQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await runQuery(`
      CREATE TABLE IF NOT EXISTS auctions (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        startPrice REAL NOT NULL,
        currentBid REAL NOT NULL,
        image TEXT,
        condition TEXT,
        seller_id INTEGER NOT NULL,
        status TEXT DEFAULT 'active',
        endTime DATETIME NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES users(id)
      )
    `);

    await runQuery(`
      CREATE TABLE IF NOT EXISTS bids (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        auction_id INTEGER NOT NULL,
        bidder_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (auction_id) REFERENCES auctions(id),
        FOREIGN KEY (bidder_id) REFERENCES users(id)
      )
    `);

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

    console.log('Database tables created');
    await seedData();
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

const seedData = async () => {
  try {
    // Clear data
    await runQuery('PRAGMA foreign_keys = OFF');
    await runQuery('DELETE FROM bids');
    await runQuery('DELETE FROM watchlist');
    await runQuery('DELETE FROM auctions');
    await runQuery('DELETE FROM users');
    await runQuery('PRAGMA foreign_keys = ON');

    // Create sellers and build seller name to ID mapping
    const sellers = [
      { name: 'seller 1', firstName: 'John', lastName: 'Seller', email: 'seller1@hammerly.com', password: 'pass' },
      { name: 'seller 2', firstName: 'Jane', lastName: 'Dealer', email: 'seller2@hammerly.com', password: 'pass' },
      { name: 'seller 3', firstName: 'Bob', lastName: 'Vendor', email: 'seller3@hammerly.com', password: 'pass' },
      { name: 'seller 4', firstName: 'Alice', lastName: 'Merchant', email: 'seller4@hammerly.com', password: 'pass' }
    ];

    const sellerMap: { [key: string]: number } = {};

    for (const seller of sellers) {
      await runQuery(
        'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)',
        [seller.firstName, seller.lastName, seller.email, seller.password]
      );
      
      const result = await getOne('SELECT id FROM users WHERE email = ?', [seller.email]);
      if (result) {
        sellerMap[seller.name] = (result as any).id;
      }
    }

    // Create bidder user
    await runQuery(
      'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)',
      ['Bidder', 'User', 'bidder@hammerly.com', 'pass']
    );

    // Insert auctions
    for (const auction of auctionListings) {
      const endTime = calculateEndTime((auction as any).timeRemaining);
      const sellerId = sellerMap[(auction as any).seller];
      
      await runQuery(
        `INSERT INTO auctions (id, title, category, description, startPrice, currentBid, image, condition, seller_id, status, endTime)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          (auction as any).id,
          (auction as any).title,
          (auction as any).category,
          (auction as any).description || '',
          (auction as any).currentBid,
          (auction as any).currentBid,
          (auction as any).image,
          (auction as any).condition,
          sellerId,
          'active',
          endTime.toISOString()
        ]
      );
    }

    // Insert bid history for auction 1
    const bidderUser = await getOne('SELECT id FROM users WHERE email = ?', ['bidder@hammerly.com']);
    const bidderId = (bidderUser as any)?.id;
    
    const auction1 = auctionListings.find((a: any) => a.id === 1);
    if (auction1 && (auction1 as any).bidHistory && bidderId) {
      for (const bid of (auction1 as any).bidHistory) {
        await runQuery(
          'INSERT INTO bids (auction_id, bidder_id, amount) VALUES (?, ?, ?)',
          [1, bidderId, bid.amount]
        );
      }
    }

    console.log('Mock data seeded');
  } catch (error) {
    console.error('Seeding error:', error);
  }
};

const calculateEndTime = (timeRemaining: string): Date => {
  const now = new Date();
  let minutes = 0;

  const dayMatch = timeRemaining.match(/(\d+)d/);
  if (dayMatch) minutes += parseInt(dayMatch[1]) * 24 * 60;

  const hourMatch = timeRemaining.match(/(\d+)h/);
  if (hourMatch) minutes += parseInt(hourMatch[1]) * 60;

  const minMatch = timeRemaining.match(/(\d+)m/);
  if (minMatch) minutes += parseInt(minMatch[1]);

  return new Date(now.getTime() + minutes * 60 * 1000);
};
