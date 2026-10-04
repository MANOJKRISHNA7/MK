export interface Movie {
  movie_id: number;
  movie_name: string;
  duration: number; // in minutes
  language: string;
  posterUrl?: string;
  bannerUrl?: string;
  genre?: string;
  rating?: string;
  votes?: string;
  certification?: string;
  synopsis?: string;
  formats?: string[];
  cast?: string[];
}

export interface Cinema {
  id: string;
  name: string;
  location: string;
  distance: string;
  amenities: string[];
  screens: {
    screen_id: number;
    screen_name: string;
    soundSystem: string;
    resolution: string;
  }[];
  showtimes: {
    time: string;
    format: string;
    screenId: number;
    status: 'available' | 'filling_fast' | 'almost_full';
  }[];
}

export interface SnackItem {
  id: string;
  name: string;
  category: 'Popcorn' | 'Combos' | 'Beverages' | 'Quick Bites';
  description: string;
  price: number;
  isVeg: boolean;
  imageUrl?: string;
}

export interface Screen {
  screen_id: number;
  screen_name: string;
  soundSystem?: string;
  resolution?: string;
  totalSeats?: number;
}

export type SeatStatus = 'AVAILABLE' | 'BOOKED' | 'SELECTED';

export type SeatTier = 'RECLINER' | 'PRIME' | 'CLASSIC';

export interface Seat {
  seat_id: number;
  screen_id: number;
  seat_number: string;
  status: SeatStatus;
  tier?: SeatTier;
  price?: number;
}

export interface Booking {
  booking_id: number;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  movie_id: number;
  screen_id: number;
  seat_id: number; // primary seat for backwards compatibility
  seat_numbers?: string[]; // all selected seats
  cinema_name?: string;
  show_date?: string;
  show_time?: string;
  snacks?: { name: string; qty: number; price: number }[];
  ticket_amount?: number;
  convenience_fee?: number;
  tax_amount?: number;
  amount: number; // grand total
  booking_time: string;
  booking_reference?: string;
}

export type PaymentMethod = 'UPI' | 'CARD' | 'NET_BANKING' | 'CASH';
export type PaymentStatus = 'SUCCESS' | 'FAILED' | 'PENDING';

export interface Payment {
  payment_id: number;
  booking_id: number;
  payment_method: PaymentMethod;
  amount: number;
  payment_status: PaymentStatus;
  details?: string;
  transaction_id?: string;
}

export interface EnrichedBooking {
  booking: Booking;
  movie: Movie;
  screen: Screen;
  seat: Seat;
  seats?: Seat[];
  payment: Payment;
}

export interface SqlQueryLog {
  id: string;
  timestamp: string;
  query: string;
  type: 'SELECT' | 'INSERT' | 'UPDATE' | 'TRANSACTION';
  status: 'SUCCESS' | 'COMMITTED' | 'ROLLBACK' | 'ERROR';
  executionTimeMs: number;
  rowsAffected?: number;
}

