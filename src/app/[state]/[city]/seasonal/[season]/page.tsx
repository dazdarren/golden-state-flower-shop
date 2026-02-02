import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityConfig, getCityPath } from '@/data/cities';
import { SEASONAL, getSeasonalBySlug, SeasonalConfig } from '@/data/categories';
import DynamicProductGrid from '@/components/DynamicProductGrid';

interface SeasonalPageProps {
  params: {
    state: string;
    city: string;
    season: string;
  };
}

// Generate static params for all seasonal pages
export function generateStaticParams() {
  return SEASONAL.map((season) => ({ season: season.slug }));
}

export async function generateMetadata({ params }: SeasonalPageProps): Promise<Metadata> {
  const cityConfig = getCityConfig(params.state, params.city);
  const seasonal = getSeasonalBySlug(params.season);

  if (!cityConfig || !seasonal) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com';
  const basePath = getCityPath(cityConfig);
  const canonicalUrl = `${siteUrl}${basePath}/seasonal/${params.season}/`;

  const description = seasonal.metaDescription.replace('{cityName}', cityConfig.cityName);
  const title = `${seasonal.title} in ${cityConfig.cityName}, ${cityConfig.stateAbbr}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${seasonal.title} - ${cityConfig.cityName} Delivery`,
      description,
      url: canonicalUrl,
      siteName: 'Golden State Flower Shop',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${seasonal.title} in ${cityConfig.cityName} | Golden State Flower Shop`,
      description,
    },
  };
}

export default function SeasonalPage({ params }: SeasonalPageProps) {
  const cityConfig = getCityConfig(params.state, params.city);
  const seasonal = getSeasonalBySlug(params.season);

  if (!cityConfig || !seasonal) {
    notFound();
  }

  const basePath = getCityPath(cityConfig);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com';
  const isActive = seasonal.activeMonths.includes(new Date().getMonth() + 1);

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
        name: 'Seasonal',
        item: `${siteUrl}${basePath}/seasonal`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: seasonal.title,
        item: `${siteUrl}${basePath}/seasonal/${params.season}`,
      },
    ],
  };

  // Collection Schema with AggregateOffer
  const priceRange = seasonal.priceRange;
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${seasonal.title} - ${cityConfig.cityName} Flower Delivery`,
    description: seasonal.description,
    url: `${siteUrl}${basePath}/seasonal/${params.season}`,
    mainEntity: {
      '@type': 'ItemList',
      name: seasonal.title,
      description: seasonal.description,
      numberOfItems: 12,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
    },
    ...(priceRange && {
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: priceRange.low.toFixed(2),
        highPrice: priceRange.high.toFixed(2),
        priceCurrency: 'USD',
        offerCount: 12,
        availability: 'https://schema.org/InStock',
      },
    }),
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
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
            <li>
              <span className="text-forest-800/40">Seasonal</span>
            </li>
            <li>/</li>
            <li className="text-forest-900 font-medium">{seasonal.name}</li>
          </ol>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className={`relative py-16 lg:py-24 overflow-hidden ${getSeasonalGradient(params.season)}`}>
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {getSeasonalDecoration(params.season)}
        </div>

        <div className="container-wide relative z-10">
          <div className="max-w-2xl">
            {isActive && (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${getSeasonalBadgeStyle(params.season)}`}>
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                Available Now
              </div>
            )}

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-forest-900 mb-4">
              {seasonal.title}
            </h1>
            <p className="text-lg md:text-xl text-forest-800/70 mb-2">
              {seasonal.description}
            </p>
            <p className="text-sm text-forest-800/50">
              {seasonal.timing} collection for {cityConfig.cityName}
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 lg:py-16">
        <div className="container-wide">
          <DynamicProductGrid
            basePath={basePath}
            occasion={params.season}
            count={12}
            showFilters={true}
          />
        </div>
      </section>

      {/* Seasonal Info */}
      <section className="py-12 lg:py-16 bg-cream-50">
        <div className="container-narrow">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-forest-900 mb-6">
            {seasonal.name} in {cityConfig.cityName}
          </h2>
          <div className="prose prose-forest max-w-none text-forest-800/70">
            {getSeasonalContent(params.season, cityConfig)}
          </div>
        </div>
      </section>

      {/* Other Seasonal Collections */}
      <section className="py-12 lg:py-16">
        <div className="container-wide">
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6">
            More Seasonal Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SEASONAL.filter((s) => s.slug !== params.season).map((season) => {
              const isSeasonActive = season.activeMonths.includes(new Date().getMonth() + 1);
              return (
                <Link
                  key={season.slug}
                  href={`${basePath}/seasonal/${season.slug}`}
                  className="group relative rounded-2xl overflow-hidden"
                >
                  <div className={`p-8 ${getSeasonalCardGradient(season.slug)}`}>
                    <div className="flex items-center justify-between mb-4">
                      {getSeasonalIcon(season.slug)}
                      {isSeasonActive && (
                        <span className="text-[10px] font-semibold text-rose-600 bg-white/80 px-2 py-1 rounded-full">
                          NOW
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-xl font-semibold text-forest-900 mb-2 group-hover:text-sage-700 transition-colors">
                      {season.name}
                    </h3>
                    <p className="text-sm text-forest-800/60">{season.timing}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function getSeasonalGradient(slug: string): string {
  const gradients: Record<string, string> = {
    'valentines-day': 'bg-gradient-to-br from-rose-100 via-rose-50 to-cream-50',
    'mothers-day': 'bg-gradient-to-br from-pink-100 via-pink-50 to-cream-50',
    christmas: 'bg-gradient-to-br from-forest-100 via-sage-50 to-cream-50',
    'seasonal-specials': 'bg-gradient-to-br from-amber-100 via-amber-50 to-cream-50',
  };
  return gradients[slug] || 'bg-gradient-to-br from-cream-100 to-cream-50';
}

function getSeasonalCardGradient(slug: string): string {
  const gradients: Record<string, string> = {
    'valentines-day': 'bg-gradient-to-br from-rose-50 to-cream-50 border border-rose-100',
    'mothers-day': 'bg-gradient-to-br from-pink-50 to-cream-50 border border-pink-100',
    christmas: 'bg-gradient-to-br from-sage-50 to-cream-50 border border-sage-100',
    'seasonal-specials': 'bg-gradient-to-br from-amber-50 to-cream-50 border border-amber-100',
  };
  return gradients[slug] || 'bg-gradient-to-br from-cream-50 to-white border border-cream-200';
}

function getSeasonalBadgeStyle(slug: string): string {
  const styles: Record<string, string> = {
    'valentines-day': 'bg-rose-100 text-rose-700 border border-rose-200',
    'mothers-day': 'bg-pink-100 text-pink-700 border border-pink-200',
    christmas: 'bg-forest-100 text-forest-700 border border-forest-200',
    'seasonal-specials': 'bg-amber-100 text-amber-700 border border-amber-200',
  };
  return styles[slug] || 'bg-sage-100 text-sage-700 border border-sage-200';
}

function getSeasonalDecoration(slug: string): JSX.Element {
  const decorations: Record<string, JSX.Element> = {
    'valentines-day': (
      <>
        <div className="absolute top-10 right-10 w-64 h-64 opacity-10">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-rose-500">
            <path d="M100 180 C20 100, 20 40, 100 40 C180 40, 180 100, 100 180Z" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-10 left-10 w-48 h-48 opacity-5 rotate-12">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-rose-400">
            <path d="M100 180 C20 100, 20 40, 100 40 C180 40, 180 100, 100 180Z" fill="currentColor" />
          </svg>
        </div>
      </>
    ),
    'mothers-day': (
      <>
        <div className="absolute top-10 right-10 w-64 h-64 opacity-10">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-pink-500">
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" />
            <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="2" />
            <circle cx="100" cy="100" r="20" fill="currentColor" />
          </svg>
        </div>
      </>
    ),
    christmas: (
      <>
        <div className="absolute top-10 right-10 w-64 h-64 opacity-10">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-forest-600">
            <polygon points="100,20 140,80 180,80 150,120 160,180 100,150 40,180 50,120 20,80 60,80" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-10 left-10 w-32 h-32 opacity-5">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-forest-600">
            <polygon points="100,20 140,80 180,80 150,120 160,180 100,150 40,180 50,120 20,80 60,80" fill="currentColor" />
          </svg>
        </div>
      </>
    ),
    'seasonal-specials': (
      <>
        <div className="absolute top-10 right-10 w-64 h-64 opacity-10">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-amber-500">
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" />
            <path d="M100 20 L100 180 M20 100 L180 100 M35 35 L165 165 M165 35 L35 165" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </>
    ),
  };
  return decorations[slug] || <></>;
}

function getSeasonalIcon(slug: string): JSX.Element {
  const icons: Record<string, JSX.Element> = {
    'valentines-day': (
      <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
        <svg className="w-6 h-6 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    ),
    'mothers-day': (
      <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
        <svg className="w-6 h-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
    ),
    christmas: (
      <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center">
        <svg className="w-6 h-6 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 3l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" />
        </svg>
      </div>
    ),
    'seasonal-specials': (
      <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
        <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    ),
  };
  return icons[slug] || icons['seasonal-specials'];
}

function getSeasonalContent(
  slug: string,
  cityConfig: { cityName: string; neighborhoods: string[] }
): React.ReactNode {
  switch (slug) {
    case 'valentines-day':
      return (
        <>
          <p>
            Make this Valentine&apos;s Day unforgettable with our romantic flower collection.
            From classic red roses to stunning mixed arrangements, we have everything you need
            to express your love in {cityConfig.cityName}.
          </p>
          <p>
            Order early to secure same-day delivery on February 14th. Our Valentine&apos;s arrangements
            are available for delivery to {cityConfig.neighborhoods.slice(0, 3).join(', ')}, and all
            {cityConfig.cityName} neighborhoods.
          </p>
        </>
      );
    case 'mothers-day':
      return (
        <>
          <p>
            Celebrate the amazing mom in your life with beautiful Mother&apos;s Day flowers.
            Our specially curated collection features elegant bouquets, lush plants, and
            thoughtful arrangements perfect for showing your appreciation.
          </p>
          <p>
            We deliver Mother&apos;s Day flowers throughout {cityConfig.cityName}. Order by
            Friday before Mother&apos;s Day to guarantee delivery on her special day.
          </p>
        </>
      );
    case 'christmas':
      return (
        <>
          <p>
            Spread holiday cheer with our festive Christmas flower collection. Featuring
            traditional reds and greens, elegant white arrangements, and stunning centerpieces
            perfect for holiday gatherings in {cityConfig.cityName}.
          </p>
          <p>
            Our holiday arrangements make wonderful hostess gifts, table centerpieces, or
            thoughtful presents. Delivery available through Christmas Eve.
          </p>
        </>
      );
    case 'seasonal-specials':
      return (
        <>
          <p>
            Discover our rotating collection of seasonal favorites, featuring the freshest
            blooms available in {cityConfig.cityName}. These special arrangements highlight
            the best flowers of each season.
          </p>
          <p>
            Our seasonal specials change throughout the year to bring you unique, timely
            arrangements that capture the spirit of each season. Available for same-day
            delivery throughout {cityConfig.cityName}.
          </p>
        </>
      );
    default:
      return (
        <p>
          Explore our seasonal collection of floral arrangements, designed to celebrate
          special moments throughout the year in {cityConfig.cityName}.
        </p>
      );
  }
}
