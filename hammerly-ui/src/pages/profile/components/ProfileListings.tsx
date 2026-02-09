export default function ProfileListings() {


  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-500 mt-1">Manage your auction listings</p>
        </div>
        <button
          className="flex items-center gap-2 bg-[#8B2635] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#7A1F2B] transition-all cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line text-xl w-5 h-5 flex items-center justify-center"></i>
          Create Listing
        </button>
      </div>
    </div>
  );
}
