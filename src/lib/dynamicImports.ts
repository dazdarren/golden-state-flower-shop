import dynamic from 'next/dynamic';

/**
 * Dynamic imports for heavy components to reduce initial bundle size
 * These components are loaded on-demand when first rendered
 */

// QuickView Modal - only needed when user clicks "Quick View"
export const DynamicQuickViewModal = dynamic(
  () => import('@/components/QuickViewModal'),
  { ssr: false }
);

// Exit Intent Popup - can be deferred
export const DynamicExitIntentPopup = dynamic(
  () => import('@/components/ExitIntentPopup'),
  { ssr: false }
);

// Product filters - can be deferred on mobile
export const DynamicProductFilters = dynamic(
  () => import('@/components/ProductFilters'),
  { ssr: true } // Keep SSR for SEO
);
