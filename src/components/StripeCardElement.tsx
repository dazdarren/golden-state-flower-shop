'use client';

import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';

declare global {
  interface Window {
    Stripe?: (key: string) => StripeInstance;
  }
}

interface StripeInstance {
  elements: () => StripeElements;
  createToken: (card: StripeCardElement) => Promise<StripeTokenResult>;
}

interface StripeElements {
  create: (type: string, options?: Record<string, unknown>) => StripeCardElement;
}

interface StripeCardElement {
  mount: (el: string | HTMLElement) => void;
  unmount: () => void;
  on: (event: string, handler: (event: StripeCardEvent) => void) => void;
  destroy: () => void;
}

interface StripeCardEvent {
  complete: boolean;
  empty: boolean;
  error?: {
    message: string;
  };
}

interface StripeTokenResult {
  token?: {
    id: string;
  };
  error?: {
    message: string;
  };
}

export interface StripeCardRef {
  createToken: () => Promise<{ token?: string; error?: string }>;
}

interface StripeCardElementProps {
  onReady?: () => void;
  onError?: (error: string) => void;
  onChange?: (complete: boolean) => void;
}

const StripeCardElement = forwardRef<StripeCardRef, StripeCardElementProps>(
  ({ onReady, onError, onChange }, ref) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const stripeRef = useRef<StripeInstance | null>(null);
    const cardRef = useRef<StripeCardElement | null>(null);
    const mountedRef = useRef(false);

    useEffect(() => {
      // Load Stripe.js
      if (window.Stripe) {
        initializeStripe();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      script.onload = initializeStripe;
      script.onerror = () => {
        setError('Failed to load payment system');
        setLoading(false);
      };
      document.head.appendChild(script);

      return () => {
        if (cardRef.current) {
          cardRef.current.destroy();
        }
      };
    }, []);

    const initializeStripe = () => {
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

      if (!publishableKey) {
        setError('Payment configuration missing');
        setLoading(false);
        return;
      }

      if (!window.Stripe) {
        setError('Payment system unavailable');
        setLoading(false);
        return;
      }

      try {
        stripeRef.current = window.Stripe(publishableKey);
        const elements = stripeRef.current.elements();

        cardRef.current = elements.create('card', {
          style: {
            base: {
              fontSize: '16px',
              color: '#1a2e1a',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              '::placeholder': {
                color: '#6b7c6b',
              },
            },
            invalid: {
              color: '#dc2626',
              iconColor: '#dc2626',
            },
          },
        });

        // Wait for mount point to be available
        const waitForMount = () => {
          const mountPoint = document.getElementById('stripe-card-element');
          if (mountPoint && !mountedRef.current) {
            mountedRef.current = true;
            cardRef.current!.mount('#stripe-card-element');

            cardRef.current!.on('ready', () => {
              setLoading(false);
              onReady?.();
            });

            cardRef.current!.on('change', (event: StripeCardEvent) => {
              if (event.error) {
                setError(event.error.message);
                onError?.(event.error.message);
              } else {
                setError(null);
              }
              onChange?.(event.complete);
            });
          } else if (!mountedRef.current) {
            requestAnimationFrame(waitForMount);
          }
        };

        waitForMount();
      } catch (err) {
        setError('Failed to initialize payment');
        setLoading(false);
      }
    };

    useImperativeHandle(ref, () => ({
      createToken: async () => {
        if (!stripeRef.current || !cardRef.current) {
          return { error: 'Payment system not ready' };
        }

        try {
          const result = await stripeRef.current.createToken(cardRef.current);

          if (result.error) {
            return { error: result.error.message };
          }

          if (result.token) {
            return { token: result.token.id };
          }

          return { error: 'Failed to process card' };
        } catch (err) {
          return { error: 'Payment processing failed' };
        }
      },
    }));

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-forest-900">
          Card Details
        </label>
        <div
          className={`
            relative p-4 border rounded-xl bg-white transition-colors
            ${error ? 'border-red-300' : 'border-cream-300 focus-within:border-sage-400'}
          `}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-cream-50 rounded-xl">
              <div className="flex items-center gap-2 text-forest-800/60">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-sm">Loading payment...</span>
              </div>
            </div>
          )}
          <div id="stripe-card-element" className="min-h-[24px]" />
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        <p className="text-xs text-forest-800/50">
          Your payment is processed securely. We never see your card details.
        </p>
      </div>
    );
  }
);

StripeCardElement.displayName = 'StripeCardElement';

export default StripeCardElement;
