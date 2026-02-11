'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import { auctionApi } from '../../api/auctions';

interface Auction {
  id: number;
  title: string;
  category: string;
  currentBid: number;
  timeRemaining: string;
  image: string;
  progress: number;
  condition?: string;
  totalBids?: number;
  seller?: string;
}

export default function AuctionDetail() {
  const { id } = useParams();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        setLoading(true);
        const auctionId = parseInt(id || '0');
        if (!auctionId) {
          setError('Invalid auction ID');
          setAuction(null);
          return;
        }
        const response = await auctionApi.getAuctionById(auctionId);
        setAuction(response.data || null);
        setError(null);
      } catch  {
        setError('Failed to load auction details.');
        setAuction(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAuction();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading auction details...</p>
        </div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Auction Not Found</h1>
          <p className="text-gray-600">{error || "The auction you're looking for doesn't exist."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="pt-24 py-8 flex-grow">
        <div className="max-w-7xl mx-auto px-6"> 
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li><a href="/" className="text-gray-500 hover:text-gray-700 cursor-pointer">Home</a></li>
              <li className="text-gray-300">/</li>
              <li><a href="/auctions" className="text-gray-500 hover:text-gray-700 cursor-pointer">All auctions</a></li>
              <li className="text-gray-300">/</li>
              <li className="text-gray-900 font-medium">{auction.title}</li>
            </ol>
          </nav>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            Details
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}