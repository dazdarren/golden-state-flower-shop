'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase, getSupabase } from '@/lib/supabase';

interface Order {
  id: string;
  created_at: string;
  status: string;
  subtotal: number;
  delivery_fee: number;
  tax: number;
  total: number;
  florist_one_confirmation: string | null;
  order_items: Array<{
    id: string;
    product_name: string;
    price: number;
    delivery_date: string;
    recipient_name: string;
  }>;
}

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !supabase) {
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      try {
        const db = getSupabase();
        const { data, error } = await db
          .from('orders')
          .select(`
            id, created_at, status, subtotal, delivery_fee, tax, total, florist_one_confirmation,
            order_items (id, product_name, price, delivery_date, recipient_name)
          `)
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        // Cast to the expected type since Supabase can't infer relation types without schema definitions
        setOrders((data as unknown as Order[]) || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
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

  const handleReorder = (orderId: string) => {
    // In a real implementation, this would add items to cart
    alert('Reorder functionality coming soon! This will add items from this order to your cart.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">
            Order History
          </h1>
          <p className="text-forest-800/60 mt-1">
            View and manage your past orders
          </p>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-cream-200 p-8 text-center">
          <div className="w-10 h-10 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-forest-800/60">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-cream-200 p-12 text-center">
          <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-forest-800/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="font-display text-xl font-semibold text-forest-900 mb-2">
            No orders yet
          </h2>
          <p className="text-forest-800/60 mb-6">
            When you place orders, they'll appear here.
          </p>
          <Link
            href="/ca/san-francisco/flowers/birthday"
            className="inline-flex items-center gap-2 px-6 py-3 bg-forest-900 text-cream-100
                     rounded-full font-medium transition-all duration-300
                     hover:bg-forest-800 hover:shadow-soft-lg"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-cream-200 overflow-hidden"
            >
              {/* Order Header */}
              <div
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-cream-50 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sage-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-forest-900">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-sm text-forest-800/50">
                      {formatDate(order.created_at)}
                      {order.florist_one_confirmation && (
                        <> &middot; Confirmation: {order.florist_one_confirmation}</>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="font-semibold text-forest-900">
                    {formatCurrency(order.total)}
                  </span>
                  <svg
                    className={`w-5 h-5 text-forest-800/40 transition-transform ${
                      expandedOrder === order.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Order Details (Expanded) */}
              {expandedOrder === order.id && (
                <div className="px-6 pb-6 border-t border-cream-200 pt-4">
                  {/* Items */}
                  <div className="space-y-3 mb-6">
                    <p className="text-sm font-medium text-forest-800/60 uppercase tracking-wider">
                      Items
                    </p>
                    {order.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-start py-3 border-b border-cream-100 last:border-0"
                      >
                        <div>
                          <p className="font-medium text-forest-900">{item.product_name}</p>
                          <p className="text-sm text-forest-800/50">
                            To: {item.recipient_name} &middot; Delivery: {formatDate(item.delivery_date)}
                          </p>
                        </div>
                        <p className="font-medium text-forest-900">{formatCurrency(item.price)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="bg-cream-50 rounded-xl p-4 space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-forest-800/60">Subtotal</span>
                      <span className="text-forest-900">{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-forest-800/60">Delivery</span>
                      <span className="text-forest-900">{formatCurrency(order.delivery_fee)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-forest-800/60">Tax</span>
                      <span className="text-forest-900">{formatCurrency(order.tax)}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t border-cream-200">
                      <span className="text-forest-900">Total</span>
                      <span className="text-forest-900">{formatCurrency(order.total)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReorder(order.id)}
                      className="px-5 py-2.5 bg-forest-900 text-cream-100 rounded-full text-sm font-medium
                               transition-all duration-300 hover:bg-forest-800"
                    >
                      Reorder
                    </button>
                    <button
                      className="px-5 py-2.5 bg-cream-100 text-forest-900 rounded-full text-sm font-medium
                               transition-all duration-300 hover:bg-cream-200"
                    >
                      Need Help?
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
