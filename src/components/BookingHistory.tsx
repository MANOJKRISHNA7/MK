import React, { useState } from 'react';
import { EnrichedBooking } from '../types';
import {
  Ticket,
  Search,
  Calendar,
  CreditCard,
  Tv,
  Film,
  Armchair,
  CheckCircle2,
  MapPin,
  Clock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface BookingHistoryProps {
  enrichedBookings: EnrichedBooking[];
  onSelectBooking: (booking: EnrichedBooking) => void;
  onBookNew: () => void;
}

export const BookingHistory: React.FC<BookingHistoryProps> = ({
  enrichedBookings,
  onSelectBooking,
  onBookNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMovie, setFilterMovie] = useState<string>('ALL');

  const filtered = enrichedBookings.filter((eb) => {
    const seatString = eb.booking.seat_numbers?.join(' ') || eb.seat.seat_number;
    const matchesSearch =
      eb.booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(eb.booking.booking_id).includes(searchTerm) ||
      (eb.booking.booking_reference &&
        eb.booking.booking_reference.toLowerCase().includes(searchTerm.toLowerCase())) ||
      seatString.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eb.movie.movie_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMovie = filterMovie === 'ALL' || eb.movie.movie_name === filterMovie;

    return matchesSearch && matchesMovie;
  });

  const uniqueMovies = Array.from(new Set(enrichedBookings.map((b) => b.movie.movie_name)));

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              My Bookings & Digital Passes
            </h2>
            <span className="text-xs font-semibold bg-rose-600/20 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-500/30">
              {enrichedBookings.length} Confirmed
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Access your active cinema passes, show barcodes at the gate, or view payment receipts.
          </p>
        </div>

        <button
          onClick={onBookNew}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-colors self-start sm:self-auto shadow-lg shadow-rose-600/20"
        >
          <span>+ Book New Movie</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by movie title, booking reference, or guest name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        {uniqueMovies.length > 1 && (
          <select
            value={filterMovie}
            onChange={(e) => setFilterMovie(e.target.value)}
            className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Movies</option>
            {uniqueMovies.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Bookings Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-zinc-800 bg-zinc-900/40 space-y-4">
          <Ticket className="w-10 h-10 text-zinc-600 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-white">No Booked Tickets Yet</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Select any movie from the catalog to book your cinema tickets in seconds.
            </p>
          </div>
          <button
            onClick={onBookNew}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all shadow-md"
          >
            Explore Now Showing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((eb) => {
            const seatDisplay = eb.booking.seat_numbers && eb.booking.seat_numbers.length > 0
              ? eb.booking.seat_numbers.join(', ')
              : eb.seat.seat_number;
            const refCode = eb.booking.booking_reference || `BMS-${eb.booking.booking_id}`;

            return (
              <div
                key={eb.booking.booking_id}
                id={`booking-card-${eb.booking.booking_id}`}
                onClick={() => onSelectBooking(eb)}
                className="group relative bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800 hover:border-rose-500/50 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-2xl hover:shadow-rose-950/20"
              >
                {/* Perforated Top Header */}
                <div className="p-4 bg-gradient-to-r from-rose-950/40 via-zinc-900 to-zinc-950 border-b border-zinc-800 flex items-start gap-3">
                  <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 border border-zinc-700 bg-zinc-950">
                    <img
                      src={eb.movie.posterUrl}
                      alt={eb.movie.movie_name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono text-rose-400 font-bold tracking-wider uppercase block">
                      Ref: {refCode}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors font-display truncate">
                      {eb.movie.movie_name}
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      {eb.movie.language} • {eb.movie.certification || 'U/A'}
                    </p>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-4 space-y-2 text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">
                      {eb.booking.cinema_name || 'PVR ICON: Phoenix Palladium'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-zinc-300">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      <span>{eb.booking.show_time || '05:30 PM'}</span>
                    </span>
                    <span className="text-zinc-500">{eb.booking.show_date || 'Today'}</span>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase">Seats</span>
                      <span className="font-mono font-bold text-rose-300 bg-rose-600/20 px-2 py-0.5 rounded border border-rose-500/30">
                        {seatDisplay}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 block uppercase">Paid</span>
                      <span className="text-emerald-400 font-bold font-mono text-sm">
                        ₹{eb.booking.amount}.00
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-3 bg-zinc-950 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirmed</span>
                  </span>
                  <span className="text-rose-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    <span>View Digital Ticket</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
