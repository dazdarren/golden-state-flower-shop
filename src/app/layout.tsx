import type { Metadata } from 'next';
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
