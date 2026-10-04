import React, { useState } from 'react';
import { Movie, Screen, Seat, Booking, Payment, SqlQueryLog } from '../types';
import {
  Database,
  Table,
  History,
  Code,
  Key,
  Link,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Play,
} from 'lucide-react';

interface DatabaseViewerProps {
  movies: Movie[];
  screens: Screen[];
  seats: Seat[];
  bookings: Booking[];
  payments: Payment[];
  sqlLogs: SqlQueryLog[];
  onResetDb: () => void;
}

type TableTab = 'movies' | 'screens' | 'seats' | 'bookings' | 'payments' | 'schema' | 'logs';

export const DatabaseViewer: React.FC<DatabaseViewerProps> = ({
  movies,
  screens,
  seats,
  bookings,
  payments,
  sqlLogs,
  onResetDb,
}) => {
  const [activeTable, setActiveTable] = useState<TableTab>('bookings');
  const [screenFilter, setScreenFilter] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [customSql, setCustomSql] = useState('SELECT * FROM seats WHERE status = \'BOOKED\';');
  const [queryResult, setQueryResult] = useState<{ columns: string[]; rows: any[] } | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

  const filteredSeats = seats.filter((s) => {
    if (screenFilter !== 'ALL' && s.screen_id !== screenFilter) return false;
    if (searchQuery && !s.seat_number.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredBookings = bookings.filter((b) => {
    if (searchQuery) {
      return (
        b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(b.booking_id).includes(searchQuery)
      );
    }
    return true;
  });

  const handleRunQuery = () => {
    setQueryError(null);
    const q = customSql.trim().toLowerCase();
    try {
      if (q.includes('from seats')) {
        let res = [...seats];
        if (q.includes("status = 'booked'") || q.includes('status="booked"')) {
          res = res.filter((s) => s.status === 'BOOKED');
        } else if (q.includes("status = 'available'")) {
          res = res.filter((s) => s.status === 'AVAILABLE');
        }
        setQueryResult({
          columns: ['seat_id', 'screen_id', 'seat_number', 'status'],
          rows: res,
        });
      } else if (q.includes('from movies')) {
        setQueryResult({
          columns: ['movie_id', 'movie_name', 'duration', 'language'],
          rows: movies,
        });
      } else if (q.includes('from screens')) {
        setQueryResult({
          columns: ['screen_id', 'screen_name'],
          rows: screens,
        });
      } else if (q.includes('from payments')) {
        setQueryResult({
          columns: ['payment_id', 'booking_id', 'payment_method', 'amount', 'payment_status'],
          rows: payments,
        });
      } else if (q.includes('from bookings')) {
        setQueryResult({
          columns: ['booking_id', 'customer_name', 'movie_id', 'screen_id', 'seat_id', 'amount', 'booking_time'],
          rows: bookings,
        });
      } else {
        setQueryError('Query supported for tables: movies, screens, seats, bookings, payments');
      }
    } catch (e: any) {
      setQueryError(e.message || 'Error executing query');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-nav */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-zinc-100 font-display">
              MySQL Database Inspector
            </h2>
            <span className="text-xs font-mono bg-zinc-800 px-2 py-0.5 rounded text-amber-400 border border-zinc-700">
              database: movie_booking
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Explore live state, relational integrity, foreign key references, and logged SQL queries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="reset-db-inspector-btn"
            onClick={onResetDb}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-amber-500/40 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Initial DDL/Seed</span>
          </button>
        </div>
      </div>

      {/* Table Selector Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800">
        {(['bookings', 'payments', 'seats', 'movies', 'screens', 'schema', 'logs'] as TableTab[]).map(
          (tab) => {
            const count =
              tab === 'movies'
                ? movies.length
                : tab === 'screens'
                ? screens.length
                : tab === 'seats'
                ? seats.length
                : tab === 'bookings'
                ? bookings.length
                : tab === 'payments'
                ? payments.length
                : tab === 'logs'
                ? sqlLogs.length
                : null;

            return (
              <button
                key={tab}
                id={`table-tab-${tab}`}
                onClick={() => setActiveTable(tab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeTable === tab
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                {tab === 'schema' ? (
                  <Key className="w-3.5 h-3.5" />
                ) : tab === 'logs' ? (
                  <History className="w-3.5 h-3.5" />
                ) : (
                  <Table className="w-3.5 h-3.5" />
                )}
                <span className="capitalize">{tab}</span>
                {count !== null && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      activeTable === tab
                        ? 'bg-zinc-950 text-amber-400'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          }
        )}
      </div>

      {/* Table View: Bookings */}
      {activeTable === 'bookings' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-xs text-zinc-400 font-mono">
              Table: <span className="text-amber-400 font-bold">bookings</span> (Primary Key: booking_id, FKs: movie_id, screen_id, seat_id)
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search customer / booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3">booking_id</th>
                  <th className="p-3">customer_name</th>
                  <th className="p-3">movie_id</th>
                  <th className="p-3">screen_id</th>
                  <th className="p-3">seat_id</th>
                  <th className="p-3">amount</th>
                  <th className="p-3">booking_time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-zinc-500">
                      No records found in bookings table
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.booking_id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="p-3 font-bold text-amber-400">#{b.booking_id}</td>
                      <td className="p-3 text-zinc-100 font-sans font-medium">{b.customer_name}</td>
                      <td className="p-3">
                        <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">
                          FK → {b.movie_id} ({movies.find((m) => m.movie_id === b.movie_id)?.movie_name || 'Movie'})
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">
                          FK → {b.screen_id} (Screen {b.screen_id})
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-1.5 py-0.5 rounded">
                          Seat #{b.seat_id} ({seats.find((s) => s.seat_id === b.seat_id)?.seat_number || 'Seat'})
                        </span>
                      </td>
                      <td className="p-3 text-emerald-400 font-bold">₹{b.amount}.00</td>
                      <td className="p-3 text-zinc-500 text-[11px]">
                        {new Date(b.booking_time).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Table View: Payments */}
      {activeTable === 'payments' && (
        <div className="space-y-4">
          <div className="text-xs text-zinc-400 font-mono">
            Table: <span className="text-amber-400 font-bold">payments</span> (Primary Key: payment_id, FK: booking_id)
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3">payment_id</th>
                  <th className="p-3">booking_id</th>
                  <th className="p-3">payment_method</th>
                  <th className="p-3">amount</th>
                  <th className="p-3">payment_status</th>
                  <th className="p-3">details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {payments.map((p) => (
                  <tr key={p.payment_id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-3 font-bold text-amber-400">#{p.payment_id}</td>
                    <td className="p-3">
                      <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">
                        FK → #{p.booking_id}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-zinc-100">{p.payment_method}</td>
                    <td className="p-3 text-emerald-400 font-bold">₹{p.amount}.00</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {p.payment_status}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-500 text-[11px]">{p.details || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Table View: Seats */}
      {activeTable === 'seats' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-zinc-400 font-mono">
              Table: <span className="text-amber-400 font-bold">seats</span> (Total: {seats.length} seats, {seats.filter((s) => s.status === 'BOOKED').length} booked)
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-mono">Screen:</span>
              <div className="flex gap-1">
                {(['ALL', 1, 2, 3] as const).map((sc) => (
                  <button
                    key={sc}
                    onClick={() => setScreenFilter(sc)}
                    className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                      screenFilter === sc
                        ? 'bg-amber-500 text-zinc-950 font-bold'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    }`}
                  >
                    {sc === 'ALL' ? 'All' : `Screen ${sc}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3">seat_id</th>
                  <th className="p-3">screen_id</th>
                  <th className="p-3">seat_number</th>
                  <th className="p-3">status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filteredSeats.map((s) => (
                  <tr key={s.seat_id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-3 font-bold text-zinc-400">#{s.seat_id}</td>
                    <td className="p-3">Screen {s.screen_id}</td>
                    <td className="p-3 font-bold text-zinc-100 font-mono">{s.seat_number}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.status === 'AVAILABLE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {s.status === 'AVAILABLE' ? '[AVAILABLE]' : '[BOOKED (XX)]'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Table View: Movies */}
      {activeTable === 'movies' && (
        <div className="space-y-4">
          <div className="text-xs text-zinc-400 font-mono">
            Table: <span className="text-amber-400 font-bold">movies</span> (Primary Key: movie_id)
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3">movie_id</th>
                  <th className="p-3">movie_name</th>
                  <th className="p-3">duration (mins)</th>
                  <th className="p-3">language</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {movies.map((m) => (
                  <tr key={m.movie_id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-3 font-bold text-amber-400">#{m.movie_id}</td>
                    <td className="p-3 text-zinc-100 font-sans font-bold">{m.movie_name}</td>
                    <td className="p-3">{m.duration} mins</td>
                    <td className="p-3 text-amber-300">{m.language}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Table View: Screens */}
      {activeTable === 'screens' && (
        <div className="space-y-4">
          <div className="text-xs text-zinc-400 font-mono">
            Table: <span className="text-amber-400 font-bold">screens</span> (Primary Key: screen_id)
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3">screen_id</th>
                  <th className="p-3">screen_name</th>
                  <th className="p-3">soundSystem</th>
                  <th className="p-3">resolution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {screens.map((sc) => (
                  <tr key={sc.screen_id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-3 font-bold text-amber-400">#{sc.screen_id}</td>
                    <td className="p-3 text-zinc-100 font-sans font-bold">{sc.screen_name}</td>
                    <td className="p-3 text-zinc-400">{sc.soundSystem || '-'}</td>
                    <td className="p-3 text-zinc-400">{sc.resolution || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schema DDL View */}
      {activeTable === 'schema' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Relational Schema Definition (MySQL DDL):</span>
            <span className="font-mono text-amber-400">5 Tables • 4 Foreign Keys</span>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono text-xs text-zinc-300 leading-relaxed overflow-x-auto shadow-inner">
            <pre className="text-amber-300/90 font-mono text-[11px]">
{`CREATE DATABASE movie_booking;
USE movie_booking;

-- Movies
CREATE TABLE movies (
    movie_id INT PRIMARY KEY AUTO_INCREMENT,
    movie_name VARCHAR(100) NOT NULL,
    duration INT,
    language VARCHAR(50)
);

-- Screens
CREATE TABLE screens (
    screen_id INT PRIMARY KEY AUTO_INCREMENT,
    screen_name VARCHAR(50) NOT NULL
);

-- Seats
CREATE TABLE seats (
    seat_id INT PRIMARY KEY AUTO_INCREMENT,
    screen_id INT,
    seat_number VARCHAR(10),
    status VARCHAR(20) DEFAULT 'AVAILABLE',
    FOREIGN KEY (screen_id) REFERENCES screens(screen_id)
);

-- Bookings
CREATE TABLE bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100),
    movie_id INT,
    screen_id INT,
    seat_id INT,
    amount DECIMAL(10,2),
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
    FOREIGN KEY (screen_id) REFERENCES screens(screen_id),
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id)
);

-- Payments
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    payment_method VARCHAR(30),
    amount DECIMAL(10,2),
    payment_status VARCHAR(30),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);`}
            </pre>
          </div>
        </div>
      )}

      {/* SQL Execution Log */}
      {activeTable === 'logs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Real-time JDBC / SQL Execution Activity:</span>
            <span className="font-mono text-zinc-500">Most recent queries</span>
          </div>

          <div className="space-y-2">
            {sqlLogs.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6">No queries logged yet.</p>
            ) : (
              sqlLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-start gap-2 overflow-hidden">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase self-start ${
                        log.type === 'INSERT'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : log.type === 'UPDATE'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          : log.type === 'TRANSACTION'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {log.type}
                    </span>
                    <span className="text-zinc-200 truncate">{log.query}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-zinc-500 shrink-0 self-end sm:self-auto">
                    <span>{log.executionTimeMs}ms</span>
                    <span className="text-zinc-400">{log.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Interactive SQL Query Playground */}
      <div className="pt-4 border-t border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-zinc-200">Interactive SQL Query Playground</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCustomSql("SELECT * FROM seats WHERE status = 'BOOKED';")}
              className="text-[11px] font-mono text-zinc-400 hover:text-amber-400"
            >
              Preset: Booked Seats
            </button>
            <span className="text-zinc-700">•</span>
            <button
              onClick={() => setCustomSql("SELECT * FROM bookings;")}
              className="text-[11px] font-mono text-zinc-400 hover:text-amber-400"
            >
              Preset: All Bookings
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={customSql}
            onChange={(e) => setCustomSql(e.target.value)}
            className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
            placeholder="e.g. SELECT * FROM seats WHERE status = 'BOOKED';"
          />
          <button
            onClick={handleRunQuery}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg text-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Execute SQL</span>
          </button>
        </div>

        {queryError && (
          <div className="p-2.5 bg-red-950/30 border border-red-800/50 rounded text-xs font-mono text-red-400">
            {queryError}
          </div>
        )}

        {queryResult && (
          <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-2">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-900 text-zinc-400 text-[10px] uppercase">
                <tr>
                  {queryResult.columns.map((col) => (
                    <th key={col} className="p-2">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {queryResult.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-900/50">
                    {queryResult.columns.map((col) => (
                      <td key={col} className="p-2">
                        {String(row[col] ?? '-')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
