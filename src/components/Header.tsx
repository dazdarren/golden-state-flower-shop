'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { CityConfig } from '@/types/city';

interface HeaderProps {
  cityConfig: CityConfig;
}

export default function Header({ cityConfig }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const basePath = `/${cityConfig.stateSlug}/${cityConfig.citySlug}`;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { href: `${basePath}/flowers/birthday`, label: 'Birthday' },
              { href: `${basePath}/flowers/sympathy`, label: 'Sympathy' },
              { href: `${basePath}/flowers/anniversary`, label: 'Anniversary' },
              { href: `${basePath}/flowers/get-well`, label: 'Get Well' },
              { href: `${basePath}/delivery`, label: 'Delivery' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 font-body text-sm text-forest-800/80 hover:text-forest-900
                         transition-colors duration-200 rounded-lg hover:bg-sage-100/50"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart Button */}
          <div className="flex items-center gap-4">
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

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2.5 rounded-xl text-forest-800 hover:bg-sage-100/50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-6 border-t border-cream-300/50 animate-fade-in">
            <div className="flex flex-col gap-1">
              {[
                { href: `${basePath}/flowers/birthday`, label: 'Birthday Flowers' },
                { href: `${basePath}/flowers/sympathy`, label: 'Sympathy & Funeral' },
                { href: `${basePath}/flowers/anniversary`, label: 'Anniversary' },
                { href: `${basePath}/flowers/get-well`, label: 'Get Well' },
                { href: `${basePath}/flowers/thank-you`, label: 'Thank You' },
                { href: `${basePath}/delivery`, label: 'Delivery Info' },
              ].map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 font-body text-forest-800 hover:text-forest-900
                           hover:bg-sage-100/50 rounded-xl transition-all duration-200
                           opacity-0 animate-fade-up stagger-${i + 1}`}
                  style={{ animationFillMode: 'forwards' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-cream-300/50">
                <Link
                  href={`${basePath}/cart`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-full
                           bg-forest-900 text-cream-100 font-medium
                           transition-all duration-300 hover:bg-forest-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  View Cart
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
