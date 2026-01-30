import { z } from 'zod';

/**
 * Phone number validation - accepts common US formats
 */
const phoneRegex = /^[\d\s\-\(\)\.+]+$/;

export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .regex(phoneRegex, 'Please enter a valid phone number');

/**
 * ZIP code validation - US 5-digit format
 */
export const zipCodeSchema = z
  .string()
  .length(5, 'ZIP code must be 5 digits')
  .regex(/^\d{5}$/, 'Please enter a valid ZIP code');

/**
 * Recipient information schema
 */
export const recipientSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long'),
  phone: phoneSchema,
  address1: z
    .string()
    .min(1, 'Address is required')
    .max(200, 'Address is too long'),
  address2: z.string().max(200, 'Address line 2 is too long').optional(),
  city: z
    .string()
    .min(1, 'City is required')
    .max(100, 'City name is too long'),
  state: z
    .string()
    .length(2, 'Please use 2-letter state code')
    .toUpperCase(),
  zip: zipCodeSchema,
});

/**
 * Sender information schema
 */
export const senderSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: phoneSchema,
});

/**
 * Card message schema
 */
export const cardMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'Card message is required')
    .max(1000, 'Message cannot exceed 1000 characters'),
  specialInstructions: z
    .string()
    .max(500, 'Special instructions cannot exceed 500 characters')
    .optional(),
});

/**
 * Complete checkout form schema
 */
export const checkoutFormSchema = z.object({
  recipient: recipientSchema,
  sender: senderSchema,
  card: cardMessageSchema,
  deliveryDate: z.string().min(1, 'Please select a delivery date'),
});

/**
 * Payment card validation
 */
export const paymentCardSchema = z.object({
  cardNumber: z
    .string()
    .min(15, 'Card number must be at least 15 digits')
    .max(19, 'Card number is too long')
    .refine(
      (val) => /^\d+$/.test(val.replace(/\s/g, '')),
      'Card number must contain only digits'
    ),
  expMonth: z
    .string()
    .length(2, 'Month must be 2 digits')
    .refine(
      (val) => {
        const month = parseInt(val, 10);
        return month >= 1 && month <= 12;
      },
      'Please enter a valid month (01-12)'
    ),
  expYear: z
    .string()
    .length(2, 'Year must be 2 digits')
    .refine(
      (val) => {
        const year = parseInt(val, 10);
        const currentYear = new Date().getFullYear() % 100;
        return year >= currentYear && year <= currentYear + 20;
      },
      'Please enter a valid expiration year'
    ),
  cvv: z
    .string()
    .min(3, 'CVV must be at least 3 digits')
    .max(4, 'CVV cannot exceed 4 digits')
    .regex(/^\d+$/, 'CVV must contain only digits'),
});

// Type exports
export type RecipientFormData = z.infer<typeof recipientSchema>;
export type SenderFormData = z.infer<typeof senderSchema>;
export type CardMessageFormData = z.infer<typeof cardMessageSchema>;
export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
export type PaymentCardData = z.infer<typeof paymentCardSchema>;
