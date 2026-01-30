/**
 * GET /api/cron/send-abandoned-cart-emails
 * Sends recovery emails for abandoned carts
 *
 * Should be triggered by a cron job (e.g., Cloudflare Workers Cron)
 * Recommended: Run every hour
 */

import {
  createSupabaseClient,
  hasSupabaseCredentials,
  SupabaseEnv,
} from '../../lib/supabase';
import {
  createEmailClient,
  hasEmailCredentials,
  sendAbandonedCartEmail,
  EmailEnv,
} from '../../lib/email';
import {
  successResponse,
  errorResponse,
  handleCors,
  methodNotAllowedResponse,
} from '../../lib/response';

interface Env extends Partial<SupabaseEnv>, Partial<EmailEnv> {
  CRON_SECRET?: string;
}

interface AbandonedCart {
  id: string;
  email: string;
  cart_session_id: string;
  cart_data: {
    items: Array<{
      sku: string;
      name: string;
      price: number;
      quantity: number;
      image?: string;
    }>;
    subtotal: number;
  };
  created_at: string;
  recovered: boolean;
  email_sent: boolean;
  email_sent_at: string | null;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return handleCors();
  }

  // Only allow GET or POST
  if (request.method !== 'GET' && request.method !== 'POST') {
    return methodNotAllowedResponse(['GET', 'POST', 'OPTIONS']);
  }

  // Verify cron secret if configured (for security)
  if (env.CRON_SECRET) {
    const url = new URL(request.url);
    const providedSecret = url.searchParams.get('secret') ||
                          request.headers.get('X-Cron-Secret');
    if (providedSecret !== env.CRON_SECRET) {
      return errorResponse('Unauthorized', 401);
    }
  }

  // Check credentials
  if (!hasSupabaseCredentials(env)) {
    return errorResponse('Supabase not configured', 500);
  }

  if (!hasEmailCredentials(env)) {
    return errorResponse('Email service not configured', 500);
  }

  try {
    const supabase = createSupabaseClient(env as SupabaseEnv);
    const resend = createEmailClient(env.RESEND_API_KEY!);
    const siteUrl = 'https://goldenstateflowershop.com';

    // Query carts abandoned 1-24 hours ago that haven't been recovered
    // and haven't had an email sent yet
    const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString();
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: abandonedCarts, error: queryError } = await supabase
      .from('abandoned_carts')
      .select('*')
      .eq('recovered', false)
      .eq('email_sent', false)
      .lt('created_at', oneHourAgo)
      .gt('created_at', twentyFourHoursAgo)
      .limit(50); // Process in batches

    if (queryError) {
      throw queryError;
    }

    if (!abandonedCarts || abandonedCarts.length === 0) {
      return successResponse({
        processed: 0,
        message: 'No abandoned carts to process',
      });
    }

    const results = {
      sent: 0,
      skipped: 0,
      failed: 0,
    };

    for (const cart of abandonedCarts as AbandonedCart[]) {
      try {
        // Skip if cart data is invalid
        if (!cart.cart_data?.items || cart.cart_data.items.length === 0) {
          results.skipped++;
          continue;
        }

        // Check if an order was placed with this email recently
        // (within 24 hours after cart was created)
        const orderCheckTime = new Date(
          new Date(cart.created_at).getTime() + 24 * 60 * 60 * 1000
        ).toISOString();

        const { data: recentOrder } = await supabase
          .from('orders')
          .select('id')
          .or(`customer_email.eq.${cart.email},guest_email.eq.${cart.email}`)
          .gt('created_at', cart.created_at)
          .lt('created_at', orderCheckTime)
          .limit(1);

        if (recentOrder && recentOrder.length > 0) {
          // Mark as recovered since they completed an order
          await supabase
            .from('abandoned_carts')
            .update({
              recovered: true,
              recovered_at: new Date().toISOString(),
            })
            .eq('id', cart.id);
          results.skipped++;
          continue;
        }

        // Generate recovery URL
        const recoveryToken = btoa(cart.cart_session_id);
        const recoveryUrl = `${siteUrl}/api/cart/recover?token=${encodeURIComponent(recoveryToken)}`;

        // Calculate cart total
        const cartTotal = cart.cart_data.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        // Send recovery email
        await sendAbandonedCartEmail(resend, {
          to: cart.email,
          env: env as EmailEnv,
          items: cart.cart_data.items.map((item) => ({
            name: item.name,
            price: `$${item.price.toFixed(2)}`,
            imageUrl: item.image,
          })),
          cartTotal: `$${cartTotal.toFixed(2)}`,
          recoveryUrl,
        });

        // Mark email as sent
        await supabase
          .from('abandoned_carts')
          .update({
            email_sent: true,
            email_sent_at: new Date().toISOString(),
          })
          .eq('id', cart.id);

        results.sent++;
      } catch (error) {
        console.error(`Failed to process cart ${cart.id}:`, error);
        results.failed++;
      }
    }

    return successResponse({
      processed: abandonedCarts.length,
      ...results,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to process abandoned carts',
      500
    );
  }
};
