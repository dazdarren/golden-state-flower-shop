'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/ca/san-francisco');
  }, [router]);

  // Brief loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6">
          <svg className="w-full h-full text-sage-500 animate-pulse" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
            <path d="M20 8c0 6-4 10-4 14s2 6 4 6 4-2 4-6-4-8-4-14z" fill="currentColor" opacity="0.3" />
            <path d="M20 10c-3 4-6 7-6 10s2 5 6 5 6-2 6-5-3-6-6-10z" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
        <p className="text-forest-800/60 text-lg">Loading Golden State Flower Shop...</p>
      </div>
    </div>
  );
}
