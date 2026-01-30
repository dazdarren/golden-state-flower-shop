'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SearchResult {
  sku: string;
  name: string;
  price: number;
  image: string;
}

interface SearchBarProps {
  basePath: string;
  variant?: 'icon' | 'expanded';
}

export default function SearchBar({ basePath, variant = 'icon' }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
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
        setShowResults(false);
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
        setShowResults(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Live search with debounce
  const searchProducts = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api${basePath}/search?q=${encodeURIComponent(searchQuery)}&count=6`);
      const data = await response.json();

      if (data.success && data.data?.products) {
        setResults(data.data.products.map((p: { sku: string; name: string; price: number; image: string }) => ({
          sku: p.sku,
          name: p.name,
          price: p.price,
          image: p.image,
        })));
        setShowResults(true);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [basePath]);

  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce search
    debounceRef.current = setTimeout(() => {
      searchProducts(value);
    }, 300);
  };

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
      setShowResults(false);
      setQuery('');
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    router.push(`${basePath}/search?q=${encodeURIComponent(search)}`);
    setIsOpen(false);
    setShowResults(false);
  };

  const handleResultClick = (sku: string) => {
    // Save search to recents
    if (query.trim()) {
      const updated = [query.trim(), ...recentSearches.filter(s => s !== query.trim())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }

    router.push(`${basePath}/product?sku=${sku}`);
    setIsOpen(false);
    setShowResults(false);
    setQuery('');
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
          className="p-2.5 rounded-lg text-forest-800/70 hover:text-forest-900 hover:bg-sage-100/50 transition-colors"
          aria-label="Search"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* Mobile backdrop overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-forest-900/20 backdrop-blur-sm z-40 sm:hidden"
            onClick={() => {
              setIsOpen(false);
              setShowResults(false);
            }}
          />
        )}

        {isOpen && (
          <div className="fixed left-4 right-4 top-20 sm:absolute sm:right-0 sm:left-auto sm:top-full sm:mt-2 w-auto sm:w-96 bg-white rounded-2xl shadow-lg border border-cream-200 overflow-hidden z-50 animate-fade-in">
            {/* Mobile swipe hint */}
            <div className="sm:hidden text-center py-2 text-xs text-forest-800/40 border-b border-cream-100">
              Tap outside to close
            </div>
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
                  onChange={handleInputChange}
                  placeholder="Search flowers, plants..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-cream-200 bg-cream-50
                           text-forest-900 placeholder:text-forest-800/40
                           focus:outline-none focus:border-sage-300 focus:ring-2 focus:ring-sage-100
                           transition-colors"
                />
                {loading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-sage-300 border-t-sage-600 rounded-full animate-spin" />
                  </div>
                )}
                {query && !loading && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setResults([]);
                      setShowResults(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-cream-200 transition-colors"
                  >
                    <svg className="w-4 h-4 text-forest-800/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </form>

            <div className="max-h-96 overflow-y-auto">
              {/* Live Search Results */}
              {showResults && results.length > 0 && (
                <div className="p-2 border-b border-cream-100">
                  <span className="block px-2 py-1 text-xs font-medium text-forest-800/50 uppercase tracking-wider">
                    Products
                  </span>
                  <div className="space-y-1">
                    {results.map((result) => (
                      <button
                        key={result.sku}
                        onClick={() => handleResultClick(result.sku)}
                        className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-cream-50 transition-colors text-left"
                      >
                        <div className="w-12 h-12 rounded-lg bg-cream-100 overflow-hidden flex-shrink-0">
                          {result.image ? (
                            <img
                              src={result.image}
                              alt=""
                              className="w-full h-full object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-sage-300" viewBox="0 0 24 24" fill="none">
                                <path d="M12 6c0 3-2 5-2 7s1 3 2 3 2-1 2-3-2-4-2-7z" fill="currentColor" opacity="0.3"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-forest-900 truncate">{result.name}</p>
                          <p className="text-sm text-sage-600">${result.price.toFixed(2)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <Link
                    href={`${basePath}/search?q=${encodeURIComponent(query)}`}
                    className="block mt-2 px-2 py-2 text-center text-sm text-sage-600 hover:text-sage-700 font-medium"
                    onClick={() => {
                      setIsOpen(false);
                      setShowResults(false);
                    }}
                  >
                    View all results for "{query}"
                  </Link>
                </div>
              )}

              {/* No Results */}
              {showResults && query.length >= 2 && results.length === 0 && !loading && (
                <div className="p-4 text-center text-sm text-forest-800/50">
                  No products found for "{query}"
                </div>
              )}

              {/* Recent & Popular when no search */}
              {!showResults && (
                <div className="p-4">
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
                            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-left text-sm text-forest-800
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
              )}
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
