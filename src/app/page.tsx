import Link from 'next/link';
import { Metadata } from 'next';
import { getCitiesByRegion, getCityPath } from '@/data/cities';

export const metadata: Metadata = {
  title: 'Golden State Flower Shop | Same-Day Flower Delivery Across California',
  description:
    'Fresh flower delivery throughout California. Same-day delivery to San Francisco, Los Angeles, San Diego, San Jose, Sacramento, and more. Order beautiful arrangements from local artisan florists.',
  openGraph: {
    title: 'Golden State Flower Shop | California Flower Delivery',
    description:
      'Same-day flower delivery across California. Fresh arrangements from local florists.',
    type: 'website',
  },
};

export default function HomePage() {
  const citiesByRegion = getCitiesByRegion();

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Florist',
            name: 'Golden State Flower Shop',
            description: 'Same-day flower delivery throughout California',
            url: 'https://goldenstateflowershop.com',
            areaServed: {
              '@type': 'State',
              name: 'California',
            },
            priceRange: '$$',
          }),
        }}
      />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sage-50 via-cream-50 to-rose-50" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAxOGMtMy4zMTQgMC02LTIuNjg2LTYtNnMyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNnoiIGZpbGw9IiM4Yjk5NmYiIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvZz48L3N2Zz4=')] opacity-60" />

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-96 h-96 opacity-[0.06]">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-sage-600">
            <path d="M100 10c0 50-40 70-40 110s20 50 40 50 40-10 40-50-40-60-40-110z" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-40 left-10 w-64 h-64 opacity-[0.04]">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-rose-500">
            <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="2" />
            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="2" />
            <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        <div className="container-wide relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                          bg-white/80 backdrop-blur-sm border border-sage-200
                          text-sage-700 text-sm font-medium mb-8 shadow-soft">
              <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              California's Trusted Florist
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold
                         text-forest-900 leading-[1.1] tracking-tight mb-6">
              Golden State
              <span className="block text-sage-600">Flower Shop</span>
            </h1>

            <p className="text-xl sm:text-2xl text-forest-800/70 leading-relaxed mb-10 max-w-2xl mx-auto">
              Same-day flower delivery across California. Fresh, beautiful arrangements
              crafted by local artisan florists in your city.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/ca/san-francisco" className="btn-primary text-lg px-8 py-4">
                Find Your City
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>

            {/* Quick city links */}
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              {['San Francisco', 'Los Angeles', 'San Diego', 'San Jose'].map((city) => (
                <Link
                  key={city}
                  href={`/ca/${city.toLowerCase().replace(' ', '-')}`}
                  className="px-4 py-2 rounded-full text-sm font-medium
                           bg-white/60 text-forest-800 border border-cream-300
                           hover:bg-white hover:border-sage-300 hover:shadow-soft
                           transition-all duration-300"
                >
                  {city}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
            <path d="M0 120V60c240-40 480-60 720-60s480 20 720 60v60H0z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Cities by Region */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sage-600 text-sm font-medium uppercase tracking-widest">
              Delivery Areas
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-forest-900 mt-4 mb-5">
              We Deliver Throughout California
            </h2>
            <p className="text-forest-800/60 text-lg">
              Select your city for same-day flower delivery, local florist arrangements,
              and hassle-free ordering.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {Object.entries(citiesByRegion).map(([region, cities], regionIndex) => (
              <div
                key={region}
                className="bg-cream-50 rounded-3xl p-8 lg:p-10 border border-cream-200
                         opacity-0 animate-fade-up"
                style={{
                  animationDelay: `${regionIndex * 150}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                <h3 className="font-display text-2xl font-semibold text-forest-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
                    {getRegionIcon(region)}
                  </span>
                  {region}
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {cities.map((city) => (
                    <Link
                      key={city.citySlug}
                      href={getCityPath(city)}
                      className="group flex items-center justify-between p-4 rounded-xl
                               bg-white border border-cream-200
                               hover:border-sage-300 hover:shadow-soft
                               transition-all duration-300"
                    >
                      <div>
                        <span className="font-medium text-forest-900 group-hover:text-sage-700 transition-colors">
                          {city.cityName}
                        </span>
                        <span className="block text-xs text-forest-800/50 mt-0.5">
                          {city.neighborhoods.length}+ neighborhoods
                        </span>
                      </div>
                      <svg
                        className="w-5 h-5 text-sage-400 opacity-0 group-hover:opacity-100
                                 translate-x-0 group-hover:translate-x-1 transition-all duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28 bg-cream-50">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-sage-600 text-sm font-medium uppercase tracking-widest">
              Why Golden State
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-forest-900 mt-4">
              California's Flower Delivery Experts
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Same-Day Delivery',
                description: 'Order by 2 PM local time for same-day delivery to any California address.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: 'Local Florists',
                description: 'Your arrangements are crafted by skilled local florists in your city.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Freshness Guaranteed',
                description: 'Every arrangement arrives fresh or we\'ll replace it, no questions asked.',
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group bg-white rounded-3xl p-8 lg:p-10 border border-cream-200
                         hover:border-sage-200 hover:shadow-soft-lg
                         transition-all duration-500 opacity-0 animate-fade-up"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                <div className="w-14 h-14 rounded-2xl bg-sage-100 text-sage-600
                              flex items-center justify-center mb-6
                              group-hover:bg-sage-500 group-hover:text-white
                              transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl font-semibold text-forest-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-forest-800/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-forest-900 text-cream-100">
        <div className="container-narrow text-center">
          <h2 className="font-display text-4xl lg:text-5xl font-semibold text-cream-100 mb-6">
            Ready to Send Flowers?
          </h2>
          <p className="text-cream-200/70 text-lg mb-10 max-w-xl mx-auto">
            Choose your city and browse our collection of beautiful arrangements,
            all available for same-day delivery.
          </p>
          <Link
            href="/ca/los-angeles"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full
                     bg-cream-100 text-forest-900 font-medium text-lg
                     hover:bg-white hover:shadow-soft-lg hover:-translate-y-0.5
                     transition-all duration-300"
          >
            Get Started
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Simple Footer for Homepage */}
      <footer className="bg-forest-900 text-cream-200 py-10 border-t border-forest-800">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-sage-400" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
                <path d="M20 8c0 6-4 10-4 14s2 6 4 6 4-2 4-6-4-8-4-14z" fill="currentColor" opacity="0.3" />
                <path d="M20 10c-3 4-6 7-6 10s2 5 6 5 6-2 6-5-3-6-6-10z" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
              <span className="font-display text-lg font-semibold text-cream-100">
                Golden State Flower Shop
              </span>
            </div>
            <p className="text-sm text-cream-200/50">
              &copy; {new Date().getFullYear()} Golden State Flower Shop. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

function getRegionIcon(region: string): JSX.Element {
  const iconClass = "w-5 h-5 text-sage-600";

  switch (region) {
    case 'Bay Area':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case 'Southern California':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case 'Central California':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'Coastal & Resort':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        </svg>
      );
  }
}
