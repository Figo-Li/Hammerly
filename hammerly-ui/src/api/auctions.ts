const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const auctionApi = {
  // Get all auctions with pagination
  getAuctions: async (page = 1) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auctions/get-all?page=${page}`);
      if (!response.ok) throw new Error('Failed to fetch auctions');
      return await response.json();
    } catch (error) {
      console.error('Error fetching auctions:', error);
      throw error;
    }
  },

  // Get top auctions
  getTopAuctions: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auctions/get-top`); 
      if (!response.ok) throw new Error('Failed to fetch auctions'); 
      return await response.json();
    } catch (error) {
      console.error('Error fetching top auctions:', error);
      throw error;
    }     
  },

  // Get single auction by ID
  getAuctionById: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auctions/get/${id}`);
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
  },

  // Search auctions by title substring with pagination
  searchAuctions: async (query: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auctions/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search auctions');
      return await response.json();
    } catch (error) {
      console.error('Error searching auctions:', error);
      throw error;
    }
  },

  // Get related auctions by item ID
  getRelatedAuctions: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auctions/get-related/${id}`);
      if (!response.ok) throw new Error('Failed to fetch related auctions');
      return await response.json();
    } catch (error) {
      console.error('Error fetching related auctions:', error);
      throw error;
    }
  }
};