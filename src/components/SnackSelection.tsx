import React, { useState } from 'react';
import { SnackItem } from '../types';
import { SNACK_MENU } from '../data/initialData';
import {
  Coffee,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Check,
  ChevronLeft,
} from 'lucide-react';

interface SnackSelectionProps {
  selectedSnacks: { [snackId: string]: number };
  onUpdateSnackQty: (snackId: string, delta: number) => void;
  onContinueToPayment: () => void;
  onBackToSeats: () => void;
  ticketSubtotal: number;
}

const CATEGORIES = ['All', 'Combos', 'Popcorn', 'Beverages', 'Quick Bites'];

export const SnackSelection: React.FC<SnackSelectionProps> = ({
  selectedSnacks,
  onUpdateSnackQty,
  onContinueToPayment,
  onBackToSeats,
  ticketSubtotal,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredSnacks =
    activeCategory === 'All'
      ? SNACK_MENU
      : SNACK_MENU.filter((s) => s.category === activeCategory);

  const totalSnackCost = Object.entries(selectedSnacks).reduce((sum, [id, rawQty]) => {
    const qty = Number(rawQty) || 0;
    const item = SNACK_MENU.find((s) => s.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const totalSnackItemsCount = Object.values(selectedSnacks).reduce((a: number, b) => a + (Number(b) || 0), 0);

  return (
    <div className="space-y-6 pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-zinc-900 to-rose-950/30 rounded-3xl border border-zinc-800 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Coffee className="w-4 h-4" />
            <span>Grab a Bite Before The Show</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display">
            Food & Beverage Combos
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Delivered hot right to your seat before the movie starts!
          </p>
        </div>

        <button
          onClick={onContinueToPayment}
          className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-all self-start sm:self-auto"
        >
          Skip F&B & Checkout →
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800/80 text-xs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Snacks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSnacks.map((snack) => {
          const qty = selectedSnacks[snack.id] || 0;

          return (
            <div
              key={snack.id}
              className={`rounded-2xl border transition-all p-4 flex flex-col justify-between space-y-3 ${
                qty > 0
                  ? 'bg-rose-950/20 border-rose-500/60 shadow-lg shadow-rose-950/30'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/90'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Snack Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-zinc-950 border border-zinc-800">
                  <img
                    src={snack.imageUrl}
                    alt={snack.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-1.5">
                    {/* Veg / Non-Veg Indicator Icon */}
                    <div
                      className={`w-3.5 h-3.5 border flex items-center justify-center rounded-sm ${
                        snack.isVeg
                          ? 'border-emerald-500 text-emerald-500'
                          : 'border-rose-500 text-rose-500'
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          snack.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500">
                      {snack.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-tight">
                    {snack.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-2">
                    {snack.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                <span className="text-base font-black text-white font-mono">
                  ₹{snack.price}
                </span>

                {qty === 0 ? (
                  <button
                    onClick={() => onUpdateSnackQty(snack.id, 1)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 rounded-lg text-xs font-bold transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ADD</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-rose-600 text-white px-2 py-1 rounded-lg">
                    <button
                      onClick={() => onUpdateSnackQty(snack.id, -1)}
                      className="p-1 hover:bg-rose-700 rounded transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold text-xs px-1">{qty}</span>
                    <button
                      onClick={() => onUpdateSnackQty(snack.id, 1)}
                      className="p-1 hover:bg-rose-700 rounded transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Summary Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 p-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onBackToSeats}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Seats</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[11px] text-zinc-400">
                Tickets (₹{ticketSubtotal}) + F&B (₹{totalSnackCost})
              </div>
              <div className="text-base font-black text-white font-mono">
                Total: ₹{ticketSubtotal + totalSnackCost}
              </div>
            </div>

            <button
              onClick={onContinueToPayment}
              className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-rose-600/30"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
