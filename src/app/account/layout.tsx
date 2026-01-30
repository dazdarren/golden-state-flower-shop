'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';

function AccountLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, isConfigured, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user && isConfigured) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, isConfigured, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-forest-800/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && isConfigured) {
    return null; // Will redirect
  }

  const navLinks = [
    { href: '/account', label: 'Overview', icon: 'home' },
    { href: '/account/orders', label: 'Order History', icon: 'orders' },
    { href: '/account/wishlist', label: 'Wishlist', icon: 'wishlist' },
    { href: '/account/addresses', label: 'Addresses', icon: 'address' },
    { href: '/account/reminders', label: 'Reminders', icon: 'reminder' },
  ];

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'home':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'orders':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        );
      case 'subscription':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'address':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'reminder':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
      case 'wishlist':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="bg-white border-b border-cream-200 sticky top-0 z-40">
        <div className="container-wide">
          <div className="flex items-center justify-between h-16">
            <Link href="/ca/san-francisco" className="flex items-center gap-3">
              <svg
                className="w-8 h-8 text-sage-600"
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
              </svg>
              <span className="font-display text-lg font-semibold text-forest-900">
                My Account
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/ca/san-francisco"
                className="text-sm text-forest-800/60 hover:text-forest-900 transition-colors"
              >
                Back to Shop
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm text-forest-800/60 hover:text-forest-900 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-wide py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-2xl border border-cream-200 p-4 sticky top-24">
              {/* User Info */}
              <div className="px-4 py-3 mb-4 border-b border-cream-200">
                <p className="font-medium text-forest-900 truncate">
                  {user?.user_metadata?.firstName || 'Welcome back'}
                </p>
                <p className="text-sm text-forest-800/50 truncate">
                  {user?.email}
                </p>
              </div>

              {/* Nav Links */}
              <ul className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          isActive
                            ? 'bg-sage-50 text-sage-700'
                            : 'text-forest-800/70 hover:bg-cream-50 hover:text-forest-900'
                        }`}
                      >
                        <span className={isActive ? 'text-sage-600' : 'text-forest-800/40'}>
                          {getIcon(link.icon)}
                        </span>
                        <span className="text-sm font-medium">{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WishlistProvider>
        <AccountLayoutInner>{children}</AccountLayoutInner>
      </WishlistProvider>
    </AuthProvider>
  );
}
