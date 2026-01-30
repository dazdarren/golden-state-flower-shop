/**
 * Simple A/B Testing Infrastructure
 *
 * Usage:
 * const variant = getVariant('experiment-name', ['control', 'variant-a', 'variant-b']);
 *
 * Track conversions:
 * trackConversion('experiment-name', 'add-to-cart');
 */

const STORAGE_PREFIX = 'ab_';
const CONVERSION_PREFIX = 'ab_conv_';

interface Experiment {
  name: string;
  variants: string[];
  weights?: number[]; // Optional weights for each variant (must sum to 1)
}

/**
 * Get or assign a variant for an experiment
 * Persists in localStorage so user always sees same variant
 */
export function getVariant(experimentName: string, variants: string[], weights?: number[]): string {
  if (typeof window === 'undefined') {
    return variants[0]; // Return control on server
  }

  const storageKey = `${STORAGE_PREFIX}${experimentName}`;

  // Check if already assigned
  const existing = localStorage.getItem(storageKey);
  if (existing && variants.includes(existing)) {
    return existing;
  }

  // Assign new variant
  const variant = selectVariant(variants, weights);
  localStorage.setItem(storageKey, variant);

  // Track experiment exposure
  trackExposure(experimentName, variant);

  return variant;
}

/**
 * Select a variant based on weights or uniform distribution
 */
function selectVariant(variants: string[], weights?: number[]): string {
  const random = Math.random();

  if (weights && weights.length === variants.length) {
    let cumulative = 0;
    for (let i = 0; i < variants.length; i++) {
      cumulative += weights[i];
      if (random < cumulative) {
        return variants[i];
      }
    }
  }

  // Uniform distribution
  const index = Math.floor(random * variants.length);
  return variants[index];
}

/**
 * Track when a user is exposed to an experiment
 */
function trackExposure(experimentName: string, variant: string): void {
  // In production, send to analytics
  if (process.env.NODE_ENV === 'development') {
    console.log(`[A/B] Exposure: ${experimentName} -> ${variant}`);
  }

  // Send to Google Analytics if available
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'experiment_exposure', {
      experiment_name: experimentName,
      variant: variant,
    });
  }
}

/**
 * Track a conversion event for an experiment
 */
export function trackConversion(experimentName: string, conversionType: string): void {
  if (typeof window === 'undefined') return;

  const storageKey = `${STORAGE_PREFIX}${experimentName}`;
  const variant = localStorage.getItem(storageKey);

  if (!variant) return;

  // Prevent duplicate conversion tracking
  const conversionKey = `${CONVERSION_PREFIX}${experimentName}_${conversionType}`;
  if (localStorage.getItem(conversionKey)) return;
  localStorage.setItem(conversionKey, 'true');

  if (process.env.NODE_ENV === 'development') {
    console.log(`[A/B] Conversion: ${experimentName} (${variant}) -> ${conversionType}`);
  }

  // Send to Google Analytics if available
  if ((window as any).gtag) {
    (window as any).gtag('event', 'experiment_conversion', {
      experiment_name: experimentName,
      variant: variant,
      conversion_type: conversionType,
    });
  }
}

/**
 * Reset all experiment assignments (useful for testing)
 */
export function resetExperiments(): void {
  if (typeof window === 'undefined') return;

  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith(STORAGE_PREFIX) || key.startsWith(CONVERSION_PREFIX))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
}

/**
 * Get current variant for an experiment without assigning
 */
export function getCurrentVariant(experimentName: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(`${STORAGE_PREFIX}${experimentName}`);
}

/**
 * Hook for using A/B tests in React components
 */
export function useExperiment(experimentName: string, variants: string[], weights?: number[]): {
  variant: string;
  isControl: boolean;
  trackConversion: (type: string) => void;
} {
  // Get variant (will be consistent due to localStorage)
  const variant = typeof window !== 'undefined'
    ? getVariant(experimentName, variants, weights)
    : variants[0];

  return {
    variant,
    isControl: variant === variants[0],
    trackConversion: (type: string) => trackConversion(experimentName, type),
  };
}

// Pre-defined experiments
export const EXPERIMENTS = {
  // Example: Test different CTA button text
  CTA_TEXT: {
    name: 'cta-button-text',
    variants: ['add-to-cart', 'buy-now', 'order-now'],
  },
  // Example: Test showing trust badges
  TRUST_BADGES: {
    name: 'trust-badges-visibility',
    variants: ['hidden', 'visible'],
    weights: [0.5, 0.5],
  },
  // Example: Test countdown timer urgency
  COUNTDOWN_STYLE: {
    name: 'countdown-style',
    variants: ['banner', 'inline', 'none'],
    weights: [0.33, 0.33, 0.34],
  },
} as const;
