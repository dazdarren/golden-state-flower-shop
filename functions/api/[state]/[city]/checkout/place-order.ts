/**
 * POST /api/{state}/{city}/checkout/place-order
 * Places an order with Florist One using AuthorizeNet payment token
 * and saves the order to the database for order history
 */

import { createFloristOneClient, hasFloristOneCredentials, FloristOneEnv } from '../../../../lib/floristOne';
import {
  createSupabaseClient,
  hasSupabaseCredentials,
  createOrder as createDatabaseOrder,
  extractBearerToken,
  getUserFromToken,
  markCartRecovered,
  SupabaseEnv,
} from '../../../../lib/supabase';
import {
  createEmailClient,
  hasEmailCredentials,
  sendOrderConfirmationEmail,
  EmailEnv,
} from '../../../../lib/email';
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

interface Env extends FloristOneEnv, Partial<SupabaseEnv>, Partial<EmailEnv> {}

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

    // Still save mock orders to database for testing order history
    let savedOrderId: string | undefined;
    if (hasSupabaseCredentials(env)) {
      try {
        const supabase = createSupabaseClient(env as SupabaseEnv);
        const recipient = recipientResult.data!;
        const sender = senderResult.data!;
        const card = cardResult.data!;

        // Check if user is authenticated
        let userId: string | undefined;
        const token = extractBearerToken(request);
        if (token) {
          const user = await getUserFromToken(supabase, token);
          if (user) {
            userId = user.id;
          }
        }

        // Create a mock order in database
        const savedOrder = await createDatabaseOrder(
          supabase,
          {
            user_id: userId,
            guest_email: userId ? undefined : sender.email,
            florist_one_order_id: mockOrderId,
            florist_one_confirmation: mockOrderId,
            subtotal: 59.99, // Mock subtotal
            delivery_fee: 14.99,
            tax: 0,
            total: 74.98,
            customer_name: `${sender.firstName} ${sender.lastName}`,
            customer_email: sender.email,
            customer_phone: sender.phone,
            billing_address: {
              address1: body.sender.address1 || 'N/A',
              city: body.sender.city || recipient.city,
              state: body.sender.state || recipient.state,
              zip: body.sender.zip || recipient.zip,
            },
          },
          [{
            product_code: 'MOCK_PRODUCT',
            product_name: 'Mock Flower Arrangement',
            price: 59.99,
            delivery_date: dateResult.data!,
            recipient_name: `${recipient.firstName} ${recipient.lastName}`,
            recipient_address: {
              address1: recipient.address1,
              address2: recipient.address2,
              city: recipient.city,
              state: recipient.state,
              zip: recipient.zip,
            },
            card_message: card.signature
              ? `${card.message}\n\n${card.signature}`
              : card.message,
            special_instructions: instructionsResult.data,
          }]
        );
        savedOrderId = savedOrder.id;
      } catch (dbError) {
        console.error('Failed to save mock order to database:', dbError);
      }
    }

    const clearCookie = clearCartCookie(stateSlug, citySlug, isProduction);

    const response = successResponse({
      orderId: mockOrderId,
      confirmationNumber: mockOrderId,
      databaseOrderId: savedOrderId,
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

    // Calculate order total by calling FlowerShop API gettotal for each product
    let orderTotalFromApi = 0;

    for (const product of products) {
      const totalResult = await client.getTotal(
        product.CODE,
        recipientResult.data!.zip,
        dateResult.data!,
        product.PRICE
      );
      // Check for API error
      if (totalResult.error) {
        return errorResponse(`Unable to calculate order total: ${totalResult.error}`, 500);
      }

      // ORDERTOTAL is the authoritative total from Florist One - we MUST use it
      if (typeof totalResult.ORDERTOTAL === 'number' && totalResult.ORDERTOTAL > 0) {
        orderTotalFromApi += totalResult.ORDERTOTAL;
      } else {
        // API didn't return ORDERTOTAL - this is a critical error
        return errorResponse('Unable to calculate order total. Please try again.', 500);
      }
    }

    const orderTotal = Math.round(orderTotalFromApi * 100) / 100;

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

    // Check for success - API returns ORDERNO (not ORDERID)
    if (!result.ORDERID && !result.ORDERNO && !result.SUCCESS) {
      // Return detailed error to help debug
      const errorMsg = result.error || result.STATUS || (result as Record<string, unknown>).MESSAGE || (result as Record<string, unknown>).ERRORMESSAGE;
      return errorResponse(errorMsg ? String(errorMsg) : `Order rejected. Response: ${JSON.stringify(result)}`, 500);
    }

    const actualOrderId = result.ORDERID || (result.ORDERNO ? String(result.ORDERNO) : undefined);
    const confirmationNumber = result.CONFIRMATIONNUMBER || actualOrderId;

    // Save order to database for order history
    let savedOrderId: string | undefined;
    if (hasSupabaseCredentials(env)) {
      try {
        const supabase = createSupabaseClient(env as SupabaseEnv);

        // Check if user is authenticated
        let userId: string | undefined;
        const token = extractBearerToken(request);
        if (token) {
          const user = await getUserFromToken(supabase, token);
          if (user) {
            userId = user.id;
          }
        }

        // Calculate totals - derive from the order total we already have
        // The delivery fee is typically $14.99 from our site
        const deliveryFee = 14.99;
        const subtotal = Math.round((orderTotal - deliveryFee) * 100) / 100;
        const tax = 0; // Tax is included in Florist One's ORDERTOTAL

        // Save order to database
        const savedOrder = await createDatabaseOrder(
          supabase,
          {
            user_id: userId,
            guest_email: userId ? undefined : sender.email,
            florist_one_order_id: actualOrderId,
            florist_one_confirmation: confirmationNumber,
            subtotal,
            delivery_fee: deliveryFee,
            tax,
            total: orderTotal,
            customer_name: `${sender.firstName} ${sender.lastName}`,
            customer_email: sender.email,
            customer_phone: sender.phone,
            billing_address: {
              address1: body.sender.address1 || 'N/A',
              city: body.sender.city || recipient.city,
              state: body.sender.state || recipient.state,
              zip: body.sender.zip || recipient.zip,
            },
          },
          products.map((p) => ({
            product_code: p.CODE,
            product_name: p.NAME || p.CODE,
            price: p.PRICE,
            delivery_date: dateResult.data!,
            recipient_name: `${recipient.firstName} ${recipient.lastName}`,
            recipient_address: {
              address1: recipient.address1,
              address2: recipient.address2,
              city: recipient.city,
              state: recipient.state,
              zip: recipient.zip,
            },
            card_message: card.signature
              ? `${card.message}\n\n${card.signature}`
              : card.message,
            special_instructions: instructionsResult.data,
          }))
        );
        savedOrderId = savedOrder.id;
      } catch (dbError) {
        // Log but don't fail the order - the Florist One order already succeeded
        console.error('Failed to save order to database:', dbError);
      }
    }

    // Mark abandoned cart as recovered
    if (hasSupabaseCredentials(env)) {
      try {
        const supabase = createSupabaseClient(env as SupabaseEnv);
        await markCartRecovered(supabase, cartId);
      } catch (recoverError) {
        // Log but don't fail - cart recovery tracking is non-critical
        console.error('Failed to mark cart as recovered:', recoverError);
      }
    }

    // Send order confirmation email
    if (hasEmailCredentials(env)) {
      try {
        const resend = createEmailClient(env.RESEND_API_KEY!);
        const deliveryDateFormatted = new Date(dateResult.data! + 'T00:00:00').toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });

        await sendOrderConfirmationEmail(resend, {
          to: sender.email,
          env: env as EmailEnv,
          orderNumber: confirmationNumber || actualOrderId || 'N/A',
          customerName: `${sender.firstName} ${sender.lastName}`,
          orderTotal: `$${orderTotal.toFixed(2)}`,
          deliveryDate: deliveryDateFormatted,
          recipientName: `${recipient.firstName} ${recipient.lastName}`,
          recipientAddress: `${recipient.address1}${recipient.address2 ? ', ' + recipient.address2 : ''}, ${recipient.city}, ${recipient.state} ${recipient.zip}`,
          items: products.map((p) => ({
            name: p.NAME || p.CODE,
            price: `$${p.PRICE.toFixed(2)}`,
          })),
        });
      } catch (emailError) {
        // Log but don't fail the order
        console.error('Failed to send order confirmation email:', emailError);
      }
    }

    // Clear cart cookie on successful order
    const clearCookie = clearCartCookie(stateSlug, citySlug, isProduction);

    const response = successResponse({
      orderId: actualOrderId,
      confirmationNumber,
      databaseOrderId: savedOrderId,
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
