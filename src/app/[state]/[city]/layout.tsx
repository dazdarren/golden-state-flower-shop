import { notFound } from 'next/navigation';
import { getCityConfig, getAllCityPaths } from '@/data/cities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import { AuthProvider } from '@/context/AuthContext';

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
    <AuthProvider>
      <Header cityConfig={cityConfig} />
      <main className="flex-1">
        {children}
      </main>
      <Footer cityConfig={cityConfig} />
      <ExitIntentPopup delay={10000} />
    </AuthProvider>
  );
}
