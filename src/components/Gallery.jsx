import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { Heart, Search } from 'lucide-react';
import useFetchPhotos from '../hooks/useFetchPhotos.js';

const STORAGE_KEY = 'celebrare-favourite-photo-ids';

function readSavedFavourites() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(saved) ? saved.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function favouritesReducer(favourites, action) {
  switch (action.type) {
    case 'toggle':
      return favourites.includes(action.photoId)
        ? favourites.filter((id) => id !== action.photoId)
        : [...favourites, action.photoId];
    default:
      return favourites;
  }
}

function PhotoCard({ photo, isFavourite, onToggleFavourite }) {
  return (
    <article className="group min-w-0">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
        <img
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          src={photo.download_url}
          alt={`Photo by ${photo.author}`}
          loading="lazy"
        />
        <button
          className={`absolute right-3 top-3 grid size-10 place-items-center rounded-full shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9472e] ${
            isFavourite
              ? 'bg-[#e9472e] text-white'
              : 'bg-white/95 text-stone-700 hover:bg-white'
          }`}
          type="button"
          aria-label={`${isFavourite ? 'Remove' : 'Add'} ${photo.author}'s photo ${isFavourite ? 'from' : 'to'} favourites`}
          aria-pressed={isFavourite}
          onClick={() => onToggleFavourite(photo.id)}
        >
          <Heart size={19} strokeWidth={2} fill={isFavourite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <p className="mt-3 truncate text-sm font-medium text-stone-800">{photo.author}</p>
    </article>
  );
}

export default function Gallery() {
  const { photos, loading, error } = useFetchPhotos();
  const [searchTerm, setSearchTerm] = useState('');
  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    undefined,
    readSavedFavourites,
  );

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleToggleFavourite = useCallback((photoId) => {
    dispatch({ type: 'toggle', photoId });
  }, []);

  const filteredPhotos = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return query
      ? photos.filter((photo) => photo.author.toLowerCase().includes(query))
      : photos;
  }, [photos, searchTerm]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    } catch {
      // The gallery remains usable if browser storage is unavailable.
    }
  }, [favourites]);

  return (
    <main className="min-h-screen bg-[#f5f4ef] text-stone-950">
      <header className="border-b border-stone-300/80">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <p className="font-serif text-xl tracking-tight">Celebrare</p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
            Photo gallery
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-[1440px] px-5 pb-16 pt-10 sm:px-8 sm:pt-14 lg:px-12 lg:pt-16">
        <div className="mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#e9472e]">
              Collected moments
            </p>
            <h1 className="font-serif text-4xl leading-none tracking-tight sm:text-5xl">
              The gallery
            </h1>
          </div>
          <label className="flex h-12 w-full items-center gap-3 border-b border-stone-400 bg-transparent sm:max-w-xs">
            <Search size={18} className="shrink-0 text-stone-500" aria-hidden="true" />
            <span className="sr-only">Search by author</span>
            <input
              className="min-w-0 flex-1 bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-500"
              type="search"
              placeholder="Search by author"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </label>
        </div>

        {loading && (
          <div className="flex min-h-64 flex-col items-center justify-center gap-4" role="status">
            <span className="size-8 animate-spin rounded-full border-2 border-stone-300 border-t-[#e9472e]" />
            <p className="text-sm text-stone-600">Loading photographs...</p>
          </div>
        )}

        {!loading && error && (
          <p className="py-16 text-center text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && filteredPhotos.length > 0 && (
          <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isFavourite={favourites.includes(photo.id)}
                onToggleFavourite={handleToggleFavourite}
              />
            ))}
          </div>
        )}

        {!loading && !error && filteredPhotos.length === 0 && (
          <p className="py-16 text-center text-sm text-stone-600">
            No photos match “{searchTerm}”.
          </p>
        )}
      </section>
    </main>
  );
}
