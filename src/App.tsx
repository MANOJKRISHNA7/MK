import React, { useState, useEffect } from 'react';
import { db } from './data/dbStore';
import {
  Movie,
  Screen,
  Seat,
  Booking,
  Payment,
  EnrichedBooking,
  PaymentMethod,
  Cinema,
} from './types';
import { Navbar } from './components/Navbar';
import { MovieSelection } from './components/MovieSelection';
import { ScreenSelection } from './components/ScreenSelection';
import { SeatPicker } from './components/SeatPicker';
import { SnackSelection } from './components/SnackSelection';
import { PaymentStep } from './components/PaymentStep';
import { TicketReceipt } from './components/TicketReceipt';
import { BookingHistory } from './components/BookingHistory';
import { CinemasDirectory } from './components/CinemasDirectory';
import {
  Film,
  Building2,
  Armchair,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Coffee,
  Ticket,
  ChevronRight,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

type Tab = 'movies' | 'cinemas' | 'history' | 'snacks';
type BookingStep = 'movie' | 'showtimes' | 'seat' | 'snacks' | 'payment' | 'receipt';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('movies');
  const [bookingStep, setBookingStep] = useState<BookingStep>('movie');

  // Navigation & Location state
  const [selectedCity, setSelectedCity] = useState<string>('Mumbai');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Database reactive state
  const [movies, setMovies] = useState<Movie[]>([]);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [enrichedBookings, setEnrichedBookings] = useState<EnrichedBooking[]>([]);

  // Current Booking Journey selection state
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(1);
  const [selectedScreenId, setSelectedScreenId] = useState<number | null>(1);
  const [selectedCinemaName, setSelectedCinemaName] = useState<string>(
    'PVR ICON: Phoenix Palladium, Lower Parel'
  );
  const [selectedShowtime, setSelectedShowtime] = useState<string>('05:30 PM');
  const [selectedShowDate, setSelectedShowDate] = useState<string>('Today, 16 Sep 2026');

  // Multi-seat selection state
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<string[]>(['B2', 'B3']);

  // Selected F&B snacks
  const [selectedSnacks, setSelectedSnacks] = useState<{ [snackId: string]: number }>({
    'c1': 1, // Regular Popcorn + Coke Combo
  });

  // Customer credentials
  const [customerName, setCustomerName] = useState<string>('Kanishka');
  const [customerEmail, setCustomerEmail] = useState<string>('kanishka@example.com');
  const [customerPhone, setCustomerPhone] = useState<string>('+91 98201 54321');

  // Confirmed booking state
  const [activeEnrichedBooking, setActiveEnrichedBooking] = useState<EnrichedBooking | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Load state and subscribe to DB changes
  const refreshDbData = () => {
    setMovies(db.getMovies());
    setScreens(db.getScreens());
    setSeats(db.getSeatsByScreen(selectedScreenId || 1));
    setBookings(db.getBookings());
    setPayments(db.getPayments());
    setEnrichedBookings(db.getEnrichedBookings());
  };

  useEffect(() => {
    refreshDbData();
    const unsubscribe = db.subscribe(() => {
      refreshDbData();
    });
    return () => {
      unsubscribe();
    };
  }, [selectedScreenId]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleResetDb = () => {
    db.resetToFactorySeed();
    setSelectedMovieId(1);
    setSelectedScreenId(1);
    setSelectedSeatNumbers(['B2']);
    setSelectedSnacks({});
    setBookingStep('movie');
    setActiveTab('movies');
    showToast('Platform reset to fresh cinema schedule!', 'success');
  };

  // Seat toggle handler (allow picking up to 6 seats)
  const handleToggleSeat = (seatNumber: string) => {
    setSelectedSeatNumbers((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((s) => s !== seatNumber);
      }
      if (prev.length >= 6) {
        showToast('Maximum 6 tickets can be selected at a time', 'error');
        return prev;
      }
      return [...prev, seatNumber];
    });
  };

  // Update snack quantity
  const handleUpdateSnackQty = (snackId: string, delta: number) => {
    setSelectedSnacks((prev) => {
      const current = prev[snackId] || 0;
      const nextVal = Math.max(0, current + delta);
      if (nextVal === 0) {
        const copy = { ...prev };
        delete copy[snackId];
        return copy;
      }
      return { ...prev, [snackId]: nextVal };
    });
  };

  // Step transitions
  const handleSelectMovie = (movieId: number) => {
    setSelectedMovieId(movieId);
    setActiveTab('movies');
    setBookingStep('showtimes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectScreenAndShowtime = (
    screenId: number,
    cinemaName: string,
    showtime: string,
    showDate: string
  ) => {
    setSelectedScreenId(screenId);
    setSelectedCinemaName(cinemaName);
    setSelectedShowtime(showtime);
    setSelectedShowDate(showDate);
    setSeats(db.getSeatsByScreen(screenId));
    setSelectedSeatNumbers([]); // fresh seats for the auditorium
    setBookingStep('seat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmBooking = async (
    paymentMethod: PaymentMethod,
    details: string,
    ticketAmount: number,
    totalAmount: number,
    snackItems: { name: string; qty: number; price: number }[]
  ) => {
    if (!selectedMovieId || !selectedScreenId || selectedSeatNumbers.length === 0) {
      showToast('Please select at least one seat to proceed!', 'error');
      return;
    }

    setIsProcessing(true);

    // Realistic banking verification network latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const result = db.executeMultiSeatBookingTransaction({
      customerName,
      customerEmail,
      customerPhone,
      movieId: selectedMovieId,
      screenId: selectedScreenId,
      seatNumbers: selectedSeatNumbers,
      ticketAmount,
      totalAmount,
      paymentMethod,
      paymentDetails: details,
      cinemaName: selectedCinemaName,
      showDate: selectedShowDate,
      showTime: selectedShowtime,
      snacks: snackItems,
    });

    setIsProcessing(false);

    if (result.success && result.booking && result.payment) {
      const movie = movies.find((m) => m.movie_id === selectedMovieId)!;
      const screen = screens.find((s) => s.screen_id === selectedScreenId)!;
      const primarySeat = seats.find((s) => s.seat_id === result.booking!.seat_id) || {
        seat_id: result.booking.seat_id,
        screen_id: selectedScreenId,
        seat_number: selectedSeatNumbers[0] || 'A1',
        status: 'BOOKED',
      };

      const enriched: EnrichedBooking = {
        booking: result.booking,
        movie,
        screen,
        seat: primarySeat,
        seats: seats.filter((s) => selectedSeatNumbers.includes(s.seat_number)),
        payment: result.payment,
      };

      setActiveEnrichedBooking(enriched);
      setBookingStep('receipt');
      showToast(
        `🎉 Booking Confirmed! Reference: ${result.booking.booking_reference || '#' + result.booking.booking_id}`,
        'success'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showToast(result.error || 'Booking transaction could not be completed', 'error');
    }
  };

  const handleCancelBooking = (bookingId: number) => {
    const res = db.cancelBooking(bookingId);
    if (res.success) {
      refreshDbData();
      showToast(res.message, 'success');
      setActiveTab('history');
      setBookingStep('movie');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleBookAnother = () => {
    setSelectedSeatNumbers([]);
    setSelectedSnacks({});
    setBookingStep('movie');
    setActiveTab('movies');
    setActiveEnrichedBooking(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedMovie = movies.find((m) => m.movie_id === selectedMovieId) || movies[0];
  const selectedScreen = screens.find((s) => s.screen_id === selectedScreenId) || screens[0];

  // Calculate ticket subtotal for step transitions
  const ticketSubtotal = selectedSeatNumbers.reduce((sum, sNo) => {
    const row = sNo.charAt(0);
    const price = row === 'A' ? 350 : row === 'B' ? 220 : 150;
    return sum + price;
  }, 0);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-rose-500 selection:text-white">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-20 right-4 sm:right-6 z-50 px-4 py-3 rounded-2xl border text-xs font-semibold shadow-2xl flex items-center gap-2.5 backdrop-blur-md ${
              toastType === 'success'
                ? 'bg-zinc-900/95 text-emerald-400 border-emerald-500/40 shadow-emerald-950/40'
                : 'bg-zinc-900/95 text-rose-400 border-rose-500/40 shadow-rose-950/40'
            }`}
          >
            {toastType === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'movies' && bookingStep === 'receipt') {
            setBookingStep('movie');
          }
        }}
        bookingCount={bookings.length}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onResetDb={handleResetDb}
        customerName={customerName}
        customerEmail={customerEmail}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TAB 1: MOVIES & BOOKING FLOW */}
        {activeTab === 'movies' && (
          <div className="space-y-6">
            {/* Step Progress Bar (Only shown during active checkout stages) */}
            {bookingStep !== 'movie' && bookingStep !== 'receipt' && (
              <div className="bg-zinc-900/80 p-2 sm:p-3 rounded-2xl border border-zinc-800/80 backdrop-blur-sm">
                <div className="flex items-center justify-between overflow-x-auto text-xs font-semibold">
                  <button
                    onClick={() => setBookingStep('movie')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all whitespace-nowrap"
                  >
                    <Film className="w-3.5 h-3.5 text-rose-500" />
                    <span>1. {selectedMovie?.movie_name || 'Movie'}</span>
                  </button>

                  <ChevronRight className="w-4 h-4 text-zinc-700 shrink-0" />

                  <button
                    onClick={() => setBookingStep('showtimes')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                      bookingStep === 'showtimes'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>2. Cinema & Time</span>
                  </button>

                  <ChevronRight className="w-4 h-4 text-zinc-700 shrink-0" />

                  <button
                    onClick={() => setBookingStep('seat')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                      bookingStep === 'seat'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <Armchair className="w-3.5 h-3.5" />
                    <span>
                      3. Seats{' '}
                      {selectedSeatNumbers.length > 0 && `(${selectedSeatNumbers.length})`}
                    </span>
                  </button>

                  <ChevronRight className="w-4 h-4 text-zinc-700 shrink-0" />

                  <button
                    onClick={() => setBookingStep('snacks')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                      bookingStep === 'snacks'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <Coffee className="w-3.5 h-3.5" />
                    <span>4. Food & Snacks</span>
                  </button>

                  <ChevronRight className="w-4 h-4 text-zinc-700 shrink-0" />

                  <button
                    onClick={() => setBookingStep('payment')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                      bookingStep === 'payment'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-zinc-500'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>5. Payment</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 1: Movie Selection Grid */}
            {bookingStep === 'movie' && (
              <MovieSelection
                movies={movies}
                selectedMovieId={selectedMovieId}
                onSelectMovie={handleSelectMovie}
                selectedCity={selectedCity}
                searchQuery={searchQuery}
              />
            )}

            {/* STEP 2: Theatres & Showtimes Selection */}
            {bookingStep === 'showtimes' && selectedMovie && (
              <ScreenSelection
                movie={selectedMovie}
                screens={screens}
                selectedScreenId={selectedScreenId}
                selectedCinemaName={selectedCinemaName}
                selectedShowtime={selectedShowtime}
                onSelectScreenAndShowtime={handleSelectScreenAndShowtime}
                onBackToMovies={() => setBookingStep('movie')}
              />
            )}

            {/* STEP 3: Interactive Seat Selection */}
            {bookingStep === 'seat' && selectedMovie && selectedScreen && (
              <SeatPicker
                screenId={selectedScreen.screen_id}
                screenName={selectedScreen.screen_name}
                cinemaName={selectedCinemaName}
                showtime={selectedShowtime}
                showDate={selectedShowDate}
                seats={seats}
                selectedSeatNumbers={selectedSeatNumbers}
                onToggleSeat={handleToggleSeat}
                onProceedToSnacks={() => {
                  setBookingStep('snacks');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onBackToShowtimes={() => setBookingStep('showtimes')}
              />
            )}

            {/* STEP 4: Food, Beverages & Snacks */}
            {bookingStep === 'snacks' && (
              <SnackSelection
                selectedSnacks={selectedSnacks}
                onUpdateSnackQty={handleUpdateSnackQty}
                onContinueToPayment={() => {
                  setBookingStep('payment');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onBackToSeats={() => setBookingStep('seat')}
                ticketSubtotal={ticketSubtotal}
              />
            )}

            {/* STEP 5: Payment & Checkout */}
            {bookingStep === 'payment' && selectedMovie && selectedScreen && (
              <PaymentStep
                movie={selectedMovie}
                screen={selectedScreen}
                cinemaName={selectedCinemaName}
                showtime={selectedShowtime}
                showDate={selectedShowDate}
                selectedSeats={selectedSeatNumbers}
                selectedSnacks={selectedSnacks}
                customerName={customerName}
                setCustomerName={setCustomerName}
                customerEmail={customerEmail}
                setCustomerEmail={setCustomerEmail}
                customerPhone={customerPhone}
                setCustomerPhone={setCustomerPhone}
                onConfirmBooking={handleConfirmBooking}
                isProcessing={isProcessing}
                onBack={() => setBookingStep('snacks')}
              />
            )}

            {/* STEP 6: Confirmed Digital M-Ticket Receipt */}
            {bookingStep === 'receipt' && activeEnrichedBooking && (
              <TicketReceipt
                enrichedBooking={activeEnrichedBooking}
                onBookAnother={handleBookAnother}
                onCancelBooking={handleCancelBooking}
              />
            )}
          </div>
        )}

        {/* TAB 2: CINEMAS DIRECTORY */}
        {activeTab === 'cinemas' && (
          <CinemasDirectory
            selectedCity={selectedCity}
            movies={movies}
            onSelectCinemaShowtime={(cinema, time, screenId, movie) => {
              setSelectedMovieId(movie.movie_id);
              setSelectedCinemaName(cinema.name);
              setSelectedShowtime(time);
              setSelectedScreenId(screenId);
              setSeats(db.getSeatsByScreen(screenId));
              setSelectedSeatNumbers([]);
              setActiveTab('movies');
              setBookingStep('seat');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* TAB 3: STANDALONE SNACKS & COMBOS */}
        {activeTab === 'snacks' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-rose-950/40 via-zinc-900 to-amber-950/30 p-6 rounded-3xl border border-zinc-800">
              <h2 className="text-2xl font-black text-white font-display">
                Cinema Concessions & Food Menu
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Explore our gourmet cinema popcorn, refreshing ice-cold beverages, and hot bite combos delivered to your seat.
              </p>
            </div>

            <SnackSelection
              selectedSnacks={selectedSnacks}
              onUpdateSnackQty={handleUpdateSnackQty}
              onContinueToPayment={() => {
                setActiveTab('movies');
                setBookingStep('movie');
                showToast('Choose your movie first, and your snacks will be ready at checkout!', 'success');
              }}
              onBackToSeats={() => {
                setActiveTab('movies');
                setBookingStep('movie');
              }}
              ticketSubtotal={ticketSubtotal}
            />
          </div>
        )}

        {/* TAB 4: MY BOOKINGS / DIGITAL TICKETS */}
        {activeTab === 'history' && (
          <BookingHistory
            enrichedBookings={enrichedBookings}
            onSelectBooking={(eb) => {
              setActiveEnrichedBooking(eb);
              setActiveTab('movies');
              setBookingStep('receipt');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBookNew={() => {
              setActiveTab('movies');
              setBookingStep('movie');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Production Cinema Footer */}
      <footer className="w-full border-t border-zinc-800/80 bg-zinc-950 py-8 mt-12 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center text-white font-black text-xs">
                <Film className="w-4 h-4" />
              </div>
              <span className="text-sm font-black text-white tracking-tight">
                CINE<span className="text-rose-500">PASS</span>
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">Interactive Movie Ticket Booking System</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-zinc-400">
              <span className="hover:text-white cursor-pointer transition-colors">About Us</span>
              <span className="hover:text-white cursor-pointer transition-colors">Help Center & FAQs</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-500">
            <div>
              © 2026 CinePass Entertainment Media Pvt. Ltd. All rights reserved.
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Safe & Secure Online Booking Experience</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
