'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface MobileStickyBarProps {
  basePath: string;
  phoneNumber?: string;
}

export default function MobileStickyBar({ basePath, phoneNumber = '(510) 485-9113' }: MobileStickyBarProps) {
  const [visible, setVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show after scrolling down 300px
      if (currentScrollY > 300) {
        // Hide when scrolling up quickly, show when scrolling down or at rest
        if (currentScrollY > lastScrollY || currentScrollY > 500) {
          setVisible(true);
        }
      } else {
        setVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-cream-200 shadow-lg
                  transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="safe-area-inset-bottom">
        <div className="flex gap-3 p-3">
          <Link
            href={`${basePath}/flowers/birthday`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                     bg-sage-600 hover:bg-sage-700 text-white font-medium text-sm
                     transition-colors active:scale-[0.98]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Shop Flowers
          </Link>

          <a
            href={`tel:${phoneNumber.replace(/[^\d+]/g, '')}`}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                     border border-cream-300 bg-white hover:bg-cream-50 text-forest-800 font-medium text-sm
                     transition-colors active:scale-[0.98]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="sr-only sm:not-sr-only">Call</span>
          </a>
        </div>
      </div>
    </div>
  );
}
