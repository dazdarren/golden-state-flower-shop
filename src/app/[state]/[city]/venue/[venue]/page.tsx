import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityConfig, getCityPath, getAllCities } from '@/data/cities';
import { OCCASIONS } from '@/data/categories';
import DynamicProductGrid from '@/components/DynamicProductGrid';

interface VenuePageProps {
  params: {
    state: string;
    city: string;
    venue: string;
  };
}

// Helper to create URL-safe slug from venue name
function venueToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper to get venue name from slug
function getVenueFromSlug(slug: string, venues: string[]): string | undefined {
  return venues.find(v => venueToSlug(v) === slug);
}

// Generate static params for all venue pages
export function generateStaticParams() {
  const cities = getAllCities();
  const params: { state: string; city: string; venue: string }[] = [];

  for (const city of cities) {
    for (const venue of city.venues) {
      params.push({
        state: city.stateSlug,
        city: city.citySlug,
        venue: venueToSlug(venue),
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: VenuePageProps): Promise<Metadata> {
  const cityConfig = getCityConfig(params.state, params.city);
  if (!cityConfig) return {};

  const venueName = getVenueFromSlug(params.venue, cityConfig.venues);
  if (!venueName) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com';
  const basePath = getCityPath(cityConfig);
  const canonicalUrl = `${siteUrl}${basePath}/venue/${params.venue}/`;

  const title = `Flower Delivery to ${venueName} | ${cityConfig.cityName} Events`;
  const description = `Event and wedding flowers for ${venueName} in ${cityConfig.cityName}. Centerpieces, ceremony flowers, and arrangements delivered directly to your venue. Same-day available.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

export default function VenuePage({ params }: VenuePageProps) {
  const cityConfig = getCityConfig(params.state, params.city);

  if (!cityConfig) {
    notFound();
  }

  const venueName = getVenueFromSlug(params.venue, cityConfig.venues);

  if (!venueName) {
    notFound();
  }

  const basePath = getCityPath(cityConfig);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com';

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: cityConfig.cityName,
        item: `${siteUrl}${basePath}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Venue Delivery',
        item: `${siteUrl}${basePath}/venue/${params.venue}`,
      },
    ],
  };

  // Service Schema for venue delivery
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Event Flower Delivery to ${venueName}`,
    description: `Wedding and event flower delivery service to ${venueName} in ${cityConfig.cityName}. Centerpieces, ceremony arrangements, and decor.`,
    provider: {
      '@type': 'Florist',
      name: 'Golden State Flower Shop',
      url: siteUrl,
    },
    areaServed: {
      '@type': 'Place',
      name: venueName,
      address: {
        '@type': 'PostalAddress',
        addressLocality: cityConfig.cityName,
        addressRegion: cityConfig.stateAbbr,
      },
    },
    serviceType: 'Event Flower Delivery',
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="bg-cream-50 border-b border-cream-200">
        <div className="container-wide py-3">
          <ol className="flex items-center gap-2 text-sm text-forest-800/60">
            <li>
              <Link href={basePath} className="hover:text-forest-900 transition-colors">
                {cityConfig.cityName}
              </Link>
            </li>
            <li>/</li>
            <li className="text-forest-900 font-medium">Venue Delivery</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-50 via-cream-50 to-white py-12 lg:py-16">
        <div className="container-wide">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-forest-900">
              Flowers for {venueName}
            </h1>
          </div>
          <p className="text-lg text-forest-800/60 max-w-2xl">
            Beautiful floral arrangements for weddings, corporate events, and special occasions at {venueName}.
            We deliver directly to the venue and can coordinate with event planners.
          </p>
        </div>
      </section>

      {/* Venue Delivery Info */}
      <section className="bg-rose-50 border-y border-rose-100">
        <div className="container-wide py-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-soft">
                <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-forest-900">Event Day Delivery</h3>
                <p className="text-sm text-forest-800/60">Timed to arrive before your event</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-soft">
                <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-forest-900">Planner Coordination</h3>
                <p className="text-sm text-forest-800/60">We work with your event team</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-soft">
                <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-forest-900">Custom Arrangements</h3>
                <p className="text-sm text-forest-800/60">Tailored to your event style</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Arrangements */}
      <section className="py-12 lg:py-16">
        <div className="container-wide">
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6">
            Event Arrangements for {venueName}
          </h2>
          <DynamicProductGrid
            basePath={basePath}
            occasion="anniversary"
            count={12}
            showFilters={true}
          />
        </div>
      </section>

      {/* Event Types */}
      <section className="py-12 lg:py-16 bg-cream-50">
        <div className="container-wide">
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6">
            Events We Serve at {venueName}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Weddings', icon: '💒', desc: 'Ceremony & reception flowers' },
              { name: 'Corporate Events', icon: '🏢', desc: 'Professional arrangements' },
              { name: 'Galas & Fundraisers', icon: '✨', desc: 'Elegant centerpieces' },
              { name: 'Birthday Parties', icon: '🎂', desc: 'Festive bouquets' },
              { name: 'Anniversary Celebrations', icon: '💕', desc: 'Romantic arrangements' },
              { name: 'Retirement Parties', icon: '🎉', desc: 'Congratulatory flowers' },
              { name: 'Memorial Services', icon: '🕊️', desc: 'Sympathy tributes' },
              { name: 'Holiday Parties', icon: '🎄', desc: 'Seasonal decor' },
            ].map((event) => (
              <div
                key={event.name}
                className="p-5 rounded-xl bg-white border border-cream-200"
              >
                <span className="text-2xl mb-2 block">{event.icon}</span>
                <h3 className="font-medium text-forest-900 mb-1">{event.name}</h3>
                <p className="text-sm text-forest-800/50">{event.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Arrangement Types for Events */}
      <section className="py-12 lg:py-16">
        <div className="container-wide">
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6">
            Popular Event Arrangements
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href={`${basePath}/shop/centerpieces/`}
              className="group p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-cream-50 border border-amber-100 hover:shadow-soft transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 shadow-soft">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-forest-900 mb-2 group-hover:text-amber-700 transition-colors">
                Centerpieces
              </h3>
              <p className="text-forest-800/60">
                Table arrangements that create stunning focal points for dining and reception areas.
              </p>
            </Link>

            <Link
              href={`${basePath}/shop/premium-collection/`}
              className="group p-6 rounded-2xl bg-gradient-to-br from-gold-50 to-cream-50 border border-gold-100 hover:shadow-soft transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 shadow-soft">
                <svg className="w-6 h-6 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-forest-900 mb-2 group-hover:text-gold-700 transition-colors">
                Premium Collection
              </h3>
              <p className="text-forest-800/60">
                Luxury arrangements featuring the finest blooms for upscale events.
              </p>
            </Link>

            <Link
              href={`${basePath}/shop/mixed-arrangements/`}
              className="group p-6 rounded-2xl bg-gradient-to-br from-sage-50 to-cream-50 border border-sage-100 hover:shadow-soft transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 shadow-soft">
                <svg className="w-6 h-6 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-forest-900 mb-2 group-hover:text-sage-700 transition-colors">
                Mixed Arrangements
              </h3>
              <p className="text-forest-800/60">
                Colorful, versatile bouquets perfect for any celebration style.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Event Planning Tips */}
      <section className="py-12 lg:py-16 bg-cream-50">
        <div className="container-narrow">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-forest-900 mb-6">
            Planning Event Flowers for {venueName}
          </h2>
          <div className="prose prose-forest max-w-none text-forest-800/70 space-y-4">
            <p>
              {venueName} is one of {cityConfig.cityName}&apos;s premier event venues, and we&apos;re
              experienced in delivering beautiful floral arrangements that complement its unique character.
            </p>

            <h3 className="text-lg font-semibold text-forest-900 mt-6">Ordering for Your Event</h3>
            <ul className="space-y-2">
              <li>
                <strong>Book early for large events</strong> - For weddings and galas, we recommend ordering
                at least 2-4 weeks in advance to ensure availability of specific blooms.
              </li>
              <li>
                <strong>Share your color palette</strong> - Let us know your event colors and we&apos;ll
                create arrangements that match perfectly.
              </li>
              <li>
                <strong>Consider the venue style</strong> - {venueName}&apos;s architecture and decor
                can guide flower choices for a cohesive look.
              </li>
              <li>
                <strong>Coordinate with your planner</strong> - We can work directly with your event
                coordinator for seamless delivery and setup.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-forest-900 mt-6">Delivery to {venueName}</h3>
            <p>
              We deliver directly to {venueName} and coordinate with venue staff to ensure
              your flowers arrive at the right time and location. For events requiring setup,
              please let us know and we can discuss options.
            </p>

            <h3 className="text-lg font-semibold text-forest-900 mt-6">Same-Day Event Flowers</h3>
            <p>
              Need flowers for a last-minute event? Order by {cityConfig.deliveryInfo.sameDay.cutoffTime} for
              same-day delivery to {venueName}. We have beautiful arrangements ready to go
              for unexpected celebrations.
            </p>
          </div>
        </div>
      </section>

      {/* Other Venues */}
      <section className="py-12 lg:py-16">
        <div className="container-wide">
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6">
            Other {cityConfig.cityName} Venues We Serve
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cityConfig.venues
              .filter(v => v !== venueName)
              .map((venue) => (
                <Link
                  key={venue}
                  href={`${basePath}/venue/${venueToSlug(venue)}/`}
                  className="p-4 rounded-xl bg-white border border-cream-200 hover:border-rose-200 hover:shadow-soft transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                      <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <span className="font-medium text-forest-900 group-hover:text-rose-700 transition-colors text-sm">
                      {venue}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-rose-50 to-cream-50 border-t border-rose-100">
        <div className="container-narrow text-center">
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-4">
            Planning a Large Event?
          </h2>
          <p className="text-forest-800/60 mb-6 max-w-lg mx-auto">
            For weddings, corporate events, or large celebrations at {venueName},
            contact us to discuss custom arrangements and bulk orders.
          </p>
          <Link
            href={`${basePath}/contact/`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-forest-900 text-cream-100
                     rounded-full font-medium transition-all duration-300
                     hover:bg-forest-800 hover:shadow-soft-lg"
          >
            Contact Us
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
