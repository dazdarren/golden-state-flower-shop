/**
 * Florist One API Client for Cloudflare Pages Functions
 *
 * Official Florist One API Documentation:
 * https://www.floristone.com/api/
 *
 * This client implements the core API endpoints needed for:
 * - Delivery date checking
 * - Shopping cart management
 * - Order placement
 */

export interface FloristOneEnv {
  FLORISTONE_AFFILIATE_ID: string;
  FLORISTONE_API_TOKEN: string;
  FLORISTONE_API_BASE_URL?: string;
}

// API Response Types
export interface FloristOneDeliveryDate {
  delivery_date: string;
  delivery_day: string;
  delivery_charge: number;
  available: boolean;
}

export interface FloristOneDeliveryDatesResponse {
  status: string;
  delivery_dates?: FloristOneDeliveryDate[];
  error?: string;
}

export interface FloristOneProduct {
  product_code: string;
  product_name: string;
  description: string;
  price: number;
  sale_price?: number;
  image_url_small: string;
  image_url_medium: string;
  image_url_large: string;
  category: string;
  available: boolean;
}

export interface FloristOneProductResponse {
  status: string;
  product?: FloristOneProduct;
  error?: string;
}

export interface FloristOneCartItem {
  item_id: string;
  product_code: string;
  product_name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface FloristOneCart {
  cart_id: string;
  items: FloristOneCartItem[];
  subtotal: number;
  delivery_charge: number;
  service_fee: number;
  total: number;
  delivery_date?: string;
  delivery_zip?: string;
}

export interface FloristOneCartResponse {
  status: string;
  cart?: FloristOneCart;
  error?: string;
}

export interface FloristOneOrderResponse {
  status: string;
  order_id?: string;
  confirmation_number?: string;
  estimated_delivery?: string;
  total?: number;
  error?: string;
}

// Configuration
const DEFAULT_API_BASE_URL = 'https://www.floristone.com/api/rest';
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

/**
 * Florist One API Client
 */
export class FloristOneClient {
  private affiliateId: string;
  private apiToken: string;
  private baseUrl: string;

  constructor(env: FloristOneEnv) {
    if (!env.FLORISTONE_AFFILIATE_ID || !env.FLORISTONE_API_TOKEN) {
      throw new Error('Florist One credentials not configured');
    }
    this.affiliateId = env.FLORISTONE_AFFILIATE_ID;
    this.apiToken = env.FLORISTONE_API_TOKEN;
    this.baseUrl = env.FLORISTONE_API_BASE_URL || DEFAULT_API_BASE_URL;
  }

  /**
   * Make an authenticated API request with retry logic
   */
  private async request<T>(
    method: 'GET' | 'POST' | 'DELETE',
    endpoint: string,
    params?: Record<string, string>,
    body?: Record<string, unknown>,
    retries = MAX_RETRIES
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    // Add auth params
    url.searchParams.set('aid', this.affiliateId);
    url.searchParams.set('token', this.apiToken);

    // Add additional params
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(url.toString(), {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Florist One API error: ${response.status} - ${errorText}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);

      // Retry on network errors for idempotent GET requests
      if (method === 'GET' && retries > 0 && error instanceof Error) {
        if (error.name === 'AbortError' || error.message.includes('network')) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          return this.request<T>(method, endpoint, params, body, retries - 1);
        }
      }

      throw error;
    }
  }

  /**
   * Get available delivery dates for a ZIP code
   * API Endpoint: /deliverydates
   */
  async getDeliveryDates(zip: string): Promise<FloristOneDeliveryDatesResponse> {
    return this.request<FloristOneDeliveryDatesResponse>('GET', '/deliverydates', {
      zip,
    });
  }

  /**
   * Get product details by SKU
   * API Endpoint: /product
   */
  async getProduct(productCode: string): Promise<FloristOneProductResponse> {
    return this.request<FloristOneProductResponse>('GET', '/product', {
      code: productCode,
    });
  }

  /**
   * Create a new shopping cart
   * API Endpoint: /cart/create
   */
  async createCart(): Promise<FloristOneCartResponse> {
    return this.request<FloristOneCartResponse>('POST', '/cart/create');
  }

  /**
   * Get cart contents
   * API Endpoint: /cart
   */
  async getCart(cartId: string): Promise<FloristOneCartResponse> {
    return this.request<FloristOneCartResponse>('GET', '/cart', {
      cart_id: cartId,
    });
  }

  /**
   * Add item to cart
   * API Endpoint: /cart/add
   */
  async addToCart(
    cartId: string,
    productCode: string,
    quantity: number,
    deliveryZip?: string,
    deliveryDate?: string
  ): Promise<FloristOneCartResponse> {
    return this.request<FloristOneCartResponse>('POST', '/cart/add', undefined, {
      cart_id: cartId,
      product_code: productCode,
      quantity,
      delivery_zip: deliveryZip,
      delivery_date: deliveryDate,
    });
  }

  /**
   * Remove item from cart
   * API Endpoint: /cart/remove
   */
  async removeFromCart(cartId: string, itemId: string): Promise<FloristOneCartResponse> {
    return this.request<FloristOneCartResponse>('POST', '/cart/remove', undefined, {
      cart_id: cartId,
      item_id: itemId,
    });
  }

  /**
   * Destroy cart
   * API Endpoint: /cart/destroy
   */
  async destroyCart(cartId: string): Promise<FloristOneCartResponse> {
    return this.request<FloristOneCartResponse>('POST', '/cart/destroy', undefined, {
      cart_id: cartId,
    });
  }

  /**
   * Place order
   * API Endpoint: /order/place
   *
   * TODO: Payment token integration
   * In production, the payment_token should come from a secure payment processor
   * (Stripe, Square, etc.) and never be raw card data passing through your server.
   */
  async placeOrder(orderData: {
    cart_id: string;
    delivery_date: string;
    recipient_first_name: string;
    recipient_last_name: string;
    recipient_phone: string;
    recipient_address1: string;
    recipient_address2?: string;
    recipient_city: string;
    recipient_state: string;
    recipient_zip: string;
    sender_first_name: string;
    sender_last_name: string;
    sender_email: string;
    sender_phone: string;
    card_message: string;
    special_instructions?: string;
    // TODO: Payment integration - this would be a tokenized payment in production
    payment_token?: string;
  }): Promise<FloristOneOrderResponse> {
    return this.request<FloristOneOrderResponse>('POST', '/order/place', undefined, orderData);
  }
}

/**
 * Create a Florist One client from Cloudflare environment
 */
export function createFloristOneClient(env: FloristOneEnv): FloristOneClient {
  return new FloristOneClient(env);
}
