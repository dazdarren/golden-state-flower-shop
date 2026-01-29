/**
 * Stripe Webhook Handler for Subscription Events
 *
 * POST /api/subscriptions/webhook
 */

import Stripe from 'stripe';
import { successResponse, errorResponse } from '../../lib/response';
import { createSupabaseClient, hasSupabaseCredentials, createSubscription, updateSubscription } from '../../lib/supabase';
import {
  createStripeClient,
  hasStripeCredentials,
  constructWebhookEvent,
  handleWebhookEvent,
  calculateNextDeliveryDate,
} from '../../lib/stripe';
import { createEmailClient, hasEmailCredentials, sendSubscriptionWelcomeEmail } from '../../lib/email';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    // Check credentials
    if (!hasStripeCredentials(context.env)) {
      return errorResponse('Payment system not configured', 503);
    }

    if (!hasSupabaseCredentials(context.env)) {
      return errorResponse('Database not configured', 503);
    }

    // Get raw body and signature
    const rawBody = await context.request.text();
    const signature = context.request.headers.get('stripe-signature');

    if (!signature) {
      return errorResponse('Missing stripe-signature header', 400);
    }

    // Verify webhook signature
    const stripe = createStripeClient(context.env.STRIPE_SECRET_KEY);
    let event: Stripe.Event;

    try {
      event = constructWebhookEvent(stripe, rawBody, signature, context.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return errorResponse('Invalid webhook signature', 400);
    }

    const supabase = createSupabaseClient(context.env);

    // Handle the event
    await handleWebhookEvent(event, {
      onCheckoutCompleted: async (session) => {
        // New subscription from checkout
        if (session.mode !== 'subscription' || !session.subscription) return;

        const subscriptionId = typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription.id;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const metadata = session.metadata || {};

        // Extract tier from price or metadata
        const tier = (metadata.tier || 'classic') as 'classic' | 'luxe' | 'grand';
        const priceAmount = subscription.items.data[0]?.price.unit_amount || 6500;

        // Calculate next delivery date (first delivery in ~5-7 days)
        const nextDelivery = new Date();
        nextDelivery.setDate(nextDelivery.getDate() + 7);
        // Skip weekends
        while (nextDelivery.getDay() === 0 || nextDelivery.getDay() === 6) {
          nextDelivery.setDate(nextDelivery.getDate() + 1);
        }

        // Save stripe customer ID to user's profile
        const stripeCustomerId = subscription.customer as string;
        await supabase
          .from('profiles')
          .update({ stripe_customer_id: stripeCustomerId })
          .eq('id', metadata.userId!);

        // Create subscription in database
        await createSubscription(supabase, {
          user_id: metadata.userId!,
          stripe_subscription_id: subscriptionId,
          stripe_customer_id: stripeCustomerId,
          tier,
          frequency: 'monthly',
          price: priceAmount / 100,
          next_delivery_date: nextDelivery.toISOString().split('T')[0],
          gift_subscription: metadata.gift === 'true',
          gift_recipient_email: metadata.recipientEmail || undefined,
          recipient_name: metadata.recipientName || undefined,
        });

        // Send welcome email
        if (hasEmailCredentials(context.env)) {
          try {
            const resend = createEmailClient(context.env.RESEND_API_KEY);

            // Get customer email
            const customer = await stripe.customers.retrieve(subscription.customer as string);
            const email = (customer as Stripe.Customer).email;

            if (email) {
              const tierNames: Record<string, string> = {
                classic: 'Classic',
                luxe: 'Luxe',
                grand: 'Grand',
              };

              await sendSubscriptionWelcomeEmail(resend, {
                to: email,
                customerName: (customer as Stripe.Customer).name || 'Subscriber',
                tierName: tierNames[tier] || 'Classic',
                price: `$${priceAmount / 100}`,
                nextDeliveryDate: nextDelivery.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                }),
                env: context.env,
              });
            }
          } catch (emailErr) {
            console.error('Failed to send welcome email:', emailErr);
          }
        }
      },

      onSubscriptionUpdated: async (subscription) => {
        // Subscription status changed (paused, resumed, etc.)
        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (!existingSub) return;

        // Map Stripe status to our status
        let status: 'active' | 'paused' | 'cancelled' | 'past_due' = 'active';
        if (subscription.pause_collection) {
          status = 'paused';
        } else if (subscription.status === 'past_due') {
          status = 'past_due';
        } else if (subscription.status === 'canceled') {
          status = 'cancelled';
        }

        await updateSubscription(supabase, existingSub.id, {
          status,
          cancelled_at: subscription.canceled_at
            ? new Date(subscription.canceled_at * 1000).toISOString()
            : undefined,
        });
      },

      onSubscriptionDeleted: async (subscription) => {
        // Subscription cancelled
        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (!existingSub) return;

        await updateSubscription(supabase, existingSub.id, {
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
        });
      },

      onInvoicePaid: async (invoice) => {
        // Recurring payment successful - schedule next delivery
        if (!invoice.subscription) return;

        const subscriptionId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription.id;

        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('id, frequency')
          .eq('stripe_subscription_id', subscriptionId)
          .single();

        if (!existingSub) return;

        // Calculate next delivery date
        const nextDelivery = calculateNextDeliveryDate(
          existingSub.frequency as 'weekly' | 'biweekly' | 'monthly'
        );

        await updateSubscription(supabase, existingSub.id, {
          next_delivery_date: nextDelivery.toISOString().split('T')[0],
          status: 'active',
        });

        // Create delivery record
        await supabase.from('subscription_deliveries').insert({
          subscription_id: existingSub.id,
          delivery_date: nextDelivery.toISOString().split('T')[0],
          status: 'scheduled',
        });
      },

      onInvoicePaymentFailed: async (invoice) => {
        // Payment failed - mark as past due
        if (!invoice.subscription) return;

        const subscriptionId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription.id;

        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('stripe_subscription_id', subscriptionId)
          .single();

        if (!existingSub) return;

        await updateSubscription(supabase, existingSub.id, {
          status: 'past_due',
        });
      },
    });

    return successResponse({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);

    if (error instanceof Error) {
      return errorResponse(error.message, 500);
    }

    return errorResponse('Webhook processing failed', 500);
  }
};
