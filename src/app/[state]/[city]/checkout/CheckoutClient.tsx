'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DeliveryDate {
  date: string;
  description: string;
  price: number;
  available: boolean;
}

interface CheckoutClientProps {
  basePath: string;
  cityConfig: {
    cityName: string;
    stateAbbr: string;
    primaryZipCodes: string[];
  };
}

interface FormData {
  // Recipient
  recipientFirstName: string;
  recipientLastName: string;
  recipientPhone: string;
  recipientAddress1: string;
  recipientAddress2: string;
  recipientCity: string;
  recipientState: string;
  recipientZip: string;
  // Sender
  senderFirstName: string;
  senderLastName: string;
  senderEmail: string;
  senderPhone: string;
  // Card
  cardMessage: string;
  // Delivery
  deliveryDate: string;
  specialInstructions: string;
}

const initialFormData: FormData = {
  recipientFirstName: '',
  recipientLastName: '',
  recipientPhone: '',
  recipientAddress1: '',
  recipientAddress2: '',
  recipientCity: '',
  recipientState: '',
  recipientZip: '',
  senderFirstName: '',
  senderLastName: '',
  senderEmail: '',
  senderPhone: '',
  cardMessage: '',
  deliveryDate: '',
  specialInstructions: '',
};

export default function CheckoutClient({ basePath, cityConfig }: CheckoutClientProps) {
  const router = useRouter();
  const [hasCart, setHasCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
    recipientCity: cityConfig.cityName,
    recipientState: cityConfig.stateAbbr,
  });
  const [deliveryDates, setDeliveryDates] = useState<DeliveryDate[]>([]);
  const [loadingDates, setLoadingDates] = useState(false);

  // Check if cart exists
  useEffect(() => {
    checkCart();
  }, []);

  // Fetch delivery dates when ZIP changes
  useEffect(() => {
    if (formData.recipientZip.length === 5) {
      fetchDeliveryDates(formData.recipientZip);
    } else {
      setDeliveryDates([]);
      setFormData((prev) => ({ ...prev, deliveryDate: '' }));
    }
  }, [formData.recipientZip]);

  const checkCart = async () => {
    try {
      const response = await fetch(`/api${basePath}/cart`);
      const data = await response.json();

      if (data.success && data.data && !data.data.isEmpty) {
        setHasCart(true);
      }
    } catch (err) {
      // Cart check failed
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryDates = async (zip: string) => {
    setLoadingDates(true);
    try {
      const response = await fetch(
        `/api${basePath}/delivery-dates?zip=${encodeURIComponent(zip)}`
      );
      const data = await response.json();

      if (data.success && data.data?.dates) {
        setDeliveryDates(data.data.dates.filter((d: DeliveryDate) => d.available));
      }
    } catch (err) {
      // Failed to fetch dates
    } finally {
      setLoadingDates(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api${basePath}/checkout/place-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deliveryDate: formData.deliveryDate,
          recipient: {
            firstName: formData.recipientFirstName,
            lastName: formData.recipientLastName,
            phone: formData.recipientPhone,
            address1: formData.recipientAddress1,
            address2: formData.recipientAddress2 || undefined,
            city: formData.recipientCity,
            state: formData.recipientState,
            zip: formData.recipientZip,
          },
          sender: {
            firstName: formData.senderFirstName,
            lastName: formData.senderLastName,
            email: formData.senderEmail,
            phone: formData.senderPhone,
          },
          card: {
            message: formData.cardMessage,
          },
          specialInstructions: formData.specialInstructions || undefined,
          // TODO: Payment token would go here in production
          // paymentToken: 'tok_xxx',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to place order');
        return;
      }

      // Redirect to confirmation
      router.push(
        `${basePath}/checkout/confirmation?order=${encodeURIComponent(
          data.data.orderId || data.data.confirmationNumber
        )}`
      );
    } catch (err) {
      setError('Unable to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg className="w-8 h-8 animate-spin mx-auto text-primary-600" viewBox="0 0 24 24">
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
          <p className="text-gray-600 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  // No cart state
  if (!hasCart) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl mb-4 block">🛒</span>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some beautiful flowers before checking out.</p>
        <Link href={`${basePath}/flowers/birthday`} className="btn-primary">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
      {/* Left Column - Forms */}
      <div className="space-y-8">
        {/* Recipient Info */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Delivery Information</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="recipientFirstName" className="label">
                Recipient First Name *
              </label>
              <input
                type="text"
                id="recipientFirstName"
                name="recipientFirstName"
                value={formData.recipientFirstName}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
            <div>
              <label htmlFor="recipientLastName" className="label">
                Recipient Last Name *
              </label>
              <input
                type="text"
                id="recipientLastName"
                name="recipientLastName"
                value={formData.recipientLastName}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="recipientPhone" className="label">
              Recipient Phone *
            </label>
            <input
              type="tel"
              id="recipientPhone"
              name="recipientPhone"
              value={formData.recipientPhone}
              onChange={handleInputChange}
              className="input"
              placeholder="(555) 123-4567"
              required
            />
          </div>

          <div className="mt-4">
            <label htmlFor="recipientAddress1" className="label">
              Delivery Address *
            </label>
            <input
              type="text"
              id="recipientAddress1"
              name="recipientAddress1"
              value={formData.recipientAddress1}
              onChange={handleInputChange}
              className="input"
              placeholder="Street address"
              required
            />
          </div>

          <div className="mt-4">
            <label htmlFor="recipientAddress2" className="label">
              Apt, Suite, etc. (optional)
            </label>
            <input
              type="text"
              id="recipientAddress2"
              name="recipientAddress2"
              value={formData.recipientAddress2}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <label htmlFor="recipientCity" className="label">
                City *
              </label>
              <input
                type="text"
                id="recipientCity"
                name="recipientCity"
                value={formData.recipientCity}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
            <div>
              <label htmlFor="recipientState" className="label">
                State *
              </label>
              <input
                type="text"
                id="recipientState"
                name="recipientState"
                value={formData.recipientState}
                onChange={handleInputChange}
                className="input"
                maxLength={2}
                required
              />
            </div>
            <div>
              <label htmlFor="recipientZip" className="label">
                ZIP Code *
              </label>
              <input
                type="text"
                id="recipientZip"
                name="recipientZip"
                value={formData.recipientZip}
                onChange={handleInputChange}
                className="input"
                maxLength={5}
                pattern="\d{5}"
                required
              />
            </div>
          </div>
        </div>

        {/* Delivery Date */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Delivery Date</h2>

          {formData.recipientZip.length !== 5 ? (
            <p className="text-gray-500 text-sm">
              Enter the delivery ZIP code above to see available dates.
            </p>
          ) : loadingDates ? (
            <p className="text-gray-500 text-sm">Loading available dates...</p>
          ) : deliveryDates.length === 0 ? (
            <p className="text-red-600 text-sm">
              No delivery dates available for this ZIP code. Please check the address.
            </p>
          ) : (
            <select
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleInputChange}
              className="input"
              required
            >
              <option value="">Select a delivery date</option>
              {deliveryDates.map((date) => (
                <option key={date.date} value={date.date}>
                  {formatDate(date.date)} ({date.description})
                  {date.price > 0 ? ` - $${date.price.toFixed(2)}` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Sender Info */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Your Information</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="senderFirstName" className="label">
                Your First Name *
              </label>
              <input
                type="text"
                id="senderFirstName"
                name="senderFirstName"
                value={formData.senderFirstName}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
            <div>
              <label htmlFor="senderLastName" className="label">
                Your Last Name *
              </label>
              <input
                type="text"
                id="senderLastName"
                name="senderLastName"
                value={formData.senderLastName}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="senderEmail" className="label">
              Your Email *
            </label>
            <input
              type="email"
              id="senderEmail"
              name="senderEmail"
              value={formData.senderEmail}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>

          <div className="mt-4">
            <label htmlFor="senderPhone" className="label">
              Your Phone *
            </label>
            <input
              type="tel"
              id="senderPhone"
              name="senderPhone"
              value={formData.senderPhone}
              onChange={handleInputChange}
              className="input"
              placeholder="(555) 123-4567"
              required
            />
          </div>
        </div>

        {/* Card Message */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Card Message</h2>

          <div>
            <label htmlFor="cardMessage" className="label">
              Message to include with flowers *
            </label>
            <textarea
              id="cardMessage"
              name="cardMessage"
              value={formData.cardMessage}
              onChange={handleInputChange}
              className="input"
              rows={4}
              maxLength={1000}
              placeholder="Write your heartfelt message here..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.cardMessage.length}/1000 characters
            </p>
          </div>

          <div className="mt-4">
            <label htmlFor="specialInstructions" className="label">
              Special Instructions (optional)
            </label>
            <textarea
              id="specialInstructions"
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleInputChange}
              className="input"
              rows={2}
              maxLength={500}
              placeholder="Delivery instructions, gate codes, etc."
            />
          </div>
        </div>
      </div>

      {/* Right Column - Summary & Payment */}
      <div className="space-y-6">
        <div className="card p-6 sticky top-24">
          <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>

          <div className="border-b pb-4 mb-4">
            <Link
              href={`${basePath}/cart`}
              className="text-primary-600 hover:text-primary-700 text-sm"
            >
              ← Edit Cart
            </Link>
          </div>

          {/* Payment Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Payment processing is not active. Orders will be
              simulated for testing purposes.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm mb-4 animate-fade-in">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || deliveryDates.length === 0}
            className="btn-primary w-full py-3 text-lg"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
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
                Processing...
              </span>
            ) : (
              'Place Order'
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            By placing this order, you agree to our terms of service.
          </p>
        </div>
      </div>
    </form>
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
