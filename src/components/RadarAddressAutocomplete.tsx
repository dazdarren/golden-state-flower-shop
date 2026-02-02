'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// Radar address result type
interface RadarAddress {
  formattedAddress: string;
  addressLabel?: string;
  number?: string;
  street?: string;
  city?: string;
  state?: string;
  stateCode?: string;
  postalCode?: string;
  country?: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
}

interface RadarAddressAutocompleteProps {
  onAddressSelect: (address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  }) => void;
  onManualChange?: (value: string) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  disabled?: boolean;
}

// Radar publishable key - safe to expose in client (prefixed with NEXT_PUBLIC_)
const RADAR_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_RADAR_PUBLISHABLE_KEY || '';

export default function RadarAddressAutocomplete({
  onAddressSelect,
  onManualChange,
  placeholder = 'Start typing an address...',
  defaultValue = '',
  className = '',
  disabled = false,
}: RadarAddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState<RadarAddress[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Fetch address suggestions from Radar API
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    // Skip if no API key configured
    if (!RADAR_PUBLISHABLE_KEY) {
      return;
    }

    if (searchQuery.length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://api.radar.io/v1/search/autocomplete?query=${encodeURIComponent(searchQuery)}&countryCode=US&layers=address&limit=5`,
        {
          headers: {
            'Authorization': RADAR_PUBLISHABLE_KEY,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setResults(data.addresses || []);
      setIsOpen((data.addresses || []).length > 0);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Radar autocomplete error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Notify parent of manual changes (for form state sync)
    if (onManualChange) {
      onManualChange(value);
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 200);
  };

  // Handle address selection
  const handleSelect = (address: RadarAddress) => {
    const streetAddress = address.number && address.street
      ? `${address.number} ${address.street}`
      : address.addressLabel || address.formattedAddress.split(',')[0];

    setQuery(streetAddress);
    setIsOpen(false);
    setResults([]);

    onAddressSelect({
      street: streetAddress,
      city: address.city || '',
      state: address.stateCode || address.state || '',
      zip: address.postalCode || '',
    });
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={className}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="w-5 h-5 animate-spin text-sage-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
      </div>

      {/* Dropdown results */}
      {isOpen && results.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-cream-300 rounded-xl shadow-lg max-h-60 overflow-auto">
          {results.map((address, index) => (
            <li
              key={`${address.latitude}-${address.longitude}-${index}`}
              onClick={() => handleSelect(address)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`px-4 py-3 cursor-pointer text-sm transition-colors ${
                index === selectedIndex
                  ? 'bg-sage-50 text-forest-900'
                  : 'text-forest-800 hover:bg-cream-50'
              }`}
            >
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-sage-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{address.formattedAddress}</span>
              </div>
            </li>
          ))}
          <li className="px-4 py-2 text-xs text-forest-800/50 border-t border-cream-200 bg-cream-50">
            Powered by Radar
          </li>
        </ul>
      )}
    </div>
  );
}
