import { Router, Request, Response } from 'express';
import { auctionListings } from '../mocks/auctions.js';
import { authMiddleware } from '../middleware/auth.js';
import { runQuery, getOne, getAll } from '../db/database.js';

const router = Router();

const auctionStats = {
  activeLots: 10,
  totalValue: 1200000,
  averageBid: 850,
  completedToday: 32
};


// /**
//  * @swagger
//  * /api/auctions/get-all:
//  *   get:
//  *     tags:
//  *       - Auctions
//  *     summary: Get all auctions with pagination
//  *     parameters:
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *         description: Page number for pagination
//  *     responses:
//  *       200:
//  *         description: A list of auctions with pagination info
//  */

// // GET all auctions (pagination: fixed 9 per page)
// router.get('/get-all', (req: Request, res: Response) => {
//   const page = Number(req.query.page) || 1;
//   const limit = 9;  

//   const start = (page - 1) * limit;

//   res.json({
//     success: true,
//     data: auctionListings.slice(start, start + limit),
//     total: auctionListings.length,
//     page,
//     totalPages: Math.ceil(auctionListings.length / limit),
//     stats: auctionStats
//   });
// });

/**
 * @swagger
 * /api/auctions/get-top:
 *   get:
 *     tags:
 *       - Auctions
 *     summary: Get top 4 auctions for the homepage
 *     responses:
 *       200:
 *         description: Top 4 auctions
 */

// GET top 4 auctions on home page
router.get('/get-top', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: auctionListings.slice(0, 6),
    stats: auctionStats
  });
});

/**
 * @swagger
 * /api/auctions/get/{id}:
 *   get:
 *     tags:
 *       - Auctions
 *     summary: Get auction details by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the auction
 *     responses:
 *       200: 
 *         description: detail of specific auction
 *       404:
 *         description: Auction not found
 */
// GET auction by ID
router.get('/get/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const auction = auctionListings.find(item => item.id === parseInt(id));

  if (!auction) {
    return res.status(404).json({
      success: false,
      message: 'Auction not found'
    });
  }

  res.json({
    success: true,
    data: auction
  });
});



/**
 * @swagger
 * /api/auctions/get-related/{id}:
 *   get:
 *     tags:
 *       - Auctions
 *     summary: Get related auctions by item ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the auction
 *     responses:
 *       200: 
 *         description: top 4 related auctions based on category
 *       404:
 *         description: Auction not found
 */

// GET related auctions by item ID
router.get('/get-related/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const auction = auctionListings.find(item => item.id === parseInt(id));

  if (!auction) {
    return res.status(404).json({
      success: false,
      message: 'Auction not found'
    });
  }

  const relatedItems = auctionListings
    .filter(item => item.category === auction.category && item.id !== auction.id)
    .slice(0, 4);

  res.json({
    success: true,
    data: relatedItems
  });
});


/**
 * @swagger
 * /api/auctions/search:
 *   get:
 *     tags:
 *       - Auctions
 *     summary: Search auctions by title substring with pagination
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: A list of matching auctions
 *       400:
 *         description: Missing search query
 */

// SEARCH auctions by title substring with pagination
router.get('/search', (req: Request, res: Response) => {
  const q = req.query.q as string;
  const page = Number(req.query.page) || 1;
  const limit = 9; 
  if (!q) {
    // If no search query is provided, return all auctions with pagination
    const start = (page - 1) * limit;
    return res.json({
      success: true,
      data: auctionListings.slice(start, start + limit),
      total: auctionListings.length,
      page,
      totalPages: Math.ceil(auctionListings.length / limit),
    });
  }
  const searchTerm = q.toLowerCase();
  const filtered = auctionListings.filter(item =>
    item.title.toLowerCase().includes(searchTerm)
  );
  const start = (page - 1) * limit;
  res.json({
    success: true,
    data: filtered.slice(start, start + limit),
    total: filtered.length,
    page,
    limit
  });
});


/**
 * @swagger
 * /api/auctions/bid/{id}:
 *   get:
 *     tags:
 *       - Auctions
 *     summary: Place a bid on an auction
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the auction
 *       - in: query
 *         name: bidAmount
 *         required: true
 *         schema:
 *           type: number
 *         description: The amount of the bid
 *     responses:
 *       200:
 *         description: Bid placed successfully
 *       400:
 *         description: Invalid bid amount
 *       404:
 *         description: Auction not found
 */

// PLACE a bid (changed to GET method)
router.get('/bid/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const bidAmount = Number(req.query.bidAmount);

  const auction = auctionListings.find(item => item.id === parseInt(id));

  if (!auction) {
    return res.status(404).json({
      success: false,
      message: 'Auction not found'
    });
  }

  if (bidAmount <= auction.currentBid) {
    return res.status(400).json({
      success: false,
      message: 'Bid amount must be higher than the current bid'
    });
  }

  auction.currentBid = bidAmount;
  auction.totalBids += 1;

  res.json({
    success: true,
    message: 'Bid placed successfully',
    data: auction
  });
});

/**
 * @swagger
 * /api/auctions/watch/{id}:
 *   post:
 *     tags:
 *       - Auctions
 *     summary: Add an auction to user's watchlist
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the auction
 *     responses:
 *       200:
 *         description: Item added to watchlist successfully
 *       400:
 *         description: Item already in watchlist
 *       401:
 *         description: Unauthorized - no token provided
 */
router.post('/watch/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const auctionId = parseInt(id);
    if (Number.isNaN(auctionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid auction id'
      });
    }

    // Validate user still exists (handles stale tokens after DB resets).
    const userExists = await getOne<{ id: number }>(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );
    if (!userExists) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please log in again.'
      });
    }

    // Watchlist table references auctions(id), so this auction must exist in DB.
    const auctionExists = await getOne<{ id: number }>(
      'SELECT id FROM auctions WHERE id = ?',
      [auctionId]
    );
    if (!auctionExists) {
      return res.status(404).json({
        success: false,
        message: 'Auction is not stored in database. This item cannot be watched yet.'
      });
    }

    // Check if already in watchlist
    const existing = await getOne(
      'SELECT id FROM watchlist WHERE user_id = ? AND auction_id = ?',
      [userId, auctionId]
    );

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Item already in watchlist'
      });
    }

    // Add to watchlist
    await runQuery(
      'INSERT INTO watchlist (user_id, auction_id) VALUES (?, ?)',
      [userId, auctionId]
    );

    res.json({
      success: true,
      message: 'Item added to watchlist'
    });
  } catch (error) {
    console.error('Error adding to watchlist:', error);

    if (error instanceof Error && error.message.includes('SQLITE_CONSTRAINT')) {
      return res.status(400).json({
        success: false,
        message: 'Cannot add to watchlist because related user or auction record is missing.'
      });
    }

    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/auctions/unwatch/{id}:
 *   delete:
 *     tags:
 *       - Auctions
 *     summary: Remove an auction from user's watchlist
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the auction
 *     responses:
 *       200:
 *         description: Item removed from watchlist successfully
 *       404:
 *         description: Item not in watchlist
 *       401:
 *         description: Unauthorized - no token provided
 */
router.delete('/unwatch/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const auctionId = parseInt(id);

    // Remove from watchlist
    const result = await new Promise<number>((resolve, reject) => {
      const db = require('../db/database.js').default;
      db.run(
        'DELETE FROM watchlist WHERE user_id = ? AND auction_id = ?',
        [userId, auctionId],
        function(this: any, err: any) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not in watchlist'
      });
    }

    res.json({
      success: true,
      message: 'Item removed from watchlist'
    });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/auctions/get-watchlist:
 *   get:
 *     tags:
 *       - Auctions
 *     summary: Get user's watchlist
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User's watchlist items
 *       401:
 *         description: Unauthorized - no token provided
 */
router.get('/get-watchlist', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const watchlist = await getAll(
      `SELECT a.* FROM auctions a
       INNER JOIN watchlist w ON a.id = w.auction_id
       WHERE w.user_id = ?
       ORDER BY w.createdAt DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: watchlist
    });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/auctions/is-watched/{id}:
 *   get:
 *     tags:
 *       - Auctions
 *     summary: Check if auction is in user's watchlist
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the auction
 *     responses:
 *       200:
 *         description: Watch status of the auction
 *       401:
 *         description: Unauthorized - no token provided
 */
router.get('/is-watched/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const auctionId = parseInt(id);
    const watchItem = await getOne(
      'SELECT id FROM watchlist WHERE user_id = ? AND auction_id = ?',
      [userId, auctionId]
    );

    res.json({
      success: true,
      isWatched: !!watchItem
    });
  } catch (error) {
    console.error('Error checking watchlist:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/auctions/create:
 *   post:
 *     tags:
 *       - Auctions
 *     summary: Create a new auction
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Auction title
 *               category:
 *                 type: string
 *                 description: Category of the item
 *               description:
 *                 type: string
 *                 description: Detailed description of the item
 *               startPrice:
 *                 type: number
 *                 description: Starting bid price
 *               condition:
 *                 type: string
 *                 description: Item condition (e.g., Excellent, Good, Fair)
 *               image:
 *                 type: string
 *                 description: URL or path to item image
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: Auction end time (ISO 8601 format)
 *             required:
 *               - title
 *               - category
 *               - startPrice
 *               - endTime
 *     responses:
 *       201:
 *         description: Auction created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - no token provided
 */
router.post('/create', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, category, description, startPrice, condition, image, endTime } = req.body;
    const seller_id = req.user?.userId;

    if (!seller_id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Validation
    if (!title || !category || !startPrice || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, category, startPrice, endTime'
      });
    }

    if (isNaN(parseFloat(startPrice)) || parseFloat(startPrice) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'startPrice must be a positive number'
      });
    }

    // Validate endTime
    const endTimeDate = new Date(endTime);
    if (isNaN(endTimeDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid endTime format. Use ISO 8601 format (e.g., 2026-03-15T18:30:00Z)'
      });
    }

    if (endTimeDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Auction end time must be in the future'
      });
    }

    // Create auction
    await runQuery(
      `INSERT INTO auctions (title, category, description, startPrice, currentBid, image, condition, seller_id, endTime, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, category, description || null, startPrice, startPrice, image || null, condition || null, seller_id, endTime, 'active']
    );

    // Get the created auction
    const newAuction = await getOne(
      'SELECT * FROM auctions WHERE seller_id = ? ORDER BY id DESC LIMIT 1',
      [seller_id]
    );

    res.status(201).json({
      success: true,
      message: 'Auction created successfully',
      data: newAuction
    });
  } catch (error) {
    console.error('Error creating auction:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
