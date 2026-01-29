'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface SubscriptionTiersProps {
  basePath: string;
  cityName: string;
}

const tiers = [
  {
    id: 'classic',
    name: 'Classic',
    price: 65,
    description: 'Beautiful seasonal bouquet',
    popular: false,
    features: [
      'Seasonal flower bouquet',
      'Hand-arranged by local florists',
      'Free delivery',
      'Skip or pause anytime',
    ],
    notIncluded: [
      'Vase included',
      'Priority support',
      'Exclusive arrangements',
    ],
  },
  {
    id: 'luxe',
    name: 'Luxe',
    price: 95,
    description: 'Premium arrangement + vase',
    popular: true,
    features: [
      'Premium floral arrangement',
      'Elegant glass vase included',
      'Hand-arranged by local florists',
      'Free delivery',
      'Skip or pause anytime',
      'Priority customer support',
    ],
    notIncluded: [
      'Exclusive arrangements',
    ],
  },
  {
    id: 'grand',
    name: 'Grand',
    price: 145,
    description: 'Luxury centerpiece + extras',
    popular: false,
    features: [
      'Luxury statement centerpiece',
      'Designer vase included',
      'Hand-arranged by master florists',
      'Free priority delivery',
      'Skip or pause anytime',
      'Dedicated account manager',
      'Exclusive subscriber-only arrangements',
    ],
    notIncluded: [],
  },
];

export default function SubscriptionTiers({ basePath, cityName }: SubscriptionTiersProps) {
  const { user, session, isConfigured } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [giftMode, setGiftMode] = useState(false);

  const handleSubscribe = async (tierId: string) => {
    if (!isConfigured) {
      // In demo mode, show a message
      alert('Subscriptions require Stripe to be configured. Please set up Stripe environment variables.');
      return;
    }

    if (!user || !session) {
      // Redirect to login first
      window.location.href = `/auth/login?redirect=${encodeURIComponent(`${basePath}/subscribe`)}`;
      return;
    }

    setLoading(tierId);

    try {
      const response = await fetch('/api/subscriptions/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          tier: tierId,
          gift: giftMode,
          successUrl: `${window.location.origin}${basePath}/subscribe/success`,
          cancelUrl: `${window.location.origin}${basePath}/subscribe`,
        }),
      });

      const data = await response.json();

      if (data.success && data.data?.checkoutUrl) {
        window.location.href = data.data.checkoutUrl;
      } else {
        alert(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      {/* Gift Toggle */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center gap-3 p-1.5 bg-cream-100 rounded-full">
          <button
            onClick={() => setGiftMode(false)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              !giftMode
                ? 'bg-white shadow-soft text-forest-900'
                : 'text-forest-800/60 hover:text-forest-900'
            }`}
          >
            For Myself
          </button>
          <button
            onClick={() => setGiftMode(true)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              giftMode
                ? 'bg-white shadow-soft text-forest-900'
                : 'text-forest-800/60 hover:text-forest-900'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            Gift
          </button>
        </div>
      </div>

      {/* Tiers Grid */}
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`relative bg-white rounded-3xl border-2 overflow-hidden transition-all duration-300
                       ${tier.popular
                         ? 'border-sage-500 shadow-soft-lg scale-[1.02]'
                         : 'border-cream-200 hover:border-sage-200 hover:shadow-soft'
                       }`}
          >
            {/* Popular Badge */}
            {tier.popular && (
              <div className="absolute top-0 left-0 right-0 bg-sage-500 text-white text-center py-2 text-sm font-medium">
                Most Popular
              </div>
            )}

            <div className={`p-8 ${tier.popular ? 'pt-14' : ''}`}>
              {/* Header */}
              <div className="text-center mb-8">
                <h3 className="font-display text-2xl font-semibold text-forest-900 mb-1">
                  {tier.name}
                </h3>
                <p className="text-forest-800/60 text-sm mb-4">
                  {tier.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-display text-5xl font-semibold text-forest-900">
                    ${tier.price}
                  </span>
                  <span className="text-forest-800/60">/month</span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleSubscribe(tier.id)}
                disabled={loading !== null}
                className={`w-full py-4 rounded-xl font-medium transition-all duration-300 mb-8
                           ${tier.popular
                             ? 'bg-forest-900 text-cream-100 hover:bg-forest-800 hover:shadow-soft-lg'
                             : 'bg-cream-100 text-forest-900 hover:bg-cream-200'
                           }
                           disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === tier.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  giftMode ? `Gift ${tier.name}` : `Subscribe to ${tier.name}`
                )}
              </button>

              {/* Features */}
              <div className="space-y-4">
                <p className="text-xs font-medium text-forest-800/40 uppercase tracking-wider">
                  What's included
                </p>
                <ul className="space-y-3">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-sage-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-forest-800">{feature}</span>
                    </li>
                  ))}
                  {tier.notIncluded.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 opacity-40">
                      <svg className="w-5 h-5 text-forest-800/30 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-sm text-forest-800/50 line-through">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Indicators */}
      <div className="flex flex-wrap justify-center gap-8 mt-12 pt-12 border-t border-cream-200">
        <div className="flex items-center gap-3 text-sm text-forest-800/60">
          <svg className="w-6 h-6 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Secure checkout with Stripe</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-forest-800/60">
          <svg className="w-6 h-6 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>No hidden fees</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-forest-800/60">
          <svg className="w-6 h-6 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Cancel anytime</span>
        </div>
      </div>

      {/* Not ready to commit? */}
      <div className="text-center mt-12">
        <p className="text-forest-800/60 mb-4">
          Not ready to commit? Try a one-time order first.
        </p>
        <Link
          href={`${basePath}/flowers/birthday`}
          className="text-sage-600 hover:text-sage-700 font-medium transition-colors"
        >
          Browse arrangements
        </Link>
      </div>
    </div>
  );
}
