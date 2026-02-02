import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityConfig, getCityPath } from '@/data/cities';
import { FUNERAL_TYPES, getFuneralTypeBySlug, CategoryConfig } from '@/data/categories';
import DynamicProductGrid from '@/components/DynamicProductGrid';

interface FuneralPageProps {
  params: {
    state: string;
    city: string;
    category: string;
  };
}

// Generate static params for all funeral category pages
export function generateStaticParams() {
  return FUNERAL_TYPES.map((type) => ({ category: type.slug }));
}

export async function generateMetadata({ params }: FuneralPageProps): Promise<Metadata> {
  const cityConfig = getCityConfig(params.state, params.city);
  const funeralType = getFuneralTypeBySlug(params.category);

  if (!cityConfig || !funeralType) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com';
  const basePath = getCityPath(cityConfig);
  const canonicalUrl = `${siteUrl}${basePath}/funeral/${params.category}/`;

  const description = funeralType.metaDescription.replace('{cityName}', cityConfig.cityName);
  const title = `${funeralType.title} in ${cityConfig.cityName}, ${cityConfig.stateAbbr}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${funeralType.title} - ${cityConfig.cityName} Delivery`,
      description,
      url: canonicalUrl,
      siteName: 'Golden State Flower Shop',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${funeralType.title} in ${cityConfig.cityName} | Golden State Flower Shop`,
      description,
    },
  };
}

export default function FuneralCategoryPage({ params }: FuneralPageProps) {
  const cityConfig = getCityConfig(params.state, params.city);
  const funeralType = getFuneralTypeBySlug(params.category);

  if (!cityConfig || !funeralType) {
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
        name: 'Funeral & Sympathy',
        item: `${siteUrl}${basePath}/funeral`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: funeralType.title,
        item: `${siteUrl}${basePath}/funeral/${params.category}`,
      },
    ],
  };

  // Collection Schema with AggregateOffer
  const priceRange = funeralType.priceRange;
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${funeralType.title} - ${cityConfig.cityName} Flower Delivery`,
    description: funeralType.description,
    url: `${siteUrl}${basePath}/funeral/${params.category}`,
    mainEntity: {
      '@type': 'ItemList',
      name: funeralType.title,
      description: funeralType.description,
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
              <Link href={`${basePath}/funeral/funeral-best-sellers`} className="hover:text-forest-900 transition-colors">
                Funeral & Sympathy
              </Link>
            </li>
            <li>/</li>
            <li className="text-forest-900 font-medium">{funeralType.name}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 via-cream-50 to-cream-50 py-12 lg:py-16">
        <div className="container-wide">
          <div className="flex items-center gap-4 mb-4">
            {getFuneralTypeIcon(params.category)}
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-forest-900">
              {funeralType.title}
            </h1>
          </div>
          <p className="text-lg text-forest-800/60 max-w-2xl">
            {getFuneralTypeIntro(params.category, cityConfig.cityName)}
          </p>
        </div>
      </section>

      {/* Important Info Banner */}
      <div className="bg-sage-50 border-y border-sage-200">
        <div className="container-wide py-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-forest-800/70">
              <p>
                We deliver sympathy flowers to all funeral homes and memorial services in {cityConfig.cityName}.
                For time-sensitive deliveries, please call us at <a href="tel:+15104859113" className="font-medium text-sage-700 hover:text-sage-800">(510) 485-9113</a>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <section className="py-12 lg:py-16">
        <div className="container-wide">
          <DynamicProductGrid
            basePath={basePath}
            occasion={params.category}
            count={12}
            showFilters={true}
          />
        </div>
      </section>

      {/* Funeral Type Info */}
      <section className="py-12 lg:py-16 bg-cream-50">
        <div className="container-narrow">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-forest-900 mb-6">
            About {funeralType.name} in {cityConfig.cityName}
          </h2>
          <div className="prose prose-forest max-w-none text-forest-800/70">
            {getFuneralTypeContent(params.category, cityConfig)}
          </div>
        </div>
      </section>

      {/* Related Funeral Categories */}
      <section className="py-12 lg:py-16">
        <div className="container-wide">
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6">
            More Sympathy Arrangements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {FUNERAL_TYPES.filter((t) => t.slug !== params.category).slice(0, 8).map((type) => (
              <Link
                key={type.slug}
                href={`${basePath}/funeral/${type.slug}`}
                className="group p-5 rounded-xl bg-cream-50 border border-cream-200 hover:border-sage-300 hover:shadow-soft transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mb-3 shadow-soft group-hover:scale-110 transition-transform">
                  {getSmallFuneralTypeIcon(type.slug)}
                </div>
                <h3 className="font-display text-base font-medium text-forest-900 mb-1">{type.name}</h3>
                <p className="text-xs text-forest-800/50 line-clamp-2">{type.description.split('.')[0]}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function getFuneralTypeIcon(slug: string): JSX.Element {
  const icons: Record<string, JSX.Element> = {
    'funeral-best-sellers': (
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </div>
    ),
    'funeral-arrangements': (
      <div className="w-14 h-14 rounded-2xl bg-sage-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25v14.25" />
        </svg>
      </div>
    ),
    'funeral-baskets': (
      <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
    ),
    'funeral-sprays': (
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    ),
    'funeral-plants': (
      <div className="w-14 h-14 rounded-2xl bg-sage-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      </div>
    ),
    'funeral-floor-pieces': (
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
    ),
    'funeral-wreaths': (
      <div className="w-14 h-14 rounded-2xl bg-forest-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
    'funeral-hearts': (
      <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
    ),
    'funeral-crosses': (
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 4v16m-6-6h12" />
        </svg>
      </div>
    ),
    'funeral-casket': (
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      </div>
    ),
    'funeral-urn': (
      <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
    ),
  };
  return icons[slug] || icons['funeral-arrangements'];
}

function getSmallFuneralTypeIcon(slug: string): JSX.Element {
  const icons: Record<string, JSX.Element> = {
    'funeral-best-sellers': (
      <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    'funeral-arrangements': (
      <svg className="w-5 h-5 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25v14.25" />
      </svg>
    ),
    'funeral-baskets': (
      <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    'funeral-sprays': (
      <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
      </svg>
    ),
    'funeral-plants': (
      <svg className="w-5 h-5 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9" />
      </svg>
    ),
    'funeral-floor-pieces': (
      <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" />
      </svg>
    ),
    'funeral-wreaths': (
      <svg className="w-5 h-5 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'funeral-hearts': (
      <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    'funeral-crosses': (
      <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 4v16m-6-6h12" />
      </svg>
    ),
    'funeral-casket': (
      <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
      </svg>
    ),
    'funeral-urn': (
      <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" />
      </svg>
    ),
  };
  return icons[slug] || icons['funeral-arrangements'];
}

function getFuneralTypeIntro(slug: string, cityName: string): string {
  const intros: Record<string, string> = {
    'funeral-best-sellers': `Our most popular funeral and sympathy flower arrangements in ${cityName}. These tasteful tributes are appropriate for funerals, memorial services, and expressing condolences.`,
    'funeral-arrangements': `Traditional funeral flower arrangements delivered to funeral homes and memorial services in ${cityName}. Appropriate, elegant tributes to honor loved ones.`,
    'funeral-baskets': `Sympathy flower baskets for funerals and memorials in ${cityName}. Perfect for the service or sending to the family's home as a lasting tribute.`,
    'funeral-sprays': `Standing funeral sprays and impressive large arrangements for services in ${cityName}. These substantial tributes make a meaningful statement of sympathy.`,
    'funeral-plants': `Long-lasting sympathy plants delivered in ${cityName}. Peace lilies, orchids, and green plants serve as enduring memorials that the family can cherish.`,
    'funeral-floor-pieces': `Large floor-standing funeral arrangements for prominent display at services in ${cityName}. Impressive tributes that honor the memory of your loved one.`,
    'funeral-wreaths': `Traditional circular funeral wreaths symbolizing eternal life in ${cityName}. These timeless arrangements represent the cycle of life and lasting memory.`,
    'funeral-hearts': `Heart-shaped funeral arrangements expressing deep love and affection in ${cityName}. A meaningful tribute from close family members and loved ones.`,
    'funeral-crosses': `Cross-shaped funeral arrangements for Christian services in ${cityName}. Traditional religious tributes that provide comfort and express faith.`,
    'funeral-casket': `Elegant casket spray arrangements designed to grace the casket during services in ${cityName}. A beautiful final tribute to your loved one.`,
    'funeral-urn': `Flower arrangements designed for cremation urns and memorial services in ${cityName}. Appropriate displays for celebrations of life and memorial gatherings.`,
  };
  return intros[slug] || '';
}

function getFuneralTypeContent(
  slug: string,
  cityConfig: { cityName: string; funeralHomes: string[] }
): React.ReactNode {
  switch (slug) {
    case 'funeral-best-sellers':
      return (
        <>
          <p>
            Our funeral best sellers represent the most trusted and appreciated sympathy
            arrangements. These designs have brought comfort to countless families in
            {cityConfig.cityName} during difficult times.
          </p>
          <p>
            We deliver to all funeral homes in {cityConfig.cityName}, including{' '}
            {cityConfig.funeralHomes.slice(0, 3).join(', ')}. Each arrangement is
            crafted with care and delivered with the utmost respect for the occasion.
          </p>
        </>
      );
    case 'funeral-arrangements':
      return (
        <>
          <p>
            Our traditional funeral arrangements provide appropriate and elegant tributes
            for any memorial service. Each design is thoughtfully created to convey
            sympathy and respect.
          </p>
          <p>
            Delivery is available to all {cityConfig.cityName} funeral homes and churches.
            We coordinate timing with the service to ensure your tribute arrives appropriately.
          </p>
        </>
      );
    case 'funeral-sprays':
      return (
        <>
          <p>
            Standing funeral sprays create impressive displays at memorial services.
            These substantial arrangements are typically placed near the casket or
            at the front of the service area.
          </p>
          <p>
            Our sprays range from elegant single-sided designs to elaborate easel
            arrangements. Each is crafted by experienced florists who understand
            the importance of funeral tributes.
          </p>
        </>
      );
    case 'funeral-plants':
      return (
        <>
          <p>
            Sympathy plants offer a lasting memorial that families can keep for years.
            Peace lilies are especially popular for their symbolic meaning and easy care.
          </p>
          <p>
            Plants are appropriate for both funeral services and the family home. They
            provide ongoing comfort as a living reminder of your thoughtfulness during
            this difficult time.
          </p>
        </>
      );
    case 'funeral-wreaths':
      return (
        <>
          <p>
            Funeral wreaths are circular arrangements that symbolize eternal life and
            the unending cycle of love. This traditional form has been used in memorial
            services for centuries.
          </p>
          <p>
            Our wreaths are crafted on sturdy easels for prominent display. They make
            meaningful tributes from family, friends, and organizations in {cityConfig.cityName}.
          </p>
        </>
      );
    case 'funeral-hearts':
      return (
        <>
          <p>
            Heart-shaped funeral arrangements express deep love and affection. These
            meaningful tributes are often chosen by immediate family members, spouses,
            or children to honor their loved one.
          </p>
          <p>
            Each heart is carefully crafted to create a touching display. Available in
            various sizes and color schemes to suit your preferences and budget.
          </p>
        </>
      );
    case 'funeral-crosses':
      return (
        <>
          <p>
            Cross arrangements provide beautiful religious tributes for Christian funeral
            services. These traditional designs offer comfort and express faith during
            times of loss.
          </p>
          <p>
            Our crosses are available in various sizes and can be customized with specific
            flowers or colors. We deliver to churches and funeral homes throughout {cityConfig.cityName}.
          </p>
        </>
      );
    case 'funeral-casket':
      return (
        <>
          <p>
            Casket sprays are designed to be placed atop the casket during the funeral service.
            These prominent arrangements are typically chosen by immediate family members as
            a final tribute.
          </p>
          <p>
            We offer half-couch sprays (for open casket) and full-couch sprays (for closed
            casket). Our experienced designers ensure each spray is perfectly proportioned
            and elegantly crafted.
          </p>
        </>
      );
    default:
      return (
        <p>
          Our sympathy arrangements are designed to express condolences and provide
          comfort during difficult times. We deliver to all funeral homes and memorial
          services in {cityConfig.cityName} with care and respect.
        </p>
      );
  }
}
