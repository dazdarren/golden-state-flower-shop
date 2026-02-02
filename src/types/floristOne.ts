/**
 * Florist One API type definitions
 * Based on official Florist One API documentation
 */

// Delivery dates response
export interface DeliveryDate {
  date: string; // YYYY-MM-DD format
  description: string;
  price: number;
  available: boolean;
}

export interface DeliveryDatesResponse {
  success: boolean;
  dates: DeliveryDate[];
  error?: string;
}

// Product types
export interface ProductImage {
  small: string;
  medium: string;
  large: string;
}

export interface Product {
  sku: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: ProductImage;
  category: string;
  occasions: string[];
  available: boolean;
  dimension?: string; // Size/dimension info e.g. "18\"H x 12\"W" or stem count
}

export interface ProductResponse {
  success: boolean;
  product?: Product;
  error?: string;
}

export interface ProductListResponse {
  success: boolean;
  products: Product[];
  total: number;
  error?: string;
}

// Cart types
export interface CartItem {
  itemId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  cartId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  deliveryDate?: string;
  deliveryZip?: string;
}

export interface CartResponse {
  success: boolean;
  cart?: Cart;
  error?: string;
}

// Order types
export interface OrderRecipient {
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
}

export interface OrderCard {
  message: string;
  signature?: string;
}

export interface OrderPayment {
  // For MVP, we'll stub the payment token
  // In production, this would be a tokenized payment from Stripe/etc.
  paymentToken?: string;
  // Or card details (in production, never handle raw card data - use tokenization)
  cardNumber?: string;
  cardExpMonth?: string;
  cardExpYear?: string;
  cardCvv?: string;
}

export interface OrderSender {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface PlaceOrderRequest {
  cartId: string;
  deliveryDate: string;
  recipient: OrderRecipient;
  sender: OrderSender;
  card: OrderCard;
  payment: OrderPayment;
  specialInstructions?: string;
}

export interface PlaceOrderResponse {
  success: boolean;
  orderId?: string;
  confirmationNumber?: string;
  estimatedDelivery?: string;
  total?: number;
  error?: string;
}

// API Error type
export interface FloristOneError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
