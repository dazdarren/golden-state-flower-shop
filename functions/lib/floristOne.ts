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
  CURRENCY?: string;
  STRIPE_PRICE_ID?: string;
}

export interface FloristOneCartResponse {
  products?: FloristOneCartItem[];
  productcount?: number;
  mixed?: boolean;
  STATUS?: string;
  error?: string;
}

export interface FloristOneCartActionResponse {
  STATUS?: string;
  error?: string;
}

export interface FloristOneTotalResponse {
  SUBTOTAL?: number;
  ORDERTOTAL?: number;
  FLORISTONEDELIVERYCHARGE?: number;
  DELIVERYCHARGETOTAL?: number;
  TAXTOTAL?: number;
  FLORISTONETAX?: number;
  error?: string;
}

export interface FloristOneOrderResponse {
  ORDERID?: string;
  ORDERNO?: number;
  CONFIRMATIONNUMBER?: string;
  SUCCESS?: boolean;
  STATUS?: string;
  error?: string;
}

export interface FloristOneAuthorizeNetKeyResponse {
  USERNAME?: string;
  AUTHORIZENET_KEY?: string;
  AUTHORIZENET_URL?: string;
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
   * FlowerShop API gettotal format:
   * products=[{"CODE":"X","PRICE":70,"RECIPIENT":{"ZIPCODE":"12345"}}]
   * Note: deliveryDate is kept in signature for backward compatibility but is not sent
   * to gettotal (it's only needed for placeOrder)
   */
  async getTotal(
    productCode: string,
    zipcode: string,
    deliveryDate: string,
    price?: number
  ): Promise<FloristOneTotalResponse> {
    // Ensure price has decimal places (API may require it)
    const priceValue = Math.round((price || 0) * 100) / 100;
    const productData = [{
      CODE: productCode,
      PRICE: priceValue,
      RECIPIENT: {
        ZIPCODE: zipcode,
      },
    }];
    const products = JSON.stringify(productData);
    const url = `${FLOWERSHOP_API_URL}/gettotal?products=${encodeURIComponent(products)}`;
    console.log('getTotal request - URL:', url);
    console.log('getTotal request - products:', products);
    const result = await this.request<FloristOneTotalResponse>('GET', url);
    console.log('getTotal response:', JSON.stringify(result));
    return result;
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
   * Add item to cart (returns status only, call getCart for contents)
   */
  async addToCart(sessionId: string, productCode: string): Promise<FloristOneCartActionResponse> {
    const url = `${CART_API_URL}?sessionid=${encodeURIComponent(sessionId)}&action=add&productcode=${encodeURIComponent(productCode)}`;
    return this.request<FloristOneCartActionResponse>('PUT', url);
  }

  /**
   * Remove item from cart (returns status only)
   */
  async removeFromCart(sessionId: string, productCode: string): Promise<FloristOneCartActionResponse> {
    const url = `${CART_API_URL}?sessionid=${encodeURIComponent(sessionId)}&action=remove&productcode=${encodeURIComponent(productCode)}`;
    return this.request<FloristOneCartActionResponse>('PUT', url);
  }

  /**
   * Clear all items from cart (returns status only)
   */
  async clearCart(sessionId: string): Promise<FloristOneCartActionResponse> {
    const url = `${CART_API_URL}?sessionid=${encodeURIComponent(sessionId)}&action=clear`;
    return this.request<FloristOneCartActionResponse>('PUT', url);
  }

  /**
   * Destroy cart (returns status only)
   */
  async destroyCart(sessionId: string): Promise<FloristOneCartActionResponse> {
    const url = `${CART_API_URL}?sessionid=${encodeURIComponent(sessionId)}&action=destroy`;
    return this.request<FloristOneCartActionResponse>('DELETE', url);
  }

  /**
   * Get AuthorizeNet Accept.js configuration
   */
  async getAuthorizeNetKey(): Promise<FloristOneAuthorizeNetKeyResponse> {
    const url = `${FLOWERSHOP_API_URL}/getauthorizenetkey`;
    return this.request<FloristOneAuthorizeNetKeyResponse>('GET', url);
  }

  /**
   * Place order with AuthorizeNet payment token
   * Florist One API expects UPPERCASE field names and stringified JSON for nested objects
   */
  async placeOrder(orderData: {
    customer: {
      name: string;
      email: string;
      address1: string;
      address2?: string;
      city: string;
      state: string;
      country: string;
      phone: string;
      zipcode: string;
      ip: string;
    };
    products: Array<{
      code: string;
      price: number;
      deliverydate: string;
      cardmessage: string;
      specialinstructions?: string;
      recipient: {
        name: string;
        institution?: string;
        address1: string;
        address2?: string;
        city: string;
        state: string;
        country: string;
        phone: string;
        zipcode: string;
      };
    }>;
    ccinfo: {
      authorizenet_token: string;
    };
    ordertotal: number;
  }): Promise<FloristOneOrderResponse> {
    const url = `${FLOWERSHOP_API_URL}/placeorder`;

    // Convert to Florist One's expected format (UPPERCASE keys, stringified JSON)
    const customerObj = {
      NAME: orderData.customer.name,
      EMAIL: orderData.customer.email,
      ADDRESS1: orderData.customer.address1,
      ADDRESS2: orderData.customer.address2 || '',
      CITY: orderData.customer.city,
      STATE: orderData.customer.state,
      COUNTRY: orderData.customer.country,
      PHONE: orderData.customer.phone.replace(/\D/g, ''), // digits only
      ZIPCODE: orderData.customer.zipcode,
      IP: orderData.customer.ip,
    };

    const productsArr = orderData.products.map((p) => ({
      CODE: p.code,
      PRICE: p.price,
      DELIVERYDATE: p.deliverydate,
      CARDMESSAGE: p.cardmessage,
      SPECIALINSTRUCTIONS: p.specialinstructions || '',
      RECIPIENT: {
        NAME: p.recipient.name,
        INSTITUTION: p.recipient.institution || '',
        ADDRESS1: p.recipient.address1,
        ADDRESS2: p.recipient.address2 || '',
        CITY: p.recipient.city,
        STATE: p.recipient.state,
        COUNTRY: p.recipient.country,
        PHONE: p.recipient.phone.replace(/\D/g, ''), // digits only
        ZIPCODE: p.recipient.zipcode,
      },
    }));

    const ccinfoObj = {
      AUTHORIZENET_TOKEN: orderData.ccinfo.authorizenet_token,
    };

    // Florist One expects stringified JSON for these fields
    const requestBody = {
      customer: JSON.stringify(customerObj),
      products: JSON.stringify(productsArr),
      ccinfo: JSON.stringify(ccinfoObj),
      ordertotal: orderData.ordertotal,
    };

    return this.request<FloristOneOrderResponse>('POST', url, requestBody);
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
