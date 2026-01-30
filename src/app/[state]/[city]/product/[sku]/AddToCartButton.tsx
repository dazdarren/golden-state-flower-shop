'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';

interface AddToCartButtonProps {
  sku: string;
  basePath: string;
  productName?: string;
  disabled?: boolean;
}

export default function AddToCartButton({
  sku,
  basePath,
  productName = 'Item',
  disabled = false,
}: AddToCartButtonProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api${basePath}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sku,
          quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to add to cart');
        showToast(data.error || 'Failed to add to cart', 'error');
        return;
      }

      // Show success toast with option to view cart
      showToast(`${productName} added to cart!`, 'success', {
        action: {
          label: 'View Cart',
          onClick: () => router.push(`${basePath}/cart`),
        },
      });
    } catch (err) {
      setError('Unable to add to cart. Please try again.');
      showToast('Unable to add to cart. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
          Quantity:
        </label>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
            disabled={disabled}
          >
            −
          </button>
          <input
            id="quantity"
            type="number"
            min="1"
            max="99"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.min(99, Math.max(1, parseInt(e.target.value) || 1)))
            }
            className="w-12 text-center border-0 focus:ring-0"
            disabled={disabled}
          />
          <button
            type="button"
            onClick={() => setQuantity(Math.min(99, quantity + 1))}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
            disabled={disabled}
          >
            +
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAddToCart}
        disabled={disabled || loading}
        className="w-full btn-primary py-3 text-lg"
      >
        {loading ? (
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
            Adding...
          </span>
        ) : disabled ? (
          'Currently Unavailable'
        ) : (
          'Add to Cart'
        )}
      </button>

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm animate-fade-in">
          {error}
        </div>
      )}
    </div>
  );
}
