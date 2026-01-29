import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityConfig, getCityPath } from '@/data/cities';
import {
  placeholderProducts,
  getPlaceholderProduct,
} from '@/data/products/placeholder';
import AddToCartButton from './AddToCartButton';

interface ProductPageProps {
  params: {
    state: string;
    city: string;
    sku: string;
  };
}

// Generate static params for featured products
export function generateStaticParams() {
  return placeholderProducts.map((product) => ({
    sku: product.sku,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const cityConfig = getCityConfig(params.state, params.city);
  const product = getPlaceholderProduct(params.sku);

  if (!cityConfig || !product) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const basePath = getCityPath(cityConfig);
  const canonicalUrl = `${siteUrl}${basePath}/product/${params.sku}/`;

  return {
    title: `${product.name} - Delivery in ${cityConfig.cityName}`,
    description: `Order ${product.name} for delivery in ${cityConfig.cityName}. ${product.description.slice(0, 100)}...`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: product.name,
      description: product.description,
      url: canonicalUrl,
      type: 'website',
      images: product.images.large
        ? [{ url: product.images.large, alt: product.name }]
        : undefined,
    },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const cityConfig = getCityConfig(params.state, params.city);
  const product = getPlaceholderProduct(params.sku);

  if (!cityConfig || !product) {
    notFound();
  }

  const basePath = getCityPath(cityConfig);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

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
            image: product.images.large || undefined,
            sku: product.sku,
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'USD',
              availability: product.available
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              areaServed: {
                '@type': 'City',
                name: cityConfig.cityName,
              },
            },
          }),
        }}
      />

      {/* Breadcrumb */}
      <nav className="bg-gray-50 py-3">
        <div className="container-wide">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href={basePath} className="text-gray-500 hover:text-primary-600">
                {cityConfig.cityName}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                href={`${basePath}/flowers/birthday`}
                className="text-gray-500 hover:text-primary-600"
              >
                Flowers
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium line-clamp-1">{product.name}</li>
          </ol>
        </div>
      </nav>

      {/* Product Details */}
      <section className="py-8 md:py-12">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              {product.images.large ? (
                <img
                  src={product.images.large}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">
                  🌸
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-primary-600">
                  ${product.price.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-gray-400 line-through">
                    ${product.originalPrice!.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Availability */}
              {product.available ? (
                <div className="flex items-center gap-2 text-accent-600 mb-6">
                  <span>✓</span>
                  <span>Available for delivery in {cityConfig.cityName}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 mb-6">
                  <span>✗</span>
                  <span>Currently unavailable</span>
                </div>
              )}

              {/* Description */}
              <div className="prose prose-gray mb-8">
                <p>{product.description}</p>
              </div>

              {/* Add to Cart */}
              <AddToCartButton
                sku={product.sku}
                basePath={basePath}
                disabled={!product.available}
              />

              {/* Delivery Info */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Delivery Information</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    • Same-day delivery: Order by {cityConfig.deliveryInfo.sameDay.cutoffTime}
                  </li>
                  <li>• Delivery available to all {cityConfig.cityName} ZIP codes</li>
                  <li>• Includes delivery to hospitals and businesses</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-12 bg-gray-50">
        <div className="container-wide">
          <h2 className="section-title">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {placeholderProducts
              .filter((p) => p.sku !== product.sku && p.category === product.category)
              .slice(0, 4)
              .map((relatedProduct) => (
                <Link
                  key={relatedProduct.sku}
                  href={`${basePath}/product/${relatedProduct.sku}`}
                  className="card product-card"
                >
                  <div className="aspect-square bg-gray-100">
                    {relatedProduct.images.medium ? (
                      <img
                        src={relatedProduct.images.medium}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🌸
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-primary-600 font-bold mt-1">
                      ${relatedProduct.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
