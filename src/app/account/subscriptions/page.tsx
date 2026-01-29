'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase, getSupabase } from '@/lib/supabase';
import { SUBSCRIPTION_TIERS } from '@/types/database';

interface Subscription {
  id: string;
  tier: 'classic' | 'luxe' | 'grand';
  frequency: string;
  status: string;
  price: number;
  next_delivery_date: string | null;
  recipient_name: string | null;
  created_at: string;
  stripe_subscription_id: string;
}

export default function SubscriptionsPage() {
  const { user, session } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !supabase) {
      setLoading(false);
      return;
    }

    async function fetchSubscriptions() {
      try {
        const db = getSupabase();
        const { data, error } = await db
          .from('subscriptions')
          .select('*')
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSubscriptions(data || []);
      } catch (error) {
        console.error('Failed to fetch subscriptions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscriptions();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-sage-100 text-sage-700';
      case 'paused':
        return 'bg-amber-100 text-amber-700';
      case 'cancelled':
        return 'bg-rose-100 text-rose-700';
      case 'past_due':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-cream-100 text-forest-800';
    }
  };

  const handleManageSubscription = async (stripeSubscriptionId: string) => {
    if (!session) {
      alert('Please log in to manage your subscription');
      return;
    }

    setActionLoading(stripeSubscriptionId);

    try {
      const response = await fetch('/api/subscriptions/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          returnUrl: window.location.href,
        }),
      });

      const data = await response.json();

      if (data.success && data.data?.url) {
        window.location.href = data.data.url;
      } else {
        alert(data.error || 'Failed to open subscription management');
      }
    } catch (error) {
      console.error('Portal session error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSkipDelivery = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to skip your next delivery?')) return;

    setActionLoading(subscriptionId);

    try {
      // In a real implementation, this would call an API to skip the delivery
      alert('Skip functionality coming soon! Your next delivery will be skipped.');
    } catch (error) {
      console.error('Skip delivery error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">
            Subscriptions
          </h1>
          <p className="text-forest-800/60 mt-1">
            Manage your Golden Bloom Club subscriptions
          </p>
        </div>
        <Link
          href="/ca/san-francisco/subscribe"
          className="px-5 py-2.5 bg-forest-900 text-cream-100 rounded-full text-sm font-medium
                   transition-all duration-300 hover:bg-forest-800 hover:shadow-soft-lg"
        >
          New Subscription
        </Link>
      </div>

      {/* Subscriptions List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-cream-200 p-8 text-center">
          <div className="w-10 h-10 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-forest-800/60">Loading subscriptions...</p>
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="bg-gradient-to-br from-sage-50 to-cream-50 rounded-2xl border border-sage-100 p-12 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
            <svg className="w-10 h-10 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h2 className="font-display text-xl font-semibold text-forest-900 mb-2">
            No active subscriptions
          </h2>
          <p className="text-forest-800/60 mb-6 max-w-md mx-auto">
            Join the Golden Bloom Club for beautiful, fresh flowers delivered to your door every month.
          </p>
          <Link
            href="/ca/san-francisco/subscribe"
            className="inline-flex items-center gap-2 px-6 py-3 bg-forest-900 text-cream-100
                     rounded-full font-medium transition-all duration-300
                     hover:bg-forest-800 hover:shadow-soft-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Join Golden Bloom Club
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {subscriptions.map((subscription) => {
            const tierInfo = SUBSCRIPTION_TIERS[subscription.tier];
            const isActive = subscription.status === 'active';

            return (
              <div
                key={subscription.id}
                className="bg-white rounded-2xl border border-cream-200 overflow-hidden"
              >
                {/* Subscription Header */}
                <div className="p-6 border-b border-cream-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        subscription.tier === 'grand'
                          ? 'bg-gradient-to-br from-amber-100 to-amber-50'
                          : subscription.tier === 'luxe'
                          ? 'bg-gradient-to-br from-sage-100 to-sage-50'
                          : 'bg-gradient-to-br from-cream-100 to-white'
                      }`}>
                        <svg className="w-7 h-7 text-forest-800/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-semibold text-forest-900">
                          {tierInfo.name} Plan
                        </h3>
                        <p className="text-forest-800/60 text-sm">
                          {tierInfo.description} &middot; ${subscription.price}/month
                        </p>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${getStatusColor(subscription.status)}`}>
                      {subscription.status}
                    </span>
                  </div>
                </div>

                {/* Subscription Details */}
                <div className="p-6">
                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    {/* Next Delivery */}
                    <div className="bg-cream-50 rounded-xl p-4">
                      <p className="text-sm text-forest-800/60 mb-1">Next Delivery</p>
                      {isActive && subscription.next_delivery_date ? (
                        <>
                          <p className="font-semibold text-forest-900">
                            {formatDate(subscription.next_delivery_date)}
                          </p>
                          {subscription.recipient_name && (
                            <p className="text-sm text-forest-800/60 mt-1">
                              To: {subscription.recipient_name}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-forest-800/50">
                          {subscription.status === 'paused' ? 'Paused' : 'N/A'}
                        </p>
                      )}
                    </div>

                    {/* Frequency */}
                    <div className="bg-cream-50 rounded-xl p-4">
                      <p className="text-sm text-forest-800/60 mb-1">Frequency</p>
                      <p className="font-semibold text-forest-900 capitalize">
                        {subscription.frequency}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    {isActive && (
                      <button
                        onClick={() => handleSkipDelivery(subscription.id)}
                        disabled={actionLoading === subscription.id}
                        className="px-5 py-2.5 bg-cream-100 text-forest-900 rounded-full text-sm font-medium
                                 transition-all duration-300 hover:bg-cream-200 disabled:opacity-50"
                      >
                        Skip Next Delivery
                      </button>
                    )}
                    <button
                      onClick={() => handleManageSubscription(subscription.stripe_subscription_id)}
                      disabled={actionLoading === subscription.stripe_subscription_id}
                      className="px-5 py-2.5 bg-forest-900 text-cream-100 rounded-full text-sm font-medium
                               transition-all duration-300 hover:bg-forest-800 disabled:opacity-50"
                    >
                      {actionLoading === subscription.stripe_subscription_id ? 'Loading...' : 'Manage Subscription'}
                    </button>
                  </div>
                </div>

                {/* Features */}
                <div className="px-6 pb-6">
                  <p className="text-sm font-medium text-forest-800/60 mb-3">Your plan includes:</p>
                  <div className="flex flex-wrap gap-2">
                    {tierInfo.features.map((feature, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-sage-50 text-sage-700 rounded-full text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
