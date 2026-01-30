'use client';

import { useState, useEffect } from 'react';

export type SortOption = 'default' | 'price-low' | 'price-high' | 'name-az' | 'name-za';

interface ProductFiltersProps {
  onSortChange: (sort: SortOption) => void;
  onPriceFilterChange: (min: number | null, max: number | null) => void;
  currentSort?: SortOption;
  currentPriceMin?: number | null;
  currentPriceMax?: number | null;
  showPriceFilter?: boolean;
  productCount?: number;
}

const PRICE_RANGES = [
  { label: 'All Prices', min: null, max: null },
  { label: 'Under $50', min: null, max: 50 },
  { label: '$50 - $75', min: 50, max: 75 },
  { label: '$75 - $100', min: 75, max: 100 },
  { label: '$100 - $150', min: 100, max: 150 },
  { label: 'Over $150', min: 150, max: null },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name-az', label: 'Name: A to Z' },
  { value: 'name-za', label: 'Name: Z to A' },
];

export default function ProductFilters({
  onSortChange,
  onPriceFilterChange,
  currentSort = 'default',
  currentPriceMin = null,
  currentPriceMax = null,
  showPriceFilter = true,
  productCount,
}: ProductFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>(currentSort);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number>(0);

  // Find current price range index
  useEffect(() => {
    const index = PRICE_RANGES.findIndex(
      (r) => r.min === currentPriceMin && r.max === currentPriceMax
    );
    if (index >= 0) setSelectedPriceRange(index);
  }, [currentPriceMin, currentPriceMax]);

  const handleSortChange = (sort: SortOption) => {
    setSelectedSort(sort);
    onSortChange(sort);
  };

  const handlePriceRangeChange = (index: number) => {
    setSelectedPriceRange(index);
    const range = PRICE_RANGES[index];
    onPriceFilterChange(range.min, range.max);
  };

  const hasActiveFilters = currentPriceMin !== null || currentPriceMax !== null;

  const clearFilters = () => {
    setSelectedPriceRange(0);
    onPriceFilterChange(null, null);
  };

  return (
    <div className="mb-8">
      {/* Desktop Filters */}
      <div className="hidden md:flex items-center justify-between gap-4 pb-6 border-b border-cream-200">
        <div className="flex items-center gap-4">
          {showPriceFilter && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-forest-800/60">Price:</span>
              <div className="flex flex-wrap gap-2">
                {PRICE_RANGES.map((range, index) => (
                  <button
                    key={index}
                    onClick={() => handlePriceRangeChange(index)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all
                      ${selectedPriceRange === index
                        ? 'bg-forest-900 text-white'
                        : 'bg-cream-100 text-forest-800 hover:bg-cream-200'
                      }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {productCount !== undefined && (
            <span className="text-sm text-forest-800/50">
              {productCount} {productCount === 1 ? 'product' : 'products'}
            </span>
          )}

          <div className="flex items-center gap-2">
            <span className="text-sm text-forest-800/60">Sort:</span>
            <select
              value={selectedSort}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="px-3 py-2 rounded-lg border border-cream-200 bg-white text-sm text-forest-800
                       focus:outline-none focus:border-sage-300 focus:ring-2 focus:ring-sage-100
                       cursor-pointer"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="md:hidden">
        <div className="flex items-center justify-between gap-4 pb-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all
              ${hasActiveFilters
                ? 'border-sage-300 bg-sage-50 text-sage-700'
                : 'border-cream-200 bg-white text-forest-800'
              }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="font-medium">Filters</span>
            {hasActiveFilters && (
              <span className="w-5 h-5 rounded-full bg-sage-600 text-white text-xs flex items-center justify-center">
                1
              </span>
            )}
          </button>

          <select
            value={selectedSort}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="px-4 py-2.5 rounded-lg border border-cream-200 bg-white text-sm text-forest-800
                     focus:outline-none focus:border-sage-300 flex-1 max-w-[180px]"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile Filter Panel */}
        {isFilterOpen && (
          <div className="bg-cream-50 rounded-xl p-4 mb-4 animate-fade-in">
            {showPriceFilter && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-forest-900">Price Range</span>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-sage-600 hover:text-sage-700"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {PRICE_RANGES.map((range, index) => (
                    <button
                      key={index}
                      onClick={() => handlePriceRangeChange(index)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all
                        ${selectedPriceRange === index
                          ? 'bg-forest-900 text-white'
                          : 'bg-white text-forest-800 border border-cream-200 hover:border-sage-300'
                        }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {productCount !== undefined && (
          <p className="text-sm text-forest-800/50 mb-4">
            Showing {productCount} {productCount === 1 ? 'product' : 'products'}
          </p>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm text-forest-800/60">Active filters:</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sage-100 text-sm text-sage-700">
            {PRICE_RANGES[selectedPriceRange].label}
            <button
              onClick={clearFilters}
              className="ml-1 hover:text-sage-900"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
