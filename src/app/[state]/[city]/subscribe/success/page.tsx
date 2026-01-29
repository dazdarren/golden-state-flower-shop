'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface SubscriptionSuccessPageProps {
  params: {
    state: string;
    city: string;
  };
}

function SubscriptionSuccessContent({ params }: SubscriptionSuccessPageProps) {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const basePath = `/${params.state}/${params.city}`;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Give Stripe webhook time to process
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-forest-800/60">Processing your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] py-20">
      <div className="container-narrow">
        <div className="bg-white rounded-3xl shadow-soft-lg p-8 md:p-12 text-center max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-forest-900 mb-4">
            Welcome to the Golden Bloom Club!
          </h1>

          <p className="text-lg text-forest-800/60 mb-8">
            Your subscription is confirmed. Get ready for beautiful, fresh flowers delivered to your door.
          </p>

          {/* What's Next */}
          <div className="bg-cream-50 rounded-2xl p-6 mb-8 text-left">
            <h2 className="font-display text-lg font-semibold text-forest-900 mb-4">
              What happens next?
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">1</span>
                <span className="text-forest-800/70">
                  <strong className="text-forest-900">Check your email</strong> - We've sent a confirmation with your subscription details.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">2</span>
                <span className="text-forest-800/70">
                  <strong className="text-forest-900">Set up your account</strong> - Add your delivery address and preferences in your account dashboard.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">3</span>
                <span className="text-forest-800/70">
                  <strong className="text-forest-900">Await your first delivery</strong> - Your first bouquet will arrive within 5-7 days.
                </span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/account/subscriptions"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-forest-900 text-cream-100
                       rounded-full font-medium transition-all duration-300
                       hover:bg-forest-800 hover:shadow-soft-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Manage Subscription
            </Link>
            <Link
              href={basePath}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cream-100 text-forest-900
                       rounded-full font-medium transition-all duration-300
                       hover:bg-cream-200"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Share */}
          <div className="mt-10 pt-8 border-t border-cream-200">
            <p className="text-sm text-forest-800/50 mb-4">
              Love flowers? Share the joy with friends!
            </p>
            <div className="flex justify-center gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=I%20just%20joined%20the%20Golden%20Bloom%20Club%20-%20fresh%20flowers%20delivered%20monthly!%20%F0%9F%8C%B8&url=https://goldenstateflowershop.com${basePath}/subscribe`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-cream-100 hover:bg-cream-200 flex items-center justify-center transition-colors"
                aria-label="Share on Twitter"
              >
                <svg className="w-5 h-5 text-forest-800/60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=https://goldenstateflowershop.com${basePath}/subscribe`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-cream-100 hover:bg-cream-200 flex items-center justify-center transition-colors"
                aria-label="Share on Facebook"
              >
                <svg className="w-5 h-5 text-forest-800/60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionSuccessPage({ params }: SubscriptionSuccessPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-forest-800/60">Loading...</p>
        </div>
      </div>
    }>
      <SubscriptionSuccessContent params={params} />
    </Suspense>
  );
}
