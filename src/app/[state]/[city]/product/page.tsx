'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { getCityConfig, getCityPath } from '@/data/cities';
import DynamicProductDetail from '@/components/DynamicProductDetail';
import Link from 'next/link';

interface ProductPageProps {
  params: {
    state: string;
    city: string;
  };
}

function ProductContent({ state, city }: { state: string; city: string }) {
  const searchParams = useSearchParams();
  const sku = searchParams.get('sku');

  const cityConfig = getCityConfig(state, city);

  if (!cityConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">City Not Found</h1>
          <Link href="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const basePath = getCityPath(cityConfig);

  if (!sku) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center p-8">
          <svg
            className="w-20 h-20 text-sage-300 mx-auto mb-6"
            viewBox="0 0 64 64"
            fill="none"
          >
            <path
              d="M32 12c0 10-6 16-6 22s3 10 6 10 6-4 6-10-6-12-6-22z"
              fill="currentColor"
              opacity="0.3"
            />
            <path
              d="M32 16c-5 6-10 12-10 18s3 8 10 8 10-2 10-8-5-12-10-18z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          <h1 className="font-display text-2xl font-semibold text-forest-900 mb-4">
            No Product Selected
          </h1>
          <p className="text-forest-800/60 mb-6">
            Please select a product from our collection.
          </p>
          <Link href={`${basePath}/flowers/birthday`} className="btn-primary">
            Browse Flowers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <DynamicProductDetail
      sku={sku}
      basePath={basePath}
      cityName={cityConfig.cityName}
      cutoffTime={cityConfig.deliveryInfo.sameDay.cutoffTime}
    />
  );
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <Suspense fallback={
      <div className="container-wide py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="aspect-square bg-cream-200 rounded-xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-cream-200 rounded w-3/4 animate-pulse" />
            <div className="h-10 bg-cream-200 rounded w-1/3 animate-pulse" />
            <div className="h-4 bg-cream-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-cream-200 rounded w-5/6 animate-pulse" />
          </div>
        </div>
      </div>
    }>
      <ProductContent state={params.state} city={params.city} />
    </Suspense>
  );
}
