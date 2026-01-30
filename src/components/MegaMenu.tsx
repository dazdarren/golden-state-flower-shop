'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { OCCASIONS, PRODUCT_TYPES, SEASONAL, getActiveSeasonalCollections } from '@/data/categories';

interface MegaMenuProps {
  basePath: string;
}

type MenuSection = 'occasions' | 'types' | 'seasonal' | null;

export default function MegaMenu({ basePath }: MegaMenuProps) {
  const [activeSection, setActiveSection] = useState<MenuSection>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<MenuSection>(null);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const activeSeasonalCollections = getActiveSeasonalCollections();

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      router.push(`${basePath}/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
      setMobileMenuOpen(false);
      setMobileSearchQuery('');
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveSection(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleMouseEnter = (section: MenuSection) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveSection(section);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveSection(null);
    }, 150);
  };

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const toggleMobileSection = (section: MenuSection) => {
    setMobileExpandedSection(mobileExpandedSection === section ? null : section);
  };

  return (
    <div ref={menuRef} className="relative">
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-1">
        {/* Shop by Occasion */}
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter('occasions')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className={`flex items-center gap-1.5 px-4 py-2 font-body text-sm transition-colors duration-200 rounded-lg
              ${activeSection === 'occasions'
                ? 'text-forest-900 bg-sage-100/50'
                : 'text-forest-800/80 hover:text-forest-900 hover:bg-sage-100/50'
              }`}
          >
            By Occasion
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${activeSection === 'occasions' ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Occasions Dropdown */}
          {activeSection === 'occasions' && (
            <div
              className="absolute top-full left-0 mt-2 w-[480px] bg-white rounded-2xl shadow-lg border border-cream-200 p-6 z-50 animate-fade-in"
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                {OCCASIONS.map((occasion) => (
                  <Link
                    key={occasion.slug}
                    href={`${basePath}/flowers/${occasion.slug}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-cream-50 transition-colors group"
                    onClick={() => setActiveSection(null)}
                  >
                    <span className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0
                                   group-hover:bg-sage-200 transition-colors">
                      {getOccasionIcon(occasion.slug)}
                    </span>
                    <div>
                      <span className="block text-sm font-medium text-forest-900 group-hover:text-sage-700 transition-colors">
                        {occasion.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Shop by Type */}
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter('types')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className={`flex items-center gap-1.5 px-4 py-2 font-body text-sm transition-colors duration-200 rounded-lg
              ${activeSection === 'types'
                ? 'text-forest-900 bg-sage-100/50'
                : 'text-forest-800/80 hover:text-forest-900 hover:bg-sage-100/50'
              }`}
          >
            By Type
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${activeSection === 'types' ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Types Dropdown */}
          {activeSection === 'types' && (
            <div
              className="absolute top-full left-0 mt-2 w-[320px] bg-white rounded-2xl shadow-lg border border-cream-200 p-6 z-50 animate-fade-in"
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="space-y-2">
                {PRODUCT_TYPES.map((type) => (
                  <Link
                    key={type.slug}
                    href={`${basePath}/shop/${type.slug}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-cream-50 transition-colors group"
                    onClick={() => setActiveSection(null)}
                  >
                    <span className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center flex-shrink-0
                                   group-hover:bg-sage-200 transition-colors">
                      {getProductTypeIcon(type.slug)}
                    </span>
                    <div>
                      <span className="block text-sm font-medium text-forest-900 group-hover:text-sage-700 transition-colors">
                        {type.name}
                      </span>
                      <span className="block text-xs text-forest-800/50 mt-0.5">
                        {type.description.split('.')[0]}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Seasonal */}
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter('seasonal')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className={`flex items-center gap-1.5 px-4 py-2 font-body text-sm transition-colors duration-200 rounded-lg
              ${activeSection === 'seasonal'
                ? 'text-forest-900 bg-sage-100/50'
                : 'text-forest-800/80 hover:text-forest-900 hover:bg-sage-100/50'
              }`}
          >
            Seasonal
            {activeSeasonalCollections.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-400" />
            )}
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${activeSection === 'seasonal' ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Seasonal Dropdown */}
          {activeSection === 'seasonal' && (
            <div
              className="absolute top-full left-0 mt-2 w-[320px] bg-white rounded-2xl shadow-lg border border-cream-200 p-6 z-50 animate-fade-in"
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="space-y-2">
                {SEASONAL.map((season) => {
                  const isActive = season.activeMonths.includes(new Date().getMonth() + 1);
                  return (
                    <Link
                      key={season.slug}
                      href={`${basePath}/seasonal/${season.slug}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-cream-50 transition-colors group relative"
                      onClick={() => setActiveSection(null)}
                    >
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                        ${isActive ? 'bg-rose-100 group-hover:bg-rose-200' : 'bg-sage-100 group-hover:bg-sage-200'}`}>
                        {getSeasonalIcon(season.slug)}
                      </span>
                      <div className="flex-1">
                        <span className="block text-sm font-medium text-forest-900 group-hover:text-sage-700 transition-colors">
                          {season.name}
                        </span>
                        <span className="block text-xs text-forest-800/50 mt-0.5">
                          {season.timing}
                        </span>
                      </div>
                      {isActive && (
                        <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                          NOW
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Delivery Info */}
        <Link
          href={`${basePath}/delivery`}
          className="px-4 py-2 font-body text-sm text-forest-800/80 hover:text-forest-900
                   transition-colors duration-200 rounded-lg hover:bg-sage-100/50"
        >
          Delivery
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <button
        type="button"
        className="lg:hidden p-2.5 rounded-xl text-forest-800 hover:bg-sage-100/50 transition-colors"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-menu"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {mobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="lg:hidden fixed inset-0 top-20 bg-cream-100/95 backdrop-blur-md z-40 overflow-y-auto animate-fade-in"
        >
          <div className="container-wide py-6">
            {/* Mobile Search */}
            <form onSubmit={handleMobileSearch} className="mb-6">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-800/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  placeholder="Search flowers, plants..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-cream-300 bg-white
                           text-forest-900 placeholder:text-forest-800/40
                           focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
                />
              </div>
            </form>

            {/* Cart & Account Links - Mobile only */}
            <div className="flex gap-3 mb-6">
              <Link
                href={`${basePath}/cart`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                         bg-forest-900 text-cream-100 font-medium text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Cart
              </Link>
              <Link
                href={`/auth/login?redirect=${encodeURIComponent(basePath)}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                         border border-cream-300 text-forest-800 font-medium text-sm
                         hover:bg-white/50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Account
              </Link>
            </div>

            {/* Shop by Occasion */}
            <div className="border-b border-cream-300/50">
              <button
                onClick={() => toggleMobileSection('occasions')}
                className="flex items-center justify-between w-full py-4 text-left"
              >
                <span className="font-display text-lg font-medium text-forest-900">Shop by Occasion</span>
                <svg
                  className={`w-5 h-5 text-forest-800/60 transition-transform ${mobileExpandedSection === 'occasions' ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileExpandedSection === 'occasions' && (
                <div className="pb-4 grid grid-cols-2 gap-2">
                  {OCCASIONS.map((occasion) => (
                    <Link
                      key={occasion.slug}
                      href={`${basePath}/flowers/${occasion.slug}`}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/50 hover:bg-white transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="w-6 h-6 rounded-full bg-sage-100 flex items-center justify-center">
                        {getOccasionIcon(occasion.slug, 'small')}
                      </span>
                      <span className="text-sm text-forest-800">{occasion.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Shop by Type */}
            <div className="border-b border-cream-300/50">
              <button
                onClick={() => toggleMobileSection('types')}
                className="flex items-center justify-between w-full py-4 text-left"
              >
                <span className="font-display text-lg font-medium text-forest-900">Shop by Type</span>
                <svg
                  className={`w-5 h-5 text-forest-800/60 transition-transform ${mobileExpandedSection === 'types' ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileExpandedSection === 'types' && (
                <div className="pb-4 space-y-2">
                  {PRODUCT_TYPES.map((type) => (
                    <Link
                      key={type.slug}
                      href={`${basePath}/shop/${type.slug}`}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg bg-white/50 hover:bg-white transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="w-8 h-8 rounded-lg bg-sage-100 flex items-center justify-center">
                        {getProductTypeIcon(type.slug, 'small')}
                      </span>
                      <span className="text-sm font-medium text-forest-800">{type.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Seasonal */}
            <div className="border-b border-cream-300/50">
              <button
                onClick={() => toggleMobileSection('seasonal')}
                className="flex items-center justify-between w-full py-4 text-left"
              >
                <span className="font-display text-lg font-medium text-forest-900">Seasonal</span>
                <svg
                  className={`w-5 h-5 text-forest-800/60 transition-transform ${mobileExpandedSection === 'seasonal' ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileExpandedSection === 'seasonal' && (
                <div className="pb-4 space-y-2">
                  {SEASONAL.map((season) => {
                    const isActive = season.activeMonths.includes(new Date().getMonth() + 1);
                    return (
                      <Link
                        key={season.slug}
                        href={`${basePath}/seasonal/${season.slug}`}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg bg-white/50 hover:bg-white transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center
                          ${isActive ? 'bg-rose-100' : 'bg-sage-100'}`}>
                          {getSeasonalIcon(season.slug, 'small')}
                        </span>
                        <span className="flex-1 text-sm font-medium text-forest-800">{season.name}</span>
                        {isActive && (
                          <span className="text-[10px] font-semibold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                            NOW
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Direct Links */}
            <div className="py-4 space-y-2">
              <Link
                href={`${basePath}/delivery`}
                className="block px-3 py-3 rounded-lg hover:bg-white/50 transition-colors text-forest-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Delivery Info
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Icon helper functions
function getOccasionIcon(slug: string, size: 'small' | 'default' = 'default'): JSX.Element {
  const sizeClass = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';

  const icons: Record<string, JSX.Element> = {
    birthday: (
      <svg className={`${sizeClass} text-rose-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
      </svg>
    ),
    anniversary: (
      <svg className={`${sizeClass} text-rose-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    'love-romance': (
      <svg className={`${sizeClass} text-rose-500`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    'new-baby': (
      <svg className={`${sizeClass} text-sky-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        <circle cx="12" cy="5" r="2" strokeWidth={1.5} />
      </svg>
    ),
    'thank-you': (
      <svg className={`${sizeClass} text-amber-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    'get-well': (
      <svg className={`${sizeClass} text-amber-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    sympathy: (
      <svg className={`${sizeClass} text-sage-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    congratulations: (
      <svg className={`${sizeClass} text-gold-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    'just-because': (
      <svg className={`${sizeClass} text-sage-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  };

  return icons[slug] || icons.birthday;
}

function getProductTypeIcon(slug: string, size: 'small' | 'default' = 'default'): JSX.Element {
  const sizeClass = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';

  const icons: Record<string, JSX.Element> = {
    plants: (
      <svg className={`${sizeClass} text-sage-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    'rose-bouquets': (
      <svg className={`${sizeClass} text-rose-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    'mixed-arrangements': (
      <svg className={`${sizeClass} text-amber-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    'premium-collection': (
      <svg className={`${sizeClass} text-gold-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  };

  return icons[slug] || icons.plants;
}

function getSeasonalIcon(slug: string, size: 'small' | 'default' = 'default'): JSX.Element {
  const sizeClass = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';

  const icons: Record<string, JSX.Element> = {
    'valentines-day': (
      <svg className={`${sizeClass} text-rose-500`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    'mothers-day': (
      <svg className={`${sizeClass} text-pink-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    christmas: (
      <svg className={`${sizeClass} text-forest-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 3l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" />
      </svg>
    ),
    'seasonal-specials': (
      <svg className={`${sizeClass} text-sage-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  };

  return icons[slug] || icons['seasonal-specials'];
}
