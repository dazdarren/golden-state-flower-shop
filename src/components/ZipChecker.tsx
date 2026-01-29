'use client';

import { useState } from 'react';
import { CityConfig } from '@/types/city';

interface DeliveryDate {
  date: string;
  description: string;
  price: number;
  available: boolean;
}

interface ZipCheckerProps {
  cityConfig: CityConfig;
}

export default function ZipChecker({ cityConfig }: ZipCheckerProps) {
  const [zip, setZip] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryDates, setDeliveryDates] = useState<DeliveryDate[] | null>(null);
  const [isMock, setIsMock] = useState(false);

  const basePath = `/${cityConfig.stateSlug}/${cityConfig.citySlug}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDeliveryDates(null);
    setIsMock(false);

    const trimmedZip = zip.trim();
    if (!/^\d{5}$/.test(trimmedZip)) {
      setError('Please enter a valid 5-digit ZIP code');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api${basePath}/delivery-dates?zip=${encodeURIComponent(trimmedZip)}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to check delivery dates');
        return;
      }

      setDeliveryDates(data.data.dates);
      setIsMock(data.data.mock === true);
    } catch (err) {
      setError('Unable to connect to delivery service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const availableDates = deliveryDates?.filter((d) => d.available) || [];
  const nextAvailable = availableDates[0];

  return (
    <div className="w-full max-w-md">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft-lg border border-cream-300/50 p-6 sm:p-8">
        {/* Header with decorative element */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-forest-900">
              Check Delivery
            </h3>
            <p className="text-sm text-forest-800/60">
              Enter your ZIP code
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="94102"
              className="input flex-1 text-center text-lg tracking-wider font-medium"
              maxLength={5}
              pattern="\d{5}"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6"
            >
              {loading ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                'Check'
              )}
            </button>
          </div>

          {/* Quick ZIP suggestions */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-forest-800/50">Popular:</span>
            {cityConfig.primaryZipCodes.slice(0, 4).map((suggestedZip) => (
              <button
                key={suggestedZip}
                type="button"
                onClick={() => setZip(suggestedZip)}
                className="text-xs px-2.5 py-1 rounded-full bg-cream-200 text-forest-800/70
                         hover:bg-sage-100 hover:text-sage-700 transition-colors duration-200"
              >
                {suggestedZip}
              </button>
            ))}
          </div>
        </form>

        {/* Error state */}
        {error && (
          <div className="mt-5 p-4 bg-rose-50 border border-rose-200/50 rounded-xl animate-scale-in">
            <p className="text-sm text-rose-700 flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          </div>
        )}

        {/* Success state */}
        {deliveryDates && !error && (
          <div className="mt-5 animate-scale-in">
            {isMock && (
              <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200/50 rounded-lg">
                <p className="text-xs text-amber-700 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Demo mode — sample dates shown
                </p>
              </div>
            )}

            {nextAvailable ? (
              <div className="p-5 bg-sage-50 border border-sage-200/50 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-sage-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-display text-lg font-semibold text-sage-800">
                    We deliver to {zip}!
                  </span>
                </div>
                <div className="space-y-1.5 text-sm text-forest-800/70">
                  <p>
                    <span className="font-medium text-forest-800">Next available:</span>{' '}
                    {formatDate(nextAvailable.date)} ({nextAvailable.description})
                  </p>
                  {nextAvailable.price > 0 && (
                    <p>
                      <span className="font-medium text-forest-800">Delivery fee:</span>{' '}
                      ${nextAvailable.price.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-5 bg-cream-200 rounded-2xl">
                <p className="text-forest-800/70 text-sm">
                  No delivery dates currently available for this ZIP code.
                </p>
              </div>
            )}

            {/* Upcoming dates */}
            {availableDates.length > 1 && (
              <div className="mt-4">
                <p className="text-xs text-forest-800/50 mb-2.5">More delivery dates:</p>
                <div className="flex flex-wrap gap-2">
                  {availableDates.slice(1, 5).map((date) => (
                    <span
                      key={date.date}
                      className="text-xs px-3 py-1.5 bg-white rounded-full border border-cream-300 text-forest-800/70"
                    >
                      {formatDate(date.date)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
