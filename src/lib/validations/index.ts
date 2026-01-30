// Checkout validations
export {
  phoneSchema,
  zipCodeSchema,
  recipientSchema,
  senderSchema,
  cardMessageSchema,
  checkoutFormSchema,
  paymentCardSchema,
  type RecipientFormData,
  type SenderFormData,
  type CardMessageFormData,
  type CheckoutFormData,
  type PaymentCardData,
} from './checkout';

// Auth validations
export {
  emailSchema,
  passwordSchema,
  strongPasswordSchema,
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type LoginFormData,
  type RegisterFormData,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
} from './auth';
