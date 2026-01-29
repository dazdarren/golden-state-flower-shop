import Link from 'next/link';
import { CityConfig } from '@/types/city';

interface FooterProps {
  cityConfig: CityConfig;
}

export default function Footer({ cityConfig }: FooterProps) {
  const basePath = `/${cityConfig.stateSlug}/${cityConfig.citySlug}`;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest-900 text-cream-200 mt-auto">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-sage-600 via-sage-400 to-sage-600" />

      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={basePath} className="flex items-center gap-3 mb-5 group">
              <svg
                className="w-10 h-10 text-sage-400 transition-colors group-hover:text-sage-300"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M20 8c0 6-4 10-4 14s2 6 4 6 4-2 4-6-4-8-4-14z"
                  fill="currentColor"
                  opacity="0.3"
                />
                <path
                  d="M20 10c-3 4-6 7-6 10s2 5 6 5 6-2 6-5-3-6-6-10z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
              <div>
                <span className="font-display text-xl font-semibold text-cream-100">
                  {cityConfig.cityName}
                </span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-sage-400 -mt-0.5">
                  Flower Delivery
                </span>
              </div>
            </Link>
            <p className="text-sm text-cream-200/70 leading-relaxed">
              Same-day flower delivery throughout {cityConfig.cityName}. Fresh, beautiful
              arrangements crafted by local artisan florists.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-display text-lg font-semibold text-cream-100 mb-5">
              Shop by Occasion
            </h3>
            <ul className="space-y-3">
              {[
                { href: `${basePath}/flowers/birthday`, label: 'Birthday Flowers' },
                { href: `${basePath}/flowers/sympathy`, label: 'Sympathy & Funeral' },
                { href: `${basePath}/flowers/anniversary`, label: 'Anniversary' },
                { href: `${basePath}/flowers/get-well`, label: 'Get Well' },
                { href: `${basePath}/flowers/thank-you`, label: 'Thank You' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-200/70 hover:text-cream-100 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Delivery Areas */}
          <div>
            <h3 className="font-display text-lg font-semibold text-cream-100 mb-5">
              Delivery Areas
            </h3>
            <ul className="space-y-3">
              {cityConfig.neighborhoods.slice(0, 6).map((neighborhood) => (
                <li key={neighborhood}>
                  <span className="text-sm text-cream-200/70">
                    {neighborhood}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-display text-lg font-semibold text-cream-100 mb-5">
              Help & Info
            </h3>
            <ul className="space-y-3">
              {[
                { href: `${basePath}/delivery`, label: 'Delivery Information' },
                { href: `${basePath}/faq`, label: 'FAQ' },
                { href: `${basePath}/contact`, label: 'Contact Us' },
                { href: `${basePath}/privacy`, label: 'Privacy Policy' },
                { href: `${basePath}/terms`, label: 'Terms of Service' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-200/70 hover:text-cream-100 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-8 border-t border-forest-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-cream-200/50 text-center sm:text-left">
              &copy; {currentYear} {cityConfig.cityName} Flower Delivery. All rights reserved.
            </p>
            <p className="text-xs text-cream-200/40 flex items-center gap-2">
              <svg className="w-4 h-4 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Crafted by local florists in {cityConfig.cityName}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
