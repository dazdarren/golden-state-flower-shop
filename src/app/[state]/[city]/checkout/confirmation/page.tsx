import { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getCityConfig, getCityPath, getAllCityPaths } from '@/data/cities';
import ConfirmationContent from './ConfirmationContent';

interface ConfirmationPageProps {
  params: {
    state: string;
    city: string;
  };
}

export function generateStaticParams() {
  return getAllCityPaths();
}

export async function generateMetadata({ params }: ConfirmationPageProps): Promise<Metadata> {
  const cityConfig = getCityConfig(params.state, params.city);
  if (!cityConfig) return {};

  return {
    title: `Order Confirmed - ${cityConfig.cityName} Flower Delivery`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

function ConfirmationLoading() {
  return (
    <div className="container-narrow text-center">
      <div className="animate-pulse">
        <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-6" />
        <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4" />
        <div className="h-4 bg-gray-200 rounded w-64 mx-auto" />
      </div>
    </div>
  );
}

export default function ConfirmationPage({ params }: ConfirmationPageProps) {
  const cityConfig = getCityConfig(params.state, params.city);

  if (!cityConfig) {
    notFound();
  }

  const basePath = getCityPath(cityConfig);

  return (
    <section className="py-16">
      <Suspense fallback={<ConfirmationLoading />}>
        <ConfirmationContent basePath={basePath} cityName={cityConfig.cityName} />
      </Suspense>
    </section>
  );
}
