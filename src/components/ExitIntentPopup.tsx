'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface ExitIntentPopupProps {
  delay?: number; // Delay before popup can appear (ms)
  mobileScrollThreshold?: number; // Show on mobile after scrolling up this many pixels
}

export default function ExitIntentPopup({ delay = 5000, mobileScrollThreshold = 300 }: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [canShow, setCanShow] = useState(false);
  const lastScrollY = useRef(0);
  const scrollUpDistance = useRef(0);

  // Check if popup has been dismissed or user already subscribed
  const hasBeenDismissed = useCallback(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('exitPopupDismissed') === 'true' ||
           localStorage.getItem('newsletterSubscribed') === 'true';
  }, []);

  useEffect(() => {
    // Wait for delay before enabling popup
    const timer = setTimeout(() => {
      if (!hasBeenDismissed()) {
        setCanShow(true);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, hasBeenDismissed]);

  useEffect(() => {
    if (!canShow) return;

    // Desktop: Mouse leave detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isVisible && !hasBeenDismissed()) {
        setIsVisible(true);
      }
    };

    // Mobile: Detect rapid scroll up (user trying to leave)
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY.current) {
        // Scrolling up
        scrollUpDistance.current += lastScrollY.current - currentScrollY;

        if (scrollUpDistance.current > mobileScrollThreshold && !isVisible && !hasBeenDismissed()) {
          setIsVisible(true);
          scrollUpDistance.current = 0;
        }
      } else {
        // Scrolling down - reset
        scrollUpDistance.current = 0;
      }

      lastScrollY.current = currentScrollY;
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [canShow, isVisible, hasBeenDismissed, mobileScrollThreshold]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('exitPopupDismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source: 'exit_intent' }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage('Thank you! Check your inbox for a welcome surprise.');
        localStorage.setItem('newsletterSubscribed', 'true');
        // Close popup after success
        setTimeout(() => {
          setIsVisible(false);
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-forest-900/60 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-cream-100 hover:bg-cream-200
                   flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5 text-forest-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="grid md:grid-cols-2">
          {/* Left side - Image/decoration */}
          <div className="hidden md:block bg-gradient-to-br from-sage-100 to-cream-100 p-8">
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-4">🌸</div>
              <p className="font-display text-xl text-forest-800 font-medium">
                Don't miss out on beautiful blooms!
              </p>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="p-8 md:p-10">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-sage-100 text-sage-700 text-xs font-medium rounded-full mb-4">
                BEFORE YOU GO
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-forest-900 mb-2">
                Wait! Don't Miss Out
              </h2>
              <p className="text-forest-800/60">
                Subscribe for exclusive offers, seasonal collections, and flower care tips.
              </p>
            </div>

            {status === 'success' ? (
              <div className="bg-sage-50 border border-sage-200 text-sage-700 px-4 py-4 rounded-xl text-center">
                <svg className="w-8 h-8 text-sage-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {message}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-cream-300
                             focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                             outline-none transition-all duration-200"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-rose-600 text-sm">{message}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3 px-4 bg-forest-900 text-cream-100 rounded-xl
                           font-medium transition-all duration-300
                           hover:bg-forest-800 hover:shadow-soft-lg
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
                </button>

                <p className="text-xs text-center text-forest-800/50">
                  By subscribing, you agree to receive marketing emails.
                  Unsubscribe anytime.
                </p>

                {/* Trust indicators */}
                <div className="flex items-center justify-center gap-4 pt-2 text-xs text-forest-800/50">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Secure
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    No spam
                  </span>
                </div>
              </form>
            )}

            <button
              onClick={handleClose}
              className="mt-4 text-sm text-forest-800/50 hover:text-forest-800/70 transition-colors w-full text-center"
            >
              No thanks, I'll pay full price
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
