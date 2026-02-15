import { Router, Request, Response } from 'express';
import { auctionListings } from '../mocks/auctions.js';

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
 * /api/auctions/{id}/bid:
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
router.get('/:id/bid', (req: Request, res: Response) => {
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




export default router;
