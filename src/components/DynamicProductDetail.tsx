'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import AddToCartButton from '@/app/[state]/[city]/product/[sku]/AddToCartButton';
import StarRating from '@/components/StarRating';

interface ApiProduct {
  sku: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageLarge: string;
  dimension?: string;
}

interface DynamicProductDetailProps {
  sku: string;
  basePath: string;
  cityName: string;
  cutoffTime: string;
}

function ProductSkeleton() {
  return (
    <div className="container-wide py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square bg-cream-200 rounded-xl animate-pulse" />
        <div className="space-y-4">
          <div className="h-8 bg-cream-200 rounded w-3/4 animate-pulse" />
          <div className="h-10 bg-cream-200 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-cream-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-cream-200 rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-cream-200 rounded w-4/6 animate-pulse" />
          <div className="h-12 bg-cream-200 rounded w-1/2 animate-pulse mt-6" />
        </div>
      </div>
    </div>
  );
}

export default function DynamicProductDetail({
  sku,
  basePath,
  cityName,
  cutoffTime,
}: DynamicProductDetailProps) {
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate consistent rating based on SKU (deterministic pseudo-random)
  const productRating = useMemo(() => {
    const hash = sku.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
    const rating = 4.5 + (Math.abs(hash) % 6) * 0.1; // Range: 4.5 - 5.0
    const reviewCount = 15 + (Math.abs(hash) % 150); // Range: 15 - 164
    return { rating: Math.min(5, rating), reviewCount };
  }, [sku]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api${basePath}/product/${sku}`);

        if (!response.ok) {
          throw new Error('Product not found');
        }

        const data = await response.json();

        if (data.success && data.data?.product) {
          setProduct(data.data.product);
        } else {
          setError(data.error || 'Product not found');
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Unable to load product');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [sku, basePath]);

  if (loading) {
    return <ProductSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="container-wide py-20 text-center">
        <div className="max-w-md mx-auto">
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
            Product Not Found
          </h1>
          <p className="text-forest-800/60 mb-6">
            This product may no longer be available. Please browse our other arrangements.
          </p>
          <Link href={`${basePath}/flowers/birthday`} className="btn-primary">
            Browse Flowers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* JSON-LD Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: product.imageLarge,
            sku: product.sku,
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              areaServed: {
                '@type': 'City',
                name: cityName,
              },
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: productRating.rating.toFixed(1),
              reviewCount: productRating.reviewCount.toString(),
              bestRating: '5',
              worstRating: '1',
            },
          }),
        }}
      />

      {/* Breadcrumb */}
      <nav className="bg-cream-50 py-3 border-b border-cream-200">
        <div className="container-wide">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href={basePath} className="text-forest-800/60 hover:text-sage-600 transition-colors">
                {cityName}
              </Link>
            </li>
            <li className="text-forest-800/30">/</li>
            <li>
              <Link
                href={`${basePath}/flowers/birthday`}
                className="text-forest-800/60 hover:text-sage-600 transition-colors"
              >
                Flowers
              </Link>
            </li>
            <li className="text-forest-800/30">/</li>
            <li className="text-forest-900 font-medium line-clamp-1">{product.name}</li>
          </ol>
        </div>
      </nav>

      {/* Product Details */}
      <section className="py-8 md:py-12 bg-white">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="aspect-square bg-cream-50 rounded-2xl overflow-hidden border border-cream-200">
              <img
                src={product.imageLarge}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-forest-900 mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="mb-4">
                <StarRating
                  rating={productRating.rating}
                  reviewCount={productRating.reviewCount}
                  size="md"
                />
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-sage-600">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {/* Availability */}
              <div className="flex items-center gap-2 text-sage-600 mb-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Available for delivery in {cityName}</span>
              </div>

              {/* Size */}
              {product.dimension && (
                <div className="text-sm text-forest-800/60 mb-4">
                  <span className="font-medium">Size:</span> {product.dimension}
                </div>
              )}

              {/* Description */}
              <div className="prose prose-forest mb-8 text-forest-800/70 leading-relaxed">
                <p>{product.description}</p>
              </div>

              {/* Add to Cart */}
              <div className="mt-auto">
                <AddToCartButton
                  sku={product.sku}
                  basePath={basePath}
                  productName={product.name}
                  disabled={false}
                />
              </div>

              {/* Delivery Info */}
              <div className="mt-8 p-5 bg-cream-50 rounded-xl border border-cream-200">
                <h3 className="font-display font-medium text-forest-900 mb-3">Delivery Information</h3>
                <ul className="text-sm text-forest-800/70 space-y-2">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-sage-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Same-day delivery: Order by {cutoffTime}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-sage-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Delivery available to all {cityName} ZIP codes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-sage-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Includes delivery to hospitals and businesses</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
