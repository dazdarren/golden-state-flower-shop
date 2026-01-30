import type { Metadata } from 'next';
import Script from 'next/script';
import WebVitals from '@/components/WebVitals';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | Golden State Flower Shop',
    default: 'Golden State Flower Shop - Same Day Flower Delivery Across California',
  },
  description:
    'Same-day flower delivery throughout California. Fresh arrangements delivered to San Francisco, Los Angeles, San Diego, San Jose, Sacramento, and more.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <WebVitals />
        {children}

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QW3R1NEJKV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QW3R1NEJKV');
          `}
        </Script>
      </body>
    </html>
  );
}
