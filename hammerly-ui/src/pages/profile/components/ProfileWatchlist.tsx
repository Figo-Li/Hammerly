import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface WatchedItem {
  id: number;
  title: string;
  image: string;
  currentBid: number;
  timeLeft: string;
  watching: number;
}

export default function ProfileWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchedItem[]>([]);

  useEffect(() => {
    // Load watched items from localStorage
    const watchedItems = JSON.parse(localStorage.getItem('watchedItems') || '[]');
    setWatchlist(watchedItems);
  }, []);


  return (
    <div className="space-y-6">
      {watchlist.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-heart-line text-4xl text-gray-400"></i>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Watched Items</h2>
          <p className="text-gray-600 mb-6">You haven't watched any items yet. Start watching items you're interested in!</p>
          <Link
            to="/auctions"
            className="inline-block bg-[#8B2635] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#7A2230] transition-colors cursor-pointer whitespace-nowrap"
          >
            Browse Auctions
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           watched items
        </div>
      )}
    </div>
  );
}
