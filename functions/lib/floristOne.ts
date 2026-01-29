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
  PRODUCTCODE: string;
  NAME: string;
  DESCRIPTION: string;
  PRICE: number;
  SALEPRICE?: number;
  IMAGE: string;
  MEDIUMIMAGE: string;
  LARGEIMAGE: string;
  CATEGORY: string;
}

export interface FloristOneProductsResponse {
  PRODUCTS?: FloristOneProduct[];
  error?: string;
}

export interface FloristOneCartItem {
  ITEMID: string;
  PRODUCTCODE: string;
  NAME: string;
  PRICE: number;
  QUANTITY: number;
  IMAGE: string;
}

export interface FloristOneCart {
  CARTID: string;
  ITEMS: FloristOneCartItem[];
  SUBTOTAL: number;
  DELIVERYCHARGE: number;
  SERVICEFEE: number;
  TOTAL: number;
}

export interface FloristOneCartResponse {
  CART?: FloristOneCart;
  CARTID?: string;
  SUCCESS?: boolean;
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
  error?: string;
}

// Configuration
const API_BASE_URL = 'https://www.floristone.com/api/rest/flowershop';
const CART_API_BASE_URL = 'https://www.floristone.com/api/rest/shoppingcart';
const REQUEST_TIMEOUT = 30000;
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

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
    method: 'GET' | 'POST' | 'DELETE',
    baseUrl: string,
    endpoint: string,
    params?: Record<string, string>,
    body?: Record<string, unknown>,
    retries = MAX_RETRIES
  ): Promise<T> {
    const url = new URL(`${baseUrl}/${endpoint}`);

    // Add query params for GET requests
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
          'Authorization': this.authHeader,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

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
          return this.request<T>(method, baseUrl, endpoint, params, body, retries - 1);
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
    return this.request<FloristOneDeliveryDatesResponse>(
      'GET',
      API_BASE_URL,
      'checkdeliverydate',
      { zipcode }
    );
  }

  /**
   * Check if a specific date is available for delivery
   */
  async checkDeliveryDate(zipcode: string, date: string): Promise<FloristOneDeliveryDatesResponse> {
    return this.request<FloristOneDeliveryDatesResponse>(
      'GET',
      API_BASE_URL,
      'checkdeliverydate',
      { zipcode, date }
    );
  }

  /**
   * Get products by category
   * Categories: bd (birthday), sy (sympathy), ao (everyday), etc.
   */
  async getProducts(category: string, numProducts = 20, startAt = 0): Promise<FloristOneProductsResponse> {
    return this.request<FloristOneProductsResponse>(
      'GET',
      API_BASE_URL,
      'getproducts',
      {
        category,
        numproducts: numProducts.toString(),
        startat: startAt.toString(),
      }
    );
  }

  /**
   * Get order total
   */
  async getTotal(
    productCode: string,
    zipcode: string,
    deliveryDate: string
  ): Promise<FloristOneTotalResponse> {
    return this.request<FloristOneTotalResponse>(
      'GET',
      API_BASE_URL,
      'gettotal',
      {
        productcode: productCode,
        zipcode,
        deliverydate: deliveryDate,
      }
    );
  }

  /**
   * Create a new shopping cart
   */
  async createCart(): Promise<FloristOneCartResponse> {
    return this.request<FloristOneCartResponse>(
      'POST',
      CART_API_BASE_URL,
      'createcart'
    );
  }

  /**
   * Get cart contents
   */
  async getCart(cartId: string): Promise<FloristOneCartResponse> {
    return this.request<FloristOneCartResponse>(
      'GET',
      CART_API_BASE_URL,
      'getcart',
      { cartid: cartId }
    );
  }

  /**
   * Add item to cart
   */
  async addToCart(
    cartId: string,
    productCode: string,
    zipcode: string,
    deliveryDate: string,
    quantity = 1
  ): Promise<FloristOneCartResponse> {
    return this.request<FloristOneCartResponse>(
      'POST',
      CART_API_BASE_URL,
      'addtocart',
      {
        cartid: cartId,
        productcode: productCode,
        zipcode,
        deliverydate: deliveryDate,
        quantity: quantity.toString(),
      }
    );
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(cartId: string, itemId: string): Promise<FloristOneCartResponse> {
    return this.request<FloristOneCartResponse>(
      'POST',
      CART_API_BASE_URL,
      'removefromcart',
      {
        cartid: cartId,
        itemid: itemId,
      }
    );
  }

  /**
   * Clear all items from cart
   */
  async clearCart(cartId: string): Promise<FloristOneCartResponse> {
    return this.request<FloristOneCartResponse>(
      'POST',
      CART_API_BASE_URL,
      'clearcart',
      { cartid: cartId }
    );
  }

  /**
   * Destroy cart
   */
  async destroyCart(cartId: string): Promise<FloristOneCartResponse> {
    return this.request<FloristOneCartResponse>(
      'POST',
      CART_API_BASE_URL,
      'destroycart',
      { cartid: cartId }
    );
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
    const params: Record<string, string> = {};
    Object.entries(orderData).forEach(([key, value]) => {
      if (value !== undefined) {
        params[key] = value;
      }
    });

    return this.request<FloristOneOrderResponse>(
      'POST',
      API_BASE_URL,
      'placeorder',
      params
    );
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
