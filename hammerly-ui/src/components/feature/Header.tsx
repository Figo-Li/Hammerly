import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export default function Header() {
  const isLoggedIn = useAuthStore(s => s.isLoggedIn);
  const watchedCount = useAuthStore(s => s.watchedCount);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Auction Listings', href: '/auctions' },
    { name: 'Guide', href: '/guide' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#8B2635] flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Hammerly</span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-700 hover:text-[#8B2635]"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link to="/cart" className="relative w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full">
                  <i className="ri-heart-line text-xl"></i>
                  {watchedCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#8B2635] text-white text-xs rounded-full flex items-center justify-center">
                      {watchedCount > 9 ? '9+' : watchedCount}
                    </span>
                  )}
                </Link>

                <Link to="/profile" className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full">
                  <i className="ri-user-line text-xl"></i>
                </Link>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-[#8B2635] text-white px-5 py-2 rounded-lg hover:bg-[#7A2230]"
              >
                Register to Bid
              </Link>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
