import { z } from 'zod';

/**
 * Email validation
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

/**
 * Password validation with strength requirements
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password is too long');

/**
 * Strong password with requirements
 */
export const strongPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password is too long')
  .refine(
    (val) => /[A-Z]/.test(val),
    'Password must contain at least one uppercase letter'
  )
  .refine(
    (val) => /[a-z]/.test(val),
    'Password must contain at least one lowercase letter'
  )
  .refine(
    (val) => /[0-9]/.test(val),
    'Password must contain at least one number'
  );

/**
 * Login form schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

/**
 * Registration form schema
 */
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(50, 'First name is too long'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(50, 'Last name is too long'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Password reset request schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/**
 * Password reset schema
 */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
