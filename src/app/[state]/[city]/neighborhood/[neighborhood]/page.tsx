import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityConfig, getCityPath, getAllCities } from '@/data/cities';
import { OCCASIONS } from '@/data/categories';
import DynamicProductGrid from '@/components/DynamicProductGrid';

interface NeighborhoodPageProps {
  params: {
    state: string;
    city: string;
    neighborhood: string;
  };
}

// Helper to create URL-safe slug from neighborhood name
function neighborhoodToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper to get neighborhood name from slug
function getNeighborhoodFromSlug(slug: string, neighborhoods: string[]): string | undefined {
  return neighborhoods.find(n => neighborhoodToSlug(n) === slug);
}

// Generate static params for all neighborhood pages
export function generateStaticParams() {
  const cities = getAllCities();
  const params: { state: string; city: string; neighborhood: string }[] = [];

  for (const city of cities) {
    for (const neighborhood of city.neighborhoods) {
      params.push({
        state: city.stateSlug,
        city: city.citySlug,
        neighborhood: neighborhoodToSlug(neighborhood),
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: NeighborhoodPageProps): Promise<Metadata> {
  const cityConfig = getCityConfig(params.state, params.city);
  if (!cityConfig) return {};

  const neighborhoodName = getNeighborhoodFromSlug(params.neighborhood, cityConfig.neighborhoods);
  if (!neighborhoodName) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com';
  const basePath = getCityPath(cityConfig);
  const canonicalUrl = `${siteUrl}${basePath}/neighborhood/${params.neighborhood}/`;

  const title = `Flower Delivery to ${neighborhoodName}, ${cityConfig.cityName} | Same-Day`;
  const description = `Same-day flower delivery to ${neighborhoodName} in ${cityConfig.cityName}. Fresh arrangements for birthdays, anniversaries, sympathy & more. Order by 2pm for delivery today.`;

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

export default function NeighborhoodPage({ params }: NeighborhoodPageProps) {
  const cityConfig = getCityConfig(params.state, params.city);

  if (!cityConfig) {
    notFound();
  }

  const neighborhoodName = getNeighborhoodFromSlug(params.neighborhood, cityConfig.neighborhoods);

  if (!neighborhoodName) {
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
        name: neighborhoodName,
        item: `${siteUrl}${basePath}/neighborhood/${params.neighborhood}`,
      },
    ],
  };

  // Local Business Schema for the neighborhood
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'Florist',
    name: `Golden State Flower Shop - ${neighborhoodName}`,
    description: `Same-day flower delivery to ${neighborhoodName}, ${cityConfig.cityName}. Fresh arrangements for all occasions.`,
    url: `${siteUrl}${basePath}/neighborhood/${params.neighborhood}/`,
    areaServed: {
      '@type': 'Place',
      name: neighborhoodName,
      containedInPlace: {
        '@type': 'City',
        name: cityConfig.cityName,
      },
    },
    priceRange: '$$-$$$',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
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
            <li className="text-forest-900 font-medium">{neighborhoodName}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-sage-50 via-cream-50 to-white py-12 lg:py-16">
        <div className="container-wide">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-sage-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-forest-900">
              Flower Delivery to {neighborhoodName}
            </h1>
          </div>
          <p className="text-lg text-forest-800/60 max-w-2xl">
            Fresh flower arrangements delivered same-day to {neighborhoodName} in {cityConfig.cityName}.
            Birthday flowers, sympathy arrangements, anniversary bouquets, and more.
          </p>
        </div>
      </section>

      {/* Delivery Info Banner */}
      <section className="bg-sage-50 border-y border-sage-100">
        <div className="container-wide py-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-soft">
                <svg className="w-5 h-5 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-forest-900">Same-Day to {neighborhoodName}</h3>
                <p className="text-sm text-forest-800/60">Order by {cityConfig.deliveryInfo.sameDay.cutoffTime}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-soft">
                <svg className="w-5 h-5 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-forest-900">Local Florist Partners</h3>
                <p className="text-sm text-forest-800/60">Hand-arranged by {cityConfig.cityName} florists</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-soft">
                <svg className="w-5 h-5 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-forest-900">Arrangements from $49</h3>
                <p className="text-sm text-forest-800/60">Delivery included in {neighborhoodName}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 lg:py-16">
        <div className="container-wide">
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6">
            Popular Arrangements for {neighborhoodName}
          </h2>
          <DynamicProductGrid
            basePath={basePath}
            occasion="birthday"
            count={12}
            showFilters={true}
          />
        </div>
      </section>

      {/* Shop by Occasion */}
      <section className="py-12 lg:py-16 bg-cream-50">
        <div className="container-wide">
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6">
            Shop by Occasion
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {OCCASIONS.slice(0, 8).map((occasion) => (
              <Link
                key={occasion.slug}
                href={`${basePath}/flowers/${occasion.slug}/`}
                className="group p-5 rounded-xl bg-white border border-cream-200 hover:border-sage-300 hover:shadow-soft transition-all"
              >
                <h3 className="font-medium text-forest-900 group-hover:text-sage-700 transition-colors mb-1">
                  {occasion.name}
                </h3>
                <p className="text-sm text-forest-800/50">
                  Delivery to {neighborhoodName}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About the Neighborhood */}
      <section className="py-12 lg:py-16">
        <div className="container-narrow">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-forest-900 mb-6">
            Flower Delivery in {neighborhoodName}
          </h2>
          <div className="prose prose-forest max-w-none text-forest-800/70">
            <p>
              {neighborhoodName} is one of {cityConfig.cityName}&apos;s most vibrant neighborhoods,
              and we&apos;re proud to offer same-day flower delivery to every address in the area.
              Whether you&apos;re sending birthday wishes to a friend, expressing sympathy to a neighbor,
              or surprising a loved one just because, our local florist partners craft each arrangement
              with care.
            </p>
            <p>
              Our delivery drivers know {neighborhoodName} well, ensuring your flowers arrive fresh
              and on time. We deliver to homes, apartments, offices, and businesses throughout the
              neighborhood. For residential deliveries, if no one is home, we&apos;ll leave flowers
              in a safe location or coordinate redelivery at no extra charge.
            </p>
            <p>
              Order by {cityConfig.deliveryInfo.sameDay.cutoffTime} for same-day delivery to {neighborhoodName}.
              Need next-day delivery? No problem - orders placed after the cutoff are delivered the following business day.
            </p>
          </div>
        </div>
      </section>

      {/* Other Neighborhoods */}
      <section className="py-12 lg:py-16 bg-white border-t border-cream-200">
        <div className="container-wide">
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6">
            Other {cityConfig.cityName} Neighborhoods
          </h2>
          <div className="flex flex-wrap gap-3">
            {cityConfig.neighborhoods
              .filter(n => n !== neighborhoodName)
              .map((neighborhood) => (
                <Link
                  key={neighborhood}
                  href={`${basePath}/neighborhood/${neighborhoodToSlug(neighborhood)}/`}
                  className="px-4 py-2 rounded-full bg-cream-50 border border-cream-200 text-forest-800
                           hover:border-sage-300 hover:bg-sage-50 transition-all text-sm"
                >
                  {neighborhood}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
