import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCityConfig, getCityPath } from '@/data/cities';
import DynamicProductDetail from '@/components/DynamicProductDetail';

interface ProductPageProps {
  params: {
    state: string;
    city: string;
    sku: string;
  };
}

// Pre-generate pages for popular Florist One products
// Other products will still work via client-side fetching
const POPULAR_SKUS = [
  'T18-1A',   // Simply Sweet
  'F1-120',   // Happy Birthday Balloon Bouquet
  'FAA-100',  // Large Floral Arrangement
  'S5251s',   // Abundance Casket Spray
  'S5252s',   // Faithful Wishes Wreath
  'S5253s',   // Thoughts of Tranquility
];

export function generateStaticParams() {
  return POPULAR_SKUS.map((sku) => ({ sku }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const cityConfig = getCityConfig(params.state, params.city);

  if (!cityConfig) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com';
  const basePath = getCityPath(cityConfig);
  const canonicalUrl = `${siteUrl}${basePath}/product/${params.sku}/`;

  const title = `Flower Arrangement - Delivery in ${cityConfig.cityName}`;
  const description = `Order beautiful flower arrangements for delivery in ${cityConfig.cityName}. Same-day delivery available.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Golden State Flower Shop',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Flower Arrangement | ${cityConfig.cityName} Delivery`,
      description,
    },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const cityConfig = getCityConfig(params.state, params.city);

  if (!cityConfig) {
    notFound();
  }

  const basePath = getCityPath(cityConfig);

  return (
    <DynamicProductDetail
      sku={params.sku}
      basePath={basePath}
      cityName={cityConfig.cityName}
      cutoffTime={cityConfig.deliveryInfo.sameDay.cutoffTime}
    />
  );
}
