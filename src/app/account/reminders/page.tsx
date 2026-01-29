'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase, getSupabase } from '@/lib/supabase';

interface Reminder {
  id: string;
  title: string;
  occasion_type: 'birthday' | 'anniversary' | 'other';
  recipient_name: string;
  date: string;
  remind_days_before: number;
  notes: string | null;
  is_active: boolean;
}

export default function RemindersPage() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    occasion_type: 'birthday' as 'birthday' | 'anniversary' | 'other',
    recipient_name: '',
    date: '',
    remind_days_before: 7,
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || !supabase) {
      setLoading(false);
      return;
    }

    fetchReminders();
  }, [user]);

  async function fetchReminders() {
    try {
      const db = getSupabase();
      const { data, error } = await db
        .from('occasion_reminders')
        .select('*')
        .eq('user_id', user!.id)
        .eq('is_active', true)
        .order('date', { ascending: true });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get this year's occurrence
    const date = new Date(dateString);
    const thisYear = new Date(today.getFullYear(), date.getMonth(), date.getDate());

    // If it's already passed this year, check next year
    if (thisYear < today) {
      thisYear.setFullYear(thisYear.getFullYear() + 1);
    }

    const diffTime = thisYear.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getOccasionIcon = (type: string) => {
    switch (type) {
      case 'birthday':
        return '🎂';
      case 'anniversary':
        return '💝';
      default:
        return '📅';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !user) return;

    setSaving(true);

    try {
      const db = getSupabase();

      if (editingId) {
        // Update existing
        const { error } = await db
          .from('occasion_reminders')
          .update(formData)
          .eq('id', editingId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await db
          .from('occasion_reminders')
          .insert({
            ...formData,
            user_id: user.id,
          });

        if (error) throw error;
      }

      // Reset form and refresh
      setFormData({
        title: '',
        occasion_type: 'birthday',
        recipient_name: '',
        date: '',
        remind_days_before: 7,
        notes: '',
      });
      setShowForm(false);
      setEditingId(null);
      fetchReminders();
    } catch (error) {
      console.error('Failed to save reminder:', error);
      alert('Failed to save reminder. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (reminder: Reminder) => {
    setFormData({
      title: reminder.title,
      occasion_type: reminder.occasion_type,
      recipient_name: reminder.recipient_name,
      date: reminder.date,
      remind_days_before: reminder.remind_days_before,
      notes: reminder.notes || '',
    });
    setEditingId(reminder.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return;
    if (!supabase || !user) return;

    try {
      const db = getSupabase();
      const { error } = await db
        .from('occasion_reminders')
        .update({ is_active: false })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      fetchReminders();
    } catch (error) {
      console.error('Failed to delete reminder:', error);
      alert('Failed to delete reminder. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-900">
            Occasion Reminders
          </h1>
          <p className="text-forest-800/60 mt-1">
            Never forget important dates for loved ones
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              title: '',
              occasion_type: 'birthday',
              recipient_name: '',
              date: '',
              remind_days_before: 7,
              notes: '',
            });
          }}
          className="px-5 py-2.5 bg-forest-900 text-cream-100 rounded-full text-sm font-medium
                   transition-all duration-300 hover:bg-forest-800 hover:shadow-soft-lg"
        >
          Add Reminder
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-cream-200 p-6">
          <h2 className="font-display text-lg font-semibold text-forest-900 mb-6">
            {editingId ? 'Edit Reminder' : 'New Reminder'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest-800 mb-2">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={formData.recipient_name}
                  onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                  required
                  placeholder="Mom, Dad, Sarah..."
                  className="w-full px-4 py-3 rounded-xl border border-cream-300
                           focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                           outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-forest-800 mb-2">
                  Occasion Type
                </label>
                <select
                  value={formData.occasion_type}
                  onChange={(e) => setFormData({
                    ...formData,
                    occasion_type: e.target.value as 'birthday' | 'anniversary' | 'other',
                    title: e.target.value === 'birthday'
                      ? `${formData.recipient_name}'s Birthday`
                      : e.target.value === 'anniversary'
                      ? 'Anniversary'
                      : formData.title,
                  })}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300
                           focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                           outline-none transition-all duration-200"
                >
                  <option value="birthday">Birthday</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest-800 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-cream-300
                           focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                           outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-forest-800 mb-2">
                  Remind me
                </label>
                <select
                  value={formData.remind_days_before}
                  onChange={(e) => setFormData({ ...formData, remind_days_before: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300
                           focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                           outline-none transition-all duration-200"
                >
                  <option value={3}>3 days before</option>
                  <option value={7}>1 week before</option>
                  <option value={14}>2 weeks before</option>
                  <option value={30}>1 month before</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-800 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Mom's Birthday"
                className="w-full px-4 py-3 rounded-xl border border-cream-300
                         focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                         outline-none transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-800 mb-2">
                Notes <span className="text-forest-800/40">(optional)</span>
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="She loves pink roses..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-cream-300
                         focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20
                         outline-none transition-all duration-200 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-forest-900 text-cream-100 rounded-full font-medium
                         transition-all duration-300 hover:bg-forest-800 disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingId ? 'Update Reminder' : 'Create Reminder'}
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

      {/* Reminders List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-cream-200 p-8 text-center">
          <div className="w-10 h-10 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-forest-800/60">Loading reminders...</p>
        </div>
      ) : reminders.length === 0 && !showForm ? (
        <div className="bg-gradient-to-br from-sage-50 to-cream-50 rounded-2xl border border-sage-100 p-12 text-center">
          <div className="text-6xl mb-4">🎂</div>
          <h2 className="font-display text-xl font-semibold text-forest-900 mb-2">
            No reminders yet
          </h2>
          <p className="text-forest-800/60 mb-6 max-w-md mx-auto">
            Add birthdays, anniversaries, and other important dates so you never forget to send flowers.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-forest-900 text-cream-100
                     rounded-full font-medium transition-all duration-300
                     hover:bg-forest-800 hover:shadow-soft-lg"
          >
            Add Your First Reminder
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reminders.map((reminder) => {
            const daysUntil = getDaysUntil(reminder.date);
            const isUpcoming = daysUntil <= 14;

            return (
              <div
                key={reminder.id}
                className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${
                  isUpcoming ? 'border-sage-300 shadow-soft' : 'border-cream-200 hover:border-sage-200'
                }`}
              >
                <div className="p-5 flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                    isUpcoming ? 'bg-sage-100' : 'bg-cream-100'
                  }`}>
                    {getOccasionIcon(reminder.occasion_type)}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-semibold text-forest-900 truncate">
                      {reminder.title}
                    </h3>
                    <p className="text-forest-800/60 text-sm">
                      {formatDate(reminder.date)} &middot; Reminder {reminder.remind_days_before} days before
                    </p>
                    {reminder.notes && (
                      <p className="text-forest-800/50 text-sm mt-1 truncate">
                        {reminder.notes}
                      </p>
                    )}
                  </div>

                  {/* Days Until */}
                  <div className={`text-center px-4 py-2 rounded-xl ${
                    daysUntil <= 7
                      ? 'bg-amber-100 text-amber-700'
                      : isUpcoming
                      ? 'bg-sage-100 text-sage-700'
                      : 'bg-cream-100 text-forest-800/60'
                  }`}>
                    <p className="text-2xl font-bold">{daysUntil}</p>
                    <p className="text-xs">days</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(reminder)}
                      className="p-2 text-forest-800/40 hover:text-forest-900 hover:bg-cream-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(reminder.id)}
                      className="p-2 text-forest-800/40 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Quick Action Bar */}
                {isUpcoming && (
                  <div className="px-5 py-3 bg-sage-50 border-t border-sage-100 flex items-center justify-between">
                    <p className="text-sm text-sage-700">
                      {daysUntil <= 7
                        ? 'Coming up soon! Time to order flowers.'
                        : `Coming up in ${daysUntil} days`}
                    </p>
                    <a
                      href={`/ca/san-francisco/flowers/${reminder.occasion_type === 'anniversary' ? 'anniversary' : 'birthday'}`}
                      className="text-sm font-medium text-sage-700 hover:text-sage-800 transition-colors"
                    >
                      Shop Now
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
