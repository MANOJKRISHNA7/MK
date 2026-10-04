import React from 'react';
import { Seat } from '../types';
import {
  Armchair,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ArrowRight,
  Info,
} from 'lucide-react';

interface SeatPickerProps {
  screenId: number;
  screenName: string;
  cinemaName?: string;
  showtime?: string;
  showDate?: string;
  seats: Seat[];
  selectedSeatNumbers: string[];
  onToggleSeat: (seatNumber: string) => void;
  onProceedToSnacks: () => void;
  onBackToShowtimes: () => void;
}

interface TierInfo {
  row: string;
  name: string;
  price: number;
  description: string;
  badgeColor: string;
}

const TIER_MAP: Record<string, TierInfo> = {
  A: {
    row: 'A',
    name: 'RECLINER LUXE',
    price: 350,
    description: 'Plush motorized leather recliner with extra legroom & table',
    badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
  },
  B: {
    row: 'B',
    name: 'PRIME CLUB',
    price: 220,
    description: 'Optimal center-tier cinematic sightlines with Dolby audio sweet-spot',
    badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40',
  },
  C: {
    row: 'C',
    name: 'CLASSIC CINEMA',
    price: 150,
    description: 'Comfortable standard theater seating with clear view',
    badgeColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  },
};

export const SeatPicker: React.FC<SeatPickerProps> = ({
  screenId,
  screenName,
  cinemaName = 'PVR ICON: Phoenix Palladium',
  showtime = '05:30 PM',
  showDate = 'Today',
  seats,
  selectedSeatNumbers,
  onToggleSeat,
  onProceedToSnacks,
  onBackToShowtimes,
}) => {
  const rows = ['A', 'B', 'C'];
  const cols = ['1', '2', '3', '4', '5'];

  const getSeat = (row: string, col: string): Seat | undefined => {
    return seats.find(
      (s) => s.screen_id === screenId && s.seat_number === `${row}${col}`
    );
  };

  // Calculate subtotal for selected seats
  const ticketSubtotal = selectedSeatNumbers.reduce((sum, seatNo) => {
    const row = seatNo.charAt(0);
    const tier = TIER_MAP[row];
    return sum + (tier ? tier.price : 200);
  }, 0);

  return (
    <div className="space-y-6 pb-28">
      {/* Top Breadcrumb & Cinema Header */}
      <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold uppercase tracking-wider">
            <Armchair className="w-4 h-4" />
            <span>Select Your Seats</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white font-display">
            {cinemaName}
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
            <span className="text-zinc-200 font-medium">{screenName}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-rose-400 font-semibold">{showtime}</span>
            <span className="text-zinc-600">•</span>
            <span>{showDate}</span>
          </div>
        </div>

        <button
          onClick={onBackToShowtimes}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Change Showtime</span>
        </button>
      </div>

      {/* Screen Curved Projection Visualizer */}
      <div className="relative py-6 max-w-xl mx-auto flex flex-col items-center">
        <div className="w-4/5 h-2.5 bg-gradient-to-r from-transparent via-rose-500/80 to-transparent rounded-full blur-[1px] shadow-[0_0_25px_rgba(244,63,94,0.6)]" />
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-rose-400 to-transparent rounded-full mt-1" />
        <p className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase mt-2.5">
          ▼ ALL EYES THIS WAY • CINEMA SCREEN ▼
        </p>
      </div>

      {/* Seating Layout by Tier */}
      <div className="max-w-2xl mx-auto space-y-5">
        {rows.map((row) => {
          const tier = TIER_MAP[row];

          return (
            <div
              key={row}
              className="bg-zinc-900/60 p-4 sm:p-5 rounded-2xl border border-zinc-800/80 backdrop-blur-sm relative shadow-md"
            >
              {/* Tier Header (Recliner Luxe / Prime Club / Classic Cinema) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 mb-4 border-b border-zinc-800/60">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold border uppercase tracking-wider ${tier.badgeColor}`}
                  >
                    {tier.name}
                  </span>
                  <span className="text-xs text-zinc-400 hidden sm:inline">
                    {tier.description}
                  </span>
                </div>
                <div className="text-xs font-mono text-rose-400 font-bold">
                  ₹{tier.price}.00 / ticket
                </div>
              </div>

              {/* Seats Row */}
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <span className="w-6 text-center text-xs font-mono font-bold text-zinc-500">
                  {row}
                </span>

                <div className="flex items-center gap-2 sm:gap-3.5">
                  {cols.map((col) => {
                    const seatNumber = `${row}${col}`;
                    const seat = getSeat(row, col);
                    const isBooked = seat?.status === 'BOOKED';
                    const isSelected = selectedSeatNumbers.includes(seatNumber);

                    return (
                      <button
                        key={seatNumber}
                        id={`seat-btn-${seatNumber}`}
                        disabled={isBooked}
                        onClick={() => onToggleSeat(seatNumber)}
                        title={
                          isBooked
                            ? `Seat ${seatNumber} is booked`
                            : `Seat ${seatNumber} - ${tier.name} (₹${tier.price})`
                        }
                        className={`group relative flex flex-col items-center justify-center w-11 h-12 sm:w-13 sm:h-13 rounded-xl text-xs font-mono font-semibold transition-all duration-200 ${
                          isBooked
                            ? 'bg-zinc-900/70 border border-red-950/60 text-red-500/40 cursor-not-allowed opacity-50'
                            : isSelected
                            ? 'bg-rose-600 text-white border border-rose-500 shadow-lg shadow-rose-600/40 scale-105 ring-2 ring-rose-400'
                            : 'bg-zinc-800/90 border border-zinc-700/80 text-zinc-200 hover:border-rose-500/60 hover:bg-zinc-700/90 hover:scale-105 active:scale-95'
                        }`}
                      >
                        <span className="text-xs leading-none">
                          {isBooked ? 'XX' : seatNumber}
                        </span>

                        <span
                          className={`text-[8px] uppercase tracking-tighter mt-1 ${
                            isBooked
                              ? 'text-red-500/70'
                              : isSelected
                              ? 'text-white font-bold'
                              : 'text-zinc-400 group-hover:text-rose-400'
                          }`}
                        >
                          {isBooked ? 'Sold' : isSelected ? 'Selected' : `₹${tier.price}`}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <span className="w-6 text-center text-xs font-mono font-bold text-zinc-500">
                  {row}
                </span>
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-zinc-800 border border-zinc-700" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-rose-600 border border-rose-500 shadow-sm" />
            <span className="text-zinc-200 font-medium">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-zinc-900/70 border border-red-950 text-[9px] font-mono text-red-400 flex items-center justify-center">
              XX
            </div>
            <span className="text-zinc-500">Booked (Sold Out)</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar for Next Action */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 p-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-zinc-400">
              {selectedSeatNumbers.length > 0 ? (
                <>
                  Selected:{' '}
                  <span className="font-bold text-white font-mono">
                    {selectedSeatNumbers.join(', ')}
                  </span>{' '}
                  ({selectedSeatNumbers.length} {selectedSeatNumbers.length === 1 ? 'Seat' : 'Seats'})
                </>
              ) : (
                'Select seats to proceed'
              )}
            </div>
            <div className="text-base font-black text-white font-mono">
              ₹{ticketSubtotal}.00
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="proceed-to-snacks-btn"
              disabled={selectedSeatNumbers.length === 0}
              onClick={onProceedToSnacks}
              className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-rose-600/30 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-102"
            >
              <span>Select Snacks & Combos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
