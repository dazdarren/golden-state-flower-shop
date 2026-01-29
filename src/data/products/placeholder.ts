import { Product } from '@/types/floristOne';

/**
 * Placeholder product data for when Florist One API is unavailable
 * Replace with real product data when API credentials are configured
 */

const PLACEHOLDER_IMAGE = '/images/placeholder-flower.svg';

function createPlaceholderProduct(
  sku: string,
  name: string,
  price: number,
  category: string,
  occasions: string[]
): Product {
  return {
    sku,
    name,
    description: `Beautiful ${name.toLowerCase()} perfect for any occasion. Fresh flowers arranged by local San Francisco florists.`,
    price,
    images: {
      small: PLACEHOLDER_IMAGE,
      medium: PLACEHOLDER_IMAGE,
      large: PLACEHOLDER_IMAGE,
    },
    category,
    occasions,
    available: true,
  };
}

export const placeholderProducts: Product[] = [
  // Mixed arrangements
  createPlaceholderProduct('FTD-MIX001', 'Garden Splendor Bouquet', 59.99, 'mixed', ['birthday', 'thank-you']),
  createPlaceholderProduct('FTD-MIX002', 'Vibrant Celebration Arrangement', 69.99, 'mixed', ['birthday', 'anniversary']),
  createPlaceholderProduct('FTD-MIX003', 'Sunshine Meadow Bouquet', 54.99, 'mixed', ['get-well', 'thank-you']),
  createPlaceholderProduct('FTD-MIX004', 'Spring Garden Basket', 74.99, 'mixed', ['birthday', 'thank-you']),
  createPlaceholderProduct('FTD-MIX005', 'Enchanted Fields Bouquet', 64.99, 'mixed', ['birthday', 'anniversary']),
  createPlaceholderProduct('FTD-MIX006', 'Coastal Bloom Collection', 79.99, 'mixed', ['anniversary', 'thank-you']),

  // Roses
  createPlaceholderProduct('FTD-ROSE001', 'Classic Red Rose Dozen', 89.99, 'roses', ['anniversary', 'birthday']),
  createPlaceholderProduct('FTD-ROSE002', 'Pink Rose Garden', 79.99, 'roses', ['birthday', 'thank-you']),
  createPlaceholderProduct('FTD-ROSE003', 'White Rose Elegance', 84.99, 'roses', ['sympathy', 'anniversary']),
  createPlaceholderProduct('FTD-ROSE004', 'Rainbow Rose Delight', 94.99, 'roses', ['birthday', 'thank-you']),
  createPlaceholderProduct('FTD-ROSE005', 'Lavender Rose Dreams', 74.99, 'roses', ['anniversary', 'birthday']),
  createPlaceholderProduct('FTD-ROSE006', 'Two Dozen Premium Roses', 149.99, 'roses', ['anniversary']),

  // Plants
  createPlaceholderProduct('FTD-PLT001', 'Peace Lily Plant', 64.99, 'plants', ['sympathy', 'get-well']),
  createPlaceholderProduct('FTD-PLT002', 'Orchid Garden', 79.99, 'plants', ['thank-you', 'birthday']),
  createPlaceholderProduct('FTD-PLT003', 'Succulent Collection', 49.99, 'plants', ['thank-you', 'birthday']),
  createPlaceholderProduct('FTD-PLT004', 'Blooming Azalea', 59.99, 'plants', ['birthday', 'get-well']),

  // Sympathy
  createPlaceholderProduct('FTD-SYM001', 'Peaceful Memories Arrangement', 99.99, 'sympathy', ['sympathy']),
  createPlaceholderProduct('FTD-SYM002', 'Eternal Love Wreath', 149.99, 'sympathy', ['sympathy']),
  createPlaceholderProduct('FTD-SYM003', 'Serene Standing Spray', 179.99, 'sympathy', ['sympathy']),
  createPlaceholderProduct('FTD-SYM004', 'Comforting Grace Basket', 89.99, 'sympathy', ['sympathy']),

  // Seasonal
  createPlaceholderProduct('FTD-SEA001', 'Seasonal Best Seller', 69.99, 'seasonal', ['birthday', 'thank-you']),
  createPlaceholderProduct('FTD-SEA002', 'Florist\'s Choice Deluxe', 84.99, 'seasonal', ['birthday', 'anniversary']),
  createPlaceholderProduct('FTD-SEA003', 'Local Favorites Bouquet', 59.99, 'seasonal', ['birthday', 'get-well']),
  createPlaceholderProduct('FTD-SEA004', 'San Francisco Special', 74.99, 'seasonal', ['birthday', 'thank-you']),
];

export const placeholderProductsMap: Record<string, Product> = Object.fromEntries(
  placeholderProducts.map((p) => [p.sku, p])
);

export function getPlaceholderProduct(sku: string): Product | undefined {
  return placeholderProductsMap[sku];
}

export function getPlaceholderProductsByOccasion(occasion: string): Product[] {
  return placeholderProducts.filter((p) => p.occasions.includes(occasion));
}

export function getPlaceholderProductsByCategory(category: string): Product[] {
  return placeholderProducts.filter((p) => p.category === category);
}
