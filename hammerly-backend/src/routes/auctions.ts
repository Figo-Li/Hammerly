import { Router, Request, Response } from 'express';

const router = Router();

// Mock auction data
const auctionListings = [
  {
    id: 1,
    title: "Auction item 1",
    category: "Category 1",
    currentBid: 40000,
    timeRemaining: "2h 15m",
    image: "/images/picture.jpg",
    progress: 85,
    condition: "Very Good",
    totalBids: 28,
    seller: "seller 1",
    description: "This is a description of Auction item 1.",
    bidHistory: [
      { bidder: 'User***2', amount: 40000, time: '2 minutes ago' },
      { bidder: 'User***1', amount: 30000, time: '30 minutes ago' },
      { bidder: 'User***2', amount: 40000, time: '2 minutes ago' },
      { bidder: 'User***1', amount: 30000, time: '30 minutes ago' },
      { bidder: 'User***2', amount: 40000, time: '2 minutes ago' },
      { bidder: 'User***1', amount: 30000, time: '30 minutes ago' },
      { bidder: 'User***2', amount: 40000, time: '2 minutes ago' },
      { bidder: 'User***1', amount: 30000, time: '30 minutes ago' },
      { bidder: 'User***2', amount: 40000, time: '2 minutes ago' },
      { bidder: 'User***1', amount: 30000, time: '30 minutes ago' },
      { bidder: 'User***2', amount: 40000, time: '2 minutes ago' },
      { bidder: 'User***1', amount: 30000, time: '30 minutes ago' },
    ]
  },
  {
    id: 2,
    title: "Auction item 2",
    category: "Category 1",
    currentBid: 50000,
    timeRemaining: "4h 30m",
    image: "/images/picture.jpg",
    progress: 65,
    condition: "Good",
    totalBids: 15,
    seller: "seller 2"
  },
  {
    id: 3,
    title: "Auction item 3",
    category: "Category 2",
    currentBid: 10000,
    timeRemaining: "1d 6h",
    image: "/images/picture.jpg",
    progress: 40,
    condition: "Very Good",
    totalBids: 22,
    seller: "seller 3"
  },
  {
    id: 4,
    title: "Auction item 4",
    category: "Category 3",
    currentBid: 20000,
    timeRemaining: "3d 12h",
    image: "/images/picture.jpg",
    progress: 25,
    condition: "Excellent",
    totalBids: 8,
    seller: "seller 1"
  },
  {
    id: 5,
    title: "Auction item 5",
    category: "Category 3",
    currentBid: 20000,
    timeRemaining: "3d 12h",
    image: "/images/picture.jpg",
    progress: 25,
    condition: "Excellent",
    totalBids: 8,
    seller: "seller 3"
  },
  {
    id: 6,
    title: "Auction item 6",
    category: "Category 4",
    currentBid: 20000,
    timeRemaining: "1d 12h",
    image: "/images/picture.jpg",
    progress: 23,
    condition: "Excellent",
    totalBids: 3,
    seller: "seller 4"
  },
  {
    id: 7,
    title: "Auction item 7",
    category: "Category 2",
    currentBid: 20000,
    timeRemaining: "1d 12h",
    image: "/images/picture.jpg",
    progress: 23,
    condition: "Excellent",
    totalBids: 3,
    seller: "seller 4"
  },
  {
    id: 8,
    title: "Auction item 8",
    category: "Category 4",
    currentBid: 20000,
    timeRemaining: "1d 12h",
    image: "/images/picture.jpg",
    progress: 23,
    condition: "Excellent",
    totalBids: 3,
    seller: "seller 4"
  },
  {
    id: 9,
    title: "Auction item 8",
    category: "Category 2",
    currentBid: 20000,
    timeRemaining: "1d 12h",
    image: "/images/picture.jpg",
    progress: 23,
    condition: "Excellent",
    totalBids: 3,
    seller: "seller 4"
  },
  {
    id: 10,
    title: "Auction item 10",
    category: "Category 4",
    currentBid: 20000,
    timeRemaining: "1d 12h",
    image: "/images/picture.jpg",
    progress: 23,
    condition: "Excellent",
    totalBids: 3,
    seller: "seller 4"
  }
];

const auctionStats = {
  activeLots: 10,
  totalValue: 1200000,
  averageBid: 850,
  completedToday: 32
};

// GET all auctions (pagination: fixed 9 per page)
router.get('/get-all', (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = 9;  

  const start = (page - 1) * limit;

  res.json({
    success: true,
    data: auctionListings.slice(start, start + limit),
    total: auctionListings.length,
    page,
    totalPages: Math.ceil(auctionListings.length / limit),
    stats: auctionStats
  });
});


// GET top 4 auctions on home page
router.get('/get-top', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: auctionListings.slice(0, 6),
    stats: auctionStats
  });
});

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

// POST placeholder for placing a bid
router.post('/:id/bid', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Bid functionality coming soon'
  });
});

// SEARCH auctions by title substring with pagination
router.get('/search', (req: Request, res: Response) => {
  const q = req.query.q as string;
  const page = Number(req.query.page) || 1;
  const limit = 9; 
  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
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

export default router;
