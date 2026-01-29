'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase, getSupabase } from '@/lib/supabase';

interface Address {
  id: string;
  label: string | null;
  recipient_name: string;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  zipcode: string;
  phone: string | null;
  is_default: boolean;
}

export default function AddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    recipient_name: '',
    address1: '',
    address2: '',
    city: '',
    state: 'CA',
    zipcode: '',
    phone: '',
    is_default: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || !supabase) {
      setLoading(false);
      return;
    }

    fetchAddresses();
  }, [user]);

  async function fetchAddresses() {
    try {
      const db = getSupabase();
      const { data, error } = await db
        .from('addresses')
        .select('*')
        .eq('user_id', user!.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !user) return;

    setSaving(true);

    try {
      const db = getSupabase();

      // If setting as default, unset others first
      if (formData.is_default) {
        await db
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      if (editingId) {
        // Update existing
        const { error } = await db
          .from('addresses')
          .update(formData)
          .eq('id', editingId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await db
          .from('addresses')
          .insert({
            ...formData,
            user_id: user.id,
          });

        if (error) throw error;
      }

      // Reset form and refresh
      setFormData({
        label: '',
        recipient_name: '',
        address1: '',
        address2: '',
        city: '',
        state: 'CA',
        zipcode: '',
        phone: '',
        is_default: false,
      });
      setShowForm(false);
      setEditingId(null);
      fetchAddresses();
    } catch (error) {
      console.error('Failed to save address:', error);
      alert('Failed to save address. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (address: Address) => {
    setFormData({
      label: address.label || '',
      recipient_name: address.recipient_name,
      address1: address.address1,
      address2: address.address2 || '',
      city: address.city,
      state: address.state,
      zipcode: address.zipcode,
      phone: address.phone || '',
      is_default: address.is_default,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    if (!supabase || !user) return;

    try {
      const db = getSupabase();
      const { error } = await db
        .from('addresses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      fetchAddresses();
    } catch (error) {
      console.error('Failed to delete address:', error);
      alert('Failed to delete address. Please try again.');
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!supabase || !user) return;

    try {
      const db = getSupabase();

      // Unset all defaults
      await db
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);

      // Set new default
      await db
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id)
        .eq('user_id', user.id);

      fetchAddresses();
    } catch (error) {
      console.error('Failed to set default address:', error);
      alert('Failed to set default address. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">
            Saved Addresses
          </h1>
          <p className="text-forest-800/60 mt-1">
            Manage delivery addresses for faster checkout
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              label: '',
              recipient_name: '',
              address1: '',
              address2: '',
              city: '',
              state: 'CA',
              zipcode: '',
              phone: '',
              is_default: addresses.length === 0,
            });
          }}
          className="px-5 py-2.5 bg-forest-900 text-cream-100 rounded-full text-sm font-medium
                   transition-all duration-300 hover:bg-forest-800 hover:shadow-soft-lg"
        >
          Add Address
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-cream-200 p-6">
          <h2 className="font-display text-lg font-semibold text-forest-900 mb-6">
            {editingId ? 'Edit Address' : 'New Address'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest-800 mb-2">
                  Label <span className="text-forest-800/40">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Home, Office, Mom's House..."
                  className="w-full px-4 py-3 rounded-xl border border-cream-300
                           focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                           outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-forest-800 mb-2">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={formData.recipient_name}
                  onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                  required
                  placeholder="Full name"
                  className="w-full px-4 py-3 rounded-xl border border-cream-300
                           focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                           outline-none transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-800 mb-2">
                Street Address
              </label>
              <input
                type="text"
                value={formData.address1}
                onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                required
                placeholder="123 Main Street"
                className="w-full px-4 py-3 rounded-xl border border-cream-300
                         focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                         outline-none transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-800 mb-2">
                Apt, Suite, Unit <span className="text-forest-800/40">(optional)</span>
              </label>
              <input
                type="text"
                value={formData.address2}
                onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                placeholder="Apt 4B"
                className="w-full px-4 py-3 rounded-xl border border-cream-300
                         focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                         outline-none transition-all duration-200"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest-800 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  placeholder="San Francisco"
                  className="w-full px-4 py-3 rounded-xl border border-cream-300
                           focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                           outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-forest-800 mb-2">
                  State
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300
                           focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                           outline-none transition-all duration-200"
                >
                  <option value="CA">California</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-forest-800 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={formData.zipcode}
                  onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                  required
                  placeholder="94102"
                  pattern="[0-9]{5}"
                  className="w-full px-4 py-3 rounded-xl border border-cream-300
                           focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                           outline-none transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-800 mb-2">
                Phone <span className="text-forest-800/40">(optional)</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-3 rounded-xl border border-cream-300
                         focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                         outline-none transition-all duration-200"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="w-5 h-5 rounded border-cream-300 text-sage-600 focus:ring-sage-500"
              />
              <label htmlFor="is_default" className="text-sm text-forest-800">
                Set as default address
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-forest-900 text-cream-100 rounded-full font-medium
                         transition-all duration-300 hover:bg-forest-800 disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingId ? 'Update Address' : 'Save Address'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="px-6 py-3 bg-cream-100 text-forest-900 rounded-full font-medium
                         transition-all duration-300 hover:bg-cream-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-cream-200 p-8 text-center">
          <div className="w-10 h-10 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-forest-800/60">Loading addresses...</p>
        </div>
      ) : addresses.length === 0 && !showForm ? (
        <div className="bg-white rounded-2xl border border-cream-200 p-12 text-center">
          <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-forest-800/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="font-display text-xl font-semibold text-forest-900 mb-2">
            No saved addresses
          </h2>
          <p className="text-forest-800/60 mb-6">
            Save addresses for faster checkout next time.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-forest-900 text-cream-100
                     rounded-full font-medium transition-all duration-300
                     hover:bg-forest-800 hover:shadow-soft-lg"
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white rounded-2xl border p-5 relative ${
                address.is_default ? 'border-sage-300 shadow-soft' : 'border-cream-200'
              }`}
            >
              {address.is_default && (
                <span className="absolute top-4 right-4 px-2 py-1 bg-sage-100 text-sage-700 text-xs font-medium rounded-full">
                  Default
                </span>
              )}

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cream-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-forest-800/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-forest-900">
                    {address.label || address.recipient_name}
                  </p>
                  {address.label && (
                    <p className="text-sm text-forest-800/60">{address.recipient_name}</p>
                  )}
                  <p className="text-sm text-forest-800/60 mt-1">
                    {address.address1}
                    {address.address2 && <>, {address.address2}</>}
                  </p>
                  <p className="text-sm text-forest-800/60">
                    {address.city}, {address.state} {address.zipcode}
                  </p>
                  {address.phone && (
                    <p className="text-sm text-forest-800/60">{address.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-cream-200">
                <button
                  onClick={() => handleEdit(address)}
                  className="px-4 py-2 text-sm text-forest-800/60 hover:text-forest-900 hover:bg-cream-100 rounded-lg transition-colors"
                >
                  Edit
                </button>
                {!address.is_default && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="px-4 py-2 text-sm text-forest-800/60 hover:text-forest-900 hover:bg-cream-100 rounded-lg transition-colors"
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(address.id)}
                  className="px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
