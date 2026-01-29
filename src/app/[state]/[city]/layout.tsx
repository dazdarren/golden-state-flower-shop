import { notFound } from 'next/navigation';
import { getCityConfig, getAllCityPaths } from '@/data/cities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface CityLayoutProps {
  children: React.ReactNode;
  params: {
    state: string;
    city: string;
  };
}

// Generate static params for all cities
export function generateStaticParams() {
  return getAllCityPaths();
}

export default function CityLayout({ children, params }: CityLayoutProps) {
  const cityConfig = getCityConfig(params.state, params.city);

  if (!cityConfig) {
    notFound();
  }

  return (
    <>
      <Header cityConfig={cityConfig} />
      <main className="flex-1">
        {children}
      </main>
      <Footer cityConfig={cityConfig} />
    </>
  );
}
