'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase, getSupabase } from '@/lib/supabase';

interface DashboardStats {
  totalOrders: number;
  activeSubscriptions: number;
  loyaltyPoints: number;
  upcomingReminders: number;
}

export default function AccountOverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    activeSubscriptions: 0,
    loyaltyPoints: 0,
    upcomingReminders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<Array<{
    id: string;
    created_at: string;
    total: number;
    status: string;
  }>>([]);

  useEffect(() => {
    if (!user || !supabase) {
      setLoading(false);
      return;
    }

    async function fetchDashboardData() {
      try {
        const db = getSupabase();
        // Fetch counts in parallel
        const [ordersRes, subsRes, pointsRes, remindersRes] = await Promise.all([
          db.from('orders').select('id, created_at, total, status', { count: 'exact' }).eq('user_id', user!.id).order('created_at', { ascending: false }).limit(3),
          db.from('subscriptions').select('id', { count: 'exact' }).eq('user_id', user!.id).eq('status', 'active'),
          db.from('loyalty_points').select('points').eq('user_id', user!.id).single(),
          db.from('occasion_reminders').select('id', { count: 'exact' }).eq('user_id', user!.id).eq('is_active', true),
        ]);

        setStats({
          totalOrders: ordersRes.count || 0,
          activeSubscriptions: subsRes.count || 0,
          loyaltyPoints: pointsRes.data?.points || 0,
          upcomingReminders: remindersRes.count || 0,
        });

        if (ordersRes.data) {
          setRecentOrders(ordersRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-sage-100 text-sage-700';
      case 'confirmed':
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'cancelled':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-cream-100 text-forest-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-sage-50 to-cream-50 rounded-2xl p-6 md:p-8 border border-sage-100">
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-forest-900 mb-2">
          Welcome back{user?.user_metadata?.firstName ? `, ${user.user_metadata.firstName}` : ''}!
        </h1>
        <p className="text-forest-800/60">
          Manage your orders, subscriptions, and account settings.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-cream-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-sage-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-sm text-forest-800/60">Total Orders</span>
          </div>
          <p className="text-2xl font-semibold text-forest-900">
            {loading ? '-' : stats.totalOrders}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-sage-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <span className="text-sm text-forest-800/60">Subscriptions</span>
          </div>
          <p className="text-2xl font-semibold text-forest-900">
            {loading ? '-' : stats.activeSubscriptions}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-sage-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <span className="text-sm text-forest-800/60">Loyalty Points</span>
          </div>
          <p className="text-2xl font-semibold text-forest-900">
            {loading ? '-' : stats.loyaltyPoints.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-cream-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-sage-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <span className="text-sm text-forest-800/60">Reminders</span>
          </div>
          <p className="text-2xl font-semibold text-forest-900">
            {loading ? '-' : stats.upcomingReminders}
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-cream-200 flex justify-between items-center">
          <h2 className="font-display text-lg font-semibold text-forest-900">
            Recent Orders
          </h2>
          <Link
            href="/account/orders"
            className="text-sm text-sage-600 hover:text-sage-700 font-medium transition-colors"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="p-6 text-center text-forest-800/50">
            Loading...
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-forest-800/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-forest-800/60 mb-4">No orders yet</p>
            <Link
              href="/ca/san-francisco/flowers/birthday"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-900 text-cream-100
                       rounded-full text-sm font-medium transition-all duration-300
                       hover:bg-forest-800"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-cream-200">
            {recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-cream-50 transition-colors">
                <div>
                  <p className="font-medium text-forest-900">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-sm text-forest-800/50">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="font-medium text-forest-900">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/ca/san-francisco/subscribe"
          className="bg-gradient-to-br from-forest-900 to-forest-800 rounded-2xl p-6 text-cream-100
                   hover:shadow-soft-lg transition-all duration-300 group"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold mb-1">
                Join the Golden Bloom Club
              </h3>
              <p className="text-cream-200/70 text-sm">
                Fresh flowers delivered monthly. Starting at $65/month.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sage-300 text-sm font-medium group-hover:translate-x-1 transition-transform">
            <span>Learn more</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>

        <Link
          href="/account/reminders"
          className="bg-white rounded-2xl border border-cream-200 p-6
                   hover:border-sage-200 hover:shadow-soft transition-all duration-300 group"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-sage-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-forest-900 mb-1">
                Set Up Reminders
              </h3>
              <p className="text-forest-800/60 text-sm">
                Never forget birthdays or anniversaries again.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sage-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
            <span>Add reminder</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
}
