'use client';

import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';

declare global {
  interface Window {
    Accept?: {
      dispatchData: (
        secureData: AuthorizeNetSecureData,
        callback: (response: AuthorizeNetResponse) => void
      ) => void;
    };
  }
}

interface AuthorizeNetSecureData {
  authData: {
    clientKey: string;
    apiLoginID: string;
  };
  cardData: {
    cardNumber: string;
    month: string;
    year: string;
    cardCode: string;
  };
}

interface AuthorizeNetResponse {
  messages: {
    resultCode: 'Ok' | 'Error';
    message: Array<{ code: string; text: string }>;
  };
  opaqueData?: {
    dataDescriptor: string;
    dataValue: string;
  };
}

export interface AuthorizeNetCardRef {
  createToken: () => Promise<{ token?: string; error?: string }>;
}

interface AuthorizeNetCardElementProps {
  basePath: string;
  onReady?: () => void;
  onError?: (error: string) => void;
  onChange?: (complete: boolean) => void;
}

const AuthorizeNetCardElement = forwardRef<AuthorizeNetCardRef, AuthorizeNetCardElementProps>(
  ({ basePath, onReady, onError, onChange }, ref) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [authConfig, setAuthConfig] = useState<{
      username: string;
      key: string;
      url: string;
    } | null>(null);

    // Card input state
    const [cardNumber, setCardNumber] = useState('');
    const [expMonth, setExpMonth] = useState('');
    const [expYear, setExpYear] = useState('');
    const [cvv, setCvv] = useState('');

    const scriptLoadedRef = useRef(false);

    // Fetch AuthorizeNet config and load script
    useEffect(() => {
      fetchAuthConfig();
    }, []);

    const fetchAuthConfig = async () => {
      try {
        const response = await fetch(`/api${basePath}/payment/authorizenet-key`);
        const data = await response.json();

        if (!data.success || !data.data) {
          throw new Error(data.error || 'Failed to load payment configuration');
        }

        const config = {
          username: data.data.username,
          key: data.data.key,
          url: data.data.url,
        };

        setAuthConfig(config);
        loadAcceptJs(config.url);
      } catch (err) {
        setError('Failed to initialize payment system');
        setLoading(false);
        onError?.('Failed to initialize payment system');
      }
    };

    const loadAcceptJs = (scriptUrl: string) => {
      if (scriptLoadedRef.current || window.Accept) {
        setLoading(false);
        onReady?.();
        return;
      }

      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
        setLoading(false);
        onReady?.();
      };
      script.onerror = () => {
        setError('Failed to load payment system');
        setLoading(false);
        onError?.('Failed to load payment system');
      };
      document.head.appendChild(script);
    };

    // Check if form is complete
    useEffect(() => {
      const isComplete =
        cardNumber.replace(/\s/g, '').length >= 15 &&
        expMonth.length === 2 &&
        expYear.length === 2 &&
        cvv.length >= 3;
      onChange?.(isComplete);
    }, [cardNumber, expMonth, expYear, cvv, onChange]);

    // Format card number with spaces
    const formatCardNumber = (value: string) => {
      const cleaned = value.replace(/\D/g, '');
      const groups = cleaned.match(/.{1,4}/g);
      return groups ? groups.join(' ').substring(0, 19) : '';
    };

    useImperativeHandle(ref, () => ({
      createToken: async () => {
        if (!window.Accept || !authConfig) {
          return { error: 'Payment system not ready' };
        }

        const cleanCardNumber = cardNumber.replace(/\s/g, '');

        if (cleanCardNumber.length < 15) {
          return { error: 'Please enter a valid card number' };
        }

        if (!expMonth || !expYear) {
          return { error: 'Please enter card expiration date' };
        }

        if (cvv.length < 3) {
          return { error: 'Please enter CVV' };
        }

        return new Promise((resolve) => {
          const secureData: AuthorizeNetSecureData = {
            authData: {
              clientKey: authConfig.key,
              apiLoginID: authConfig.username,
            },
            cardData: {
              cardNumber: cleanCardNumber,
              month: expMonth,
              year: expYear,
              cardCode: cvv,
            },
          };

          window.Accept!.dispatchData(secureData, (response: AuthorizeNetResponse) => {
            if (response.messages.resultCode === 'Error') {
              const errorMessage = response.messages.message[0]?.text || 'Payment processing failed';
              setError(errorMessage);
              resolve({ error: errorMessage });
            } else if (response.opaqueData) {
              // The token is the dataValue
              resolve({ token: response.opaqueData.dataValue });
            } else {
              resolve({ error: 'Failed to process payment' });
            }
          });
        });
      },
    }));

    if (loading) {
      return (
        <div className="space-y-4">
          <div className="h-12 bg-cream-100 rounded-xl animate-pulse" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-12 bg-cream-100 rounded-xl animate-pulse" />
            <div className="h-12 bg-cream-100 rounded-xl animate-pulse" />
            <div className="h-12 bg-cream-100 rounded-xl animate-pulse" />
          </div>
          <p className="text-sm text-forest-800/60 text-center">Loading secure payment...</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-forest-900 mb-1">
            Card Number
          </label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 transition-colors"
            autoComplete="cc-number"
          />
        </div>

        {/* Expiry and CVV */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-forest-900 mb-1">
              Month
            </label>
            <input
              type="text"
              value={expMonth}
              onChange={(e) => setExpMonth(e.target.value.replace(/\D/g, '').substring(0, 2))}
              placeholder="MM"
              maxLength={2}
              className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 transition-colors"
              autoComplete="cc-exp-month"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest-900 mb-1">
              Year
            </label>
            <input
              type="text"
              value={expYear}
              onChange={(e) => setExpYear(e.target.value.replace(/\D/g, '').substring(0, 2))}
              placeholder="YY"
              maxLength={2}
              className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 transition-colors"
              autoComplete="cc-exp-year"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest-900 mb-1">
              CVV
            </label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
              placeholder="123"
              maxLength={4}
              className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 transition-colors"
              autoComplete="cc-csc"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <p className="text-xs text-forest-800/50">
          Your payment is processed securely. Card details are sent directly to the payment processor.
        </p>
      </div>
    );
  }
);

AuthorizeNetCardElement.displayName = 'AuthorizeNetCardElement';

export default AuthorizeNetCardElement;
