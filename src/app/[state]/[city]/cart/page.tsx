import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCityConfig, getCityPath, getAllCityPaths } from '@/data/cities';
import CartClient from './CartClient';

interface CartPageProps {
  params: {
    state: string;
    city: string;
  };
}

export function generateStaticParams() {
  return getAllCityPaths();
}

export async function generateMetadata({ params }: CartPageProps): Promise<Metadata> {
  const cityConfig = getCityConfig(params.state, params.city);
  if (!cityConfig) return {};

  return {
    title: `Shopping Cart - ${cityConfig.cityName} Flower Delivery`,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function CartPage({ params }: CartPageProps) {
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
            Your Shopping Cart
          </h1>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-8">
        <div className="container-wide">
          <CartClient
            basePath={basePath}
            cityName={cityConfig.cityName}
            primaryZipCodes={cityConfig.primaryZipCodes}
          />
        </div>
      </section>
    </>
  );
}
