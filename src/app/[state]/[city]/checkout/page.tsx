import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCityConfig, getCityPath, getAllCityPaths } from '@/data/cities';
import CheckoutClient from './CheckoutClient';

interface CheckoutPageProps {
  params: {
    state: string;
    city: string;
  };
}

export function generateStaticParams() {
  return getAllCityPaths();
}

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
  const cityConfig = getCityConfig(params.state, params.city);
  if (!cityConfig) return {};

  return {
    title: `Checkout - ${cityConfig.cityName} Flower Delivery`,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const cityConfig = getCityConfig(params.state, params.city);

  if (!cityConfig) {
    notFound();
  }

  const basePath = getCityPath(cityConfig);

  return (
    <>
      {/* Header */}
      <section className="bg-gray-50 py-8">
        <div className="container-wide">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Checkout
          </h1>
        </div>
      </section>

      {/* Checkout Form */}
      <section className="py-8">
        <div className="container-wide">
          <CheckoutClient
            basePath={basePath}
            cityConfig={{
              cityName: cityConfig.cityName,
              stateAbbr: cityConfig.stateAbbr,
              primaryZipCodes: cityConfig.primaryZipCodes,
            }}
          />
        </div>
      </section>
    </>
  );
}
