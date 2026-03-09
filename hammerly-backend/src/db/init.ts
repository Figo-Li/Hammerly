import db, { runQuery, getOne } from './database.js';
import { hashPassword } from '../utils/auth.js';

/**
 * Safely add a column to a table (ignores error if column already exists)
 */
const addColumnIfNotExists = async (table: string, column: string, type: string) => {
  try {
    await runQuery(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
  } catch {
    // Column already exists — ignore
  }
};

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
        phone TEXT DEFAULT '',
        avatarImage TEXT DEFAULT '',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add columns for existing databases that don't have them yet
    await addColumnIfNotExists('users', 'phone', "TEXT DEFAULT ''");
    await addColumnIfNotExists('users', 'avatarImage', "TEXT DEFAULT ''");

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

    // Payment methods table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS payment_methods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        cardType TEXT NOT NULL,
        lastFour TEXT NOT NULL,
        expiryMonth INTEGER NOT NULL,
        expiryYear INTEGER NOT NULL,
        cardholderName TEXT NOT NULL,
        isDefault INTEGER DEFAULT 0,
        billingAddress TEXT DEFAULT '',
        billingCity TEXT DEFAULT '',
        billingProvince TEXT DEFAULT '',
        billingPostalCode TEXT DEFAULT '',
        billingCountry TEXT DEFAULT '',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log('✅ Database tables initialized successfully');

    // Seed sample data if DB is empty
    await seedDatabase();
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

/**
 * Seed the database with sample users and auctions (only if tables are empty)
 */
const seedDatabase = async () => {
  const existingUser = await getOne<{ id: number }>('SELECT id FROM users LIMIT 1');
  if (existingUser) return; // Already seeded

  console.log('🌱 Seeding database with sample data...');

  const hashedPassword = await hashPassword('password123');

  // Create sample users
  await runQuery(
    `INSERT INTO users (firstName, lastName, email, password, phone) VALUES (?, ?, ?, ?, ?)`,
    ['Alice', 'Johnson', 'alice@example.com', hashedPassword, '555-0101']
  );
  await runQuery(
    `INSERT INTO users (firstName, lastName, email, password, phone) VALUES (?, ?, ?, ?, ?)`,
    ['Bob', 'Smith', 'bob@example.com', hashedPassword, '555-0102']
  );
  await runQuery(
    `INSERT INTO users (firstName, lastName, email, password, phone) VALUES (?, ?, ?, ?, ?)`,
    ['Carol', 'Williams', 'carol@example.com', hashedPassword, '555-0103']
  );

  // Helper: endTime N days from now
  const daysFromNow = (days: number) =>
    new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

  // Sample auctions  (seller_id references the users above: 1=Alice, 2=Bob, 3=Carol)
  const auctions = [
    { title: 'Antique Victorian Pocket Watch', category: 'Jewelry & Watches', description: 'Beautiful 1890s gold-plated pocket watch in excellent working condition.', startPrice: 500, currentBid: 850, image: '/images/picture.jpg', condition: 'Excellent', seller_id: 1, days: 3 },
    { title: 'Rare First Edition Novel — 1925', category: 'Books & Manuscripts', description: 'First edition hardcover with original dust jacket. Minor shelf wear.', startPrice: 1200, currentBid: 2400, image: '/images/picture.jpg', condition: 'Very Good', seller_id: 1, days: 5 },
    { title: 'Mid-Century Modern Teak Desk', category: 'Furniture', description: 'Scandinavian design teak desk from the 1960s. Recently restored.', startPrice: 800, currentBid: 1350, image: '/images/picture.jpg', condition: 'Restored', seller_id: 2, days: 2 },
    { title: 'Vintage Leica M3 Camera', category: 'Cameras & Photography', description: 'Classic 1954 rangefinder camera. Fully functional with minor cosmetic wear.', startPrice: 2000, currentBid: 3100, image: '/images/picture.jpg', condition: 'Good', seller_id: 2, days: 7 },
    { title: 'Art Deco Bronze Sculpture', category: 'Art & Collectibles', description: 'Signed bronze sculpture, circa 1930. 12 inches tall.', startPrice: 600, currentBid: 950, image: '/images/picture.jpg', condition: 'Excellent', seller_id: 3, days: 4 },
    { title: 'Persian Silk Rug — Handwoven', category: 'Rugs & Textiles', description: 'Authentic handwoven silk rug from Isfahan. 4×6 feet.', startPrice: 3000, currentBid: 4500, image: '/images/picture.jpg', condition: 'Excellent', seller_id: 3, days: 6 },
    { title: 'Sterling Silver Tea Set', category: 'Silver & Metalware', description: 'Complete 5-piece Victorian sterling silver tea service. Hallmarked.', startPrice: 1500, currentBid: 2200, image: '/images/picture.jpg', condition: 'Very Good', seller_id: 1, days: 8 },
    { title: 'Vintage Gibson Les Paul Guitar', category: 'Musical Instruments', description: '1959 reissue Gibson Les Paul Standard. Cherry sunburst finish.', startPrice: 4000, currentBid: 5800, image: '/images/picture.jpg', condition: 'Excellent', seller_id: 2, days: 10 },
  ];

  for (const a of auctions) {
    await runQuery(
      `INSERT INTO auctions (title, category, description, startPrice, currentBid, image, condition, seller_id, status, endTime)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)`,
      [a.title, a.category, a.description, a.startPrice, a.currentBid, a.image, a.condition, a.seller_id, daysFromNow(a.days)]
    );
  }

  // Add a few sample bids
  await runQuery(`INSERT INTO bids (auction_id, bidder_id, amount) VALUES (?, ?, ?)`, [1, 2, 650]);
  await runQuery(`INSERT INTO bids (auction_id, bidder_id, amount) VALUES (?, ?, ?)`, [1, 3, 850]);
  await runQuery(`INSERT INTO bids (auction_id, bidder_id, amount) VALUES (?, ?, ?)`, [2, 3, 1800]);
  await runQuery(`INSERT INTO bids (auction_id, bidder_id, amount) VALUES (?, ?, ?)`, [2, 2, 2400]);
  await runQuery(`INSERT INTO bids (auction_id, bidder_id, amount) VALUES (?, ?, ?)`, [3, 1, 1000]);
  await runQuery(`INSERT INTO bids (auction_id, bidder_id, amount) VALUES (?, ?, ?)`, [3, 3, 1350]);
  await runQuery(`INSERT INTO bids (auction_id, bidder_id, amount) VALUES (?, ?, ?)`, [4, 1, 2500]);
  await runQuery(`INSERT INTO bids (auction_id, bidder_id, amount) VALUES (?, ?, ?)`, [4, 3, 3100]);

  console.log('✅ Seed data inserted (3 users, 8 auctions, 8 bids)');
};
