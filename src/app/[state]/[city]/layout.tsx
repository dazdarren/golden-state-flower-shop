import { notFound } from 'next/navigation';
import { getCityConfig, getAllCityPaths } from '@/data/cities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import DeliveryCountdown from '@/components/DeliveryCountdown';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ToastProvider } from '@/components/ui/Toast';

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
      <WishlistProvider>
        <ToastProvider>
          {/* Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
                       focus:z-[60] focus:px-4 focus:py-2 focus:bg-forest-900 focus:text-cream-100
                       focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
          >
            Skip to main content
          </a>
          <Header cityConfig={cityConfig} />
          <DeliveryCountdown
            cutoffTime={cityConfig.deliveryInfo.sameDay.cutoffTime}
            cityName={cityConfig.cityName}
            variant="banner"
          />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer cityConfig={cityConfig} />
          <ExitIntentPopup delay={10000} />
        </ToastProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
