'use client';

import { useState, useEffect } from 'react';

interface DeliveryCountdownProps {
  cutoffTime: string; // e.g., "2:00 PM"
  cityName: string;
  variant?: 'banner' | 'inline' | 'compact';
}

function parseCutoffTime(cutoffTime: string): { hours: number; minutes: number } {
  const match = cutoffTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return { hours: 14, minutes: 0 }; // Default 2 PM

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return { hours, minutes };
}

function getTimeUntilCutoff(cutoffTime: string): { hours: number; minutes: number; seconds: number; isPast: boolean } {
  const now = new Date();
  const cutoff = parseCutoffTime(cutoffTime);

  const cutoffDate = new Date();
  cutoffDate.setHours(cutoff.hours, cutoff.minutes, 0, 0);

  // If cutoff has passed today, show for tomorrow
  if (now > cutoffDate) {
    return { hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const diff = cutoffDate.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, isPast: false };
}

export default function DeliveryCountdown({ cutoffTime, cityName, variant = 'banner' }: DeliveryCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilCutoff(cutoffTime));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilCutoff(cutoffTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [cutoffTime]);

  // Don't render on server to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  if (timeLeft.isPast) {
    if (variant === 'compact') return null;

    return (
      <div className={variant === 'banner' ? 'bg-cream-100 border-b border-cream-200' : ''}>
        <div className={variant === 'banner' ? 'container-wide py-2' : ''}>
          <p className="text-sm text-forest-800/70 text-center">
            Order now for <span className="font-medium text-forest-900">next-day delivery</span> to {cityName}
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-forest-800/70">
          Same-day delivery if ordered in{' '}
          <span className="font-semibold text-forest-900">
            {timeLeft.hours}h {timeLeft.minutes}m
          </span>
        </span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-3 p-3 bg-sage-50 rounded-lg border border-sage-200">
        <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-forest-900">Same-Day Delivery Available</p>
          <p className="text-xs text-forest-800/60">
            Order within{' '}
            <span className="font-semibold text-sage-700">
              {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </span>
          </p>
        </div>
      </div>
    );
  }

  // Banner variant (default)
  return (
    <div className="bg-gradient-to-r from-sage-600 to-sage-700 text-white">
      <div className="container-wide py-2.5">
        <div className="flex items-center justify-center gap-3 text-sm">
          <svg className="w-5 h-5 text-sage-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            Order within{' '}
            <span className="font-bold tabular-nums">
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
            {' '}for <span className="font-semibold">same-day delivery</span> to {cityName}
          </span>
        </div>
      </div>
    </div>
  );
}
