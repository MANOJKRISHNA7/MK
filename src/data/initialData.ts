import { Movie, Screen, Seat, Booking, Payment, Cinema, SnackItem } from '../types';

export const POPULAR_CITIES = [
  'Mumbai',
  'Delhi-NCR',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
];

export const INITIAL_MOVIES: Movie[] = [
  {
    movie_id: 1,
    movie_name: 'Interstellar (10th Anniversary)',
    duration: 169,
    language: 'English',
    genre: 'Sci-Fi • Adventure • Drama',
    rating: '9.4/10',
    votes: '240K+ Votes',
    certification: 'U/A 13+',
    formats: ['IMAX 2D', '4DX', '2D'],
    synopsis: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    posterUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
  },
  {
    movie_id: 2,
    movie_name: 'Avengers: Endgame',
    duration: 181,
    language: 'English',
    genre: 'Action • Sci-Fi • Epic',
    rating: '9.1/10',
    votes: '310K+ Votes',
    certification: 'U/A 16+',
    formats: ['IMAX 3D', '3D', '2D', '4DX'],
    synopsis: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos\' actions and restore balance.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&w=1600&q=80',
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Scarlett Johansson', 'Mark Ruffalo'],
  },
  {
    movie_id: 3,
    movie_name: 'Leo: Bloody Sweet',
    duration: 164,
    language: 'Tamil',
    genre: 'Action • Thriller • Crime',
    rating: '8.7/10',
    votes: '195K+ Votes',
    certification: 'U/A 16+',
    formats: ['2D Dolby Atmos', 'IMAX 2D'],
    synopsis: 'Parthiban is a mild-mannered cafe owner in Kashmir who successfully fends off a gang of deadly bandits. However, this attracts the attention of a drug cartel who suspect he is their estranged hitman.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    cast: ['Thalapathy Vijay', 'Sanjay Dutt', 'Trisha Krishnan', 'Arjun Sarja'],
  },
  {
    movie_id: 4,
    movie_name: 'Dune: Part Two',
    duration: 166,
    language: 'English',
    genre: 'Action • Sci-Fi • Adventure',
    rating: '9.3/10',
    votes: '220K+ Votes',
    certification: 'U/A 13+',
    formats: ['IMAX 2D', 'Dolby Atmos 4K', '2D'],
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between love and the fate of the universe, he endeavors to prevent a terrible future.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
  },
  {
    movie_id: 5,
    movie_name: 'Kalki 2898 AD',
    duration: 180,
    language: 'Telugu',
    genre: 'Mythological • Sci-Fi • Action',
    rating: '8.9/10',
    votes: '260K+ Votes',
    certification: 'U/A 13+',
    formats: ['3D', 'IMAX 3D', '2D'],
    synopsis: 'Set in a post-apocalyptic world in the year 2898 AD, a modern-day avatar of Vishnu descends to protect the world from evil forces in a breathtaking visual spectacle.',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    cast: ['Prabhas', 'Amitabh Bachchan', 'Kamal Haasan', 'Deepika Padukone'],
  },
  {
    movie_id: 6,
    movie_name: 'Oppenheimer',
    duration: 180,
    language: 'English',
    genre: 'Biography • Drama • History',
    rating: '9.0/10',
    votes: '280K+ Votes',
    certification: 'A',
    formats: ['IMAX 70mm', '2D Dolby Cinema'],
    synopsis: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
  },
];

export const INITIAL_SCREENS: Screen[] = [
  {
    screen_id: 1,
    screen_name: 'AUDI 01: Dolby Atmos',
    soundSystem: 'Dolby Atmos 7.1',
    resolution: '4K Dual Laser Projection',
    totalSeats: 15,
  },
  {
    screen_id: 2,
    screen_name: 'AUDI 02: IMAX with Laser',
    soundSystem: 'IMAX 12-Channel Precision Audio',
    resolution: 'IMAX Dual 4K Laser',
    totalSeats: 15,
  },
  {
    screen_id: 3,
    screen_name: 'AUDI 03: VIP Luxe Recliner',
    soundSystem: 'THX Spatial Surround Sound',
    resolution: 'Barco 4K RGB High Frame Rate',
    totalSeats: 15,
  },
];

export const CINEMAS: Cinema[] = [
  {
    id: 'pvr-palladium',
    name: 'PVR ICON: Phoenix Palladium, Lower Parel',
    location: 'Senapati Bapat Marg, Lower Parel, Mumbai',
    distance: '2.4 km away',
    amenities: ['M-Ticket', 'F&B Service', 'Recliners Available', 'Dolby Atmos', 'Valet Parking'],
    screens: [
      { screen_id: 1, screen_name: 'Audi 1 (Dolby Atmos)', soundSystem: 'Dolby Atmos 7.1', resolution: '4K Laser' },
      { screen_id: 2, screen_name: 'Audi 2 (IMAX Laser)', soundSystem: 'IMAX 12-Ch', resolution: 'IMAX 4K' },
    ],
    showtimes: [
      { time: '10:15 AM', format: 'Dolby Atmos 2D', screenId: 1, status: 'available' },
      { time: '01:45 PM', format: 'IMAX 2D', screenId: 2, status: 'filling_fast' },
      { time: '05:30 PM', format: 'Dolby Atmos 2D', screenId: 1, status: 'filling_fast' },
      { time: '08:45 PM', format: 'IMAX 2D', screenId: 2, status: 'almost_full' },
      { time: '11:15 PM', format: 'Dolby Atmos 2D', screenId: 1, status: 'available' },
    ],
  },
  {
    id: 'inox-inorbit',
    name: 'INOX Megaplex: Inorbit Mall, Malad',
    location: 'New Link Road, Malad West, Mumbai',
    distance: '5.8 km away',
    amenities: ['M-Ticket', 'Gourmet Food Hall', 'Kiddles Play Area', 'Wheelchair Access'],
    screens: [
      { screen_id: 2, screen_name: 'Audi 2 (IMAX Laser)', soundSystem: 'IMAX 12-Ch', resolution: 'IMAX 4K' },
      { screen_id: 3, screen_name: 'Audi 3 (VIP Luxe)', soundSystem: 'THX Spatial', resolution: 'Barco 4K' },
    ],
    showtimes: [
      { time: '11:00 AM', format: 'IMAX 2D', screenId: 2, status: 'available' },
      { time: '02:30 PM', format: 'VIP Luxe 2D', screenId: 3, status: 'available' },
      { time: '06:15 PM', format: 'IMAX 2D', screenId: 2, status: 'almost_full' },
      { time: '09:30 PM', format: 'VIP Luxe 2D', screenId: 3, status: 'filling_fast' },
    ],
  },
  {
    id: 'cinepolis-grand',
    name: 'Cinépolis VIP: Grand Central Mall',
    location: 'Sector 40, Seawoods Railway Station, Navi Mumbai',
    distance: '8.2 km away',
    amenities: ['M-Ticket', 'In-Seat Butler Service', 'Plush Recliners', 'Coffee House'],
    screens: [
      { screen_id: 3, screen_name: 'Audi 3 (VIP Luxe)', soundSystem: 'THX Spatial', resolution: 'Barco 4K' },
      { screen_id: 1, screen_name: 'Audi 1 (Dolby Atmos)', soundSystem: 'Dolby Atmos 7.1', resolution: '4K Laser' },
    ],
    showtimes: [
      { time: '12:00 PM', format: 'VIP Luxe 2D', screenId: 3, status: 'available' },
      { time: '03:45 PM', format: 'Dolby Atmos 2D', screenId: 1, status: 'filling_fast' },
      { time: '07:30 PM', format: 'VIP Luxe 2D', screenId: 3, status: 'almost_full' },
      { time: '10:45 PM', format: 'Dolby Atmos 2D', screenId: 1, status: 'available' },
    ],
  },
];

export const SNACKS: SnackItem[] = [
  {
    id: 'popcorn-caramel',
    name: 'Jumbo Gourmet Caramel Popcorn',
    category: 'Popcorn',
    description: 'Crispy popped corn glazed with rich golden artisanal caramel (Large Tub)',
    price: 220,
    isVeg: true,
  },
  {
    id: 'nachos-cheese',
    name: 'Mexican Nachos with Warm Cheese & Salsa',
    category: 'Quick Bites',
    description: 'Crispy corn tortilla chips served with jalapeño cheese dip and spicy tomato salsa',
    price: 190,
    isVeg: true,
  },
  {
    id: 'duo-combo',
    name: 'Blockbuster Duo Combo (Save ₹90)',
    category: 'Combos',
    description: '1 Jumbo Butter Popcorn + 2 Chilled Coca-Cola 500ml',
    price: 350,
    isVeg: true,
  },
  {
    id: 'coke-fountain',
    name: 'Chilled Fountain Coca-Cola (500ml)',
    category: 'Beverages',
    description: 'Refreshing ice-cold carbonated beverage served in an insulated cinema cup',
    price: 99,
    isVeg: true,
  },
  {
    id: 'chicken-popcorn',
    name: 'Crispy Spiced Chicken Bites',
    category: 'Quick Bites',
    description: 'Tender bite-sized chicken pops coated in spicy herbs with garlic mayo dip',
    price: 240,
    isVeg: false,
  },
];

export const SNACK_MENU = SNACKS;


// Generate seats: (screen_id, seat_number) for screens 1, 2, 3 with A1-A5, B1-B5, C1-C5
export function generateInitialSeats(): Seat[] {
  const seats: Seat[] = [];
  let seatIdCounter = 1;
  const rows = ['A', 'B', 'C'];
  const cols = [1, 2, 3, 4, 5];

  for (let screenId = 1; screenId <= 3; screenId++) {
    for (const row of rows) {
      for (const col of cols) {
        const tier = row === 'A' ? 'RECLINER' : row === 'B' ? 'PRIME' : 'CLASSIC';
        const price = row === 'A' ? 350 : row === 'B' ? 220 : 150;
        seats.push({
          seat_id: seatIdCounter++,
          screen_id: screenId,
          seat_number: `${row}${col}`,
          status: 'AVAILABLE',
          tier,
          price,
        });
      }
    }
  }

  // Sample pre-booked seats
  const s1A3 = seats.find(s => s.screen_id === 1 && s.seat_number === 'A3');
  if (s1A3) s1A3.status = 'BOOKED';
  const s1B4 = seats.find(s => s.screen_id === 1 && s.seat_number === 'B4');
  if (s1B4) s1B4.status = 'BOOKED';
  const s2B2 = seats.find(s => s.screen_id === 2 && s.seat_number === 'B2');
  if (s2B2) s2B2.status = 'BOOKED';
  const s3A1 = seats.find(s => s.screen_id === 3 && s.seat_number === 'A1');
  if (s3A1) s3A1.status = 'BOOKED';

  return seats;
}

export const INITIAL_BOOKINGS: Booking[] = [
  {
    booking_id: 101,
    booking_reference: 'BMS-94821',
    customer_name: 'Kanishka',
    customer_email: 'kanishka@example.com',
    customer_phone: '+91 98201 45872',
    movie_id: 1,
    screen_id: 1,
    seat_id: 3,
    seat_numbers: ['A3'],
    cinema_name: 'PVR ICON: Phoenix Palladium, Lower Parel',
    show_date: 'Wed, 16 Sep 2026',
    show_time: '05:30 PM',
    ticket_amount: 350,
    convenience_fee: 28,
    tax_amount: 5,
    amount: 383,
    booking_time: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    booking_id: 102,
    booking_reference: 'BMS-83145',
    customer_name: 'Ananya Roy',
    customer_email: 'ananya.roy@example.com',
    customer_phone: '+91 99823 11029',
    movie_id: 2,
    screen_id: 2,
    seat_id: 22,
    seat_numbers: ['B2'],
    cinema_name: 'INOX Megaplex: Inorbit Mall, Malad',
    show_date: 'Thu, 17 Sep 2026',
    show_time: '06:15 PM',
    ticket_amount: 220,
    convenience_fee: 28,
    tax_amount: 4,
    amount: 252,
    booking_time: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    payment_id: 501,
    booking_id: 101,
    payment_method: 'UPI',
    amount: 383,
    payment_status: 'SUCCESS',
    details: 'rahul@okhdfcbank',
    transaction_id: 'TXN-9847192837',
  },
  {
    payment_id: 502,
    booking_id: 102,
    payment_method: 'CARD',
    amount: 252,
    payment_status: 'SUCCESS',
    details: 'HDFC Bank Credit Card •••• 4242',
    transaction_id: 'TXN-7182947192',
  },
];

