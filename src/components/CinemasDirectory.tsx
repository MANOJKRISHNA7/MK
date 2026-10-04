import React, { useState } from 'react';
import { Cinema, Movie } from '../types';
import { CINEMAS } from '../data/initialData';
import {
  Building2,
  MapPin,
  Heart,
  ChevronRight,
  Tv,
  Sparkles,
  Search,
  Film,
} from 'lucide-react';

interface CinemasDirectoryProps {
  selectedCity: string;
  movies: Movie[];
  onSelectCinemaShowtime: (cinema: Cinema, showtime: string, screenId: number, movie: Movie) => void;
}

export const CinemasDirectory: React.FC<CinemasDirectoryProps> = ({
  selectedCity,
  movies,
  onSelectCinemaShowtime,
}) => {
  const [search, setSearch] = useState('');
  const [bookmarked, setBookmarked] = useState<string[]>([]);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredCinemas = CINEMAS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              Cinemas & Theatres in {selectedCity}
            </h2>
            <span className="text-xs font-semibold bg-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded-full border border-zinc-700">
              {CINEMAS.length} Multiplexes
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Browse state-of-the-art IMAX, Dolby Atmos, and luxury VIP auditoriums near you.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search cinema chains or areas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Cinema Cards */}
      <div className="space-y-4">
        {filteredCinemas.map((cinema) => {
          const isLiked = bookmarked.includes(cinema.id);

          return (
            <div
              key={cinema.id}
              className="bg-zinc-900/70 hover:bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all p-5 space-y-4 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => toggleBookmark(cinema.id, e)}
                      className="text-zinc-500 hover:text-rose-500 transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                    <h3 className="text-base sm:text-lg font-bold text-white font-display">
                      {cinema.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 pl-6">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{cinema.location}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-emerald-400 font-semibold">{cinema.distance}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pl-6 sm:pl-0">
                  {cinema.amenities.map((am) => (
                    <span
                      key={am}
                      className="px-2.5 py-0.5 rounded text-[10px] font-medium bg-zinc-800/80 text-zinc-400 border border-zinc-700"
                    >
                      {am}
                    </span>
                  ))}
                </div>
              </div>

              {/* Screens and Showtimes available */}
              <div className="pt-3 border-t border-zinc-800/80 space-y-2.5 pl-6">
                <span className="text-[11px] font-mono uppercase text-zinc-500 block font-semibold">
                  Today's Recommended Showtimes:
                </span>

                <div className="flex flex-wrap items-center gap-2.5">
                  {cinema.showtimes.map((st, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const targetMovie = movies[0];
                        if (targetMovie) {
                          onSelectCinemaShowtime(cinema, st.time, st.screenId, targetMovie);
                        }
                      }}
                      className="group py-2 px-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-rose-500 hover:bg-rose-500/10 text-left transition-all"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white font-mono group-hover:text-rose-400">
                          {st.time}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                          {st.format}
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">
                        Starting from ₹150
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
