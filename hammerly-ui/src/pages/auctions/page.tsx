'use client';

import { useEffect, useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import AuctionCard from './components/AuctionCard';
import { auctionApi } from '../../api/auctions';

interface Auction {
  id: number;
  title: string;
  category: string;
  currentBid: number;
  timeRemaining: string;
  image: string;
  progress: number;
  condition: string;
  totalBids: number;
  seller: string;
}

export default function Auctions() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        const response = await auctionApi.getAuctions();
        // Backend returns { success: true, data: [...], stats: {...} }
        setAuctions(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch auctions:', err);
        setError('Failed to load auctions. Please try again later.');
        setAuctions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setLoading(true);
    try {
      let response;
      if (searchQuery.trim()) {
        response = await auctionApi.searchAuctions(searchQuery);
      } else {
        response = await auctionApi.getAuctions();
      }
      setAuctions(response.data || []);
      setError(null);
    } catch {
      setError('Failed to search auctions.');
      setAuctions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 py-8">
        <div className="max-w-7xl mx-auto px-6">

                    {/* Page Header */}
          <div className="mb-8">
            <nav className="mb-4">
              <ol className="flex items-center space-x-2 text-sm">
                <li><a href="/" className="text-gray-500 hover:text-gray-700 cursor-pointer">Home</a></li>
                <li className="text-gray-300">/</li>
                <li className="text-gray-900 font-medium">All Auctions</li>
              </ol>
            </nav>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  <span className="text-black">ALL </span>
                  <span className="text-[#8B2635]">AUCTIONS</span>
                </h1>
                {loading ? 'Loading...' : `${auctions.length} items available`}
              </div>
              
              {/* Search and View Toggle */}
              <div className="flex items-center gap-4">
                {/* Search Input */}
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search auctions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#8B2635] focus:border-[#8B2635] outline-none transition-all"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400">
                    <i className="ri-search-line"></i>
                  </div>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <i className="ri-close-line"></i>
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>




          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading auctions...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
              <p>{error}</p>
            </div>
          )}

          {/* Auction Cards */}
          {!loading && !error && auctions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} viewType="grid" />
              ))}
            </div>
          ) : (
            !loading && !error && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No auctions found</p>
              </div>
            )
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
