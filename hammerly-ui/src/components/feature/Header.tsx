import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [watchedCount, setWatchedCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Check login status on mount and route change
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    // Get watched items count - ensure it's always a valid array
    try {
      const watchedItems = JSON.parse(localStorage.getItem('watchedItems') || '[]');
      setWatchedCount(Array.isArray(watchedItems) ? watchedItems.length : 0);
    } catch {
      setWatchedCount(0);
      localStorage.setItem('watchedItems', '[]');
    }
  }, [location.pathname]);

  // Listen for watched items changes
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const watchedItems = JSON.parse(localStorage.getItem('watchedItems') || '[]');
        setWatchedCount(Array.isArray(watchedItems) ? watchedItems.length : 0);
      } catch {
        setWatchedCount(0);
        localStorage.setItem('watchedItems', '[]');
      }
    };

    window.addEventListener('watchedItemsUpdated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('watchedItemsUpdated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
          <Link to="/" className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#8B2635]">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Hammerly</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="font-medium transition-colors cursor-pointer text-gray-700 hover:text-[#8B2635]"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Section - Icons and CTA */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* Watched Items - Only when logged in */}
                <Link to="/cart" className="relative w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer hover:bg-gray-100 text-gray-700">
                  <i className="ri-heart-line text-xl"></i>
                  {watchedCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#8B2635] text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {watchedCount > 9 ? '9+' : watchedCount}
                    </span>
                  )}
                </Link>
                
                {/* Profile - Only when logged in */}
                <Link to="/profile" className="w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer hover:bg-gray-100 text-gray-700">
                  <i className="ri-user-line text-xl"></i>
                </Link>
              </>
            ) : (
              /* Register Button - Only when not logged in */
              <Link
                to="/auth"
                className="bg-[#8B2635] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#7A2230] transition-colors cursor-pointer whitespace-nowrap"
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
