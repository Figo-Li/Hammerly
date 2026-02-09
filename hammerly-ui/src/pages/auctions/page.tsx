import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import AuctionCard from './components/AuctionCard';
import { auctionListings } from '../../mocks/auctions';

export default function Auctions() {
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
              {auctionListings.length} items available
            </p>
          </div>

          {/* Auction Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctionListings.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} viewType="grid" />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
