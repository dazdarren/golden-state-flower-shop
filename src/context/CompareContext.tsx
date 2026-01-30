'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

export interface CompareProduct {
  sku: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  dimension?: string;
}

interface CompareContextType {
  products: CompareProduct[];
  addProduct: (product: CompareProduct) => boolean;
  removeProduct: (sku: string) => void;
  clearAll: () => void;
  isInCompare: (sku: string) => boolean;
  canAdd: boolean;
}

const MAX_COMPARE_ITEMS = 4;
const STORAGE_KEY = 'compare_products';

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<CompareProduct[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProducts(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products, isLoaded]);

  const addProduct = useCallback((product: CompareProduct): boolean => {
    if (products.length >= MAX_COMPARE_ITEMS) {
      return false;
    }
    if (products.some((p) => p.sku === product.sku)) {
      return false;
    }
    setProducts((prev) => [...prev, product]);
    return true;
  }, [products]);

  const removeProduct = useCallback((sku: string) => {
    setProducts((prev) => prev.filter((p) => p.sku !== sku));
  }, []);

  const clearAll = useCallback(() => {
    setProducts([]);
  }, []);

  const isInCompare = useCallback((sku: string) => {
    return products.some((p) => p.sku === sku);
  }, [products]);

  const canAdd = products.length < MAX_COMPARE_ITEMS;

  return (
    <CompareContext.Provider
      value={{
        products,
        addProduct,
        removeProduct,
        clearAll,
        isInCompare,
        canAdd,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
