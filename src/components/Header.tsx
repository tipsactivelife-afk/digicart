import { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useStore } from '../store';

export default function Header() {
  const { state, dispatch } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; page: 'home' | 'products' | 'about' | 'contact' }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Products', page: 'products' },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_FILTER', filters: { searchQuery } });
    dispatch({ type: 'NAVIGATE', page: 'products' });
    dispatch({ type: 'TOGGLE_SEARCH' });
    setSearchQuery('');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-primary-100/20'
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        {/* Promo Banner */}
        <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 text-white text-center py-2 px-4 text-xs sm:text-sm font-medium">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            Use code <span className="font-bold bg-white/20 px-2 py-0.5 rounded">WELCOME10</span> for 10% off your first order!
            <Sparkles className="w-3.5 h-3.5" />
          </span>
        </div>

        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => dispatch({ type: 'NAVIGATE', page: 'home' })}
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200 group-hover:shadow-primary-300 transition-shadow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
                DigiCraft
              </span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => dispatch({ type: 'NAVIGATE', page: item.page })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    state.currentPage === item.page
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="relative group">
                <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50/50 transition-all duration-200 inline-flex items-center gap-1">
                  More <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                  {(['terms', 'privacy', 'refund'] as const).map((page) => (
                    <button
                      key={page}
                      onClick={() => dispatch({ type: 'NAVIGATE', page })}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    >
                      {page === 'terms'
                        ? 'Terms & Conditions'
                        : page === 'privacy'
                        ? 'Privacy Policy'
                        : 'Refund Policy'}
                    </button>
                  ))}
                  <hr className="my-2 border-gray-100" />
                  <button
                    onClick={() => dispatch({ type: 'NAVIGATE', page: 'admin' })}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors flex items-center gap-2"
                  >
                    🔐 Admin Panel
                  </button>
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch({ type: 'TOGGLE_SEARCH' })}
                className="p-2.5 rounded-xl text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-all"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                className="relative p-2.5 rounded-xl text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-all"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {state.cart.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-bounce-in">
                    {state.cart.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => dispatch({ type: 'TOGGLE_MOBILE_MENU' })}
                className="md:hidden p-2.5 rounded-xl text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-all"
                aria-label="Menu"
              >
                {state.isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Search Bar */}
        {state.searchOpen && (
          <div className="border-t border-gray-100 bg-white animate-slide-down">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-4 py-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates, courses, assets..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all"
                  autoFocus
                />
              </div>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {state.isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white animate-slide-down">
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => dispatch({ type: 'NAVIGATE', page: item.page })}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    state.currentPage === item.page
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <hr className="my-2 border-gray-100" />
              {(['terms', 'privacy', 'refund'] as const).map((page) => (
                <button
                  key={page}
                  onClick={() => dispatch({ type: 'NAVIGATE', page })}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-all"
                >
                  {page === 'terms'
                    ? 'Terms & Conditions'
                    : page === 'privacy'
                    ? 'Privacy Policy'
                    : 'Refund Policy'}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[calc(4rem+2.25rem)]" />
    </>
  );
}
