import React, { useState } from 'react';
import {
  Film,
  Ticket,
  Search,
  MapPin,
  ChevronDown,
  User,
  Coffee,
  Building2,
  Sparkles,
  X,
  RotateCcw,
} from 'lucide-react';
import { POPULAR_CITIES } from '../data/initialData';

interface NavbarProps {
  activeTab: 'movies' | 'cinemas' | 'history' | 'snacks';
  setActiveTab: (tab: 'movies' | 'cinemas' | 'history' | 'snacks') => void;
  bookingCount: number;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onResetDb: () => void;
  customerName?: string;
  customerEmail?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  bookingCount,
  selectedCity,
  setSelectedCity,
  searchQuery,
  setSearchQuery,
  onResetDb,
  customerName = 'Kanishka',
  customerEmail = 'kanishka@example.com',
}) => {
  const [showCityModal, setShowCityModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-rose-900/40 via-purple-900/30 to-amber-900/30 text-[11px] py-1 px-4 text-center text-zinc-300 flex items-center justify-center gap-2 border-b border-zinc-800/50">
        <Sparkles className="w-3.5 h-3.5 text-rose-400" />
        <span>
          <strong className="text-white">Weekend Blockbuster Carnival:</strong> Flat ₹100 OFF on Recliner Luxe tickets with UPI payments!
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          {/* Brand Logo & Name */}
          <div
            onClick={() => setActiveTab('movies')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-lg shadow-rose-500/25 group-hover:scale-105 transition-transform font-black">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-black tracking-tight text-white font-display">
                  CINE<span className="text-rose-500">PASS</span>
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase">
                Cinema Tickets & Experiences
              </p>
            </div>
          </div>

          {/* Search Bar - Real-time filtering */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for Movies, Languages, Genres..."
              className="w-full pl-10 pr-9 py-2 bg-zinc-900/90 border border-zinc-800 rounded-full text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Controls: City Selector, Navigation Tabs & Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* City Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCityModal(!showCityModal)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-200 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-all"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{selectedCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {/* City Selection Popover */}
              {showCityModal && (
                <div className="absolute right-0 mt-2 w-56 p-3 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs font-semibold text-zinc-300">
                    <span>Popular Cities</span>
                    <button
                      onClick={() => setShowCityModal(false)}
                      className="text-zinc-400 hover:text-zinc-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-2">
                    {POPULAR_CITIES.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedCity(city);
                          setShowCityModal(false);
                        }}
                        className={`px-2.5 py-2 rounded-lg text-xs text-left font-medium transition-all ${
                          selectedCity === city
                            ? 'bg-rose-500 text-white font-bold'
                            : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden sm:flex items-center gap-1 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800">
              <button
                id="nav-movies-tab"
                onClick={() => setActiveTab('movies')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'movies'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Movies</span>
              </button>

              <button
                id="nav-cinemas-tab"
                onClick={() => setActiveTab('cinemas')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'cinemas'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Cinemas</span>
              </button>

              <button
                id="nav-snacks-tab"
                onClick={() => setActiveTab('snacks')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'snacks'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Snacks</span>
              </button>

              <button
                id="nav-history-tab"
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'history'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                }`}
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>My Tickets</span>
                {bookingCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 bg-rose-600 text-white text-[10px] font-mono font-bold rounded-full">
                    {bookingCount}
                  </span>
                )}
              </button>
            </nav>

            {/* User Account / Profile button */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all text-left"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-zinc-950 font-black text-xs">
                  {customerName ? customerName.charAt(0).toUpperCase() : 'K'}
                </div>
                <div className="hidden lg:block text-xs">
                  <div className="font-semibold text-zinc-200 leading-tight">{customerName || 'Kanishka'}</div>
                  <div className="text-[10px] text-zinc-500 leading-none">BookMyShow Member</div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 p-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 text-xs">
                  <div className="p-2 border-b border-zinc-800">
                    <p className="font-bold text-zinc-100">{customerName || 'Kanishka'}</p>
                    <p className="text-[11px] text-zinc-400">{customerEmail || 'kanishka@example.com'}</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('history');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-200 mt-1 flex items-center gap-2"
                  >
                    <Ticket className="w-3.5 h-3.5 text-rose-400" />
                    <span>My Booked Tickets ({bookingCount})</span>
                  </button>
                  <button
                    onClick={() => {
                      onResetDb();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Booking Demo</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex sm:hidden items-center justify-around py-2 border-t border-zinc-800/80 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('movies')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg ${
              activeTab === 'movies' ? 'text-rose-500 bg-rose-500/10' : 'text-zinc-400'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Movies</span>
          </button>
          <button
            onClick={() => setActiveTab('cinemas')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg ${
              activeTab === 'cinemas' ? 'text-rose-500 bg-rose-500/10' : 'text-zinc-400'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Cinemas</span>
          </button>
          <button
            onClick={() => setActiveTab('snacks')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg ${
              activeTab === 'snacks' ? 'text-rose-500 bg-rose-500/10' : 'text-zinc-400'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Snacks</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg ${
              activeTab === 'history' ? 'text-rose-500 bg-rose-500/10' : 'text-zinc-400'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Tickets ({bookingCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};

