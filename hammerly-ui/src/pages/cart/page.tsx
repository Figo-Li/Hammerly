import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function Cart() {


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Watchlist</h1>
            <p className="text-gray-600">Track items you're interested in</p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}