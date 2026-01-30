'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AnnouncementBarProps {
  basePath: string;
  cityName: string;
  cutoffTime: string;
}

interface SeasonalMessage {
  message: string;
  ctaText: string;
  ctaLink: string;
  deadline?: string;
  daysLeft?: number;
}

function getSeasonalMessage(basePath: string): SeasonalMessage {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();

  // Valentine's Day (Feb 1-14)
  if (month === 2 && day <= 14) {
    const daysLeft = 14 - day;
    const deadlineDate = daysLeft <= 2 ? 'Feb 12' : `Feb ${12}`;
    return {
      message: `Valentine's Day: Order by ${deadlineDate} for guaranteed delivery`,
      ctaText: "Shop Valentine's",
      ctaLink: `${basePath}/seasonal/valentines-day`,
      deadline: deadlineDate,
      daysLeft: daysLeft,
    };
  }

  // Mother's Day (second Sunday in May - approximate as May 1-12)
  if (month === 5 && day <= 12) {
    const daysLeft = Math.max(0, 10 - day);
    return {
      message: `Mother's Day: Make Mom's day - Order by May 10`,
      ctaText: "Shop Mother's Day",
      ctaLink: `${basePath}/seasonal/mothers-day`,
      deadline: 'May 10',
      daysLeft: daysLeft,
    };
  }

  // Christmas (Dec 1-24)
  if (month === 12 && day <= 24) {
    const daysLeft = Math.max(0, 22 - day);
    return {
      message: `Holiday Season: Order by Dec 22 for Christmas delivery`,
      ctaText: 'Shop Holiday',
      ctaLink: `${basePath}/seasonal/christmas`,
      deadline: 'Dec 22',
      daysLeft: daysLeft,
    };
  }

  // Default message
  return {
    message: 'Same-day delivery available - Order by 2pm',
    ctaText: 'Shop Now',
    ctaLink: `${basePath}/flowers/birthday`,
  };
}

export default function AnnouncementBar({ basePath, cityName, cutoffTime }: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(true); // Start dismissed to prevent flash
  const [mounted, setMounted] = useState(false);

  const seasonalMessage = getSeasonalMessage(basePath);

  useEffect(() => {
    setMounted(true);
    // Check localStorage for dismissal
    const isDismissed = localStorage.getItem('announcement-dismissed');
    const dismissedAt = localStorage.getItem('announcement-dismissed-at');

    // Reset dismissal after 24 hours
    if (isDismissed && dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60);
      if (hoursSinceDismissed > 24) {
        localStorage.removeItem('announcement-dismissed');
        localStorage.removeItem('announcement-dismissed-at');
        setDismissed(false);
      }
    } else {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('announcement-dismissed', 'true');
    localStorage.setItem('announcement-dismissed-at', Date.now().toString());
  };

  // Don't render on server or if dismissed
  if (!mounted || dismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white relative">
      <div className="container-wide py-2.5 pr-10">
        <div className="flex items-center justify-center gap-3 text-sm">
          {/* Seasonal icon */}
          <span className="hidden sm:inline">
            {seasonalMessage.daysLeft !== undefined && seasonalMessage.daysLeft <= 5 ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="bg-white/20 text-white px-2 py-0.5 rounded text-xs font-bold animate-pulse">
                  {seasonalMessage.daysLeft} {seasonalMessage.daysLeft === 1 ? 'DAY' : 'DAYS'} LEFT
                </span>
              </span>
            ) : (
              <svg className="w-5 h-5 text-rose-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}
          </span>

          <span className="text-center">
            {seasonalMessage.message}
          </span>

          <Link
            href={seasonalMessage.ctaLink}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30
                     rounded-full text-xs font-semibold transition-colors whitespace-nowrap"
          >
            {seasonalMessage.ctaText}
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full
                 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Dismiss announcement"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
