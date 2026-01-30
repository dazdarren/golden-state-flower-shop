'use client';

import { useState, useEffect } from 'react';

export type SortOption = 'default' | 'price-low' | 'price-high' | 'name-az' | 'name-za';

export type OccasionFilter = 'birthday' | 'sympathy' | 'anniversary' | 'get-well' | 'thank-you' | 'love-romance' | 'congratulations' | 'new-baby';

interface ProductFiltersProps {
  onSortChange: (sort: SortOption) => void;
  onPriceFilterChange: (min: number | null, max: number | null) => void;
  onOccasionFilterChange?: (occasions: OccasionFilter[]) => void;
  currentSort?: SortOption;
  currentPriceMin?: number | null;
  currentPriceMax?: number | null;
  currentOccasions?: OccasionFilter[];
  showPriceFilter?: boolean;
  showOccasionFilter?: boolean;
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

const OCCASION_FILTERS: { value: OccasionFilter; label: string; icon: string }[] = [
  { value: 'birthday', label: 'Birthday', icon: '🎂' },
  { value: 'sympathy', label: 'Sympathy', icon: '💐' },
  { value: 'anniversary', label: 'Anniversary', icon: '💕' },
  { value: 'get-well', label: 'Get Well', icon: '🌻' },
  { value: 'thank-you', label: 'Thank You', icon: '🙏' },
  { value: 'love-romance', label: 'Romance', icon: '❤️' },
  { value: 'congratulations', label: 'Congrats', icon: '🎉' },
  { value: 'new-baby', label: 'New Baby', icon: '👶' },
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
  onOccasionFilterChange,
  currentSort = 'default',
  currentPriceMin = null,
  currentPriceMax = null,
  currentOccasions = [],
  showPriceFilter = true,
  showOccasionFilter = false,
  productCount,
}: ProductFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>(currentSort);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number>(0);
  const [selectedOccasions, setSelectedOccasions] = useState<OccasionFilter[]>(currentOccasions);

  // Find current price range index
  useEffect(() => {
    const index = PRICE_RANGES.findIndex(
      (r) => r.min === currentPriceMin && r.max === currentPriceMax
    );
    if (index >= 0) setSelectedPriceRange(index);
  }, [currentPriceMin, currentPriceMax]);

  // Sync selected occasions with prop
  useEffect(() => {
    setSelectedOccasions(currentOccasions);
  }, [currentOccasions]);

  const handleSortChange = (sort: SortOption) => {
    setSelectedSort(sort);
    onSortChange(sort);
  };

  const handlePriceRangeChange = (index: number) => {
    setSelectedPriceRange(index);
    const range = PRICE_RANGES[index];
    onPriceFilterChange(range.min, range.max);
  };

  const handleOccasionToggle = (occasion: OccasionFilter) => {
    const newOccasions = selectedOccasions.includes(occasion)
      ? selectedOccasions.filter(o => o !== occasion)
      : [...selectedOccasions, occasion];
    setSelectedOccasions(newOccasions);
    onOccasionFilterChange?.(newOccasions);
  };

  const removeOccasion = (occasion: OccasionFilter) => {
    const newOccasions = selectedOccasions.filter(o => o !== occasion);
    setSelectedOccasions(newOccasions);
    onOccasionFilterChange?.(newOccasions);
  };

  const hasPriceFilter = currentPriceMin !== null || currentPriceMax !== null;
  const hasActiveFilters = hasPriceFilter || selectedOccasions.length > 0;
  const activeFilterCount = (hasPriceFilter ? 1 : 0) + selectedOccasions.length;

  const clearFilters = () => {
    setSelectedPriceRange(0);
    setSelectedOccasions([]);
    onPriceFilterChange(null, null);
    onOccasionFilterChange?.([]);
  };

  const clearPriceFilter = () => {
    setSelectedPriceRange(0);
    onPriceFilterChange(null, null);
  };

  return (
    <div className="mb-8">
      {/* Desktop Filters */}
      <div className="hidden md:block pb-6 border-b border-cream-200">
        {/* Occasion Filter Chips */}
        {showOccasionFilter && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-sm text-forest-800/60">Occasion:</span>
            {OCCASION_FILTERS.map((occasion) => (
              <button
                key={occasion.value}
                onClick={() => handleOccasionToggle(occasion.value)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all
                  ${selectedOccasions.includes(occasion.value)
                    ? 'bg-sage-600 text-white'
                    : 'bg-cream-100 text-forest-800 hover:bg-cream-200'
                  }`}
              >
                <span>{occasion.icon}</span>
                <span>{occasion.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Price and Sort Row */}
        <div className="flex items-center justify-between gap-4">
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
            aria-expanded={isFilterOpen}
            aria-controls="mobile-filter-panel"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="font-medium">Filters</span>
            {hasActiveFilters && (
              <span className="w-5 h-5 rounded-full bg-sage-600 text-white text-xs flex items-center justify-center">
                {activeFilterCount}
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

        {/* Mobile Filter Bottom Sheet */}
        {isFilterOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-forest-900/30 z-40 animate-fade-in"
              onClick={() => setIsFilterOpen(false)}
            />

            {/* Bottom Sheet */}
            <div
              id="mobile-filter-panel"
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[80vh] overflow-y-auto animate-slide-up safe-area-bottom"
            >
              {/* Handle */}
              <div className="flex justify-center py-3">
                <div className="w-10 h-1 bg-cream-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-4 border-b border-cream-200">
                <h3 className="font-display text-lg font-semibold text-forest-900">Filters</h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 -mr-2 text-forest-800/60 hover:text-forest-900"
                  aria-label="Close filters"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Filter Content */}
              <div className="p-5 space-y-6">
                {/* Occasion Filters */}
                {showOccasionFilter && (
                  <div>
                    <h4 className="text-sm font-medium text-forest-900 mb-3">Occasion</h4>
                    <div className="flex flex-wrap gap-2">
                      {OCCASION_FILTERS.map((occasion) => (
                        <button
                          key={occasion.value}
                          onClick={() => handleOccasionToggle(occasion.value)}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all
                            ${selectedOccasions.includes(occasion.value)
                              ? 'bg-sage-600 text-white'
                              : 'bg-cream-100 text-forest-800 border border-cream-200'
                            }`}
                        >
                          <span>{occasion.icon}</span>
                          <span>{occasion.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range */}
                {showPriceFilter && (
                  <div>
                    <h4 className="text-sm font-medium text-forest-900 mb-3">Price Range</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {PRICE_RANGES.map((range, index) => (
                        <button
                          key={index}
                          onClick={() => handlePriceRangeChange(index)}
                          className={`px-3 py-2.5 rounded-lg text-sm transition-all
                            ${selectedPriceRange === index
                              ? 'bg-forest-900 text-white'
                              : 'bg-cream-100 text-forest-800 border border-cream-200'
                            }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 p-5 border-t border-cream-200">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-3 rounded-xl border border-cream-300 text-forest-800 font-medium
                           hover:bg-cream-50 transition-colors"
                  disabled={!hasActiveFilters}
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-forest-900 text-white font-medium
                           hover:bg-forest-800 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </>
        )}

        {productCount !== undefined && (
          <p className="text-sm text-forest-800/50 mb-4">
            Showing {productCount} {productCount === 1 ? 'product' : 'products'}
          </p>
        )}
      </div>

      {/* Active Filters Display (Desktop) */}
      {hasActiveFilters && (
        <div className="hidden md:flex items-center gap-2 mt-4 flex-wrap">
          <span className="text-sm text-forest-800/60">Active filters:</span>

          {/* Price Filter Chip */}
          {hasPriceFilter && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sage-100 text-sm text-sage-700">
              {PRICE_RANGES[selectedPriceRange].label}
              <button
                onClick={clearPriceFilter}
                className="ml-1 hover:text-sage-900"
                aria-label={`Remove ${PRICE_RANGES[selectedPriceRange].label} filter`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}

          {/* Occasion Filter Chips */}
          {selectedOccasions.map((occasion) => {
            const occasionData = OCCASION_FILTERS.find(o => o.value === occasion);
            return (
              <span
                key={occasion}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sage-100 text-sm text-sage-700"
              >
                {occasionData?.icon} {occasionData?.label}
                <button
                  onClick={() => removeOccasion(occasion)}
                  className="ml-1 hover:text-sage-900"
                  aria-label={`Remove ${occasionData?.label} filter`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            );
          })}

          {/* Clear All */}
          <button
            onClick={clearFilters}
            className="text-sm text-sage-600 hover:text-sage-700 underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
