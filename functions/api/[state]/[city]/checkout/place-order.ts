/**
 * POST /api/{state}/{city}/checkout/place-order
 * Places an order with Florist One
 */

import { createFloristOneClient, FloristOneEnv } from '../../../../lib/floristOne';
import {
  validateSlug,
  validateDate,
  validateRecipient,
  validateSender,
  validateCard,
  validateOptionalString,
} from '../../../../lib/validation';
import {
  successResponse,
  errorResponse,
  handleCors,
  methodNotAllowedResponse,
  serverErrorResponse,
} from '../../../../lib/response';
import {
  getCartIdFromCookies,
  clearCartCookie,
  addCookieToResponse,
} from '../../../../lib/cookies';

interface Env extends FloristOneEnv {}

interface PlaceOrderBody {
  deliveryDate: string;
  recipient: {
    firstName: string;
    lastName: string;
    phone: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
  };
  sender: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  card: {
    message: string;
    signature?: string;
  };
  specialInstructions?: string;
  // TODO: Payment integration
  // In production, this would be a tokenized payment from Stripe, Square, etc.
  // The payment_token should be obtained client-side and passed here
  paymentToken?: string;
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

  const stateSlug = stateResult.data!;
  const citySlug = cityResult.data!;

  // Get cart ID from cookie
  const cartId = getCartIdFromCookies(request);
  if (!cartId) {
    return errorResponse('No cart found. Please add items before checking out.', 400);
  }

  // Parse request body
  let body: PlaceOrderBody;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body');
  }

  // Validate delivery date
  const dateResult = validateDate(body.deliveryDate);
  if (!dateResult.success) {
    return errorResponse(`Delivery date: ${dateResult.error}`);
  }

  // Validate recipient
  const recipientResult = validateRecipient(body.recipient);
  if (!recipientResult.success) {
    return errorResponse(`Recipient: ${recipientResult.error}`);
  }

  // Validate sender
  const senderResult = validateSender(body.sender);
  if (!senderResult.success) {
    return errorResponse(`Sender: ${senderResult.error}`);
  }

  // Validate card
  const cardResult = validateCard(body.card);
  if (!cardResult.success) {
    return errorResponse(`Card: ${cardResult.error}`);
  }

  // Validate optional special instructions
  const instructionsResult = validateOptionalString(
    body.specialInstructions,
    'Special instructions',
    1000
  );
  if (!instructionsResult.success) {
    return errorResponse(instructionsResult.error!);
  }

  const isProduction = request.url.startsWith('https://');

  // Handle mock carts
  if (cartId.startsWith('mock_cart_')) {
    const mockOrderId = `MOCK_${Date.now()}_${Math.random().toString(36).substring(7).toUpperCase()}`;
    const clearCookie = clearCartCookie(stateSlug, citySlug, isProduction);

    const response = successResponse({
      orderId: mockOrderId,
      confirmationNumber: mockOrderId,
      mock: true,
      message: 'Mock order placed - Florist One credentials not configured',
      orderDetails: {
        deliveryDate: dateResult.data,
        recipient: recipientResult.data,
        sender: senderResult.data,
        card: cardResult.data,
      },
    });

    return addCookieToResponse(response, clearCookie);
  }

  // Check credentials
  if (!env.FLORISTONE_AFFILIATE_ID || !env.FLORISTONE_API_TOKEN) {
    return errorResponse('Florist One credentials not configured', 500);
  }

  // TODO: Payment Integration
  // In a production system, you would:
  // 1. Validate the payment token from body.paymentToken
  // 2. Or integrate with Florist One's payment processing
  // 3. The actual payment processing depends on Florist One's API requirements
  //
  // For MVP, we're wiring up the order placement endpoint but payment
  // token handling is stubbed. The request shape is correct.

  if (!body.paymentToken) {
    // In production, this would be a hard error
    // For MVP/testing, we'll note this but try to proceed
    console.warn('No payment token provided - order may fail on production API');
  }

  try {
    const client = createFloristOneClient(env);
    const recipient = recipientResult.data!;
    const sender = senderResult.data!;
    const card = cardResult.data!;

    const result = await client.placeOrder({
      cart_id: cartId,
      delivery_date: dateResult.data!,
      recipient_first_name: recipient.firstName,
      recipient_last_name: recipient.lastName,
      recipient_phone: recipient.phone,
      recipient_address1: recipient.address1,
      recipient_address2: recipient.address2,
      recipient_city: recipient.city,
      recipient_state: recipient.state,
      recipient_zip: recipient.zip,
      sender_first_name: sender.firstName,
      sender_last_name: sender.lastName,
      sender_email: sender.email,
      sender_phone: sender.phone,
      card_message: card.signature
        ? `${card.message}\n\n${card.signature}`
        : card.message,
      special_instructions: instructionsResult.data,
      payment_token: body.paymentToken,
    });

    if (result.status !== 'success') {
      return errorResponse(result.error || 'Failed to place order', 500);
    }

    // Clear cart cookie on successful order
    const clearCookie = clearCartCookie(stateSlug, citySlug, isProduction);

    const response = successResponse({
      orderId: result.order_id,
      confirmationNumber: result.confirmation_number,
      estimatedDelivery: result.estimated_delivery,
      total: result.total,
    });

    return addCookieToResponse(response, clearCookie);
  } catch (error) {
    console.error('Florist One API error:', error);
    return serverErrorResponse(
      error instanceof Error ? error.message : 'Failed to place order'
    );
  }
};
