
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { myBids } from '@/mocks/myBids';

export default function ProfileBids() {
  const [filter, setFilter] = useState('all');


  const filteredBids = filter === 'all' ? myBids : myBids.filter(bid => bid.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'winning':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Winning</span>;
      case 'outbid':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Outbid</span>;
      case 'won':
        return <span className="px-3 py-1 bg-[#8B2635]/10 text-[#8B2635] rounded-full text-xs font-medium">Won</span>;
      case 'lost':
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Lost</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 pt-4">
        {[
          { id: 'all', label: 'All Bids' },
          { id: 'winning', label: 'Winning' },
          { id: 'outbid', label: 'Outbid' },
          { id: 'won', label: 'Won' },
          { id: 'lost', label: 'Lost' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-5 py-2 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap ${
              filter === tab.id
                ? 'bg-[#8B2635] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bids List */}
      <div className="space-y-4">
        {filteredBids.map((bid) => (
          <div key={bid.id} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all">
            <div className="flex flex-col md:flex-row gap-5">
              {/* Image */}
              <div className="w-full md:w-48 h-36 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={bid.image}
                  alt={bid.title}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{bid.title}</h3>
                    {getStatusBadge(bid.status)}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Time Left</p>
                    <p className={`font-bold ${bid.timeLeft === 'Ended' ? 'text-gray-400' : 'text-[#8B2635]'}`}>
                      {bid.timeLeft}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Your Bid</p>
                    <p className="text-lg font-bold text-gray-900">{bid.yourBid}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Bid</p>
                    <p className="text-lg font-bold text-[#8B2635]">{bid.currentBid}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Bids</p>
                    <p className="text-lg font-bold text-gray-900">{bid.totalBids}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                  {bid.status === 'outbid' && (
                    <button className="bg-[#8B2635] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#7A1F2B] transition-all cursor-pointer whitespace-nowrap">
                      Increase Bid
                    </button>
                  )}
                  <button className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBids.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-hammer-line text-3xl text-gray-400 w-8 h-8 flex items-center justify-center"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bids found</h3>
          <p className="text-gray-500 mb-6">You don&apos;t have any bids in this category yet.</p>
          <Link
            to="/auctions"
            className="inline-flex items-center gap-2 bg-[#8B2635] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#7A1F2B] transition-all cursor-pointer whitespace-nowrap"
          >
            Browse Auctions
          </Link>
        </div>
      )}
    </div>
  );
}
