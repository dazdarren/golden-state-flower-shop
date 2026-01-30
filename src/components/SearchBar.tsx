'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  basePath: string;
  variant?: 'icon' | 'expanded';
}

export default function SearchBar({ basePath, variant = 'icon' }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored).slice(0, 5));
    }
  }, []);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Save to recent searches
      const updated = [query.trim(), ...recentSearches.filter(s => s !== query.trim())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));

      // Navigate to search results
      router.push(`${basePath}/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    router.push(`${basePath}/search?q=${encodeURIComponent(search)}`);
    setIsOpen(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const popularSearches = ['roses', 'birthday flowers', 'sympathy', 'plants', 'mixed bouquet'];

  if (variant === 'icon') {
    return (
      <div ref={containerRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-forest-800/70 hover:text-forest-900 hover:bg-sage-100/50 transition-colors"
          aria-label="Search"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-lg border border-cream-200 overflow-hidden z-50 animate-fade-in">
            <form onSubmit={handleSubmit} className="p-4 border-b border-cream-100">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-800/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search flowers, plants, occasions..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50
                           text-forest-900 placeholder:text-forest-800/40
                           focus:outline-none focus:border-sage-300 focus:ring-2 focus:ring-sage-100
                           transition-colors"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-cream-200 transition-colors"
                  >
                    <svg className="w-4 h-4 text-forest-800/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </form>

            <div className="p-4 max-h-80 overflow-y-auto">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-forest-800/50 uppercase tracking-wider">Recent</span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-sage-600 hover:text-sage-700 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, i) => (
                      <button
                        key={i}
                        onClick={() => handleRecentSearchClick(search)}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left text-sm text-forest-800
                                 hover:bg-cream-50 transition-colors"
                      >
                        <svg className="w-4 h-4 text-forest-800/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <span className="block text-xs font-medium text-forest-800/50 uppercase tracking-wider mb-2">
                  Popular
                </span>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, i) => (
                    <button
                      key={i}
                      onClick={() => handleRecentSearchClick(search)}
                      className="px-3 py-1.5 rounded-full text-sm text-forest-800 bg-cream-100 hover:bg-cream-200 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Expanded variant for search page
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-forest-800/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search flowers, plants, occasions..."
          className="w-full pl-14 pr-14 py-4 rounded-2xl border border-cream-200 bg-white
                   text-lg text-forest-900 placeholder:text-forest-800/40
                   focus:outline-none focus:border-sage-300 focus:ring-4 focus:ring-sage-100
                   shadow-soft transition-all"
        />
        <button
          type="submit"
          disabled={!query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl
                   bg-forest-900 text-white font-medium
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-forest-800 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
