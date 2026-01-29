/**
 * Supabase Database Types
 *
 * These types represent the database schema for Golden State Flower Shop.
 * Run `supabase gen types typescript` to regenerate from your actual schema.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string | null;
          recipient_name: string;
          address1: string;
          address2: string | null;
          city: string;
          state: string;
          zipcode: string;
          phone: string | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label?: string | null;
          recipient_name: string;
          address1: string;
          address2?: string | null;
          city: string;
          state: string;
          zipcode: string;
          phone?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          label?: string | null;
          recipient_name?: string;
          address1?: string;
          address2?: string | null;
          city?: string;
          state?: string;
          zipcode?: string;
          phone?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          guest_email: string | null;
          florist_one_order_id: string | null;
          florist_one_confirmation: string | null;
          status: 'pending' | 'processing' | 'confirmed' | 'delivered' | 'cancelled';
          subtotal: number;
          delivery_fee: number;
          tax: number;
          total: number;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          billing_address: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          guest_email?: string | null;
          florist_one_order_id?: string | null;
          florist_one_confirmation?: string | null;
          status?: 'pending' | 'processing' | 'confirmed' | 'delivered' | 'cancelled';
          subtotal: number;
          delivery_fee: number;
          tax: number;
          total: number;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          billing_address: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          guest_email?: string | null;
          florist_one_order_id?: string | null;
          florist_one_confirmation?: string | null;
          status?: 'pending' | 'processing' | 'confirmed' | 'delivered' | 'cancelled';
          subtotal?: number;
          delivery_fee?: number;
          tax?: number;
          total?: number;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          billing_address?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_code: string;
          product_name: string;
          price: number;
          delivery_date: string;
          recipient_name: string;
          recipient_address: Json;
          card_message: string | null;
          special_instructions: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_code: string;
          product_name: string;
          price: number;
          delivery_date: string;
          recipient_name: string;
          recipient_address: Json;
          card_message?: string | null;
          special_instructions?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_code?: string;
          product_name?: string;
          price?: number;
          delivery_date?: string;
          recipient_name?: string;
          recipient_address?: Json;
          card_message?: string | null;
          special_instructions?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string;
          stripe_customer_id: string;
          tier: 'classic' | 'luxe' | 'grand';
          frequency: 'weekly' | 'biweekly' | 'monthly';
          status: 'active' | 'paused' | 'cancelled' | 'past_due';
          price: number;
          next_delivery_date: string | null;
          delivery_address_id: string | null;
          recipient_name: string | null;
          special_instructions: string | null;
          gift_subscription: boolean;
          gift_recipient_email: string | null;
          created_at: string;
          updated_at: string;
          cancelled_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_subscription_id: string;
          stripe_customer_id: string;
          tier: 'classic' | 'luxe' | 'grand';
          frequency?: 'weekly' | 'biweekly' | 'monthly';
          status?: 'active' | 'paused' | 'cancelled' | 'past_due';
          price: number;
          next_delivery_date?: string | null;
          delivery_address_id?: string | null;
          recipient_name?: string | null;
          special_instructions?: string | null;
          gift_subscription?: boolean;
          gift_recipient_email?: string | null;
          created_at?: string;
          updated_at?: string;
          cancelled_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_subscription_id?: string;
          stripe_customer_id?: string;
          tier?: 'classic' | 'luxe' | 'grand';
          frequency?: 'weekly' | 'biweekly' | 'monthly';
          status?: 'active' | 'paused' | 'cancelled' | 'past_due';
          price?: number;
          next_delivery_date?: string | null;
          delivery_address_id?: string | null;
          recipient_name?: string | null;
          special_instructions?: string | null;
          gift_subscription?: boolean;
          gift_recipient_email?: string | null;
          created_at?: string;
          updated_at?: string;
          cancelled_at?: string | null;
        };
        Relationships: [];
      };
      subscription_deliveries: {
        Row: {
          id: string;
          subscription_id: string;
          florist_one_order_id: string | null;
          delivery_date: string;
          status: 'scheduled' | 'processing' | 'delivered' | 'skipped' | 'failed';
          product_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          subscription_id: string;
          florist_one_order_id?: string | null;
          delivery_date: string;
          status?: 'scheduled' | 'processing' | 'delivered' | 'skipped' | 'failed';
          product_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          subscription_id?: string;
          florist_one_order_id?: string | null;
          delivery_date?: string;
          status?: 'scheduled' | 'processing' | 'delivered' | 'skipped' | 'failed';
          product_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      occasion_reminders: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          occasion_type: 'birthday' | 'anniversary' | 'other';
          recipient_name: string;
          date: string;
          remind_days_before: number;
          notes: string | null;
          is_active: boolean;
          last_reminded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          occasion_type: 'birthday' | 'anniversary' | 'other';
          recipient_name: string;
          date: string;
          remind_days_before?: number;
          notes?: string | null;
          is_active?: boolean;
          last_reminded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          occasion_type?: 'birthday' | 'anniversary' | 'other';
          recipient_name?: string;
          date?: string;
          remind_days_before?: number;
          notes?: string | null;
          is_active?: boolean;
          last_reminded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          user_id: string | null;
          source: string | null;
          subscribed_at: string;
          unsubscribed_at: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          user_id?: string | null;
          source?: string | null;
          subscribed_at?: string;
          unsubscribed_at?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          user_id?: string | null;
          source?: string | null;
          subscribed_at?: string;
          unsubscribed_at?: string | null;
          is_active?: boolean;
        };
        Relationships: [];
      };
      loyalty_points: {
        Row: {
          id: string;
          user_id: string;
          points: number;
          lifetime_points: number;
          tier: 'bronze' | 'silver' | 'gold' | 'platinum';
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          points?: number;
          lifetime_points?: number;
          tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          points?: number;
          lifetime_points?: number;
          tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
          updated_at?: string;
        };
        Relationships: [];
      };
      loyalty_transactions: {
        Row: {
          id: string;
          user_id: string;
          points: number;
          type: 'earned' | 'redeemed' | 'expired' | 'bonus';
          description: string;
          order_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          points: number;
          type: 'earned' | 'redeemed' | 'expired' | 'bonus';
          description: string;
          order_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          points?: number;
          type?: 'earned' | 'redeemed' | 'expired' | 'bonus';
          description?: string;
          order_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      referrals: {
        Row: {
          id: string;
          referrer_id: string;
          referee_email: string;
          referee_id: string | null;
          code: string;
          status: 'pending' | 'signed_up' | 'completed' | 'expired';
          referrer_reward: number;
          referee_reward: number;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          referrer_id: string;
          referee_email: string;
          referee_id?: string | null;
          code: string;
          status?: 'pending' | 'signed_up' | 'completed' | 'expired';
          referrer_reward?: number;
          referee_reward?: number;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          referrer_id?: string;
          referee_email?: string;
          referee_id?: string | null;
          code?: string;
          status?: 'pending' | 'signed_up' | 'completed' | 'expired';
          referrer_reward?: number;
          referee_reward?: number;
          created_at?: string;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      abandoned_carts: {
        Row: {
          id: string;
          email: string;
          user_id: string | null;
          cart_session_id: string;
          cart_data: Json;
          recovery_email_sent: boolean;
          recovery_email_sent_at: string | null;
          recovered: boolean;
          recovered_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          user_id?: string | null;
          cart_session_id: string;
          cart_data: Json;
          recovery_email_sent?: boolean;
          recovery_email_sent_at?: string | null;
          recovered?: boolean;
          recovered_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          user_id?: string | null;
          cart_session_id?: string;
          cart_data?: Json;
          recovery_email_sent?: boolean;
          recovery_email_sent_at?: string | null;
          recovered?: boolean;
          recovered_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      order_status: 'pending' | 'processing' | 'confirmed' | 'delivered' | 'cancelled';
      subscription_tier: 'classic' | 'luxe' | 'grand';
      subscription_frequency: 'weekly' | 'biweekly' | 'monthly';
      subscription_status: 'active' | 'paused' | 'cancelled' | 'past_due';
      delivery_status: 'scheduled' | 'processing' | 'delivered' | 'skipped' | 'failed';
      occasion_type: 'birthday' | 'anniversary' | 'other';
      loyalty_tier: 'bronze' | 'silver' | 'gold' | 'platinum';
      points_transaction_type: 'earned' | 'redeemed' | 'expired' | 'bonus';
      referral_status: 'pending' | 'signed_up' | 'completed' | 'expired';
    };
  };
}

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Address = Database['public']['Tables']['addresses']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
export type SubscriptionDelivery = Database['public']['Tables']['subscription_deliveries']['Row'];
export type OccasionReminder = Database['public']['Tables']['occasion_reminders']['Row'];
export type NewsletterSubscriber = Database['public']['Tables']['newsletter_subscribers']['Row'];
export type LoyaltyPoints = Database['public']['Tables']['loyalty_points']['Row'];
export type LoyaltyTransaction = Database['public']['Tables']['loyalty_transactions']['Row'];
export type Referral = Database['public']['Tables']['referrals']['Row'];
export type AbandonedCart = Database['public']['Tables']['abandoned_carts']['Row'];

// Subscription tier configuration
export const SUBSCRIPTION_TIERS = {
  classic: {
    name: 'Classic',
    price: 65,
    description: 'Seasonal bouquet',
    features: [
      'Beautiful seasonal bouquet',
      'Hand-arranged by local florists',
      'Free delivery',
      'Skip or pause anytime',
    ],
  },
  luxe: {
    name: 'Luxe',
    price: 95,
    description: 'Premium arrangement + vase',
    features: [
      'Premium floral arrangement',
      'Elegant glass vase included',
      'Hand-arranged by local florists',
      'Free delivery',
      'Skip or pause anytime',
      'Priority customer support',
    ],
  },
  grand: {
    name: 'Grand',
    price: 145,
    description: 'Luxury centerpiece + extras',
    features: [
      'Luxury statement centerpiece',
      'Designer vase included',
      'Hand-arranged by master florists',
      'Free priority delivery',
      'Skip or pause anytime',
      'Dedicated account manager',
      'Exclusive subscriber-only arrangements',
    ],
  },
} as const;

// Loyalty tier configuration
export const LOYALTY_TIERS = {
  bronze: {
    name: 'Bronze',
    minPoints: 0,
    pointsMultiplier: 1,
    perks: ['Earn 1 point per $1 spent'],
  },
  silver: {
    name: 'Silver',
    minPoints: 500,
    pointsMultiplier: 1.25,
    perks: ['Earn 1.25 points per $1 spent', 'Free upgrade on birthday'],
  },
  gold: {
    name: 'Gold',
    minPoints: 1500,
    pointsMultiplier: 1.5,
    perks: ['Earn 1.5 points per $1 spent', 'Free upgrade on birthday', 'Free expedited delivery'],
  },
  platinum: {
    name: 'Platinum',
    minPoints: 5000,
    pointsMultiplier: 2,
    perks: ['Earn 2 points per $1 spent', 'Free upgrade on birthday', 'Free expedited delivery', 'Exclusive arrangements', 'Personal florist consultation'],
  },
} as const;
