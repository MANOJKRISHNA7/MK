import React, { useState } from 'react';
import { Movie } from '../types';
import {
  Clock,
  Globe,
  Film,
  Sparkles,
  Calendar,
  Star,
  Play,
  Heart,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface MovieSelectionProps {
  movies: Movie[];
  selectedMovieId: number | null;
  onSelectMovie: (movieId: number) => void;
  selectedCity: string;
  searchQuery?: string;
}

export const MovieSelection: React.FC<MovieSelectionProps> = ({
  movies,
  selectedMovieId,
  onSelectMovie,
  selectedCity,
  searchQuery = '',
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [likedMovies, setLikedMovies] = useState<number[]>([]);

  const toggleLike = (movieId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedMovies((prev) =>
      prev.includes(movieId) ? prev.filter((id) => id !== movieId) : [...prev, movieId]
    );
  };

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hours}h ${m}m`;
  };

  // Filter movies
  const filteredMovies = movies.filter((m) => {
    const matchesSearch =
      !searchQuery ||
      m.movie_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.genre && m.genre.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.language.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLang = selectedLanguage === 'All' || m.language === selectedLanguage;
    const matchesGenre =
      selectedGenre === 'All' ||
      (m.genre && m.genre.toLowerCase().includes(selectedGenre.toLowerCase()));

    return matchesSearch && matchesLang && matchesGenre;
  });

  const spotlightMovie = movies[0] || null;

  return (
    <div className="space-y-8">
      {/* Featured Spotlight Blockbuster Banner */}
      {spotlightMovie && !searchQuery && (
        <div className="relative rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-950 group">
          <div className="relative h-80 sm:h-96 w-full">
            <img
              src={spotlightMovie.bannerUrl || spotlightMovie.posterUrl}
              alt={spotlightMovie.movie_name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 max-w-2xl space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-white" />
                  {spotlightMovie.rating || '★ 9.4/10'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-900/90 text-zinc-200 border border-zinc-700">
                  {spotlightMovie.votes || '240K+ Votes'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-900/90 text-amber-400 border border-zinc-700">
                  {spotlightMovie.language}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-900/90 text-zinc-300 border border-zinc-700">
                  {spotlightMovie.certification || 'U/A 13+'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight leading-tight">
                {spotlightMovie.movie_name}
              </h1>

              <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed max-w-xl">
                {spotlightMovie.synopsis}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  id="spotlight-book-btn"
                  onClick={() => onSelectMovie(spotlightMovie.movie_id)}
                  className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm transition-all shadow-xl shadow-rose-600/30 hover:scale-102"
                >
                  <Film className="w-4 h-4" />
                  <span>Book Tickets Now</span>
                </button>

                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{formatDuration(spotlightMovie.duration)}</span>
                  <span className="text-zinc-600">•</span>
                  <span>{spotlightMovie.genre}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Filters Bar */}
      <div className="bg-zinc-900/80 rounded-2xl border border-zinc-800 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Filter className="w-4 h-4 text-rose-500" />
            <span>Now Showing in {selectedCity}</span>
            <span className="text-xs text-zinc-400 font-normal">
              ({filteredMovies.length} movies available)
            </span>
          </div>

          {/* Language filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs text-zinc-500 shrink-0">Language:</span>
            {['All', 'English', 'Hindi', 'Tamil', 'Telugu'].map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedLanguage === lang
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Genre Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-zinc-800/60 text-xs">
          <span className="text-zinc-500 shrink-0">Genre:</span>
          {['All', 'Action', 'Sci-Fi', 'Adventure', 'Drama', 'Historical'].map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                selectedGenre === genre
                  ? 'bg-zinc-200 text-zinc-950 font-bold'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredMovies.map((movie) => {
          const isLiked = likedMovies.includes(movie.movie_id);

          return (
            <div
              key={movie.movie_id}
              id={`movie-card-${movie.movie_id}`}
              onClick={() => onSelectMovie(movie.movie_id)}
              className="group relative bg-zinc-900/60 hover:bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-rose-500/50 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-2xl hover:shadow-rose-950/20"
            >
              {/* Poster Container */}
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
                <img
                  src={movie.posterUrl}
                  alt={movie.movie_name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/30" />

                {/* Rating Badge */}
                <div className="absolute top-2.5 left-2.5 bg-zinc-950/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-bold text-rose-400 border border-rose-500/30 flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-rose-400 text-rose-400" />
                  <span>{movie.rating || '★ 9.0'}</span>
                </div>

                {/* Like Button */}
                <button
                  onClick={(e) => toggleLike(movie.movie_id, e)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-zinc-950/80 backdrop-blur-md text-zinc-400 hover:text-rose-500 transition-colors"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`}
                  />
                </button>

                {/* Bottom Format & Language strip */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-zinc-200">
                  <span className="font-semibold bg-zinc-950/80 px-2 py-0.5 rounded backdrop-blur-sm">
                    {movie.language}
                  </span>
                  <span className="text-zinc-400 text-[10px] bg-zinc-950/80 px-1.5 py-0.5 rounded backdrop-blur-sm">
                    {movie.certification || 'U/A'}
                  </span>
                </div>
              </div>

              {/* Movie Info */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-rose-400 transition-colors font-display line-clamp-1">
                    {movie.movie_name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                    {movie.genre || 'Action / Drama'}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    {formatDuration(movie.duration)}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectMovie(movie.movie_id);
                    }}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMovies.length === 0 && (
        <div className="text-center py-16 bg-zinc-900/40 rounded-3xl border border-zinc-800">
          <Film className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Movies Found</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Try adjusting your search query or language/genre filters.
          </p>
        </div>
      )}
    </div>
  );
};
