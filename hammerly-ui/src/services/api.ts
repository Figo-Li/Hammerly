const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token management
const getToken = () => localStorage.getItem('token');
const setToken = (token: string) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

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

  // Place a bid (requires authentication)
  placeBid: async (auctionId: number, bidAmount: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auctions/${auctionId}/bid`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ bidAmount })
      });
      return await response.json();
    } catch (error) {
      console.error('Error placing bid:', error);
      throw error;
    }
  }
};

export const authApi = {
  // Register user
  register: async (firstName: string, lastName: string, email: string, password: string, confirmPassword: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, confirmPassword })
      });
      const data = await response.json();
      
      if (data.success && data.token) {
        setToken(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },

  // Login user
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (data.success && data.token) {
        setToken(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      
      if (data.success) {
        removeToken();
        localStorage.removeItem('user');
      }
      
      return data;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }
};

export const usersApi = {
  // Get current user profile
  getProfile: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      return await response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Get public user info by ID
  getUser: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`);
      if (!response.ok) throw new Error('User not found');
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }
};
