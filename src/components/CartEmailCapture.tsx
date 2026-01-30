'use client';

import { useState, useEffect } from 'react';

interface CartEmailCaptureProps {
  cartHasItems: boolean;
  onEmailSubmit?: (email: string) => void;
}

const STORAGE_KEY = 'cart_email_captured';

export default function CartEmailCapture({ cartHasItems, onEmailSubmit }: CartEmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if already captured
    const captured = localStorage.getItem(STORAGE_KEY);
    if (captured) {
      setIsSubmitted(true);
      return;
    }

    // Show after a delay if cart has items
    if (cartHasItems) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [cartHasItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      // Store that we've captured email
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsSubmitted(true);

      // Call callback if provided
      onEmailSubmit?.(email);

      // You could also send to your API here
      // await fetch('/api/cart/email', { method: 'POST', body: JSON.stringify({ email }) });
    } catch {
      // Silently fail
    }
  };

  if (!cartHasItems || !isVisible || isSubmitted) {
    return null;
  }

  return (
    <div className="bg-sage-50 border border-sage-200 rounded-xl p-5 mt-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-forest-900 mb-1">Save your cart</h3>
          <p className="text-sm text-forest-800/60 mb-3">
            Enter your email and we'll save your cart so you can complete your order later.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-3 py-2 text-sm border border-sage-200 rounded-lg
                       focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-sage-600 text-white text-sm font-medium rounded-lg
                       hover:bg-sage-700 transition-colors"
            >
              Save
            </button>
          </form>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-forest-800/40 hover:text-forest-800/60 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
