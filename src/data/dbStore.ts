import {
  Movie,
  Screen,
  Seat,
  Booking,
  Payment,
  EnrichedBooking,
  SqlQueryLog,
  PaymentMethod,
} from '../types';
import {
  INITIAL_MOVIES,
  INITIAL_SCREENS,
  generateInitialSeats,
  INITIAL_BOOKINGS,
  INITIAL_PAYMENTS,
} from './initialData';

const STORAGE_KEYS = {
  MOVIES: 'movie_booking_movies',
  SCREENS: 'movie_booking_screens',
  SEATS: 'movie_booking_seats',
  BOOKINGS: 'movie_booking_bookings',
  PAYMENTS: 'movie_booking_payments',
  SQL_LOGS: 'movie_booking_sql_logs',
};

export class MovieBookingDatabase {
  private static instance: MovieBookingDatabase;

  private movies: Movie[] = [];
  private screens: Screen[] = [];
  private seats: Seat[] = [];
  private bookings: Booking[] = [];
  private payments: Payment[] = [];
  private sqlLogs: SqlQueryLog[] = [];
  private listeners: Set<() => void> = new Set();

  private constructor() {
    this.initDatabase();
  }

  public static getInstance(): MovieBookingDatabase {
    if (!MovieBookingDatabase.instance) {
      MovieBookingDatabase.instance = new MovieBookingDatabase();
    }
    return MovieBookingDatabase.instance;
  }

  private initDatabase() {
    try {
      const storedMovies = localStorage.getItem(STORAGE_KEYS.MOVIES);
      const storedScreens = localStorage.getItem(STORAGE_KEYS.SCREENS);
      const storedSeats = localStorage.getItem(STORAGE_KEYS.SEATS);
      const storedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      const storedPayments = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      const storedLogs = localStorage.getItem(STORAGE_KEYS.SQL_LOGS);

      this.movies = storedMovies ? JSON.parse(storedMovies) : [...INITIAL_MOVIES];
      this.screens = storedScreens ? JSON.parse(storedScreens) : [...INITIAL_SCREENS];
      this.seats = storedSeats ? JSON.parse(storedSeats) : generateInitialSeats();
      this.bookings = storedBookings ? JSON.parse(storedBookings) : [...INITIAL_BOOKINGS];
      this.payments = storedPayments ? JSON.parse(storedPayments) : [...INITIAL_PAYMENTS];
      this.sqlLogs = storedLogs ? JSON.parse(storedLogs) : [];

      if (!storedMovies) {
        this.persistData(false);
        this.logQuery('USE movie_booking;', 'SELECT', 'SUCCESS', 1);
        this.logQuery('SELECT * FROM movies;', 'SELECT', 'SUCCESS', 2, this.movies.length);
      }
    } catch {
      this.movies = [...INITIAL_MOVIES];
      this.screens = [...INITIAL_SCREENS];
      this.seats = generateInitialSeats();
      this.bookings = [...INITIAL_BOOKINGS];
      this.payments = [...INITIAL_PAYMENTS];
      this.sqlLogs = [];
    }
  }

  private persistData(notifyListeners = true) {
    try {
      localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(this.movies));
      localStorage.setItem(STORAGE_KEYS.SCREENS, JSON.stringify(this.screens));
      localStorage.setItem(STORAGE_KEYS.SEATS, JSON.stringify(this.seats));
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(this.bookings));
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(this.payments));
    } catch {
      // Ignore storage errors in sandboxed modes
    }
    if (notifyListeners) {
      this.notify();
    }
  }

  private persistLogs() {
    try {
      localStorage.setItem(STORAGE_KEYS.SQL_LOGS, JSON.stringify(this.sqlLogs.slice(0, 100)));
    } catch {
      // Ignore storage errors
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public logQuery(
    query: string,
    type: 'SELECT' | 'INSERT' | 'UPDATE' | 'TRANSACTION',
    status: 'SUCCESS' | 'COMMITTED' | 'ROLLBACK' | 'ERROR' = 'SUCCESS',
    executionTimeMs = Math.floor(Math.random() * 4) + 1,
    rowsAffected?: number
  ) {
    const log: SqlQueryLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toLocaleTimeString(),
      query,
      type,
      status,
      executionTimeMs,
      rowsAffected,
    };
    this.sqlLogs.unshift(log);
    if (this.sqlLogs.length > 80) this.sqlLogs.pop();
    this.persistLogs();
  }

  // Database Accessors mimicking JDBC calls (pure getters, no mutation or side-effects)
  public getMovies(): Movie[] {
    return [...this.movies];
  }

  public getMovieById(movieId: number): Movie | undefined {
    return this.movies.find((m) => m.movie_id === movieId);
  }

  public getScreens(): Screen[] {
    return [...this.screens];
  }

  public getScreenById(screenId: number): Screen | undefined {
    return this.screens.find((s) => s.screen_id === screenId);
  }

  public getSeatsByScreen(screenId: number): Seat[] {
    return this.seats.filter((s) => s.screen_id === screenId);
  }

  public getSeat(screenId: number, seatNumber: string): Seat | undefined {
    return this.seats.find((s) => s.screen_id === screenId && s.seat_number.toUpperCase() === seatNumber.toUpperCase());
  }

  public getBookings(): Booking[] {
    return [...this.bookings];
  }

  public getPayments(): Payment[] {
    return [...this.payments];
  }

  public getSqlLogs(): SqlQueryLog[] {
    return [...this.sqlLogs];
  }

  public getEnrichedBookings(): EnrichedBooking[] {
    return this.bookings.map((b) => {
      const movie = this.movies.find((m) => m.movie_id === b.movie_id) || {
        movie_id: b.movie_id,
        movie_name: 'Unknown Movie',
        duration: 0,
        language: '-',
      };
      const screen = this.screens.find((s) => s.screen_id === b.screen_id) || {
        screen_id: b.screen_id,
        screen_name: `Screen ${b.screen_id}`,
      };
      const seat = this.seats.find((s) => s.seat_id === b.seat_id) || {
        seat_id: b.seat_id,
        screen_id: b.screen_id,
        seat_number: b.seat_numbers?.[0] || 'N/A',
        status: 'BOOKED',
      };
      
      const seats = b.seat_numbers && b.seat_numbers.length > 0
        ? this.seats.filter(s => s.screen_id === b.screen_id && b.seat_numbers!.includes(s.seat_number))
        : [seat];

      const payment = this.payments.find((p) => p.booking_id === b.booking_id) || {
        payment_id: 0,
        booking_id: b.booking_id,
        payment_method: 'CASH' as PaymentMethod,
        amount: b.amount,
        payment_status: 'SUCCESS' as const,
      };

      return {
        booking: b,
        movie,
        screen,
        seat,
        seats,
        payment,
      };
    }).sort((a, b) => new Date(b.booking.booking_time).getTime() - new Date(a.booking.booking_time).getTime());
  }

  /**
   * Real-world BookMyShow multi-seat transaction execution
   */
  public executeMultiSeatBookingTransaction(params: {
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    movieId: number;
    screenId: number;
    seatNumbers: string[];
    ticketAmount: number;
    convenienceFee?: number;
    taxAmount?: number;
    totalAmount: number;
    paymentMethod: PaymentMethod;
    paymentDetails?: string;
    cinemaName?: string;
    showDate?: string;
    showTime?: string;
    snacks?: { name: string; qty: number; price: number }[];
  }): { success: boolean; error?: string; booking?: Booking; payment?: Payment } {
    const cleanCustomerName = params.customerName.trim() || 'Guest Customer';

    // Validate movie
    const movie = this.movies.find((m) => m.movie_id === params.movieId);
    if (!movie) {
      return { success: false, error: 'Invalid movie selected!' };
    }

    // Validate screen
    const screen = this.screens.find((s) => s.screen_id === params.screenId);
    if (!screen) {
      return { success: false, error: 'Invalid screen selected!' };
    }

    if (!params.seatNumbers || params.seatNumbers.length === 0) {
      return { success: false, error: 'Please select at least one seat!' };
    }

    // Check all seats availability
    const matchedSeatIndices: number[] = [];
    for (const seatNo of params.seatNumbers) {
      const idx = this.seats.findIndex(
        (s) => s.screen_id === params.screenId && s.seat_number.toUpperCase() === seatNo.toUpperCase()
      );
      if (idx === -1) {
        return { success: false, error: `Invalid seat number [${seatNo}]!` };
      }
      if (this.seats[idx].status !== 'AVAILABLE') {
        return { success: false, error: `Seat ${seatNo} has just been booked by another guest!` };
      }
      matchedSeatIndices.push(idx);
    }

    try {
      const maxBookingId = this.bookings.reduce((max, b) => Math.max(max, b.booking_id), 100);
      const newBookingId = maxBookingId + 1;
      const refCode = 'BMS-' + Math.floor(10000 + Math.random() * 90000);

      const primarySeat = this.seats[matchedSeatIndices[0]];

      const newBooking: Booking = {
        booking_id: newBookingId,
        booking_reference: refCode,
        customer_name: cleanCustomerName,
        customer_email: params.customerEmail || `${cleanCustomerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        customer_phone: params.customerPhone || '+91 98201 54321',
        movie_id: params.movieId,
        screen_id: params.screenId,
        seat_id: primarySeat.seat_id,
        seat_numbers: [...params.seatNumbers],
        cinema_name: params.cinemaName || 'PVR ICON: Phoenix Palladium, Lower Parel',
        show_date: params.showDate || 'Today, 16 Sep 2026',
        show_time: params.showTime || '05:30 PM',
        snacks: params.snacks || [],
        ticket_amount: params.ticketAmount,
        convenience_fee: params.convenienceFee || 28,
        tax_amount: params.taxAmount || Math.round((params.convenienceFee || 28) * 0.18),
        amount: params.totalAmount,
        booking_time: new Date().toISOString(),
      };

      this.bookings.push(newBooking);

      // Lock all selected seats
      matchedSeatIndices.forEach((idx) => {
        this.seats[idx] = { ...this.seats[idx], status: 'BOOKED' };
      });

      // Generate payment
      const maxPaymentId = this.payments.reduce((max, p) => Math.max(max, p.payment_id), 500);
      const newPaymentId = maxPaymentId + 1;
      const txnId = 'TXN-' + Math.floor(1000000000 + Math.random() * 9000000000);

      const newPayment: Payment = {
        payment_id: newPaymentId,
        booking_id: newBookingId,
        payment_method: params.paymentMethod,
        amount: params.totalAmount,
        payment_status: 'SUCCESS',
        details: params.paymentDetails || (params.paymentMethod === 'CASH' ? 'Pay at Counter' : 'Instant Verified'),
        transaction_id: txnId,
      };

      this.payments.push(newPayment);
      this.persistData();

      return {
        success: true,
        booking: newBooking,
        payment: newPayment,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  }

  public cancelBooking(bookingId: number): { success: boolean; message: string } {
    const bookingIndex = this.bookings.findIndex((b) => b.booking_id === bookingId);
    if (bookingIndex === -1) {
      return { success: false, message: 'Booking not found!' };
    }

    const booking = this.bookings[bookingIndex];
    const seatsToFree = booking.seat_numbers || [
      this.seats.find((s) => s.seat_id === booking.seat_id)?.seat_number || '',
    ];

    // Free seats
    this.seats = this.seats.map((s) => {
      if (s.screen_id === booking.screen_id && seatsToFree.includes(s.seat_number)) {
        return { ...s, status: 'AVAILABLE' };
      }
      return s;
    });

    // Update payment to refunded
    const payment = this.payments.find((p) => p.booking_id === bookingId);
    if (payment) {
      payment.payment_status = 'SUCCESS';
      payment.details = 'Refunded to source account';
    }

    // Remove from active bookings
    this.bookings.splice(bookingIndex, 1);
    this.persistData();

    return {
      success: true,
      message: `Booking #${bookingId} cancelled. ₹${booking.amount} refund initiated.`,
    };
  }

  /**
   * Exact transaction flow matching MovieTicketBookingSystem.java:
   * conn.setAutoCommit(false);
   * 1. INSERT INTO bookings (customer_name, movie_id, screen_id, seat_id, amount) VALUES (?, ?, ?, ?, ?)
   * 2. UPDATE seats SET status = 'BOOKED' WHERE seat_id = ?
   * 3. INSERT INTO payments (booking_id, payment_method, amount, payment_status) VALUES (?, ?, ?, ?)
   * conn.commit();
   */
  public executeBookingTransaction(params: {
    customerName: string;
    movieId: number;
    screenId: number;
    seatNumber: string;
    amount?: number;
    paymentMethod: PaymentMethod;
    paymentDetails?: string;
  }): { success: boolean; error?: string; booking?: Booking; payment?: Payment } {
    const amount = params.amount || 200; // TICKET_PRICE = 200 from Java code
    const cleanCustomerName = params.customerName.trim() || 'Guest Customer';

    // Step 1: Validate movie
    const movie = this.movies.find((m) => m.movie_id === params.movieId);
    if (!movie) {
      return { success: false, error: 'Invalid movie selected!' };
    }

    // Step 2: Validate screen
    const screen = this.screens.find((s) => s.screen_id === params.screenId);
    if (!screen) {
      return { success: false, error: 'Invalid screen selected!' };
    }

    // Step 3: Validate seat
    const seatIndex = this.seats.findIndex(
      (s) => s.screen_id === params.screenId && s.seat_number.toUpperCase() === params.seatNumber.toUpperCase()
    );
    if (seatIndex === -1) {
      return { success: false, error: `Invalid seat number [${params.seatNumber}]!` };
    }

    const seat = this.seats[seatIndex];
    if (seat.status !== 'AVAILABLE') {
      return { success: false, error: `Sorry! Seat ${seat.seat_number} is already booked.` };
    }

    // Begin SQL Transaction
    this.logQuery('conn.setAutoCommit(false); -- START TRANSACTION', 'TRANSACTION', 'SUCCESS', 1);

    try {
      // 1. Generate Next Booking ID
      const maxBookingId = this.bookings.reduce((max, b) => Math.max(max, b.booking_id), 100);
      const newBookingId = maxBookingId + 1;

      const newBooking: Booking = {
        booking_id: newBookingId,
        customer_name: cleanCustomerName,
        movie_id: params.movieId,
        screen_id: params.screenId,
        seat_id: seat.seat_id,
        amount: amount,
        booking_time: new Date().toISOString(),
      };

      // Execute SQL: INSERT INTO bookings
      this.bookings.push(newBooking);
      this.logQuery(
        `INSERT INTO bookings (customer_name, movie_id, screen_id, seat_id, amount) VALUES ('${cleanCustomerName}', ${params.movieId}, ${params.screenId}, ${seat.seat_id}, ${amount});`,
        'INSERT',
        'SUCCESS',
        2,
        1
      );

      // 2. Execute SQL: UPDATE seats SET status = 'BOOKED' WHERE seat_id = ?
      this.seats[seatIndex] = { ...seat, status: 'BOOKED' };
      this.logQuery(
        `UPDATE seats SET status = 'BOOKED' WHERE seat_id = ${seat.seat_id};`,
        'UPDATE',
        'SUCCESS',
        1,
        1
      );

      // 3. Generate Next Payment ID
      const maxPaymentId = this.payments.reduce((max, p) => Math.max(max, p.payment_id), 500);
      const newPaymentId = maxPaymentId + 1;

      const newPayment: Payment = {
        payment_id: newPaymentId,
        booking_id: newBookingId,
        payment_method: params.paymentMethod,
        amount: amount,
        payment_status: 'SUCCESS',
        details: params.paymentDetails || (params.paymentMethod === 'CASH' ? 'Pay at Counter' : 'Verified'),
      };

      // Execute SQL: INSERT INTO payments
      this.payments.push(newPayment);
      this.logQuery(
        `INSERT INTO payments (booking_id, payment_method, amount, payment_status) VALUES (${newBookingId}, '${params.paymentMethod}', ${amount}, 'SUCCESS');`,
        'INSERT',
        'SUCCESS',
        2,
        1
      );

      // Commit transaction
      this.logQuery('conn.commit(); -- TRANSACTION COMMITTED SUCCESSFULLY', 'TRANSACTION', 'COMMITTED', 2);
      this.persistData();

      return {
        success: true,
        booking: newBooking,
        payment: newPayment,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logQuery(`conn.rollback(); -- ERROR: ${msg}`, 'TRANSACTION', 'ROLLBACK', 1);
      return { success: false, error: msg };
    }
  }

  public resetToFactorySeed() {
    this.movies = [...INITIAL_MOVIES];
    this.screens = [...INITIAL_SCREENS];
    this.seats = generateInitialSeats();
    this.bookings = [...INITIAL_BOOKINGS];
    this.payments = [...INITIAL_PAYMENTS];
    this.sqlLogs = [];
    this.logQuery('/* DATABASE RESTORED TO FACTORY SCHEMA & SEED */', 'TRANSACTION', 'SUCCESS', 1);
    this.persistData();
  }

  public addCustomMovie(movie: Omit<Movie, 'movie_id'>): Movie {
    const maxId = this.movies.reduce((max, m) => Math.max(max, m.movie_id), 0);
    const newMovie: Movie = {
      ...movie,
      movie_id: maxId + 1,
    };
    this.movies.push(newMovie);
    this.logQuery(
      `INSERT INTO movies (movie_name, duration, language) VALUES ('${newMovie.movie_name}', ${newMovie.duration}, '${newMovie.language}');`,
      'INSERT',
      'SUCCESS',
      2,
      1
    );
    this.persistData();
    return newMovie;
  }
}

export const db = MovieBookingDatabase.getInstance();
