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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 py-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-black">ALL </span>
              <span className="text-[#8B2635]">AUCTIONS</span>
            </h1>
            <p className="text-lg text-gray-600">
              {loading ? 'Loading...' : `${auctions.length} items available`}
            </p>
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
