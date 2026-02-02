import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityConfig, getCityPath, getAllCities } from '@/data/cities';
import { FUNERAL_TYPES } from '@/data/categories';
import DynamicProductGrid from '@/components/DynamicProductGrid';

interface FuneralHomePageProps {
  params: {
    state: string;
    city: string;
    'funeral-home': string;
  };
}

// Helper to create URL-safe slug from funeral home name
function funeralHomeToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper to get funeral home name from slug
function getFuneralHomeFromSlug(slug: string, funeralHomes: string[]): string | undefined {
  return funeralHomes.find(f => funeralHomeToSlug(f) === slug);
}

// Generate static params for all funeral home pages
export function generateStaticParams() {
  const cities = getAllCities();
  const params: { state: string; city: string; 'funeral-home': string }[] = [];

  for (const city of cities) {
    for (const funeralHome of city.funeralHomes) {
      params.push({
        state: city.stateSlug,
        city: city.citySlug,
        'funeral-home': funeralHomeToSlug(funeralHome),
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: FuneralHomePageProps): Promise<Metadata> {
  const cityConfig = getCityConfig(params.state, params.city);
  if (!cityConfig) return {};

  const funeralHomeName = getFuneralHomeFromSlug(params['funeral-home'], cityConfig.funeralHomes);
  if (!funeralHomeName) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com';
  const basePath = getCityPath(cityConfig);
  const canonicalUrl = `${siteUrl}${basePath}/funeral-home/${params['funeral-home']}/`;

  const title = `Funeral Flowers for ${funeralHomeName} | ${cityConfig.cityName}`;
  const description = `Send sympathy flowers to ${funeralHomeName} in ${cityConfig.cityName}. Funeral sprays, standing arrangements, casket flowers & wreaths. Same-day delivery to the funeral home.`;

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

export default function FuneralHomePage({ params }: FuneralHomePageProps) {
  const cityConfig = getCityConfig(params.state, params.city);

  if (!cityConfig) {
    notFound();
  }

  const funeralHomeName = getFuneralHomeFromSlug(params['funeral-home'], cityConfig.funeralHomes);

  if (!funeralHomeName) {
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
        name: 'Funeral Flowers',
        item: `${siteUrl}${basePath}/flowers/sympathy`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: funeralHomeName,
        item: `${siteUrl}${basePath}/funeral-home/${params['funeral-home']}`,
      },
    ],
  };

  // Service Schema for funeral home delivery
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Funeral Flower Delivery to ${funeralHomeName}`,
    description: `Same-day funeral flower delivery service to ${funeralHomeName} in ${cityConfig.cityName}. Sympathy arrangements, standing sprays, and casket flowers.`,
    provider: {
      '@type': 'Florist',
      name: 'Golden State Flower Shop',
      url: siteUrl,
    },
    areaServed: {
      '@type': 'Place',
      name: funeralHomeName,
      address: {
        '@type': 'PostalAddress',
        addressLocality: cityConfig.cityName,
        addressRegion: cityConfig.stateAbbr,
      },
    },
    serviceType: 'Funeral Flower Delivery',
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
            <li>
              <Link href={`${basePath}/flowers/sympathy/`} className="hover:text-forest-900 transition-colors">
                Sympathy
              </Link>
            </li>
            <li>/</li>
            <li className="text-forest-900 font-medium">{funeralHomeName}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 via-cream-50 to-white py-12 lg:py-16">
        <div className="container-wide">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-forest-900">
              Funeral Flowers for {funeralHomeName}
            </h1>
          </div>
          <p className="text-lg text-forest-800/60 max-w-2xl">
            Express your condolences with beautiful sympathy arrangements delivered directly to {funeralHomeName}.
            We coordinate delivery timing with the funeral home to ensure your tribute arrives for the service.
          </p>
        </div>
      </section>

      {/* Funeral Home Delivery Info */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="container-wide py-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-soft">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-forest-900">Timed Delivery</h3>
                <p className="text-sm text-forest-800/60">We coordinate with the funeral home schedule</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-soft">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-forest-900">Delivery Confirmation</h3>
                <p className="text-sm text-forest-800/60">We confirm delivery with you and the family</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-soft">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-forest-900">Personalized Card</h3>
                <p className="text-sm text-forest-800/60">Your condolence message included</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sympathy Products */}
      <section className="py-12 lg:py-16">
        <div className="container-wide">
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6">
            Sympathy Arrangements for {funeralHomeName}
          </h2>
          <DynamicProductGrid
            basePath={basePath}
            occasion="sympathy"
            count={12}
            showFilters={true}
          />
        </div>
      </section>

      {/* Funeral Flower Categories */}
      <section className="py-12 lg:py-16 bg-cream-50">
        <div className="container-wide">
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6">
            Shop by Arrangement Type
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {FUNERAL_TYPES.slice(0, 8).map((type) => (
              <Link
                key={type.slug}
                href={`${basePath}/funeral/${type.slug}/`}
                className="group p-5 rounded-xl bg-white border border-cream-200 hover:border-slate-300 hover:shadow-soft transition-all"
              >
                <h3 className="font-medium text-forest-900 group-hover:text-slate-700 transition-colors mb-1">
                  {type.name}
                </h3>
                <p className="text-sm text-forest-800/50">
                  {type.priceRange ? `From $${type.priceRange.low}` : 'View options'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ordering Guide */}
      <section className="py-12 lg:py-16">
        <div className="container-narrow">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-forest-900 mb-6">
            Ordering Funeral Flowers for {funeralHomeName}
          </h2>
          <div className="prose prose-forest max-w-none text-forest-800/70 space-y-4">
            <p>
              When ordering sympathy flowers for a service at {funeralHomeName}, we make the process
              as simple as possible during this difficult time.
            </p>

            <h3 className="text-lg font-semibold text-forest-900 mt-6">What We Need From You</h3>
            <ul className="space-y-2">
              <li>
                <strong>Name of the deceased</strong> - This ensures your arrangement is displayed at the correct service.
              </li>
              <li>
                <strong>Date and time of the service</strong> - We&apos;ll coordinate delivery to arrive before the viewing or funeral.
              </li>
              <li>
                <strong>Your relationship to the family</strong> - This helps us suggest appropriate arrangements.
              </li>
              <li>
                <strong>Your card message</strong> - We include a printed card with your personal condolences.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-forest-900 mt-6">Delivery to {funeralHomeName}</h3>
            <p>
              We deliver directly to {funeralHomeName} and coordinate with their staff to ensure
              your arrangement is received and displayed properly. For standing sprays and large
              pieces, we position them according to the funeral home&apos;s guidance.
            </p>

            <h3 className="text-lg font-semibold text-forest-900 mt-6">When to Order</h3>
            <p>
              For same-day delivery to {funeralHomeName}, please order by {cityConfig.deliveryInfo.sameDay.cutoffTime}.
              We recommend ordering at least one day before the service when possible, especially for
              large standing arrangements or custom pieces.
            </p>
          </div>
        </div>
      </section>

      {/* Other Funeral Homes */}
      <section className="py-12 lg:py-16 bg-white border-t border-cream-200">
        <div className="container-wide">
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6">
            Other {cityConfig.cityName} Funeral Homes We Serve
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cityConfig.funeralHomes
              .filter(f => f !== funeralHomeName)
              .map((funeralHome) => (
                <Link
                  key={funeralHome}
                  href={`${basePath}/funeral-home/${funeralHomeToSlug(funeralHome)}/`}
                  className="p-5 rounded-xl bg-cream-50 border border-cream-200 hover:border-slate-200 hover:shadow-soft transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center group-hover:bg-slate-50 transition-colors">
                      <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <span className="font-medium text-forest-900 group-hover:text-slate-700 transition-colors">
                      {funeralHome}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 lg:py-16 bg-cream-50">
        <div className="container-narrow">
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="bg-white rounded-xl border border-cream-200 overflow-hidden group">
              <summary className="p-5 font-medium text-forest-900 cursor-pointer list-none flex justify-between items-center">
                <span>What type of arrangement is appropriate?</span>
                <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-forest-800/70">
                <strong>Standing sprays</strong> are traditional for funeral services and are displayed near the casket.
                <strong>Baskets and arrangements</strong> are versatile and can be sent to the funeral home or the family&apos;s home.
                <strong>Casket sprays</strong> are typically ordered by immediate family. When in doubt, a medium-sized
                sympathy arrangement is always appropriate.
              </div>
            </details>
            <details className="bg-white rounded-xl border border-cream-200 overflow-hidden group">
              <summary className="p-5 font-medium text-forest-900 cursor-pointer list-none flex justify-between items-center">
                <span>Can I send flowers if I can&apos;t attend the service?</span>
                <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-forest-800/70">
                Absolutely. Sending flowers to {funeralHomeName} is a thoughtful way to express condolences
                even when you cannot attend in person. Your card message will let the family know you&apos;re
                thinking of them during this difficult time.
              </div>
            </details>
            <details className="bg-white rounded-xl border border-cream-200 overflow-hidden group">
              <summary className="p-5 font-medium text-forest-900 cursor-pointer list-none flex justify-between items-center">
                <span>What if the obituary says &quot;in lieu of flowers&quot;?</span>
                <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-forest-800/70">
                Respect the family&apos;s wishes by making a donation to the suggested charity or cause.
                However, if you&apos;d still like to send something, consider a small plant or arrangement
                to the family&apos;s home after the service, or a sympathy gift basket.
              </div>
            </details>
            <details className="bg-white rounded-xl border border-cream-200 overflow-hidden group">
              <summary className="p-5 font-medium text-forest-900 cursor-pointer list-none flex justify-between items-center">
                <span>What happens to the flowers after the service?</span>
                <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-forest-800/70">
                Typically, the family takes arrangements home after the service, donates them to
                nursing homes or hospitals, or has them taken to the gravesite. {funeralHomeName} can
                advise the family on options. Your card will stay with the arrangement so the
                family knows who sent it.
              </div>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
