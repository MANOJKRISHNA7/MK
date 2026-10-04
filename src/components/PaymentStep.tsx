import React, { useState } from 'react';
import { Movie, Screen, PaymentMethod } from '../types';
import { SNACK_MENU } from '../data/initialData';
import {
  CreditCard,
  QrCode,
  Banknote,
  User,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Lock,
  ArrowRight,
  Ticket,
  ChevronLeft,
  Mail,
  Phone,
  Tag,
  Sparkles,
  Smartphone,
} from 'lucide-react';

interface PaymentStepProps {
  movie: Movie;
  screen: Screen;
  cinemaName?: string;
  showtime?: string;
  showDate?: string;
  selectedSeats: string[];
  selectedSnacks: { [snackId: string]: number };
  customerName: string;
  setCustomerName: (name: string) => void;
  customerEmail: string;
  setCustomerEmail: (email: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  onConfirmBooking: (
    paymentMethod: PaymentMethod,
    details: string,
    ticketAmount: number,
    totalAmount: number,
    snackItems: { name: string; qty: number; price: number }[]
  ) => Promise<void>;
  isProcessing: boolean;
  onBack: () => void;
}

const TIER_PRICES: Record<string, number> = {
  A: 350,
  B: 220,
  C: 150,
};

export const PaymentStep: React.FC<PaymentStepProps> = ({
  movie,
  screen,
  cinemaName = 'PVR ICON: Phoenix Palladium, Lower Parel',
  showtime = '05:30 PM',
  showDate = 'Today, 16 Sep 2026',
  selectedSeats,
  selectedSnacks,
  customerName,
  setCustomerName,
  customerEmail,
  setCustomerEmail,
  customerPhone,
  setCustomerPhone,
  onConfirmBooking,
  isProcessing,
  onBack,
}) => {
  const [method, setMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardCvv, setCardCvv] = useState('782');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  // Compute ticket amount
  const ticketSubtotal = selectedSeats.reduce((sum, seatNo) => {
    const row = seatNo.charAt(0);
    return sum + (TIER_PRICES[row] || 200);
  }, 0);

  // Compute snacks amount & list
  const snackList: { name: string; qty: number; price: number }[] = [];
  let snackSubtotal = 0;
  Object.entries(selectedSnacks).forEach(([id, rawQty]) => {
    const qty = Number(rawQty) || 0;
    if (qty > 0) {
      const item = SNACK_MENU.find((s) => s.id === id);
      if (item) {
        snackList.push({ name: item.name, qty, price: item.price });
        snackSubtotal += item.price * qty;
      }
    }
  });

  const convenienceFee = selectedSeats.length * 28;
  const tax = Math.round(convenienceFee * 0.18);
  const discount = discountApplied ? 50 : 0;
  const grandTotal = ticketSubtotal + snackSubtotal + convenienceFee + tax - discount;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'CINEPASS50' || promoCode.trim().toUpperCase() === 'BMS50') {
      setDiscountApplied(true);
    } else {
      setDiscountApplied(true); // Reward user on any demo attempt
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let details = '';
    if (method === 'UPI') {
      details = upiId.trim() || 'user@upi';
    } else if (method === 'CARD') {
      const last4 = cardNumber.replace(/\s+/g, '').slice(-4) || '6789';
      details = `Card ending •••• ${last4}`;
    } else {
      details = 'Pay at Counter';
    }

    await onConfirmBooking(method, details, ticketSubtotal, grandTotal, snackList);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2">
            <Lock className="w-5 h-5 text-rose-500" />
            <span>Secure Checkout</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Finalize your ticket reservation & receive your M-Ticket instantly
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-xl transition-all"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Payment Methods (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Details Card */}
            <div className="bg-zinc-900/70 p-5 rounded-2xl border border-zinc-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-rose-500" />
                <span>Contact & Ticket Delivery Details</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Kanishka"
                      className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">
                      Email Address (For PDF Pass) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">
                      Mobile Number (WhatsApp M-Ticket) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+91 98201 54321"
                        className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-zinc-900/70 p-5 rounded-2xl border border-zinc-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-rose-500" />
                <span>Select Payment Method</span>
              </h3>

              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  id="payment-method-upi"
                  onClick={() => setMethod('UPI')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    method === 'UPI'
                      ? 'border-rose-500 bg-rose-500/10 text-white ring-1 ring-rose-500 shadow-sm'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-rose-500" />
                  <div className="text-center">
                    <span className="text-xs font-bold block">UPI Apps</span>
                    <span className="text-[10px] text-zinc-500">GPay, PhonePe</span>
                  </div>
                </button>

                <button
                  type="button"
                  id="payment-method-card"
                  onClick={() => setMethod('CARD')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    method === 'CARD'
                      ? 'border-rose-500 bg-rose-500/10 text-white ring-1 ring-rose-500 shadow-sm'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-rose-500" />
                  <div className="text-center">
                    <span className="text-xs font-bold block">Debit/Credit</span>
                    <span className="text-[10px] text-zinc-500">Visa, Mastercard</span>
                  </div>
                </button>

                <button
                  type="button"
                  id="payment-method-cash"
                  onClick={() => setMethod('CASH')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    method === 'CASH'
                      ? 'border-rose-500 bg-rose-500/10 text-white ring-1 ring-rose-500 shadow-sm'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-rose-500" />
                  <div className="text-center">
                    <span className="text-xs font-bold block">Box Office</span>
                    <span className="text-[10px] text-zinc-500">Pay at Counter</span>
                  </div>
                </button>
              </div>

              {/* Payment Details Form */}
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-3">
                {method === 'UPI' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-medium text-zinc-300">
                      Enter UPI ID / Virtual Payment Address:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okhdfcbank"
                        className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-100 font-mono focus:border-rose-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setUpiId('rahul.sharma@okaxis')}
                        className="px-2.5 py-1 text-[11px] bg-zinc-800 text-zinc-300 hover:text-white rounded-lg border border-zinc-700"
                      >
                        Auto-fill
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Instant payment approval with zero surcharge fees</span>
                    </div>
                  </div>
                )}

                {method === 'CARD' && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-zinc-300 mb-1 font-medium">Card Number:</label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 •••• •••• 6789"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 font-mono focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-zinc-300 mb-1 font-medium">Expiry:</label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 font-mono focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-300 mb-1 font-medium">CVV:</label>
                        <input
                          type="password"
                          maxLength={4}
                          required
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 font-mono focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {method === 'CASH' && (
                  <div className="py-2 text-center space-y-1">
                    <p className="text-xs font-bold text-zinc-200">
                      Reserve Now, Pay at Cinema Box Office
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Your seats are held. Please collect your paper tickets at the theater box office counter at least 20 minutes before showtime.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800 flex items-center gap-2">
              <Tag className="w-4 h-4 text-rose-500 shrink-0" />
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter Promo Code (Try CINEPASS50)"
                className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none uppercase font-mono"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 rounded-lg text-xs font-bold transition-all"
              >
                {discountApplied ? 'APPLIED ✓' : 'APPLY'}
              </button>
            </div>

            {/* Payment Button */}
            <button
              type="submit"
              id="confirm-booking-btn"
              disabled={isProcessing || !customerName.trim()}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl text-sm transition-all shadow-xl shadow-rose-600/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-101"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Securing Tickets & Reserving Seats...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{grandTotal}.00 & Confirm Booking</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-5 space-y-5 sticky top-24 shadow-2xl">
            <div className="flex items-start gap-3 pb-4 border-b border-zinc-800">
              <div className="w-16 h-22 rounded-xl overflow-hidden shrink-0 border border-zinc-700 bg-zinc-950">
                <img
                  src={movie.posterUrl}
                  alt={movie.movie_name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white leading-tight font-display">
                  {movie.movie_name}
                </h3>
                <p className="text-[11px] text-zinc-400">
                  {movie.language} • {movie.certification || 'U/A'}
                </p>
                <p className="text-xs font-semibold text-rose-400">
                  {cinemaName}
                </p>
                <p className="text-[11px] text-zinc-400">
                  {screen.screen_name} • {showtime} ({showDate})
                </p>
              </div>
            </div>

            {/* Selected Seats Badges */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Seats ({selectedSeats.length}):</span>
                <span className="font-mono font-bold text-white bg-zinc-800 px-2.5 py-0.5 rounded-lg border border-zinc-700">
                  {selectedSeats.join(', ')}
                </span>
              </div>
            </div>

            {/* Snacks itemized if any */}
            {snackList.length > 0 && (
              <div className="space-y-1.5 pt-3 border-t border-zinc-800 text-xs">
                <span className="text-zinc-400 font-semibold block">Food & Beverages:</span>
                {snackList.map((snk, i) => (
                  <div key={i} className="flex justify-between text-zinc-300">
                    <span>
                      {snk.qty}x {snk.name}
                    </span>
                    <span className="font-mono font-medium">₹{snk.price * snk.qty}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-2 pt-3 border-t border-zinc-800 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Tickets Subtotal</span>
                <span className="font-mono text-zinc-200">₹{ticketSubtotal}.00</span>
              </div>

              {snackSubtotal > 0 && (
                <div className="flex justify-between">
                  <span>Food & Beverage Subtotal</span>
                  <span className="font-mono text-zinc-200">₹{snackSubtotal}.00</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Convenience Fees (Integrated)</span>
                <span className="font-mono text-zinc-200">₹{convenienceFee}.00</span>
              </div>

              <div className="flex justify-between">
                <span>GST (18% on convenience fee)</span>
                <span className="font-mono text-zinc-200">₹{tax}.00</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Promo Discount Applied</span>
                  <span className="font-mono">-₹{discount}.00</span>
                </div>
              )}
            </div>

            {/* Grand Total */}
            <div className="pt-4 border-t border-zinc-700 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-zinc-400 block font-semibold uppercase tracking-wider">
                  Amount Payable
                </span>
                <span className="text-[11px] text-zinc-500">Includes all cinema taxes</span>
              </div>
              <span className="text-2xl font-black text-rose-400 font-mono">
                ₹{grandTotal}.00
              </span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Safe & Secure Payment with instant SMS & WhatsApp M-Ticket dispatch.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
