/**
 * POST /api/{state}/{city}/orders/lookup
 * Look up a guest order by email and order ID
 */

import {
  createSupabaseClient,
  hasSupabaseCredentials,
  getGuestOrder,
  SupabaseEnv,
} from '../../../../lib/supabase';
import { validateSlug } from '../../../../lib/validation';
import {
  successResponse,
  errorResponse,
  handleCors,
  methodNotAllowedResponse,
} from '../../../../lib/response';

interface Env extends Partial<SupabaseEnv> {}

interface LookupBody {
  email: string;
  orderId: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, params, env } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return handleCors();
  }

  // Only allow POST
  if (request.method !== 'POST') {
    return methodNotAllowedResponse(['POST', 'OPTIONS']);
  }

  // Validate route params
  const stateResult = validateSlug(params.state);
  if (!stateResult.success) {
    return errorResponse(stateResult.error!);
  }

  const cityResult = validateSlug(params.city);
  if (!cityResult.success) {
    return errorResponse(cityResult.error!);
  }

  // Check Supabase credentials
  if (!hasSupabaseCredentials(env)) {
    return errorResponse('Order lookup not available', 500);
  }

  // Parse request body
  let body: LookupBody;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body');
  }

  // Validate email
  const email = body.email?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return errorResponse('Valid email is required');
  }

  // Validate order ID
  const orderId = body.orderId?.trim();
  if (!orderId || orderId.length < 3) {
    return errorResponse('Order ID or confirmation number is required');
  }

  try {
    const supabase = createSupabaseClient(env as SupabaseEnv);
    const order = await getGuestOrder(supabase, email, orderId);

    if (!order) {
      // Don't reveal if email exists - just say not found
      return errorResponse('Order not found. Please check your email and order number.', 404);
    }

    // Return order details (excluding sensitive info)
    return successResponse({
      orderId: order.florist_one_order_id,
      confirmationNumber: order.florist_one_confirmation,
      status: order.status || 'processing',
      orderDate: order.created_at,
      subtotal: order.subtotal,
      deliveryFee: order.delivery_fee,
      tax: order.tax,
      total: order.total,
      items: order.items.map((item) => ({
        name: item.product_name,
        price: item.price,
        deliveryDate: item.delivery_date,
        recipientName: item.recipient_name,
      })),
    });
  } catch (error) {
    console.error('Order lookup error:', error);
    return errorResponse('Unable to look up order. Please try again.', 500);
  }
};
