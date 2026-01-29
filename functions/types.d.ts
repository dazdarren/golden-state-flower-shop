/**
 * Cloudflare Pages Functions type declarations
 */

interface FloristOneEnv {
  FLORISTONE_AFFILIATE_ID: string;
  FLORISTONE_API_TOKEN: string;
  FLORISTONE_API_BASE_URL?: string;
}

// Extend the global PagesFunction type with our environment
type PagesFunction<Env = FloristOneEnv> = import('@cloudflare/workers-types').PagesFunction<Env>;
