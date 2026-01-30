'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CityConfig } from '@/types/city';
import { useAuth } from '@/context/AuthContext';
import MegaMenu from './MegaMenu';
import SearchBar from './SearchBar';

interface HeaderProps {
  cityConfig: CityConfig;
}

export default function Header({ cityConfig }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const basePath = `/${cityConfig.stateSlug}/${cityConfig.citySlug}`;
  const { user, loading, signOut, isConfigured } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountMenuOpen && !(e.target as Element).closest('.account-menu')) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [accountMenuOpen]);

  // Focus mobile search input when opened
  useEffect(() => {
    if (mobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  // Handle mobile search submit
  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      router.push(`${basePath}/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
      setMobileSearchOpen(false);
      setMobileSearchQuery('');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setAccountMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-cream-100/95 backdrop-blur-md shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={basePath} className="flex items-center gap-3 group">
            <div className="relative">
              <svg
                className="w-10 h-10 text-sage-600 transition-transform duration-300 group-hover:scale-110"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M20 8c0 6-4 10-4 14s2 6 4 6 4-2 4-6-4-8-4-14z"
                  fill="currentColor"
                  opacity="0.2"
                />
                <path
                  d="M20 10c-3 4-6 7-6 10s2 5 6 5 6-2 6-5-3-6-6-10z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M14 18c2-1 4 0 6 2M26 18c-2-1-4 0-6 2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-semibold text-forest-900 tracking-tight">
                {cityConfig.cityName}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-sage-600 font-medium -mt-0.5">
                Flower Delivery
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - MegaMenu */}
          <MegaMenu basePath={basePath} />

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {/* Mobile action buttons - visible on mobile only */}
            <div className="flex md:hidden items-center gap-1">
              {/* Mobile Search Button */}
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="p-2.5 rounded-full text-forest-800/70 hover:bg-sage-100/50 transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Mobile Cart Button */}
              <Link
                href={`${basePath}/cart`}
                className="relative p-2.5 rounded-full text-forest-800/70 hover:bg-sage-100/50 transition-colors"
                aria-label="Shopping cart"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:block">
              <SearchBar basePath={basePath} />
            </div>

            {/* Account / Sign In */}
            {isConfigured && !loading && (
              user ? (
                <div className="relative account-menu hidden md:block">
                  <button
                    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                    aria-expanded={accountMenuOpen}
                    aria-haspopup="true"
                    aria-label="Account menu"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg
                             text-forest-800/80 hover:text-forest-900 hover:bg-sage-100/50
                             transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm font-medium">Account</span>
                    <svg className={`w-4 h-4 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`}
                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {accountMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-cream-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-cream-100">
                        <p className="text-sm font-medium text-forest-900 truncate">
                          {user.user_metadata?.firstName || 'Welcome'}
                        </p>
                        <p className="text-xs text-forest-800/50 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm text-forest-800/80 hover:bg-sage-50 hover:text-forest-900"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        My Account
                      </Link>
                      <Link
                        href="/account/orders"
                        className="block px-4 py-2 text-sm text-forest-800/80 hover:bg-sage-50 hover:text-forest-900"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        Order History
                      </Link>
                      <hr className="my-2 border-cream-100" />
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-forest-800/80 hover:bg-sage-50 hover:text-forest-900"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={`/auth/login?redirect=${encodeURIComponent(basePath)}`}
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg
                           text-forest-800/80 hover:text-forest-900 hover:bg-sage-100/50
                           transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm font-medium">Sign In</span>
                </Link>
              )
            )}

            {/* Cart Button */}
            <Link
              href={`${basePath}/cart`}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full
                       bg-forest-900 text-cream-100 font-medium text-sm
                       transition-all duration-300
                       hover:bg-forest-800 hover:shadow-soft-lg hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span>Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-forest-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-cream-100 p-4 shadow-lg">
            <form onSubmit={handleMobileSearch} className="relative">
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
                ref={mobileSearchInputRef}
                type="text"
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                placeholder="Search flowers, plants..."
                className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-cream-300 bg-white
                         text-forest-900 placeholder:text-forest-800/40
                         focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => {
                  setMobileSearchOpen(false);
                  setMobileSearchQuery('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full
                         text-forest-800/60 hover:text-forest-900 hover:bg-cream-200"
                aria-label="Close search"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </form>
            <p className="text-xs text-forest-800/50 mt-2 px-1">
              Press Enter to search
            </p>
          </div>
          {/* Click outside to close */}
          <div
            className="flex-1 h-full"
            onClick={() => {
              setMobileSearchOpen(false);
              setMobileSearchQuery('');
            }}
          />
        </div>
      )}
    </header>
  );
}
