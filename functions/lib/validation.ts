/**
 * Zod validation schemas for API endpoints
 */

// Note: We need to use a minimal Zod-like validation since Zod may have issues
// in the Workers runtime. This provides the same interface but is Workers-compatible.

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Simple validator functions that work in Workers runtime
 */

// ZIP code validation (5 digits)
export function validateZip(zip: unknown): ValidationResult<string> {
  if (typeof zip !== 'string') {
    return { success: false, error: 'ZIP code must be a string' };
  }
  const trimmed = zip.trim();
  if (!/^\d{5}$/.test(trimmed)) {
    return { success: false, error: 'ZIP code must be exactly 5 digits' };
  }
  return { success: true, data: trimmed };
}

// City/State slug validation
export function validateSlug(slug: unknown): ValidationResult<string> {
  if (typeof slug !== 'string') {
    return { success: false, error: 'Slug must be a string' };
  }
  const trimmed = slug.toLowerCase().trim();
  if (!/^[a-z0-9-]+$/.test(trimmed)) {
    return { success: false, error: 'Slug must contain only lowercase letters, numbers, and hyphens' };
  }
  if (trimmed.length < 1 || trimmed.length > 50) {
    return { success: false, error: 'Slug must be between 1 and 50 characters' };
  }
  return { success: true, data: trimmed };
}

// SKU validation
export function validateSku(sku: unknown): ValidationResult<string> {
  if (typeof sku !== 'string') {
    return { success: false, error: 'SKU must be a string' };
  }
  const trimmed = sku.trim();
  if (!/^[A-Za-z0-9-]+$/.test(trimmed)) {
    return { success: false, error: 'SKU must contain only letters, numbers, and hyphens' };
  }
  if (trimmed.length < 1 || trimmed.length > 50) {
    return { success: false, error: 'SKU must be between 1 and 50 characters' };
  }
  return { success: true, data: trimmed };
}

// Quantity validation
export function validateQuantity(qty: unknown): ValidationResult<number> {
  const num = typeof qty === 'string' ? parseInt(qty, 10) : qty;
  if (typeof num !== 'number' || isNaN(num)) {
    return { success: false, error: 'Quantity must be a number' };
  }
  if (!Number.isInteger(num) || num < 1 || num > 99) {
    return { success: false, error: 'Quantity must be an integer between 1 and 99' };
  }
  return { success: true, data: num };
}

// Item ID validation
export function validateItemId(itemId: unknown): ValidationResult<string> {
  if (typeof itemId !== 'string') {
    return { success: false, error: 'Item ID must be a string' };
  }
  const trimmed = itemId.trim();
  if (trimmed.length < 1 || trimmed.length > 100) {
    return { success: false, error: 'Item ID must be between 1 and 100 characters' };
  }
  return { success: true, data: trimmed };
}

// Date validation (YYYY-MM-DD)
export function validateDate(date: unknown): ValidationResult<string> {
  if (typeof date !== 'string') {
    return { success: false, error: 'Date must be a string' };
  }
  const trimmed = date.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return { success: false, error: 'Date must be in YYYY-MM-DD format' };
  }
  const parsed = new Date(trimmed);
  if (isNaN(parsed.getTime())) {
    return { success: false, error: 'Invalid date' };
  }
  return { success: true, data: trimmed };
}

// Email validation
export function validateEmail(email: unknown): ValidationResult<string> {
  if (typeof email !== 'string') {
    return { success: false, error: 'Email must be a string' };
  }
  const trimmed = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { success: false, error: 'Invalid email address' };
  }
  return { success: true, data: trimmed };
}

// Phone validation (US format, flexible)
export function validatePhone(phone: unknown): ValidationResult<string> {
  if (typeof phone !== 'string') {
    return { success: false, error: 'Phone must be a string' };
  }
  // Remove non-digits
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 11) {
    return { success: false, error: 'Phone must be a valid US phone number' };
  }
  return { success: true, data: digits };
}

// Required string validation
export function validateRequiredString(
  value: unknown,
  fieldName: string,
  minLength = 1,
  maxLength = 500
): ValidationResult<string> {
  if (typeof value !== 'string') {
    return { success: false, error: `${fieldName} must be a string` };
  }
  const trimmed = value.trim();
  if (trimmed.length < minLength) {
    return { success: false, error: `${fieldName} is required` };
  }
  if (trimmed.length > maxLength) {
    return { success: false, error: `${fieldName} must be at most ${maxLength} characters` };
  }
  return { success: true, data: trimmed };
}

// Optional string validation
export function validateOptionalString(
  value: unknown,
  fieldName: string,
  maxLength = 500
): ValidationResult<string | undefined> {
  if (value === undefined || value === null || value === '') {
    return { success: true, data: undefined };
  }
  if (typeof value !== 'string') {
    return { success: false, error: `${fieldName} must be a string` };
  }
  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    return { success: false, error: `${fieldName} must be at most ${maxLength} characters` };
  }
  return { success: true, data: trimmed || undefined };
}

// State abbreviation validation
export function validateStateAbbr(state: unknown): ValidationResult<string> {
  if (typeof state !== 'string') {
    return { success: false, error: 'State must be a string' };
  }
  const trimmed = state.trim().toUpperCase();
  const validStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
  ];
  if (!validStates.includes(trimmed)) {
    return { success: false, error: 'Invalid state abbreviation' };
  }
  return { success: true, data: trimmed };
}

// Order recipient validation
export interface RecipientData {
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
}

export function validateRecipient(data: unknown): ValidationResult<RecipientData> {
  if (!data || typeof data !== 'object') {
    return { success: false, error: 'Recipient data is required' };
  }

  const obj = data as Record<string, unknown>;
  const errors: string[] = [];

  const firstName = validateRequiredString(obj.firstName, 'First name', 1, 50);
  if (!firstName.success) errors.push(firstName.error!);

  const lastName = validateRequiredString(obj.lastName, 'Last name', 1, 50);
  if (!lastName.success) errors.push(lastName.error!);

  const phone = validatePhone(obj.phone);
  if (!phone.success) errors.push(phone.error!);

  const address1 = validateRequiredString(obj.address1, 'Address', 1, 200);
  if (!address1.success) errors.push(address1.error!);

  const address2 = validateOptionalString(obj.address2, 'Address line 2', 200);
  if (!address2.success) errors.push(address2.error!);

  const city = validateRequiredString(obj.city, 'City', 1, 100);
  if (!city.success) errors.push(city.error!);

  const state = validateStateAbbr(obj.state);
  if (!state.success) errors.push(state.error!);

  const zip = validateZip(obj.zip);
  if (!zip.success) errors.push(zip.error!);

  if (errors.length > 0) {
    return { success: false, error: errors.join('; ') };
  }

  return {
    success: true,
    data: {
      firstName: firstName.data!,
      lastName: lastName.data!,
      phone: phone.data!,
      address1: address1.data!,
      address2: address2.data,
      city: city.data!,
      state: state.data!,
      zip: zip.data!,
    },
  };
}

// Order sender validation
export interface SenderData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export function validateSender(data: unknown): ValidationResult<SenderData> {
  if (!data || typeof data !== 'object') {
    return { success: false, error: 'Sender data is required' };
  }

  const obj = data as Record<string, unknown>;
  const errors: string[] = [];

  const firstName = validateRequiredString(obj.firstName, 'First name', 1, 50);
  if (!firstName.success) errors.push(firstName.error!);

  const lastName = validateRequiredString(obj.lastName, 'Last name', 1, 50);
  if (!lastName.success) errors.push(lastName.error!);

  const email = validateEmail(obj.email);
  if (!email.success) errors.push(email.error!);

  const phone = validatePhone(obj.phone);
  if (!phone.success) errors.push(phone.error!);

  if (errors.length > 0) {
    return { success: false, error: errors.join('; ') };
  }

  return {
    success: true,
    data: {
      firstName: firstName.data!,
      lastName: lastName.data!,
      email: email.data!,
      phone: phone.data!,
    },
  };
}

// Card message validation
export interface CardData {
  message: string;
  signature?: string;
}

export function validateCard(data: unknown): ValidationResult<CardData> {
  if (!data || typeof data !== 'object') {
    return { success: false, error: 'Card data is required' };
  }

  const obj = data as Record<string, unknown>;
  const errors: string[] = [];

  const message = validateRequiredString(obj.message, 'Card message', 1, 1000);
  if (!message.success) errors.push(message.error!);

  const signature = validateOptionalString(obj.signature, 'Signature', 200);
  if (!signature.success) errors.push(signature.error!);

  if (errors.length > 0) {
    return { success: false, error: errors.join('; ') };
  }

  return {
    success: true,
    data: {
      message: message.data!,
      signature: signature.data,
    },
  };
}
