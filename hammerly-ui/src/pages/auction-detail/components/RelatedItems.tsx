import { auctionListings } from '../../../mocks/auctions';

interface RelatedItemsProps {
  currentId: number;
}

export default function RelatedItems({ currentId }: RelatedItemsProps) {
  const relatedItems = auctionListings.filter(item => item.id !== currentId).slice(0, 4);

  return (
    <section className="mt-12 pt-12 border-t">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Related Auctions</h2>
        <a href="/auctions" className="text-[#8B2635] hover:underline font-medium cursor-pointer">
          View All Auctions
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedItems.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={() => window.location.href = `/auction/${item.id}`}
          >
            <div className="p-3">
              <img 
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover object-top rounded-lg"
              />
            </div>
            
            <div className="p-4">
              <div className="mb-3">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                  {item.category}
                </p>
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                  {item.title}
                </h3>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-500">Current Bid</p>
                  <p className="text-lg font-bold text-[#8B2635]">
                    ${item.currentBid.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{item.timeRemaining}</p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div 
                  className="bg-[#8B2635] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}