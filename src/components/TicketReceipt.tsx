import React, { useState } from 'react';
import { EnrichedBooking } from '../types';
import {
  CheckCircle2,
  Printer,
  Share2,
  Calendar,
  Clock,
  Tv,
  Armchair,
  CreditCard,
  QrCode,
  Sparkles,
  ArrowLeft,
  Smartphone,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  MapPin,
  Coffee,
} from 'lucide-react';

interface TicketReceiptProps {
  enrichedBooking: EnrichedBooking;
  onBookAnother: () => void;
  onCancelBooking?: (bookingId: number) => void;
}

export const TicketReceipt: React.FC<TicketReceiptProps> = ({
  enrichedBooking,
  onBookAnother,
  onCancelBooking,
}) => {
  const [copied, setCopied] = useState(false);
  const [sentWhatsapp, setSentWhatsapp] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { booking, movie, screen, seat, payment } = enrichedBooking;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    const code = booking.booking_reference || `BMS-${booking.booking_id}`;
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsapp = () => {
    setSentWhatsapp(true);
    setTimeout(() => setSentWhatsapp(false), 3000);
  };

  const formattedDate = new Date(booking.booking_time).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  const seatList = booking.seat_numbers && booking.seat_numbers.length > 0
    ? booking.seat_numbers.join(', ')
    : seat.seat_number;

  const refCode = booking.booking_reference || `BMS-${booking.booking_id}`;

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-16">
      {/* Celebration Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-1 shadow-xl shadow-emerald-500/20 animate-bounce">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
          Booking Confirmed!
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400">
          Your digital M-Ticket is active. Show the barcode at the cinema turnstile for direct entry.
        </p>
      </div>

      {/* BookMyShow Style Digital M-Ticket */}
      <div
        id="printable-ticket"
        className="relative bg-zinc-900 rounded-3xl border border-zinc-700/80 overflow-hidden shadow-2xl shadow-black/90"
      >
        {/* Top Header Card */}
        <div className="relative p-6 bg-gradient-to-br from-rose-950/60 via-zinc-900 to-zinc-950 border-b border-zinc-800">
          <div className="flex items-start gap-4 justify-between">
            <div className="flex items-start gap-3.5">
              <div className="w-14 h-20 rounded-xl overflow-hidden shrink-0 border border-zinc-700 bg-zinc-950 shadow-md">
                <img
                  src={movie.posterUrl}
                  alt={movie.movie_name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-rose-400 uppercase font-semibold">
                  Official Admission Pass
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white font-display">
                  {movie.movie_name}
                </h3>
                <p className="text-xs text-zinc-400">
                  {movie.language} • {movie.certification || 'U/A 13+'} • {movie.duration} mins
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Ref Code</span>
              <div className="flex items-center gap-1 bg-rose-600/20 text-rose-300 border border-rose-500/40 px-2.5 py-1 rounded-lg font-mono font-black text-xs">
                <span>{refCode}</span>
                <button
                  onClick={handleCopyCode}
                  className="hover:text-white"
                  title="Copy Reference Code"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Details Body */}
        <div className="p-6 space-y-5">
          {/* Cinema & Screen */}
          <div className="space-y-1 pb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{booking.cinema_name || 'PVR ICON: Phoenix Palladium, Lower Parel'}</span>
            </div>
            <div className="text-xs text-zinc-300 font-medium">
              {screen.screen_name} • {booking.show_date || 'Today'} at {booking.show_time || '05:30 PM'}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 border-b border-zinc-800/80 text-xs">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 block uppercase">
                Seats ({booking.seat_numbers?.length || 1})
              </span>
              <span className="font-mono font-bold text-white bg-rose-600/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30 inline-block mt-0.5">
                {seatList}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-zinc-500 block uppercase">
                Total Paid
              </span>
              <span className="font-bold text-emerald-400 font-mono text-sm mt-0.5 block">
                ₹{booking.amount}.00
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-zinc-500 block uppercase">
                Payment
              </span>
              <span className="font-semibold text-zinc-200 mt-0.5 block">
                {payment.payment_method} • Verified
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-zinc-500 block uppercase">
                Status
              </span>
              <span className="font-semibold text-emerald-400 mt-0.5 block">
                CONFIRMED
              </span>
            </div>
          </div>

          {/* Snacks ordered if any */}
          {booking.snacks && booking.snacks.length > 0 && (
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                <Coffee className="w-3.5 h-3.5" />
                <span>Pre-ordered F&B (In-Seat Delivery):</span>
              </div>
              <div className="text-zinc-300 space-y-1">
                {booking.snacks.map((snk, i) => (
                  <div key={i} className="flex justify-between">
                    <span>
                      {snk.qty}x {snk.name}
                    </span>
                    <span className="font-mono text-zinc-400">₹{snk.price * snk.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer info */}
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <div>
              <span className="text-zinc-500 block text-[10px]">Guest Name</span>
              <span className="font-medium text-white">{booking.customer_name}</span>
            </div>
            <div className="text-right">
              <span className="text-zinc-500 block text-[10px]">Booked At</span>
              <span className="font-mono text-zinc-300">{formattedDate}</span>
            </div>
          </div>

          {/* Perforated Barcode Strip with side cutout notches */}
          <div className="relative pt-4 flex items-center justify-between border-t border-dashed border-zinc-700/80">
            {/* Cutout notches on left and right */}
            <div className="absolute -left-9 -top-3 w-6 h-6 rounded-full bg-zinc-950 border-r border-zinc-700/70" />
            <div className="absolute -right-9 -top-3 w-6 h-6 rounded-full bg-zinc-950 border-l border-zinc-700/70" />

            <div className="space-y-1">
              <div className="h-8 flex items-center gap-[2px] opacity-85">
                {[2, 4, 1, 3, 2, 5, 1, 2, 4, 2, 1, 3, 4, 2, 5, 2, 1, 3, 2, 4, 1, 3, 2, 4, 1, 3].map(
                  (width, idx) => (
                    <div
                      key={idx}
                      className="h-full bg-zinc-200"
                      style={{ width: `${width}px` }}
                    />
                  )
                )}
              </div>
              <span className="text-[9px] font-mono text-zinc-500 tracking-widest block">
                *{refCode}-{booking.booking_id}*
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-14 h-14 bg-white p-1 rounded-xl flex items-center justify-center shadow-lg">
                <QrCode className="w-12 h-12 text-zinc-950" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Delivery Status Confirmation */}
      <div className="p-3 bg-zinc-900/80 rounded-2xl border border-zinc-800 flex items-center justify-between text-xs text-zinc-300">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>M-Ticket dispatched to WhatsApp & SMS</span>
        </div>
        <button
          onClick={handleSendWhatsapp}
          className="text-rose-400 hover:text-rose-300 font-semibold"
        >
          {sentWhatsapp ? 'Sent!' : 'Resend M-Ticket'}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
        <button
          type="button"
          id="print-ticket-btn"
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-medium rounded-xl text-xs border border-zinc-700 transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print / PDF</span>
        </button>

        <button
          type="button"
          onClick={() => setShowCancelModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 font-medium rounded-xl text-xs border border-zinc-800 hover:border-red-900/50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Cancel Ticket</span>
        </button>

        <button
          type="button"
          id="book-another-btn"
          onClick={onBookAnother}
          className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-rose-600/30"
        >
          <span>Book More Tickets</span>
        </button>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-500">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">Cancel Ticket Booking?</h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Are you sure you want to cancel booking <strong className="text-white">#{booking.booking_id}</strong>? A refund of <strong className="text-emerald-400">₹{booking.amount}</strong> will be processed back to your {payment.payment_method} account, and the seats ({seatList}) will be freed for other cinema goers.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700"
              >
                Keep Booking
              </button>
              <button
                onClick={() => {
                  if (onCancelBooking) {
                    onCancelBooking(booking.booking_id);
                  }
                  setShowCancelModal(false);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
