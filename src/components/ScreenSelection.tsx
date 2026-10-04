import React, { useState } from 'react';
import { Movie, Screen, Cinema } from '../types';
import { CINEMAS } from '../data/initialData';
import {
  MapPin,
  Calendar,
  Clock,
  Heart,
  Info,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Tv,
  Film,
  Tag,
} from 'lucide-react';

interface ScreenSelectionProps {
  movie: Movie;
  screens: Screen[];
  selectedScreenId: number | null;
  selectedCinemaName?: string;
  selectedShowtime?: string;
  onSelectScreenAndShowtime: (screenId: number, cinemaName: string, showtime: string, showDate: string) => void;
  onBackToMovies: () => void;
}

const DATES = [
  { day: 'TODAY', date: '16', month: 'SEP', full: 'Wed, 16 Sep 2026' },
  { day: 'THU', date: '17', month: 'SEP', full: 'Thu, 17 Sep 2026' },
  { day: 'FRI', date: '18', month: 'SEP', full: 'Fri, 18 Sep 2026' },
  { day: 'SAT', date: '19', month: 'SEP', full: 'Sat, 19 Sep 2026' },
  { day: 'SUN', date: '20', month: 'SEP', full: 'Sun, 20 Sep 2026' },
];

export const ScreenSelection: React.FC<ScreenSelectionProps> = ({
  movie,
  screens,
  selectedScreenId,
  selectedCinemaName,
  selectedShowtime,
  onSelectScreenAndShowtime,
  onBackToMovies,
}) => {
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [priceFilter, setPriceFilter] = useState<string>('All');
  const [bookmarkedCinemas, setBookmarkedCinemas] = useState<string[]>([]);

  const toggleBookmark = (cinemaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedCinemas((prev) =>
      prev.includes(cinemaId) ? prev.filter((id) => id !== cinemaId) : [...prev, cinemaId]
    );
  };

  const getStatusBadge = (status: 'available' | 'filling_fast' | 'almost_full') => {
    switch (status) {
      case 'available':
        return {
          badge: 'text-emerald-400 border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-500/10',
          dot: 'bg-emerald-400',
          label: 'Available',
        };
      case 'filling_fast':
        return {
          badge: 'text-amber-400 border-amber-500/30 hover:border-amber-500 hover:bg-amber-500/10',
          dot: 'bg-amber-400',
          label: 'Filling Fast',
        };
      case 'almost_full':
        return {
          badge: 'text-rose-400 border-rose-500/30 hover:border-rose-500 hover:bg-rose-500/10',
          dot: 'bg-rose-400',
          label: 'Almost Full',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Movie Header Spotlight Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800/80 p-5 sm:p-7 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden shrink-0 border border-zinc-700 shadow-xl bg-zinc-900">
              <img
                src={movie.posterUrl}
                alt={movie.movie_name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {movie.rating || '★ 9.4/10'}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {movie.certification || 'U/A 13+'}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-800 text-amber-400 border border-zinc-700">
                  {movie.language}
                </span>
                <span className="text-xs text-zinc-400">
                  {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
                {movie.movie_name}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl line-clamp-2">
                {movie.synopsis}
              </p>
            </div>
          </div>

          <button
            onClick={onBackToMovies}
            className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl transition-all self-start md:self-center shrink-0"
          >
            ← Change Movie
          </button>
        </div>
      </div>

      {/* Date Carousel & Filter Bar */}
      <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-3 sm:p-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-zinc-800/80">
          {/* Dates Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {DATES.map((item, idx) => (
              <button
                key={item.date}
                onClick={() => setSelectedDateIdx(idx)}
                className={`flex flex-col items-center justify-center min-w-[62px] py-2 px-3 rounded-xl transition-all ${
                  selectedDateIdx === idx
                    ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/30 scale-105'
                    : 'bg-zinc-800/60 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-700/60'
                }`}
              >
                <span className="text-[10px] tracking-wider uppercase font-semibold">{item.day}</span>
                <span className="text-base font-black leading-none my-0.5">{item.date}</span>
                <span className="text-[9px] uppercase tracking-wider">{item.month}</span>
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-[11px] text-zinc-400 self-end sm:self-center">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Filling Fast</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>Almost Full</span>
            </div>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-medium">Formats:</span>
            {['All', 'IMAX 2D', 'Dolby Atmos', 'VIP Luxe'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedLanguage(fmt)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedLanguage === fmt
                    ? 'bg-zinc-100 text-zinc-950 font-bold'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-zinc-400">Price:</span>
            {['All', 'Under ₹200', '₹200 - ₹350'].map((price) => (
              <button
                key={price}
                onClick={() => setPriceFilter(price)}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  priceFilter === price
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {price}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cinema Venues & Showtimes List */}
      <div className="space-y-4">
        {CINEMAS.map((cinema) => {
          const isBookmarked = bookmarkedCinemas.includes(cinema.id);

          return (
            <div
              key={cinema.id}
              className="bg-zinc-900/60 hover:bg-zinc-900/80 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all p-5 space-y-4"
            >
              {/* Cinema Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => toggleBookmark(cinema.id, e)}
                      className="text-zinc-500 hover:text-rose-500 transition-colors"
                      title="Add to Favorite Cinemas"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isBookmarked ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                    <h3 className="text-base font-bold text-white tracking-tight font-display">
                      {cinema.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 pl-6">
                    <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                    <span>{cinema.location}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-emerald-400 font-medium">{cinema.distance}</span>
                  </div>
                </div>

                {/* Amenities Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pl-6 sm:pl-0">
                  {cinema.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700/60"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Showtimes Grid */}
              <div className="pt-3 border-t border-zinc-800/60 flex flex-wrap items-center gap-3 pl-6">
                {cinema.showtimes.map((st, sIdx) => {
                  const statusInfo = getStatusBadge(st.status);
                  const isCurrentSelection =
                    selectedCinemaName === cinema.name &&
                    selectedShowtime === st.time &&
                    selectedScreenId === st.screenId;

                  return (
                    <button
                      key={sIdx}
                      id={`showtime-btn-${cinema.id}-${sIdx}`}
                      onClick={() =>
                        onSelectScreenAndShowtime(
                          st.screenId,
                          cinema.name,
                          st.time,
                          DATES[selectedDateIdx].full
                        )
                      }
                      className={`group relative py-2.5 px-4 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                        isCurrentSelection
                          ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/30 scale-105 ring-2 ring-rose-400'
                          : `bg-zinc-950/80 ${statusInfo.badge}`
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-sm font-black font-mono tracking-tight">
                          {st.time}
                        </span>
                      </div>
                      <div className="text-[10px] font-medium mt-0.5 opacity-80 uppercase tracking-wider">
                        {st.format}
                      </div>

                      {/* Hover Tooltip / Detail */}
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1 px-2 py-1 rounded bg-zinc-950 border border-zinc-700 text-[9px] text-zinc-300 whitespace-nowrap z-20 shadow-xl pointer-events-none">
                        <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                        <span>{statusInfo.label} • ₹150 - ₹350</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
