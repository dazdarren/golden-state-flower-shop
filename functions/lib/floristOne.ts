/**
 * Florist One API Client for Cloudflare Pages Functions
 *
 * Official Florist One API Documentation:
 * https://florist.one/api/documentation/
 *
 * Uses HTTP Basic Authentication and REST endpoints.
 */

export interface FloristOneEnv {
  FLORISTONE_AFFILIATE_ID: string;
  FLORISTONE_API_TOKEN: string;
}

// API Response Types
export interface FloristOneDeliveryDatesResponse {
  DATES?: string[];
  DATE_AVAILABLE?: boolean;
  error?: string;
}

export interface FloristOneProduct {
  CODE: string;
  NAME: string;
  DESCRIPTION: string;
  PRICE: number;
  DIMENSION?: string;
  SMALL: string;
  LARGE: string;
}

export interface FloristOneProductsResponse {
  PRODUCTS?: FloristOneProduct[];
  TOTAL?: number;
  error?: string;
}

export interface FloristOneCartCreateResponse {
  STATUS?: string;
  SESSIONID?: string;
  error?: string;
}

export interface FloristOneCartItem {
  CODE: string;
  NAME: string;
  PRICE: number;
  QUANTITY: number;
  SMALL: string;
}

export interface FloristOneCartResponse {
  SESSIONID?: string;
  ITEMS?: FloristOneCartItem[];
  SUBTOTAL?: number;
  STATUS?: string;
  error?: string;
}

export interface FloristOneTotalResponse {
  SUBTOTAL?: number;
  DELIVERYCHARGE?: number;
  SERVICEFEE?: number;
  TOTAL?: number;
  error?: string;
}

export interface FloristOneOrderResponse {
  ORDERID?: string;
  CONFIRMATIONNUMBER?: string;
  SUCCESS?: boolean;
  STATUS?: string;
  error?: string;
}

// Configuration
const FLOWERSHOP_API_URL = 'https://www.floristone.com/api/rest/flowershop';
const CART_API_URL = 'https://www.floristone.com/api/rest/shoppingcart';
const REQUEST_TIMEOUT = 30000;
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

// Category mapping from our occasion slugs to Florist One codes
export const OCCASION_TO_CATEGORY: Record<string, string> = {
  'birthday': 'bd',
  'sympathy': 'sy',
  'anniversary': 'an',
  'get-well': 'gw',
  'thank-you': 'ty',
  'love-romance': 'lr',
  'new-baby': 'nb',
  'everyday': 'ao',
  'best-sellers': 'bs',
};

/**
 * Florist One API Client
 */
export class FloristOneClient {
  private authHeader: string;

  constructor(env: FloristOneEnv) {
    if (!env.FLORISTONE_AFFILIATE_ID || !env.FLORISTONE_API_TOKEN) {
      throw new Error('Florist One credentials not configured');
    }
    // HTTP Basic Auth: base64(APIKey:APIPassword)
    const credentials = `${env.FLORISTONE_AFFILIATE_ID}:${env.FLORISTONE_API_TOKEN}`;
    this.authHeader = `Basic ${btoa(credentials)}`;
  }

  /**
   * Make an authenticated API request with retry logic
   */
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    body?: Record<string, unknown>,
    retries = MAX_RETRIES
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Authorization': this.authHeader,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: controller.signal,
      };

      // Always include body for POST/PUT/DELETE to ensure Content-Length is set
      if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
        options.body = body ? JSON.stringify(body) : '';
      }

      const response = await fetch(url, options);

      clearTimeout(timeoutId);

      if (response.status === 403) {
        throw new Error('Authentication failed - check API credentials');
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Florist One API error: ${response.status} - ${errorText}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);

      // Retry on network errors for GET requests
      if (method === 'GET' && retries > 0 && error instanceof Error) {
        if (error.name === 'AbortError' || error.message.includes('network')) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          return this.request<T>(method, url, body, retries - 1);
        }
      }

      throw error;
    }
  }

  /**
   * Get available delivery dates for a ZIP code
   * Returns array of dates in MM/DD/YYYY format
   */
  async getDeliveryDates(zipcode: string): Promise<FloristOneDeliveryDatesResponse> {
    const url = `${FLOWERSHOP_API_URL}/checkdeliverydate?zipcode=${encodeURIComponent(zipcode)}`;
    return this.request<FloristOneDeliveryDatesResponse>('GET', url);
  }

  /**
   * Check if a specific date is available for delivery
   * @param date - YYYY-MM-DD format
   */
  async checkDeliveryDate(zipcode: string, date: string): Promise<FloristOneDeliveryDatesResponse> {
    const url = `${FLOWERSHOP_API_URL}/checkdeliverydate?zipcode=${encodeURIComponent(zipcode)}&date=${encodeURIComponent(date)}`;
    return this.request<FloristOneDeliveryDatesResponse>('GET', url);
  }

  /**
   * Get products by category
   */
  async getProducts(
    category: string,
    count = 12,
    start = 1,
    sorttype?: 'pa' | 'pd' | 'az' | 'za'
  ): Promise<FloristOneProductsResponse> {
    let url = `${FLOWERSHOP_API_URL}/getproducts?category=${encodeURIComponent(category)}&count=${count}&start=${start}`;
    if (sorttype) {
      url += `&sorttype=${sorttype}`;
    }
    return this.request<FloristOneProductsResponse>('GET', url);
  }

  /**
   * Get single product by code
   */
  async getProduct(code: string): Promise<FloristOneProductsResponse> {
    const url = `${FLOWERSHOP_API_URL}/getproducts?code=${encodeURIComponent(code)}`;
    return this.request<FloristOneProductsResponse>('GET', url);
  }

  /**
   * Get order total
   */
  async getTotal(
    productCode: string,
    zipcode: string,
    deliveryDate: string
  ): Promise<FloristOneTotalResponse> {
    const url = `${FLOWERSHOP_API_URL}/gettotal?productcode=${encodeURIComponent(productCode)}&zipcode=${encodeURIComponent(zipcode)}&deliverydate=${encodeURIComponent(deliveryDate)}`;
    return this.request<FloristOneTotalResponse>('GET', url);
  }

  /**
   * Create a new shopping cart
   */
  async createCart(sessionId?: string): Promise<FloristOneCartCreateResponse> {
    const body = sessionId ? { sessionid: sessionId } : {};
    return this.request<FloristOneCartCreateResponse>('POST', CART_API_URL, body);
  }

  /**
   * Get cart contents
   */
  async getCart(sessionId: string): Promise<FloristOneCartResponse> {
    const url = `${CART_API_URL}?sessionid=${encodeURIComponent(sessionId)}`;
    return this.request<FloristOneCartResponse>('GET', url);
  }

  /**
   * Add item to cart
   */
  async addToCart(sessionId: string, productCode: string): Promise<FloristOneCartResponse> {
    const url = `${CART_API_URL}?sessionid=${encodeURIComponent(sessionId)}&action=add&productcode=${encodeURIComponent(productCode)}`;
    return this.request<FloristOneCartResponse>('PUT', url);
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(sessionId: string, productCode: string): Promise<FloristOneCartResponse> {
    const url = `${CART_API_URL}?sessionid=${encodeURIComponent(sessionId)}&action=remove&productcode=${encodeURIComponent(productCode)}`;
    return this.request<FloristOneCartResponse>('PUT', url);
  }

  /**
   * Clear all items from cart
   */
  async clearCart(sessionId: string): Promise<FloristOneCartResponse> {
    const url = `${CART_API_URL}?sessionid=${encodeURIComponent(sessionId)}&action=clear`;
    return this.request<FloristOneCartResponse>('PUT', url);
  }

  /**
   * Destroy cart
   */
  async destroyCart(sessionId: string): Promise<FloristOneCartResponse> {
    const url = `${CART_API_URL}?sessionid=${encodeURIComponent(sessionId)}&action=destroy`;
    return this.request<FloristOneCartResponse>('DELETE', url);
  }

  /**
   * Place order
   */
  async placeOrder(orderData: {
    productcode: string;
    deliverydate: string;
    recipientfirstname: string;
    recipientlastname: string;
    recipientaddress: string;
    recipientaddress2?: string;
    recipientcity: string;
    recipientstate: string;
    recipientzipcode: string;
    recipientphone: string;
    senderfirstname: string;
    senderlastname: string;
    senderemail: string;
    senderphone: string;
    cardmessage: string;
    specialinstructions?: string;
    ccnumber: string;
    ccexp: string;
    ccsecurity: string;
  }): Promise<FloristOneOrderResponse> {
    const params = new URLSearchParams();
    Object.entries(orderData).forEach(([key, value]) => {
      if (value !== undefined) {
        params.set(key, value);
      }
    });

    const url = `${FLOWERSHOP_API_URL}/placeorder?${params.toString()}`;
    return this.request<FloristOneOrderResponse>('POST', url);
  }
}

/**
 * Create a Florist One client from Cloudflare environment
 */
export function createFloristOneClient(env: FloristOneEnv): FloristOneClient {
  return new FloristOneClient(env);
}

/**
 * Check if Florist One credentials are configured
 */
export function hasFloristOneCredentials(env: FloristOneEnv): boolean {
  return !!(env.FLORISTONE_AFFILIATE_ID && env.FLORISTONE_API_TOKEN);
}
