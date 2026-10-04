import React, { useState, useEffect, useRef } from 'react';
import { db } from '../data/dbStore';
import { Terminal, Play, RotateCcw, Check, Sparkles } from 'lucide-react';
import { PaymentMethod } from '../types';

interface JavaTerminalProps {
  onBookingCreated?: () => void;
}

type Step =
  | 'CUSTOMER_NAME'
  | 'SELECT_MOVIE'
  | 'SELECT_SCREEN'
  | 'SELECT_SEAT'
  | 'SELECT_PAYMENT'
  | 'ENTER_UPI'
  | 'ENTER_CARD_NUMBER'
  | 'ENTER_CARD_CVV'
  | 'CONFIRMATION';

interface HistoryLine {
  id: string;
  text: string;
  type: 'output' | 'input' | 'prompt' | 'header' | 'error' | 'success';
}

export const JavaTerminal: React.FC<JavaTerminalProps> = ({ onBookingCreated }) => {
  const [history, setHistory] = useState<HistoryLine[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [step, setStep] = useState<Step>('CUSTOMER_NAME');

  // Transaction state during CLI run
  const [customerName, setCustomerName] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState<number>(0);
  const [selectedMovieName, setSelectedMovieName] = useState('');
  const [selectedScreenId, setSelectedScreenId] = useState<number>(0);
  const [selectedScreenName, setSelectedScreenName] = useState('');
  const [selectedSeatNumber, setSelectedSeatNumber] = useState('');
  const [paymentChoice, setPaymentChoice] = useState<number>(1);
  const [paymentMethodName, setPaymentMethodName] = useState<PaymentMethod>('UPI');
  const [cardNumber, setCardNumber] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  const startProgram = () => {
    const movies = db.getMovies();
    setHistory([
      { id: 'h1', text: 'Class.forName("com.mysql.cj.jdbc.Driver"); // Connected to jdbc:mysql://localhost:3306/movie_booking', type: 'output' },
      { id: 'h2', text: '======================================', type: 'header' },
      { id: 'h3', text: '     MOVIE TICKET BOOKING SYSTEM', type: 'header' },
      { id: 'h4', text: '======================================', type: 'header' },
      { id: 'h5', text: 'Enter Customer Name: ', type: 'prompt' },
    ]);
    setStep('CUSTOMER_NAME');
    setInputValue('');
  };

  useEffect(() => {
    startProgram();
  }, []);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const addLines = (lines: { text: string; type?: HistoryLine['type'] }[]) => {
    setHistory((prev) => [
      ...prev,
      ...lines.map((l) => ({
        id: Math.random().toString(),
        text: l.text,
        type: l.type || 'output',
      })),
    ]);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputValue.trim();

    // Echo input
    addLines([{ text: `> ${val || ''}`, type: 'input' }]);
    setInputValue('');

    if (step === 'CONFIRMATION') {
      startProgram();
      return;
    }

    if (step === 'CUSTOMER_NAME') {
      if (!val) {
        addLines([{ text: 'Customer name cannot be empty. Enter Customer Name: ', type: 'prompt' }]);
        return;
      }
      setCustomerName(val);

      const movies = db.getMovies();
      const movieLines = [
        { text: '\nAvailable Movies:', type: 'output' as const },
        ...movies.map((m) => ({
          text: `${m.movie_id}. ${m.movie_name} - ${m.duration} mins - ${m.language}`,
          type: 'output' as const,
        })),
        { text: '\nSelect Movie: ', type: 'prompt' as const },
      ];
      addLines(movieLines);
      setStep('SELECT_MOVIE');
      return;
    }

    if (step === 'SELECT_MOVIE') {
      const mId = parseInt(val, 10);
      const movie = db.getMovieById(mId);
      if (!movie) {
        addLines([
          { text: 'Invalid movie! Program terminated.', type: 'error' as const },
          { text: 'Type "restart" or press Enter to run again.', type: 'output' as const },
        ]);
        setStep('CONFIRMATION');
        return;
      }

      setSelectedMovieId(mId);
      setSelectedMovieName(movie.movie_name);

      const screens = db.getScreens();
      addLines([
        { text: `Movie Selected: ${movie.movie_name}`, type: 'output' as const },
        { text: '\nAvailable Screens:', type: 'output' as const },
        ...screens.map((sc) => ({
          text: `${sc.screen_id}. ${sc.screen_name}`,
          type: 'output' as const,
        })),
        { text: '\nSelect Screen: ', type: 'prompt' as const },
      ]);
      setStep('SELECT_SCREEN');
      return;
    }

    if (step === 'SELECT_SCREEN') {
      const scId = parseInt(val, 10);
      const screen = db.getScreenById(scId);
      if (!screen) {
        addLines([
          { text: 'Invalid screen! Program terminated.', type: 'error' as const },
          { text: 'Type "restart" or press Enter to run again.', type: 'output' as const },
        ]);
        setStep('CONFIRMATION');
        return;
      }

      setSelectedScreenId(scId);
      setSelectedScreenName(screen.screen_name);

      const seats = db.getSeatsByScreen(scId);
      let seatString = '';
      seats.forEach((s) => {
        if (s.status === 'AVAILABLE') {
          seatString += `[${s.seat_number}] `;
        } else {
          seatString += '[XX] ';
        }
      });

      addLines([
        { text: `Screen Selected: ${screen.screen_name}`, type: 'output' as const },
        { text: '\nAvailable Seats:', type: 'output' as const },
        { text: seatString, type: 'output' as const },
        { text: '\nEnter Seat Number: ', type: 'prompt' as const },
      ]);
      setStep('SELECT_SEAT');
      return;
    }

    if (step === 'SELECT_SEAT') {
      const seatNum = val.toUpperCase();
      const seat = db.getSeat(selectedScreenId, seatNum);

      if (!seat) {
        addLines([
          { text: 'Invalid seat! Program terminated.', type: 'error' as const },
          { text: 'Type "restart" or press Enter to run again.', type: 'output' as const },
        ]);
        setStep('CONFIRMATION');
        return;
      }

      if (seat.status !== 'AVAILABLE') {
        addLines([
          { text: 'Sorry! Seat is already booked.', type: 'error' as const },
          { text: 'Type "restart" or press Enter to run again.', type: 'output' as const },
        ]);
        setStep('CONFIRMATION');
        return;
      }

      setSelectedSeatNumber(seatNum);

      addLines([
        { text: `Seat ${seatNum} selected.`, type: 'output' as const },
        { text: '\n======================================', type: 'header' as const },
        { text: '              PAYMENT', type: 'header' as const },
        { text: '======================================', type: 'header' as const },
        { text: 'Ticket Price: ₹200', type: 'output' as const },
        { text: '\n1. UPI\n2. Card\n3. Cash', type: 'output' as const },
        { text: '\nSelect Payment Method: ', type: 'prompt' as const },
      ]);
      setStep('SELECT_PAYMENT');
      return;
    }

    if (step === 'SELECT_PAYMENT') {
      const pChoice = parseInt(val, 10);
      if (pChoice === 1) {
        setPaymentChoice(1);
        setPaymentMethodName('UPI');
        addLines([{ text: 'Enter UPI ID: ', type: 'prompt' as const }]);
        setStep('ENTER_UPI');
      } else if (pChoice === 2) {
        setPaymentChoice(2);
        setPaymentMethodName('CARD');
        addLines([{ text: 'Enter Card Number: ', type: 'prompt' as const }]);
        setStep('ENTER_CARD_NUMBER');
      } else if (pChoice === 3) {
        setPaymentChoice(3);
        setPaymentMethodName('CASH');
        addLines([
          { text: '\nPlease pay at the counter.', type: 'output' as const },
          { text: 'Processing database transaction...', type: 'output' as const },
        ]);
        completeBooking('CASH', 'Pay at Counter');
      } else {
        addLines([
          { text: 'Invalid payment method! Program terminated.', type: 'error' as const },
          { text: 'Type "restart" or press Enter to run again.', type: 'output' as const },
        ]);
        setStep('CONFIRMATION');
      }
      return;
    }

    if (step === 'ENTER_UPI') {
      const upi = val || 'customer@upi';
      addLines([
        { text: '\nProcessing UPI payment...', type: 'output' as const },
        { text: 'Executing SQL transaction...', type: 'output' as const },
      ]);
      completeBooking('UPI', upi);
      return;
    }

    if (step === 'ENTER_CARD_NUMBER') {
      setCardNumber(val || '4532 0000 0000 1234');
      addLines([{ text: 'Enter CVV: ', type: 'prompt' as const }]);
      setStep('ENTER_CARD_CVV');
      return;
    }

    if (step === 'ENTER_CARD_CVV') {
      addLines([
        { text: '\nProcessing Card payment...', type: 'output' as const },
        { text: 'Executing SQL transaction...', type: 'output' as const },
      ]);
      completeBooking('CARD', `Card •••• ${cardNumber.slice(-4) || '1234'}`);
      return;
    }
  };

  const completeBooking = (method: PaymentMethod, details: string) => {
    const result = db.executeBookingTransaction({
      customerName,
      movieId: selectedMovieId,
      screenId: selectedScreenId,
      seatNumber: selectedSeatNumber,
      amount: 200,
      paymentMethod: method,
      paymentDetails: details,
    });

    if (result.success && result.booking) {
      addLines([
        { text: 'conn.setAutoCommit(false);', type: 'output' as const },
        { text: 'INSERT INTO bookings ... [SUCCESS]', type: 'output' as const },
        { text: `UPDATE seats SET status = 'BOOKED' WHERE seat_number = '${selectedSeatNumber}' ... [SUCCESS]`, type: 'output' as const },
        { text: 'INSERT INTO payments ... [SUCCESS]', type: 'output' as const },
        { text: 'conn.commit(); // Transaction committed!', type: 'success' as const },
        { text: '\n======================================', type: 'header' as const },
        { text: '          BOOKING CONFIRMED', type: 'header' as const },
        { text: '======================================', type: 'header' as const },
        { text: `Booking ID : ${result.booking.booking_id}`, type: 'output' as const },
        { text: `Customer   : ${customerName}`, type: 'output' as const },
        { text: `Movie      : ${selectedMovieName}`, type: 'output' as const },
        { text: `Screen     : ${selectedScreenName}`, type: 'output' as const },
        { text: `Seat       : ${selectedSeatNumber}`, type: 'output' as const },
        { text: 'Amount     : ₹200', type: 'output' as const },
        { text: `Payment    : ${method}`, type: 'output' as const },
        { text: 'Status     : SUCCESS', type: 'success' as const },
        { text: '======================================', type: 'header' as const },
        { text: '       THANK YOU FOR BOOKING!', type: 'header' as const },
        { text: '======================================', type: 'header' as const },
        { text: '\nType anything or press Enter to start another booking...', type: 'prompt' as const },
      ]);
      onBookingCreated?.();
    } else {
      addLines([
        { text: 'conn.rollback();', type: 'error' as const },
        { text: `Booking failed: ${result.error || 'Transaction failed'}`, type: 'error' as const },
        { text: '\nType "restart" or press Enter to run again.', type: 'output' as const },
      ]);
    }
    setStep('CONFIRMATION');
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-zinc-100 font-display">
              Java CLI Console Terminal
            </h2>
            <span className="text-xs font-mono bg-zinc-800 text-amber-400 px-2 py-0.5 rounded border border-zinc-700">
              MovieTicketBookingSystem.java
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Directly executes the user's Java JDBC console application with Scanner inputs and stdout.
          </p>
        </div>

        <button
          onClick={startProgram}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg text-xs font-mono border border-zinc-700 hover:border-amber-500/40 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart Console</span>
        </button>
      </div>

      {/* Terminal Screen Window */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 font-mono text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-zinc-500 ml-2">bash - java MovieTicketBookingSystem</span>
          </div>
          <span className="text-[11px] text-amber-400">JDBC: MySQL 8.0</span>
        </div>

        {/* Terminal Output Area */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="p-5 font-mono text-xs leading-relaxed max-h-[480px] min-h-[340px] overflow-y-auto space-y-1 select-text cursor-text"
        >
          {history.map((line) => {
            if (line.type === 'header') {
              return (
                <div key={line.id} className="text-amber-400 font-bold tracking-wider">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'error') {
              return (
                <div key={line.id} className="text-rose-400 font-bold">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'success') {
              return (
                <div key={line.id} className="text-emerald-400 font-bold">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'input') {
              return (
                <div key={line.id} className="text-amber-300 font-semibold pl-2">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'prompt') {
              return (
                <div key={line.id} className="text-cyan-400 font-medium">
                  {line.text}
                </div>
              );
            }
            return (
              <div key={line.id} className="text-zinc-300 whitespace-pre-wrap">
                {line.text}
              </div>
            );
          })}

          {/* Interactive Stdin Prompt */}
          <form onSubmit={handleInputSubmit} className="flex items-center gap-2 pt-2">
            <span className="text-emerald-400 font-bold font-mono">user@terminal:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                step === 'CUSTOMER_NAME'
                  ? 'Type name and press Enter...'
                  : step === 'SELECT_MOVIE'
                  ? 'Enter Movie ID (1, 2, or 3)...'
                  : step === 'SELECT_SCREEN'
                  ? 'Enter Screen ID (1, 2, or 3)...'
                  : step === 'SELECT_SEAT'
                  ? 'Enter Seat Number (e.g. A1, B3, C5)...'
                  : step === 'SELECT_PAYMENT'
                  ? '1 for UPI, 2 for Card, 3 for Cash...'
                  : 'Type input and press Enter...'
              }
              className="flex-1 bg-transparent text-amber-300 font-mono text-xs focus:outline-none placeholder-zinc-600"
              autoFocus
            />
          </form>

          <div ref={terminalBottomRef} />
        </div>
      </div>

      {/* Quick Interactive Shortcut Buttons */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400">
        <span className="text-zinc-500">Quick Test Inputs:</span>
        <button
          onClick={() => {
            setInputValue('Ramesh');
            inputRef.current?.focus();
          }}
          className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 rounded border border-zinc-800 text-zinc-300 text-[11px]"
        >
          Name: "Ramesh"
        </button>
        <button
          onClick={() => {
            setInputValue('1');
            inputRef.current?.focus();
          }}
          className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 rounded border border-zinc-800 text-zinc-300 text-[11px]"
        >
          Choice: 1
        </button>
        <button
          onClick={() => {
            setInputValue('A1');
            inputRef.current?.focus();
          }}
          className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 rounded border border-zinc-800 text-zinc-300 text-[11px]"
        >
          Seat: A1
        </button>
        <button
          onClick={() => {
            setInputValue('B4');
            inputRef.current?.focus();
          }}
          className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 rounded border border-zinc-800 text-zinc-300 text-[11px]"
        >
          Seat: B4
        </button>
      </div>
    </div>
  );
};
