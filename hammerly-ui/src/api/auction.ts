const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const auctionApi = {
  // Get all auctions
  getAuctions: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auctions`);
      if (!response.ok) throw new Error('Failed to fetch auctions');
      return await response.json();
    } catch (error) {
      console.error('Error fetching auctions:', error);
      throw error;
    }
  },

  // Get single auction by ID
  getAuctionById: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auctions/${id}`);
      if (!response.ok) throw new Error('Auction not found');
      return await response.json();
    } catch (error) {
      console.error('Error fetching auction:', error);
      throw error;
    }
  },

  // Place a bid (skeleton for now)
  placeBid: async (auctionId: number, bidAmount: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auctions/${auctionId}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidAmount })
      });
      return await response.json();
    } catch (error) {
      console.error('Error placing bid:', error);
      throw error;
    }
  }
};