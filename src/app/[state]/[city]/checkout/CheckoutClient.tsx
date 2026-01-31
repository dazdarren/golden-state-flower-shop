'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthorizeNetCardElement, { AuthorizeNetCardRef } from '@/components/AuthorizeNetCardElement';
import { supabase } from '@/lib/supabase';
import { PaymentIcons } from '@/components/TrustBadges';

interface DeliveryDate {
  date: string;
  formatted: string;
  available: boolean;
}

interface CartItem {
  itemId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
}

interface Cart {
  cartId: string | null;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number | null; // null = not yet known (ZIP not validated)
  serviceFee: number;
  total: number;
  isEmpty: boolean;
}

interface OrderTotal {
  subtotal: number;
  delivery: number;
  tax: number;
  total: number;
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
  recipientFirstName: string;
  recipientLastName: string;
  recipientPhone: string;
  recipientAddress1: string;
  recipientAddress2: string;
  recipientCity: string;
  recipientState: string;
  recipientZip: string;
  senderFirstName: string;
  senderLastName: string;
  senderEmail: string;
  senderPhone: string;
  cardMessage: string;
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

// Checkout step definitions
const CHECKOUT_STEPS = [
  { id: 'delivery', label: 'Delivery', shortLabel: 'Delivery' },
  { id: 'date', label: 'Date', shortLabel: 'Date' },
  { id: 'sender', label: 'Your Info', shortLabel: 'Info' },
  { id: 'payment', label: 'Payment', shortLabel: 'Pay' },
] as const;

type CheckoutStep = typeof CHECKOUT_STEPS[number]['id'];

export default function CheckoutClient({ basePath, cityConfig }: CheckoutClientProps) {
  const router = useRouter();
  const paymentRef = useRef<AuthorizeNetCardRef>(null);

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
    recipientCity: cityConfig.cityName,
    recipientState: cityConfig.stateAbbr,
  });
  const [deliveryDates, setDeliveryDates] = useState<DeliveryDate[]>([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [orderTotal, setOrderTotal] = useState<OrderTotal | null>(null);
  const [loadingTotal, setLoadingTotal] = useState(false);

  // Calculate current checkout step based on form completion
  const currentStep = useMemo<CheckoutStep>(() => {
    const hasDeliveryInfo = formData.recipientFirstName && formData.recipientLastName &&
      formData.recipientPhone && formData.recipientAddress1 && formData.recipientCity &&
      formData.recipientState && formData.recipientZip.length === 5;

    const hasDeliveryDate = !!formData.deliveryDate;

    const hasSenderInfo = formData.senderFirstName && formData.senderLastName &&
      formData.senderEmail && formData.senderPhone && formData.cardMessage;

    if (!hasDeliveryInfo) return 'delivery';
    if (!hasDeliveryDate) return 'date';
    if (!hasSenderInfo) return 'sender';
    return 'payment';
  }, [formData]);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
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

  // Fetch order total when ZIP and delivery date are set
  useEffect(() => {
    if (formData.recipientZip.length === 5 && formData.deliveryDate) {
      fetchOrderTotal(formData.recipientZip, formData.deliveryDate);
    } else {
      setOrderTotal(null);
    }
  }, [formData.recipientZip, formData.deliveryDate]);

  const fetchCart = async () => {
    try {
      const response = await fetch(`/api${basePath}/cart`);
      const data = await response.json();

      if (data.success && data.data && !data.data.isEmpty) {
        setCart(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
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
      console.error('Failed to fetch dates:', err);
    } finally {
      setLoadingDates(false);
    }
  };

  const fetchOrderTotal = async (zip: string, date: string) => {
    setLoadingTotal(true);
    try {
      const response = await fetch(
        `/api${basePath}/checkout/get-total?zip=${encodeURIComponent(zip)}&date=${encodeURIComponent(date)}`
      );
      const data = await response.json();

      if (data.success && data.data) {
        setOrderTotal(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch order total:', err);
    } finally {
      setLoadingTotal(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Create payment token
    if (!paymentRef.current) {
      setError('Payment system not ready. Please try again.');
      setSubmitting(false);
      return;
    }

    const tokenResult = await paymentRef.current.createToken();

    if (tokenResult.error) {
      setError(tokenResult.error);
      setSubmitting(false);
      return;
    }

    if (!tokenResult.token) {
      setError('Failed to process payment. Please try again.');
      setSubmitting(false);
      return;
    }

    try {
      // Get auth token if user is logged in
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }
      }

      const response = await fetch(`/api${basePath}/checkout/place-order`, {
        method: 'POST',
        headers,
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
          paymentToken: tokenResult.token,
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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <svg className="w-10 h-10 animate-spin mx-auto text-sage-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-forest-800/60 mt-4">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // No cart state
  if (!cart || cart.isEmpty) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cream-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-semibold text-forest-900 mb-3">Your cart is empty</h2>
        <p className="text-forest-800/60 mb-8">Add some beautiful flowers before checking out.</p>
        <Link href={`${basePath}/flowers/birthday`} className="btn-primary">
          Browse Flowers
        </Link>
      </div>
    );
  }

  const displayTotal = orderTotal?.total ?? cart.total;

  return (
    <>
      {/* Mobile Progress Indicator */}
      <div className="lg:hidden sticky top-0 z-10 bg-white border-b border-cream-200 -mx-5 px-5 mb-6">
        <div className="flex items-center justify-between py-3">
          {CHECKOUT_STEPS.map((step, index) => {
            const stepIndex = CHECKOUT_STEPS.findIndex(s => s.id === currentStep);
            const isActive = step.id === currentStep;
            const isCompleted = index < stepIndex;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors
                      ${isCompleted ? 'bg-sage-600 text-white' :
                        isActive ? 'bg-sage-600 text-white' :
                        'bg-cream-200 text-forest-800/40'}`}
                  >
                    {isCompleted ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`mt-1 text-[10px] font-medium
                    ${isActive ? 'text-sage-600' : 'text-forest-800/40'}`}>
                    {step.shortLabel}
                  </span>
                </div>
                {index < CHECKOUT_STEPS.length - 1 && (
                  <div className={`w-full h-0.5 mx-1 -mt-4
                    ${index < stepIndex ? 'bg-sage-600' : 'bg-cream-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8 pb-24 lg:pb-0">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Information */}
          <div className="bg-white rounded-2xl border border-cream-200 p-6">
            <h2 className="font-display text-xl font-semibold text-forest-900 mb-6">
              Delivery Information
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="recipientFirstName" className="block text-sm font-medium text-forest-900 mb-1">
                  Recipient First Name *
                </label>
                <input
                  type="text"
                  id="recipientFirstName"
                  name="recipientFirstName"
                  value={formData.recipientFirstName}
                  onChange={handleInputChange}
                  autoComplete="given-name"
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="recipientLastName" className="block text-sm font-medium text-forest-900 mb-1">
                  Recipient Last Name *
                </label>
                <input
                  type="text"
                  id="recipientLastName"
                  name="recipientLastName"
                  value={formData.recipientLastName}
                  onChange={handleInputChange}
                  autoComplete="family-name"
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="recipientPhone" className="block text-sm font-medium text-forest-900 mb-1">
                Recipient Phone *
              </label>
              <input
                type="tel"
                id="recipientPhone"
                name="recipientPhone"
                value={formData.recipientPhone}
                onChange={handleInputChange}
                inputMode="tel"
                autoComplete="tel"
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 transition-colors"
                placeholder="(555) 123-4567"
                required
              />
            </div>

            <div className="mt-4">
              <label htmlFor="recipientAddress1" className="block text-sm font-medium text-forest-900 mb-1">
                Delivery Address *
              </label>
              <input
                type="text"
                id="recipientAddress1"
                name="recipientAddress1"
                value={formData.recipientAddress1}
                onChange={handleInputChange}
                autoComplete="street-address"
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 transition-colors"
                placeholder="Street address"
                required
              />
            </div>

            <div className="mt-4">
              <label htmlFor="recipientAddress2" className="block text-sm font-medium text-forest-900 mb-1">
                Apt, Suite, etc.
              </label>
              <input
                type="text"
                id="recipientAddress2"
                name="recipientAddress2"
                value={formData.recipientAddress2}
                onChange={handleInputChange}
                autoComplete="address-line2"
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div>
                <label htmlFor="recipientCity" className="block text-sm font-medium text-forest-900 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  id="recipientCity"
                  name="recipientCity"
                  value={formData.recipientCity}
                  onChange={handleInputChange}
                  autoComplete="address-level2"
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="recipientState" className="block text-sm font-medium text-forest-900 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  id="recipientState"
                  name="recipientState"
                  value={formData.recipientState}
                  onChange={handleInputChange}
                  autoComplete="address-level1"
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 transition-colors"
                  maxLength={2}
                  required
                />
              </div>
              <div>
                <label htmlFor="recipientZip" className="block text-sm font-medium text-forest-900 mb-1">
                  ZIP *
                </label>
                <input
                  type="text"
                  id="recipientZip"
                  name="recipientZip"
                  value={formData.recipientZip}
                  onChange={handleInputChange}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 transition-colors"
                  maxLength={5}
                  pattern="\d{5}"
                  required
                />
              </div>
            </div>
          </div>

          {/* Delivery Date */}
          <div className="bg-white rounded-2xl border border-cream-200 p-6">
            <h2 className="font-display text-xl font-semibold text-forest-900 mb-6">
              Delivery Date
            </h2>

            {formData.recipientZip.length !== 5 ? (
              <p className="text-forest-800/60 text-sm">
                Enter the delivery ZIP code above to see available dates.
              </p>
            ) : loadingDates ? (
              <div className="flex items-center gap-2 text-forest-800/60">
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Loading available dates...</span>
              </div>
            ) : deliveryDates.length === 0 ? (
              <p className="text-red-600 text-sm">
                No delivery dates available for this ZIP code.
              </p>
            ) : (
              <select
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 transition-colors"
                required
              >
                <option value="">Select a delivery date</option>
                {deliveryDates.map((date) => (
                  <option key={date.date} value={date.date}>
                    {date.formatted}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Sender Info */}
          <div className="bg-white rounded-2xl border border-cream-200 p-6">
            <h2 className="font-display text-xl font-semibold text-forest-900 mb-6">
              Your Information
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="senderFirstName" className="block text-sm font-medium text-forest-900 mb-1">
                  Your First Name *
                </label>
                <input
                  type="text"
                  id="senderFirstName"
                  name="senderFirstName"
                  value={formData.senderFirstName}
                  onChange={handleInputChange}
                  autoComplete="given-name"
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="senderLastName" className="block text-sm font-medium text-forest-900 mb-1">
                  Your Last Name *
                </label>
                <input
                  type="text"
                  id="senderLastName"
                  name="senderLastName"
                  value={formData.senderLastName}
                  onChange={handleInputChange}
                  autoComplete="family-name"
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="senderEmail" className="block text-sm font-medium text-forest-900 mb-1">
                Your Email *
              </label>
              <input
                type="email"
                id="senderEmail"
                name="senderEmail"
                value={formData.senderEmail}
                onChange={handleInputChange}
                inputMode="email"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 transition-colors"
                required
              />
            </div>

            <div className="mt-4">
              <label htmlFor="senderPhone" className="block text-sm font-medium text-forest-900 mb-1">
                Your Phone *
              </label>
              <input
                type="tel"
                id="senderPhone"
                name="senderPhone"
                value={formData.senderPhone}
                onChange={handleInputChange}
                inputMode="tel"
                autoComplete="tel"
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 transition-colors"
                placeholder="(555) 123-4567"
                required
              />
            </div>
          </div>

          {/* Card Message */}
          <div className="bg-white rounded-2xl border border-cream-200 p-6">
            <h2 className="font-display text-xl font-semibold text-forest-900 mb-6">
              Card Message
            </h2>

            <div>
              <label htmlFor="cardMessage" className="block text-sm font-medium text-forest-900 mb-1">
                Message to include with flowers *
              </label>
              <textarea
                id="cardMessage"
                name="cardMessage"
                value={formData.cardMessage}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 transition-colors resize-none"
                rows={4}
                maxLength={1000}
                placeholder="Write your heartfelt message here..."
                required
              />
              <p className="text-xs text-forest-800/50 mt-1">
                {formData.cardMessage.length}/1000 characters
              </p>
            </div>

            <div className="mt-4">
              <label htmlFor="specialInstructions" className="block text-sm font-medium text-forest-900 mb-1">
                Special Instructions
              </label>
              <textarea
                id="specialInstructions"
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 transition-colors resize-none"
                rows={2}
                maxLength={500}
                placeholder="Delivery instructions, gate codes, etc."
              />
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-cream-200 p-6">
            <h2 className="font-display text-xl font-semibold text-forest-900 mb-6">
              Payment
            </h2>

            <AuthorizeNetCardElement
              ref={paymentRef}
              basePath={basePath}
              onChange={setCardComplete}
            />
          </div>
        </div>

        {/* Right Column - Order Summary (Desktop) */}
        <div className="lg:col-span-1 hidden lg:block">
          <div className="bg-white rounded-2xl border border-cream-200 p-6 sticky top-20 lg:top-24">
            <h2 className="font-display text-xl font-semibold text-forest-900 mb-6">
              Order Summary
            </h2>

            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div key={item.itemId} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-forest-900">{item.name}</p>
                    <p className="text-sm text-forest-800/60">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-forest-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-cream-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-forest-800/60">Subtotal</span>
                <span className="text-forest-900">
                  ${(orderTotal?.subtotal ?? cart.subtotal).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-forest-800/60">Delivery</span>
                <span className="text-forest-900">
                  {orderTotal?.delivery !== undefined
                    ? `$${orderTotal.delivery.toFixed(2)}`
                    : 'Enter ZIP & date'}
                </span>
              </div>
              {(orderTotal?.tax ?? 0) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-forest-800/60">Tax</span>
                  <span className="text-forest-900">${orderTotal!.tax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold pt-2 border-t border-cream-200">
                <span className="text-forest-900">Total</span>
                <span className="text-sage-600">
                  {loadingTotal ? (
                    <span className="text-forest-800/40">Calculating...</span>
                  ) : (
                    `$${displayTotal.toFixed(2)}`
                  )}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href={`${basePath}/cart`}
                className="text-sage-600 hover:text-sage-700 text-sm font-medium"
              >
                Edit Cart
              </Link>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || deliveryDates.length === 0 || !cardComplete}
              className="w-full mt-6 py-4 bg-sage-600 hover:bg-sage-700 disabled:bg-cream-300
                       text-white disabled:text-forest-800/40 font-semibold rounded-xl
                       transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing Order...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Place Order - ${displayTotal.toFixed(2)}
                </>
              )}
            </button>

            <p className="text-xs text-forest-800/50 text-center mt-4 flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Your payment is secure and encrypted
            </p>

            {/* Payment method icons */}
            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-cream-200">
              <PaymentIcons size="sm" />
            </div>
          </div>
        </div>
      </form>

      {/* Mobile Sticky Order Summary */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-cream-200 shadow-lg z-40 safe-area-bottom">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <span className="text-sm text-forest-800/60">Total</span>
            <span className="ml-2 text-xl font-bold text-forest-900">
              {loadingTotal ? '...' : `$${displayTotal.toFixed(2)}`}
            </span>
          </div>
          <button
            type="submit"
            form="checkout-form"
            onClick={handleSubmit as unknown as React.MouseEventHandler<HTMLButtonElement>}
            disabled={submitting || deliveryDates.length === 0 || !cardComplete}
            className="px-6 py-3 bg-sage-600 hover:bg-sage-700 disabled:bg-cream-300
                     text-white disabled:text-forest-800/40 font-semibold rounded-xl
                     transition-colors duration-200 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Place Order
              </>
            )}
          </button>
        </div>

        {/* Mobile Error Display */}
        {error && (
          <div className="px-5 pb-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
