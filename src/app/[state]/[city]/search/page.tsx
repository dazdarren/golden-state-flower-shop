import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCityConfig } from '@/data/cities';
import SearchClient from './SearchClient';

interface SearchPageProps {
  params: {
    state: string;
    city: string;
  };
}

export async function generateMetadata({ params }: SearchPageProps): Promise<Metadata> {
  const cityConfig = getCityConfig(params.state, params.city);

  if (!cityConfig) return {};

  return {
    title: `Search Flowers in ${cityConfig.cityName} | Golden State Flower Shop`,
    description: `Search our collection of fresh flower arrangements for delivery in ${cityConfig.cityName}. Birthday, sympathy, anniversary flowers and more.`,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function SearchPage({ params }: SearchPageProps) {
  const cityConfig = getCityConfig(params.state, params.city);

  if (!cityConfig) {
    notFound();
  }

  return (
    <SearchClient
      state={params.state}
      city={params.city}
      cityName={cityConfig.cityName}
    />
  );
}
