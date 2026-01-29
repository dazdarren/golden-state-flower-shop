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

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const cityConfig = getCityConfig(params.state, params.city);

  if (!cityConfig) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const basePath = getCityPath(cityConfig);
  const canonicalUrl = `${siteUrl}${basePath}/product/${params.sku}/`;

  return {
    title: `Flower Arrangement - Delivery in ${cityConfig.cityName}`,
    description: `Order beautiful flower arrangements for delivery in ${cityConfig.cityName}. Same-day delivery available.`,
    alternates: {
      canonical: canonicalUrl,
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
