import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function Auctions() {


  return (
    <div className="min-h-screen bg-gray-50  flex flex-col">
      <Header />
      
      <main className="pt-24 py-8 flex-grow">
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
            
            <div className="flex justify-between items-start mb-6"> All Auctions
             
              
            </div>

           
          </div>

          
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
