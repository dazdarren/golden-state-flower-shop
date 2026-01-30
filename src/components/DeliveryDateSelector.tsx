'use client';

import { useState, useEffect } from 'react';

interface DeliveryDate {
  date: string;
  formatted: string;
  available: boolean;
}

interface DeliveryDateSelectorProps {
  basePath: string;
  onDateSelect?: (date: string | null) => void;
  selectedDate?: string | null;
  compact?: boolean;
}

export default function DeliveryDateSelector({
  basePath,
  onDateSelect,
  selectedDate = null,
  compact = false,
}: DeliveryDateSelectorProps) {
  const [zip, setZip] = useState('');
  const [savedZip, setSavedZip] = useState<string | null>(null);
  const [dates, setDates] = useState<DeliveryDate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Load saved ZIP from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('deliveryZip');
    if (stored) {
      setSavedZip(stored);
      setZip(stored);
      fetchDates(stored);
    }
  }, []);

  const fetchDates = async (zipCode: string) => {
    if (!/^\d{5}$/.test(zipCode)) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api${basePath}/delivery-dates?zip=${zipCode}`);
      const data = await response.json();

      if (data.success && data.data?.dates) {
        setDates(data.data.dates.slice(0, 7)); // Show next 7 days
        setSavedZip(zipCode);
        localStorage.setItem('deliveryZip', zipCode);
      } else {
        setError('Unable to find delivery dates');
        setDates([]);
      }
    } catch {
      setError('Failed to check delivery');
      setDates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zip.length === 5) {
      fetchDates(zip);
    }
  };

  const handleDateClick = (date: string) => {
    const newDate = selectedDate === date ? null : date;
    onDateSelect?.(newDate);
  };

  const formatShortDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (compact) {
    return (
      <div className="bg-sage-50 border border-sage-200 rounded-xl p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-forest-900">
                {savedZip ? `Delivering to ${savedZip}` : 'Check delivery dates'}
              </p>
              {selectedDate && (
                <p className="text-xs text-sage-600">
                  {formatShortDate(selectedDate)}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-sage-600 hover:text-sage-700 font-medium"
          >
            {isExpanded ? 'Hide' : savedZip ? 'Change' : 'Set ZIP'}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-sage-200 animate-fade-in">
            <form onSubmit={handleZipSubmit} className="flex gap-2 mb-3">
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="ZIP code"
                className="flex-1 px-3 py-2 rounded-lg border border-sage-200 text-sm
                         focus:outline-none focus:border-sage-400"
                maxLength={5}
              />
              <button
                type="submit"
                disabled={loading || zip.length !== 5}
                className="px-4 py-2 bg-sage-600 text-white rounded-lg text-sm font-medium
                         disabled:opacity-50 hover:bg-sage-700 transition-colors"
              >
                {loading ? '...' : 'Check'}
              </button>
            </form>

            {error && <p className="text-xs text-rose-600 mb-2">{error}</p>}

            {dates.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {dates.map((d) => (
                  <button
                    key={d.date}
                    onClick={() => handleDateClick(d.date)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all
                      ${selectedDate === d.date
                        ? 'bg-sage-600 text-white'
                        : 'bg-white border border-sage-200 text-forest-800 hover:border-sage-400'
                      }`}
                  >
                    {formatShortDate(d.date)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Full version
  return (
    <div className="bg-white border border-cream-200 rounded-2xl p-6 shadow-soft">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-forest-900">Delivery Date</h3>
          <p className="text-sm text-forest-800/60">When do you need it?</p>
        </div>
      </div>

      {!savedZip ? (
        <form onSubmit={handleZipSubmit}>
          <div className="flex gap-3">
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="Enter ZIP code"
              className="flex-1 px-4 py-3 rounded-xl border border-cream-200 text-center text-lg
                       focus:outline-none focus:border-sage-300 focus:ring-2 focus:ring-sage-100"
              maxLength={5}
            />
            <button
              type="submit"
              disabled={loading || zip.length !== 5}
              className="px-6 py-3 bg-forest-900 text-white rounded-xl font-medium
                       disabled:opacity-50 hover:bg-forest-800 transition-colors"
            >
              {loading ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                'Check'
              )}
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
        </form>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-forest-800/60">
              Delivering to <span className="font-medium text-forest-900">{savedZip}</span>
            </p>
            <button
              onClick={() => {
                setSavedZip(null);
                setDates([]);
                localStorage.removeItem('deliveryZip');
              }}
              className="text-sm text-sage-600 hover:text-sage-700"
            >
              Change
            </button>
          </div>

          {dates.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {dates.map((d) => (
                <button
                  key={d.date}
                  onClick={() => handleDateClick(d.date)}
                  className={`p-3 rounded-xl text-center transition-all
                    ${selectedDate === d.date
                      ? 'bg-sage-600 text-white shadow-soft'
                      : 'bg-cream-50 border border-cream-200 hover:border-sage-300 text-forest-800'
                    }`}
                >
                  <span className="block text-xs opacity-70">
                    {new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="block text-lg font-semibold">
                    {new Date(d.date + 'T00:00:00').getDate()}
                  </span>
                  <span className="block text-xs opacity-70">
                    {new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                </button>
              ))}
            </div>
          )}

          {selectedDate && (
            <p className="mt-4 text-sm text-sage-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Showing products available for {formatShortDate(selectedDate)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
