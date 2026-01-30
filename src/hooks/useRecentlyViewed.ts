'use client';

import { useState, useEffect, useCallback } from 'react';

export interface RecentlyViewedProduct {
  sku: string;
  name: string;
  price: number;
  image: string;
  viewedAt: number;
}

const STORAGE_KEY = 'recently_viewed';
const MAX_ITEMS = 12;

export function useRecentlyViewed() {
  const [products, setProducts] = useState<RecentlyViewedProduct[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as RecentlyViewedProduct[];
        // Filter out items older than 30 days
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const filtered = parsed.filter((p) => p.viewedAt > thirtyDaysAgo);
        setProducts(filtered);
      }
    } catch {
      // Invalid data, reset
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when products change
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products, isLoaded]);

  const addProduct = useCallback((product: Omit<RecentlyViewedProduct, 'viewedAt'>) => {
    setProducts((prev) => {
      // Remove if already exists
      const filtered = prev.filter((p) => p.sku !== product.sku);
      // Add to front with timestamp
      const updated = [{ ...product, viewedAt: Date.now() }, ...filtered];
      // Limit to MAX_ITEMS
      return updated.slice(0, MAX_ITEMS);
    });
  }, []);

  const removeProduct = useCallback((sku: string) => {
    setProducts((prev) => prev.filter((p) => p.sku !== sku));
  }, []);

  const clearAll = useCallback(() => {
    setProducts([]);
  }, []);

  return {
    products,
    addProduct,
    removeProduct,
    clearAll,
    isLoaded,
  };
}
