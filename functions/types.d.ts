/**
 * Cloudflare Pages Functions type declarations
 */

interface Env {
  // Florist One API
  FLORISTONE_AFFILIATE_ID: string;
  FLORISTONE_API_TOKEN: string;
  FLORISTONE_API_BASE_URL?: string;

  // Supabase
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;

  // Stripe
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_PRICE_CLASSIC_MONTHLY: string;
  STRIPE_PRICE_LUXE_MONTHLY: string;
  STRIPE_PRICE_GRAND_MONTHLY: string;

  // Resend (Email)
  RESEND_API_KEY: string;
  EMAIL_FROM_ADDRESS?: string;
  EMAIL_FROM_NAME?: string;
}

// Legacy type alias for backward compatibility
type FloristOneEnv = Env;

// Extend the global PagesFunction type with our environment
type PagesFunction<E = Env> = import('@cloudflare/workers-types').PagesFunction<E>;
