import { OccasionSlug } from '@/types/city';

/**
 * SKU mappings by occasion
 * Maps occasion slugs to featured product SKUs for that occasion
 */
export const occasionSkuMap: Record<OccasionSlug, string[]> = {
  birthday: [
    'FTD-MIX001',
    'FTD-MIX002',
    'FTD-MIX004',
    'FTD-MIX005',
    'FTD-ROSE001',
    'FTD-ROSE002',
    'FTD-ROSE004',
    'FTD-ROSE005',
    'FTD-PLT002',
    'FTD-PLT003',
    'FTD-PLT004',
    'FTD-SEA001',
  ],
  sympathy: [
    'FTD-SYM001',
    'FTD-SYM002',
    'FTD-SYM003',
    'FTD-SYM004',
    'FTD-ROSE003',
    'FTD-PLT001',
  ],
  anniversary: [
    'FTD-ROSE001',
    'FTD-ROSE003',
    'FTD-ROSE005',
    'FTD-ROSE006',
    'FTD-MIX002',
    'FTD-MIX005',
    'FTD-MIX006',
    'FTD-SEA002',
  ],
  'get-well': [
    'FTD-MIX003',
    'FTD-PLT001',
    'FTD-PLT004',
    'FTD-SEA003',
    'FTD-MIX001',
    'FTD-MIX004',
  ],
  'thank-you': [
    'FTD-MIX001',
    'FTD-MIX003',
    'FTD-MIX004',
    'FTD-MIX006',
    'FTD-ROSE002',
    'FTD-ROSE004',
    'FTD-PLT002',
    'FTD-PLT003',
    'FTD-SEA001',
    'FTD-SEA004',
  ],
};

export function getSkusForOccasion(occasion: OccasionSlug): string[] {
  return occasionSkuMap[occasion] || [];
}
