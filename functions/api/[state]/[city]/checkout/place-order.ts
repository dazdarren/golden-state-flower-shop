/**
 * POST /api/{state}/{city}/checkout/place-order
 * Places an order with Florist One using AuthorizeNet payment token
 */

import { createFloristOneClient, hasFloristOneCredentials, FloristOneEnv } from '../../../../lib/floristOne';
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
    address1?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  card: {
    message: string;
    signature?: string;
  };
  specialInstructions?: string;
  paymentToken: string;
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
    100
  );
  if (!instructionsResult.success) {
    return errorResponse(instructionsResult.error!);
  }

  // Validate payment token
  if (!body.paymentToken) {
    return errorResponse('Payment information is required', 400);
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
    });

    return addCookieToResponse(response, clearCookie);
  }

  // Check credentials
  if (!hasFloristOneCredentials(env)) {
    return errorResponse('Payment processing not configured', 500);
  }

  try {
    const client = createFloristOneClient(env);
    const recipient = recipientResult.data!;
    const sender = senderResult.data!;
    const card = cardResult.data!;

    // Fetch cart to get products
    const cartResult = await client.getCart(cartId);
    const products = cartResult.products || [];

    if (products.length === 0) {
      return errorResponse('Cart is empty', 400);
    }

    // Calculate order total by calling getTotal for each product
    // Sum up subtotal + tax for each, then add delivery once
    let subtotalSum = 0;
    let taxSum = 0;
    let deliveryCharge = 0;

    for (const product of products) {
      const totalResult = await client.getTotal(
        product.CODE,
        recipientResult.data!.zip,
        dateResult.data!
      );
      console.log('getTotal for', product.CODE, ':', JSON.stringify(totalResult));

      // Use API's SUBTOTAL if available, otherwise use product price
      const productSubtotal = totalResult.SUBTOTAL || product.PRICE;
      const productTax = totalResult.FLORISTONETAX || 0;

      subtotalSum += productSubtotal;
      taxSum += productTax;

      // Capture delivery charge (same for all products to same address)
      if (!deliveryCharge && totalResult.FLORISTONEDELIVERYCHARGE) {
        deliveryCharge = totalResult.FLORISTONEDELIVERYCHARGE;
      }
    }

    // Order total = sum of subtotals + one delivery charge + sum of taxes
    const orderTotal = Math.round((subtotalSum + deliveryCharge + taxSum) * 100) / 100;

    console.log('Products:', products.length, 'Subtotal:', subtotalSum,
                'Delivery:', deliveryCharge, 'Tax:', taxSum, 'OrderTotal:', orderTotal);

    // Get client IP
    const clientIp = request.headers.get('cf-connecting-ip') ||
                     request.headers.get('x-forwarded-for')?.split(',')[0] ||
                     '0.0.0.0';

    // Build products array for API
    const orderProducts = products.map((p) => ({
      code: p.CODE,
      price: p.PRICE,
      deliverydate: dateResult.data!,
      cardmessage: card.signature
        ? `${card.message}\n\n${card.signature}`
        : card.message,
      specialinstructions: instructionsResult.data,
      recipient: {
        name: `${recipient.firstName} ${recipient.lastName}`,
        address1: recipient.address1,
        address2: recipient.address2,
        city: recipient.city,
        state: recipient.state,
        country: 'US',
        phone: recipient.phone,
        zipcode: recipient.zip,
      },
    }));

    // Place order with Florist One
    const result = await client.placeOrder({
      customer: {
        name: `${sender.firstName} ${sender.lastName}`,
        email: sender.email,
        address1: body.sender.address1 || 'N/A',
        city: body.sender.city || recipient.city,
        state: body.sender.state || recipient.state,
        country: 'US',
        phone: sender.phone,
        zipcode: body.sender.zip || recipient.zip,
        ip: clientIp,
      },
      products: orderProducts,
      ccinfo: {
        authorizenet_token: body.paymentToken,
      },
      ordertotal: orderTotal,
    });

    // Log the full response for debugging
    console.log('Florist One placeOrder response:', JSON.stringify(result));

    if (!result.ORDERID && !result.SUCCESS) {
      // Return detailed error to help debug
      const errorMsg = result.error || result.STATUS || (result as Record<string, unknown>).MESSAGE || (result as Record<string, unknown>).ERRORMESSAGE;
      return errorResponse(errorMsg ? String(errorMsg) : `Order rejected. Response: ${JSON.stringify(result)}`, 500);
    }

    // Clear cart cookie on successful order
    const clearCookie = clearCartCookie(stateSlug, citySlug, isProduction);

    const response = successResponse({
      orderId: result.ORDERID,
      confirmationNumber: result.CONFIRMATIONNUMBER || result.ORDERID,
    });

    return addCookieToResponse(response, clearCookie);
  } catch (error) {
    console.error('Florist One API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to place order';
    // Return a more user-friendly message but log the full error
    if (errorMessage.includes('500')) {
      return errorResponse('Payment could not be processed. Please verify your card details and try again.', 500);
    }
    return serverErrorResponse(errorMessage);
  }
};
