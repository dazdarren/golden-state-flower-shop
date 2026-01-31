'use client';

import { useState } from 'react';

interface CartZipCheckerProps {
  basePath: string;
  cityName: string;
  onValidZip: (zip: string, deliveryFee: number) => void;
  primaryZipCodes?: string[];
}

interface DeliveryDate {
  date: string;
  formatted: string;
  available: boolean;
}

interface GetTotalResponse {
  success: boolean;
  data?: {
    subtotal: number;
    delivery: number;
    tax: number;
    total: number;
    mock?: boolean;
  };
  error?: string;
}

export default function CartZipChecker({
  basePath,
  cityName,
  onValidZip,
  primaryZipCodes = [],
}: CartZipCheckerProps) {
  const [zip, setZip] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);
  const [validatedZip, setValidatedZip] = useState('');
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await validateZip(zip);
  };

  const validateZip = async (zipCode: string) => {
    setError(null);

    const trimmedZip = zipCode.trim();
    if (!/^\d{5}$/.test(trimmedZip)) {
      setError('Please enter a valid 5-digit ZIP code');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Check if ZIP is deliverable and get available dates
      const datesResponse = await fetch(
        `/api${basePath}/delivery-dates?zip=${encodeURIComponent(trimmedZip)}`
      );

      const datesData = await datesResponse.json();

      if (!datesResponse.ok || !datesData.success) {
        setError(datesData.error || 'We don\'t deliver to this ZIP code');
        setValidated(false);
        return;
      }

      const dates: DeliveryDate[] = datesData.data.dates;
      const availableDates = dates.filter((d) => d.available);

      if (availableDates.length === 0) {
        setError('Sorry, we don\'t currently deliver to this area');
        setValidated(false);
        return;
      }

      // Step 2: Get the REAL delivery fee from the get-total API (calls Florist One gettotal)
      const firstAvailableDate = availableDates[0].date;
      const totalResponse = await fetch(
        `/api${basePath}/checkout/get-total?zip=${encodeURIComponent(trimmedZip)}&date=${encodeURIComponent(firstAvailableDate)}`
      );

      const totalData: GetTotalResponse = await totalResponse.json();

      let fee = 14.99; // Fallback only if API fails completely
      if (totalResponse.ok && totalData.success && totalData.data) {
        // Use the REAL delivery fee from Florist One API
        fee = totalData.data.delivery;
      }

      setDeliveryFee(fee);
      setValidated(true);
      setValidatedZip(trimmedZip);
      onValidZip(trimmedZip, fee);
    } catch (err) {
      setError('Unable to verify delivery. Please try again.');
      setValidated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeZip = () => {
    setValidated(false);
    setValidatedZip('');
    setDeliveryFee(null);
    setZip('');
  };

  if (validated) {
    return (
      <div className="p-4 bg-sage-50 border border-sage-200 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sage-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-forest-900">
                Delivering to {validatedZip}
              </p>
              <p className="text-sm text-forest-800/60">
                {deliveryFee === 0 ? 'Free delivery' : `Delivery fee: $${deliveryFee?.toFixed(2)}`}
              </p>
            </div>
          </div>
          <button
            onClick={handleChangeZip}
            className="text-sm text-sage-600 hover:text-sage-700 font-medium"
          >
            Change
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-cream-50 border border-cream-200 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
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
        <span className="font-medium text-forest-900">Verify delivery address</span>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
          placeholder="Enter ZIP code"
          className="flex-1 px-4 py-2.5 rounded-lg border border-cream-300 bg-white
                   text-forest-900 placeholder:text-forest-800/40
                   focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
          maxLength={5}
          pattern="\d{5}"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2.5 bg-sage-600 text-white font-medium rounded-lg
                   hover:bg-sage-700 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            'Verify'
          )}
        </button>
      </form>

      {/* Error state */}
      {error && (
        <div className="mt-3 p-3 bg-rose-50 border border-rose-200/50 rounded-lg">
          <p className="text-sm text-rose-700 flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* Quick ZIP suggestions */}
      {primaryZipCodes.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-xs text-forest-800/50">Popular in {cityName}:</span>
          {primaryZipCodes.slice(0, 3).map((suggestedZip) => (
            <button
              key={suggestedZip}
              type="button"
              onClick={() => {
                setZip(suggestedZip);
                validateZip(suggestedZip);
              }}
              className="text-xs px-2 py-1 rounded-full bg-white border border-cream-300 text-forest-800/70
                       hover:bg-sage-50 hover:border-sage-300 transition-colors"
            >
              {suggestedZip}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
