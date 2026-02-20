import { useState } from 'react';
import { Listing, myListings } from '../../../mocks/myListing';
import CreateListingModal from './CreateListingModal';



export default function ProfileListings() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'ended' | 'draft'>('all');
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [endingListingId, setEndingListingId] = useState<number | null>(null);
  
  const [listings] = useState<Listing[]>(myListings);

  const filteredListings = listings.filter(listing => {
    if (activeFilter === 'all') return true;
    return listing.status === activeFilter;
  });

  const handleEditListing = (listing: Listing) => {
    setEditingListing(listing);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingListing(null);
  };

  const handleEndAuction = (listingId: number) => {
    setEndingListingId(listingId);
    setShowEndConfirm(true);
  };

  const confirmEndAuction = () => {
    // Here you would call your API to end the auction
    console.log('Ending auction:', endingListingId);
    setShowEndConfirm(false);
    setEndingListingId(null);
  };


  return (
    <div className="space-y-6">

      {/* Filter Tabs */}
      <div className="flex items-center justify-between pt-4">
        <div className="bg-white rounded-xl shadow-sm p-2 inline-flex gap-1">
          {(['all', 'active', 'ended', 'draft'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-[#8B2635] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
              {filter === 'all' && ` (${listings.length})`}
              {filter === 'active' && ` (${listings.filter(l => l.status === 'active').length})`}
              {filter === 'ended' && ` (${listings.filter(l => l.status === 'ended').length})`}
              {filter === 'draft' && ` (${listings.filter(l => l.status === 'draft').length})`}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#8B2635] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#7A1F2B] transition-all cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line text-xl w-5 h-5 flex items-center justify-center"></i>
          Create New
        </button>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredListings.map((listing) => (
          <div key={listing.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all">
            <div className="relative h-48">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-full object-cover object-top"
              />
              <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${
                listing.status === 'active' ? 'bg-emerald-500 text-white' :
                listing.status === 'ended' ? 'bg-gray-500 text-white' :
                'bg-amber-500 text-white'
              }`}>
                {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
              </div>
              {listing.status === 'active' && (
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-xs font-medium text-gray-700">{listing.timeLeft} left</span>
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-gray-900 mb-3 line-clamp-1">{listing.title}</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Current Bid</p>
                  <p className="text-lg font-bold text-[#8B2635]">
                    {listing.currentBid > 0 ? `$${listing.currentBid.toLocaleString()}` : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Starting Price</p>
                  <p className="text-lg font-bold text-gray-700">${listing.startingPrice.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <i className="ri-hammer-line w-4 h-4 flex items-center justify-center"></i>
                  {listing.bids} bids
                </span>
                <span className="flex items-center gap-1">
                  <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                  {listing.watchers} watchers
                </span>
              </div>

              <div className="flex items-center gap-2">
                {listing.status === 'draft' ? (
                  <>
                    <button className="flex-1 bg-[#8B2635] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#7A1F2B] transition-all cursor-pointer whitespace-nowrap">
                      Publish
                    </button>
                    <button 
                      onClick={() => handleEditListing(listing)}
                      className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap"
                    >
                      Edit
                    </button>
                  </>
                ) : listing.status === 'active' ? (
                  <>
                    <button 
                      onClick={() => handleEndAuction(listing.id)}
                      className="flex-1 border border-red-200 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-all cursor-pointer whitespace-nowrap"
                    >
                      End Auction
                    </button>
                  </>
                ) : (
                  <button className="flex-1 bg-[#8B2635] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#7A1F2B] transition-all cursor-pointer whitespace-nowrap">
                    Deliver
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-store-2-line text-3xl text-gray-400 w-8 h-8 flex items-center justify-center"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
          <p className="text-gray-500 mb-4">You don&apos;t have any {activeFilter !== 'all' ? activeFilter : ''} listings yet.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 bg-[#8B2635] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#7A1F2B] transition-all cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line w-5 h-5 flex items-center justify-center"></i>
            Create Your First Listing
          </button>
        </div>
      )}

      {/* Create/Edit Listing Modal */}
      {showCreateModal && (
        <CreateListingModal onClose={handleCloseModal} editingListing={editingListing} />
      )}

      {/* End Auction Confirmation Modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-alarm-warning-line text-3xl text-red-600 w-8 h-8 flex items-center justify-center"></i>
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2 text-center">End Auction Early?</h2>
            <p className="text-gray-500 text-center mb-6">
              Are you sure you want to end this auction now? This action cannot be undone. The current highest bidder will win the item.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={confirmEndAuction}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-all cursor-pointer whitespace-nowrap"
              >
                End Auction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
