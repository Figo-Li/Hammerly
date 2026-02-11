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
    seller: "seller 1"
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
  }
];

const auctionStats = {
  activeLots: 6,
  totalValue: 1200000,
  averageBid: 850,
  completedToday: 32
};

// GET all auctions
router.get('/get-all', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: auctionListings,
    stats: auctionStats
  });
});

// GET top 4 auctions on home page
router.get('/get-top4', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: auctionListings.slice(0, 4),
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

export default router;
