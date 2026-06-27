import { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { semanticSearch } from '@/services/ai.service';
import type { Property } from '@/types/property.types';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface Props {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export default function AISearchBar({
  onSearch,
  placeholder = 'Search properties naturally... e.g. "modern 2-bed under 500k in Brooklyn"',
}: Props) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Property[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (query.length < 3) { setSuggestions([]); setOpen(false); return; }
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await semanticSearch(query, {}, 5);
        if (!cancelled) {
          setSuggestions(results);
          setOpen(results.length > 0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 400);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      onSearch?.(query.trim());
      navigate(`/properties?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div ref={ref} className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="h-14 rounded-xl border-2 border-gray-200 bg-white pl-12 pr-24 text-base shadow-lg focus:border-blue-400 dark:border-gray-600 dark:bg-gray-800"
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => { setQuery(''); setSuggestions([]); setOpen(false); }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button type="submit" size="sm" className="h-9 gap-1 rounded-lg bg-blue-600 px-4 hover:bg-blue-700">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>
      </form>

      {open && suggestions.length > 0 && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          {loading && (
            <div className="p-3 text-center text-sm text-gray-500">Searching...</div>
          )}
          {suggestions.slice(0, 5).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setOpen(false);
                navigate(`/properties/${p.id}`);
              }}
              className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                {p.images[0] && (
                  <img
                    src={p.images[0].url}
                    alt={p.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900 dark:text-white">{p.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {p.location.city}, {p.location.state} &middot; ${p.price.toLocaleString()}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
