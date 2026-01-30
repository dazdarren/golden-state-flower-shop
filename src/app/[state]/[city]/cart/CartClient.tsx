'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CartZipChecker from '@/components/CartZipChecker';

interface CartItem {
  itemId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Cart {
  cartId: string | null;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  isEmpty: boolean;
  mock?: boolean;
}

interface CartClientProps {
  basePath: string;
  cityName: string;
  primaryZipCodes?: string[];
}

export default function CartClient({ basePath, cityName, primaryZipCodes = [] }: CartClientProps) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [zipValidated, setZipValidated] = useState(false);
  const [validatedDeliveryFee, setValidatedDeliveryFee] = useState<number | null>(null);

  const handleValidZip = (zip: string, deliveryFee: number) => {
    setZipValidated(true);
    setValidatedDeliveryFee(deliveryFee);
  };

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch(`/api${basePath}/cart`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to fetch cart');
        return;
      }

      setCart(data.data);
    } catch (err) {
      setError('Unable to load cart. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setRemovingItem(itemId);

    try {
      const response = await fetch(`/api${basePath}/cart/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to remove item');
        return;
      }

      // Refresh cart
      fetchCart();
    } catch (err) {
      setError('Unable to remove item. Please try again.');
    } finally {
      setRemovingItem(null);
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return;

    setLoading(true);

    try {
      const response = await fetch(`/api${basePath}/cart/destroy`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to clear cart');
        return;
      }

      // Refresh cart
      fetchCart();
    } catch (err) {
      setError('Unable to clear cart. Please try again.');
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
          <p className="text-gray-600 mt-2">Loading cart...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !cart) {
    return (
      <div className="text-center py-12">
        <div className="p-4 bg-red-50 text-red-700 rounded-lg inline-block">
          {error}
        </div>
        <button onClick={fetchCart} className="btn-primary mt-4">
          Try Again
        </button>
      </div>
    );
  }

  // Empty cart state
  if (!cart || cart.isEmpty) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl mb-4 block">🛒</span>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">
          Browse our beautiful flower arrangements and add something special.
        </p>
        <Link href={`${basePath}/flowers/birthday`} className="btn-primary">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {cart.mock && (
          <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm">
            Demo mode - cart changes won&apos;t persist
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm animate-fade-in">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {cart.items.map((item) => (
          <div key={item.itemId} className="card p-4 flex gap-4">
            {/* Image */}
            <div className="w-24 h-24 bg-cream-100 rounded-lg flex-shrink-0 overflow-hidden">
              <img
                src={item.image || '/images/placeholder-flower.svg'}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder-flower.svg';
                }}
              />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <Link
                href={`${basePath}/product/${item.sku}`}
                className="font-medium text-gray-900 hover:text-primary-600 line-clamp-1"
              >
                {item.name}
              </Link>
              <p className="text-sm text-gray-500 mt-1">SKU: {item.sku}</p>
              <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity}</p>
            </div>

            {/* Price & Remove */}
            <div className="text-right">
              <p className="font-bold text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => handleRemoveItem(item.itemId)}
                disabled={removingItem === item.itemId}
                className="text-sm text-red-600 hover:text-red-700 mt-2 disabled:opacity-50 py-2 px-3 -mr-3"
              >
                {removingItem === item.itemId ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        ))}

        {/* Clear cart button */}
        <div className="pt-4">
          <button
            onClick={handleClearCart}
            className="text-sm text-gray-500 hover:text-gray-700 py-2"
          >
            Clear Cart
          </button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="card p-6 sticky top-20 lg:top-24 space-y-6">
          {/* ZIP Validation */}
          <CartZipChecker
            basePath={basePath}
            cityName={cityName}
            onValidZip={handleValidZip}
            primaryZipCodes={primaryZipCodes}
          />

          <div>
            <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium">
                  {validatedDeliveryFee !== null
                    ? validatedDeliveryFee === 0
                      ? 'Free'
                      : `$${validatedDeliveryFee.toFixed(2)}`
                    : cart.deliveryFee > 0
                    ? `$${cart.deliveryFee.toFixed(2)}`
                    : 'Enter ZIP above'}
                </span>
              </div>
              {cart.serviceFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium">${cart.serviceFee.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">
                  ${((validatedDeliveryFee ?? cart.deliveryFee) + cart.subtotal + cart.serviceFee).toFixed(2)}
                </span>
              </div>
            </div>

            {zipValidated ? (
              <Link href={`${basePath}/checkout`} className="btn-primary w-full mt-6">
                Proceed to Checkout
              </Link>
            ) : (
              <button
                disabled
                className="w-full mt-6 px-6 py-3 rounded-full bg-gray-300 text-gray-500 font-medium cursor-not-allowed"
              >
                Verify ZIP to Continue
              </button>
            )}

            <p className="text-xs text-gray-500 text-center mt-4">
              {zipValidated
                ? `Delivering to ${cityName}`
                : 'Please verify your delivery ZIP code above'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
