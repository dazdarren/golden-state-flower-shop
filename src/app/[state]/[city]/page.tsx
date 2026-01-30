import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityConfig, getCityPath, getAllCityPaths } from '@/data/cities';
import { OCCASIONS as OCCASIONS_OLD, OccasionSlug } from '@/types/city';
import { OCCASIONS, PRODUCT_TYPES, SEASONAL, getActiveSeasonalCollections } from '@/data/categories';
import { getFeaturedGuides } from '@/data/guides';
import DynamicProductGrid from '@/components/DynamicProductGrid';
import ValuePropStrip from '@/components/ValuePropStrip';
import NewsletterSignup from '@/components/NewsletterSignup';
import FeaturedProducts from '@/components/FeaturedProducts';
import GuideCard from '@/components/GuideCard';

interface CityPageProps {
  params: {
    state: string;
    city: string;
  };
}

export function generateStaticParams() {
  return getAllCityPaths();
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const cityConfig = getCityConfig(params.state, params.city);
  if (!cityConfig) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com';
  const canonicalUrl = `${siteUrl}${getCityPath(cityConfig)}/`;
  const ogImageUrl = `${siteUrl}/images/og-default.svg`;

  const title = `Flower Delivery in ${cityConfig.cityName}, ${cityConfig.stateAbbr} | Same Day Delivery`;
  const description = `Order fresh flowers for delivery in ${cityConfig.cityName}. Same-day delivery available to ${cityConfig.neighborhoods.slice(0, 3).join(', ')}, and more. Birthday, sympathy, anniversary arrangements.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Flower Delivery in ${cityConfig.cityName}, ${cityConfig.stateAbbr}`,
      description: `Same-day flower delivery throughout ${cityConfig.cityName}. Fresh arrangements for every occasion.`,
      url: canonicalUrl,
      siteName: 'Golden State Flower Shop',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Beautiful flower arrangements for delivery in ${cityConfig.cityName}`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cityConfig.cityName} Flower Delivery | Golden State Flower Shop`,
      description: `Same-day flower delivery in ${cityConfig.cityName}. Fresh, hand-arranged bouquets for every occasion.`,
      images: [ogImageUrl],
    },
  };
}

export default function CityHomePage({ params }: CityPageProps) {
  const cityConfig = getCityConfig(params.state, params.city);

  if (!cityConfig) {
    notFound();
  }

  const basePath = getCityPath(cityConfig);
  const occasionList = Object.values(OCCASIONS_OLD);
  const activeSeasonalCollections = getActiveSeasonalCollections();

  return (
    <>
      {/* JSON-LD Structured Data - LocalBusiness/Florist */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Florist',
            '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com'}${basePath}/#florist`,
            name: `Golden State Flower Shop - ${cityConfig.cityName}`,
            alternateName: `${cityConfig.cityName} Flower Delivery`,
            description: `Premium same-day flower delivery in ${cityConfig.cityName}, ${cityConfig.stateName}. Fresh, hand-arranged bouquets delivered to your door.`,
            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com'}${basePath}/`,
            telephone: '(510) 485-9113',
            email: 'support@goldenstateflowershop.com',
            logo: {
              '@type': 'ImageObject',
              url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com'}/images/logo.png`,
            },
            image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com'}/images/hero-flowers.jpg`,
            address: {
              '@type': 'PostalAddress',
              addressLocality: cityConfig.cityName,
              addressRegion: cityConfig.stateAbbr,
              addressCountry: 'US',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: cityConfig.coordinates.lat.toString(),
              longitude: cityConfig.coordinates.lng.toString(),
            },
            areaServed: [
              {
                '@type': 'City',
                name: cityConfig.cityName,
                containedInPlace: {
                  '@type': 'State',
                  name: cityConfig.stateName,
                },
              },
              ...cityConfig.neighborhoods.slice(0, 5).map(n => ({
                '@type': 'Place',
                name: n,
              })),
            ],
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              reviewCount: '247',
              bestRating: '5',
              worstRating: '1',
            },
            priceRange: '$$-$$$',
            currenciesAccepted: 'USD',
            paymentAccepted: 'Cash, Credit Card',
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '08:00',
                closes: '18:00',
              },
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Saturday',
                opens: '09:00',
                closes: '17:00',
              },
            ],
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Flower Arrangements',
              itemListElement: occasionList.map((occasion) => ({
                '@type': 'OfferCatalog',
                name: occasion.title,
                url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com'}${basePath}/flowers/${occasion.slug}`,
              })),
            },
            potentialAction: {
              '@type': 'OrderAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com'}${basePath}/flowers/birthday`,
                actionPlatform: [
                  'http://schema.org/DesktopWebPlatform',
                  'http://schema.org/MobileWebPlatform',
                ],
              },
              deliveryMethod: ['http://purl.org/goodrelations/v1#DeliveryModeOwnFleet'],
            },
            sameAs: [
              'https://www.facebook.com/goldenstateflowershop',
              'https://www.instagram.com/goldenstateflowershop',
            ],
          }),
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-cream-50 to-sage-50" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAxOGMtMy4zMTQgMC02LTIuNjg2LTYtNnMyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNnoiIGZpbGw9IiM4Yjk5NmYiIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvZz48L3N2Zz4=')] opacity-60" />

        {/* Decorative botanical elements */}
        <div className="absolute top-20 right-10 w-72 h-72 opacity-[0.07] hidden lg:block">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-sage-600">
            <path d="M100 20c0 40-30 60-30 90s15 40 30 40 30-10 30-40-30-50-30-90z" fill="currentColor"/>
            <path d="M70 80c20-10 40 0 60 20M130 80c-20-10-40 0-60 20" stroke="currentColor" strokeWidth="3"/>
          </svg>
        </div>
        <div className="absolute bottom-32 left-10 w-48 h-48 opacity-[0.05] rotate-45 hidden lg:block">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-rose-400">
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2"/>
            <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="2"/>
            <circle cx="100" cy="100" r="20" fill="currentColor"/>
          </svg>
        </div>

        <div className="container-wide relative z-10 py-12 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left content - Hero Image */}
            <div className="order-2 lg:order-1 relative">
              <div className="relative aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden shadow-soft-lg">
                {/* Placeholder hero image - replace with actual image */}
                <div className="absolute inset-0 bg-gradient-to-br from-sage-200 via-cream-200 to-rose-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-32 h-32 text-sage-400" viewBox="0 0 80 80" fill="none">
                      <path d="M40 15c0 12-8 20-8 28s4 12 8 12 8-4 8-12-8-16-8-28z" fill="currentColor" opacity="0.3" />
                      <path d="M40 20c-6 8-12 14-12 20s4 10 12 10 12-4 12-10-6-12-12-20z" stroke="currentColor" strokeWidth="2" fill="none" />
                      <path d="M28 36c4-2 8 0 12 4M52 36c-4-2-8 0-12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M40 50v15M35 60l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                {/* Same-day badge on image */}
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-sage-600 text-white text-xs font-semibold rounded-full shadow-sm">
                  Same-Day Delivery
                </div>
              </div>
            </div>

            {/* Right content - CTA Area */}
            <div className="order-1 lg:order-2 max-w-xl lg:max-w-none">
              {/* Tagline */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-gradient-to-r from-sage-100 to-cream-100
                            text-sage-700 text-sm font-medium mb-6 backdrop-blur-sm
                            border border-sage-200/50">
                <svg className="w-4 h-4 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Same-Day Delivery to {cityConfig.cityName}
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold
                           text-forest-900 leading-[1.1] tracking-tight mb-4">
                Fresh, Hand-Arranged
                <span className="block text-sage-600">Bouquets</span>
              </h1>

              {/* Starting price */}
              <p className="text-lg sm:text-xl text-forest-800/70 leading-relaxed mb-6">
                Starting at <span className="font-semibold text-forest-900">$49</span> with free delivery on orders over $75
              </p>

              {/* Star Rating - Social Proof */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="font-semibold text-forest-900">4.8</span>
                <span className="text-forest-800/60">(247 reviews)</span>
              </div>

              {/* Primary CTAs */}
              <div className="flex flex-wrap gap-3 mb-8">
                <Link href={`${basePath}/flowers/birthday`} className="btn-primary">
                  <span>Shop Birthday</span>
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href={`${basePath}/flowers/sympathy`} className="btn-secondary">
                  Sympathy Flowers
                </Link>
                <Link
                  href={`${basePath}/flowers/love-romance`}
                  className="px-5 py-2.5 rounded-full border border-rose-300 text-rose-600 font-medium
                           hover:bg-rose-50 transition-colors"
                >
                  Romance
                </Link>
              </div>

              {/* Inline Trust Badges */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-6 border-t border-cream-300/50">
                <div className="flex items-center gap-2 text-sm text-forest-800">
                  <svg className="w-5 h-5 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Order by 2pm for today</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-forest-800">
                  <svg className="w-5 h-5 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>100% Satisfaction</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-forest-800">
                  <svg className="w-5 h-5 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Local florist network</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
            <path
              d="M0 120V60c240-40 480-60 720-60s480 20 720 60v60H0z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Value Proposition Strip */}
      <ValuePropStrip cutoffTime={cityConfig.deliveryInfo.sameDay.cutoffTime} />

      {/* Occasion Categories */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-sage-600 text-sm font-medium uppercase tracking-widest">
              Shop by Occasion
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-forest-900 mt-4 mb-5">
              For Every Moment
            </h2>
            <p className="text-forest-800/60 text-lg">
              Find the perfect arrangement to express exactly what you feel.
              Same-day delivery throughout {cityConfig.cityName}.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {OCCASIONS.slice(0, 10).map((occasion, index) => (
              <Link
                key={occasion.slug}
                href={`${basePath}/flowers/${occasion.slug}`}
                className="group relative bg-cream-50 rounded-2xl p-6 lg:p-8 text-center
                         border border-cream-200 hover:border-sage-300
                         hover:shadow-soft-lg transition-all duration-500
                         opacity-0 animate-fade-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white
                              flex items-center justify-center shadow-soft
                              group-hover:scale-110 group-hover:shadow-soft-lg
                              transition-all duration-300">
                  {getOccasionIcon(occasion.slug as OccasionSlug)}
                </div>

                <h3 className="font-display text-lg font-medium text-forest-900 mb-1">
                  {occasion.name}
                </h3>
                <p className="text-sm text-forest-800/50 hidden sm:block">
                  {getOccasionSubtitle(occasion.slug as OccasionSlug)}
                </p>

                {/* Hover arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100
                              translate-x-2 group-hover:translate-x-0
                              transition-all duration-300">
                  <svg className="w-5 h-5 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Type */}
      <section className="py-20 lg:py-28 bg-sage-50">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-sage-700 text-sm font-medium uppercase tracking-widest">
              Browse by Type
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-forest-900 mt-4 mb-5">
              Find Your Perfect Bloom
            </h2>
            <p className="text-forest-800/60 text-lg">
              From classic roses to long-lasting plants, discover arrangements by flower type.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCT_TYPES.map((type, index) => (
              <Link
                key={type.slug}
                href={`${basePath}/shop/${type.slug}`}
                className="group relative bg-white rounded-3xl p-8 text-center
                         border border-cream-200 hover:border-sage-400
                         hover:shadow-soft-lg transition-all duration-500
                         opacity-0 animate-fade-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center
                              group-hover:scale-110 transition-all duration-300 ${getTypeIconBg(type.slug)}`}>
                  {getProductTypeIcon(type.slug)}
                </div>

                <h3 className="font-display text-xl font-semibold text-forest-900 mb-2">
                  {type.name}
                </h3>
                <p className="text-sm text-forest-800/60 line-clamp-2">
                  {type.description.split('.')[0]}
                </p>

                <div className="mt-6 inline-flex items-center gap-2 text-sage-600 font-medium text-sm
                              group-hover:text-sage-700 transition-colors">
                  <span>Shop Now</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Collections */}
      {activeSeasonalCollections.length > 0 && (
        <section className="py-20 lg:py-28 bg-gradient-to-br from-rose-50 to-cream-50">
          <div className="container-wide">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-rose-600 text-sm font-medium uppercase tracking-widest">
                Limited Time
              </span>
              <h2 className="font-display text-4xl lg:text-5xl font-semibold text-forest-900 mt-4 mb-5">
                Seasonal Collections
              </h2>
              <p className="text-forest-800/60 text-lg">
                Special arrangements for the season, available for delivery in {cityConfig.cityName}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SEASONAL.map((season, index) => {
                const isActive = season.activeMonths.includes(new Date().getMonth() + 1);
                return (
                  <Link
                    key={season.slug}
                    href={`${basePath}/seasonal/${season.slug}`}
                    className={`group relative rounded-3xl overflow-hidden
                              transition-all duration-500 opacity-0 animate-fade-up
                              ${isActive ? 'ring-2 ring-rose-300' : ''}`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'forwards',
                    }}
                  >
                    <div className={`p-8 h-full ${getSeasonalBg(season.slug)}`}>
                      {isActive && (
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-semibold">
                          NOW
                        </div>
                      )}

                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6
                                    ${getSeasonalIconBg(season.slug)}`}>
                        {getSeasonalIcon(season.slug)}
                      </div>

                      <h3 className="font-display text-xl font-semibold text-forest-900 mb-2">
                        {season.name}
                      </h3>
                      <p className="text-sm text-forest-800/60 mb-4">
                        {season.timing}
                      </p>

                      <div className="inline-flex items-center gap-2 text-forest-700 font-medium text-sm
                                    group-hover:text-forest-900 transition-colors">
                        <span>Explore</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-20 lg:py-28 bg-cream-50">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <span className="text-sage-600 text-sm font-medium uppercase tracking-widest">
                Curated Selection
              </span>
              <h2 className="font-display text-4xl lg:text-5xl font-semibold text-forest-900 mt-4">
                Popular in {cityConfig.cityName}
              </h2>
              <p className="text-forest-800/60 mt-3 max-w-lg">
                Our most-loved arrangements, handcrafted by local artisan florists.
              </p>
            </div>
            <Link
              href={`${basePath}/flowers/birthday`}
              className="group flex items-center gap-2 text-sage-700 font-medium
                       hover:text-sage-800 transition-colors"
            >
              <span>View all arrangements</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <DynamicProductGrid basePath={basePath} occasion="best-sellers" count={8} />

          <div className="text-center mt-12 md:hidden">
            <Link href={`${basePath}/flowers/birthday`} className="btn-primary">
              View All Arrangements
            </Link>
          </div>
        </div>
      </section>

      {/* Editor's Picks - Premium Collection */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-forest-900 to-forest-800 text-cream-100 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500" />
        <div className="absolute top-10 right-10 w-64 h-64 opacity-5">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1"/>
            <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="1"/>
          </svg>
        </div>

        <div className="container-wide relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                            bg-gold-500/20 text-gold-400 text-sm font-medium mb-4
                            border border-gold-500/30">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Editor's Picks
              </div>
              <h2 className="font-display text-4xl lg:text-5xl font-semibold text-cream-100">
                Premium Collection
              </h2>
              <p className="text-cream-200/70 mt-3 max-w-lg">
                Our most exquisite arrangements, hand-selected for their exceptional beauty and craftsmanship.
              </p>
            </div>
            <Link
              href={`${basePath}/flowers/anniversary`}
              className="group flex items-center gap-2 text-gold-400 font-medium
                       hover:text-gold-300 transition-colors"
            >
              <span>View luxury collection</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <DynamicProductGrid basePath={basePath} occasion="anniversary" count={4} />

          {/* Premium guarantee */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 pt-10 border-t border-forest-700">
            <div className="flex items-center gap-3 text-cream-200/80">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium">100% Satisfaction Guaranteed</span>
            </div>
            <div className="flex items-center gap-3 text-cream-200/80">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <span className="text-sm font-medium">Complimentary Gift Packaging</span>
            </div>
            <div className="flex items-center gap-3 text-cream-200/80">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Personalized Card Included</span>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Features */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-sage-600 text-sm font-medium uppercase tracking-widest">
              Why Choose Us
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-forest-900 mt-4">
              The {cityConfig.cityName} Difference
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Same-Day Delivery',
                description: cityConfig.deliveryInfo.sameDay.description,
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Freshness Guaranteed',
                description: cityConfig.deliveryInfo.substitutionPolicy,
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ),
                title: 'Hospital Delivery',
                description: `We deliver to ${cityConfig.hospitals.slice(0, 2).join(', ')} and other ${cityConfig.cityName} hospitals.`,
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group bg-cream-50 rounded-3xl p-8 lg:p-10 border border-cream-200
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

          <div className="text-center mt-12">
            <Link
              href={`${basePath}/delivery`}
              className="inline-flex items-center gap-2 text-sage-700 font-medium
                       hover:text-sage-800 transition-colors"
            >
              <span>Learn more about delivery</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="py-20 lg:py-28 bg-forest-900 text-cream-100 overflow-hidden">
        <div className="container-wide relative">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-96 h-96 opacity-5">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
              <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1"/>
              <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1"/>
              <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>

          <div className="text-center max-w-2xl mx-auto mb-14 relative z-10">
            <span className="text-sage-400 text-sm font-medium uppercase tracking-widest">
              Delivery Areas
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-cream-100 mt-4 mb-5">
              Throughout {cityConfig.cityName}
            </h2>
            <p className="text-cream-200/70 text-lg">
              We proudly deliver fresh flowers to all {cityConfig.cityName} neighborhoods
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 relative z-10">
            {cityConfig.neighborhoods.map((neighborhood, index) => (
              <span
                key={neighborhood}
                className="px-5 py-2.5 rounded-full text-sm font-medium
                         bg-forest-800/50 text-cream-200 border border-forest-700
                         hover:bg-sage-600 hover:border-sage-500 hover:text-white
                         transition-all duration-300 cursor-default
                         opacity-0 animate-fade-up"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                {neighborhood}
              </span>
            ))}
          </div>

          <div className="text-center mt-10 relative z-10">
            <p className="text-sm text-cream-200/50">
              Serving ZIP codes: {cityConfig.primaryZipCodes.slice(0, 6).join(', ')}...
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-28 bg-cream-50">
        <div className="container-narrow">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-sage-600 text-sm font-medium uppercase tracking-widest">
              Common Questions
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-forest-900 mt-4">
              Frequently Asked
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                question: 'What is the cutoff time for same-day delivery?',
                answer: `Order by ${cityConfig.deliveryInfo.sameDay.cutoffTime} for same-day delivery to ${cityConfig.cityName} addresses. Orders placed after the cutoff will be delivered the next business day.`,
              },
              {
                question: 'Do you deliver to hospitals?',
                answer: `Yes! We deliver to all major ${cityConfig.cityName} hospitals including ${cityConfig.hospitals.slice(0, 3).join(', ')}, and more. Please include the patient's room number if available.`,
              },
              {
                question: 'What if a flower is out of stock?',
                answer: cityConfig.deliveryInfo.substitutionPolicy,
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="group bg-white rounded-2xl border border-cream-200 overflow-hidden
                         hover:border-sage-200 hover:shadow-soft transition-all duration-300"
              >
                <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                  <span className="font-display text-lg font-medium text-forest-900 pr-8">
                    {faq.question}
                  </span>
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cream-100
                                 flex items-center justify-center text-sage-600
                                 group-open:bg-sage-500 group-open:text-white
                                 transition-colors duration-300">
                    <svg className="w-4 h-4 group-open:rotate-180 transition-transform duration-300"
                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-forest-800/70 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href={`${basePath}/faq`}
              className="inline-flex items-center gap-2 text-sage-700 font-medium
                       hover:text-sage-800 transition-colors"
            >
              <span>View all FAQs</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <span className="text-sage-600 text-sm font-medium uppercase tracking-widest">
                Expert Advice
              </span>
              <h2 className="font-display text-3xl lg:text-4xl font-semibold text-forest-900 mt-4">
                Flower Guides & Tips
              </h2>
              <p className="text-forest-800/60 mt-3 max-w-lg">
                Expert advice on flower care, etiquette, and choosing the perfect arrangement.
              </p>
            </div>
            <Link
              href={`${basePath}/guides`}
              className="group flex items-center gap-2 text-sage-700 font-medium
                       hover:text-sage-800 transition-colors"
            >
              <span>View all guides</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {getFeaturedGuides(3).map((guide) => (
              <GuideCard key={guide.slug} guide={guide} basePath={basePath} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 lg:py-28 bg-cream-50">
        <div className="container-narrow">
          <NewsletterSignup variant="card" source="homepage" />
        </div>
      </section>
    </>
  );
}

function getOccasionIcon(occasion: OccasionSlug): JSX.Element {
  const icons: Record<string, JSX.Element> = {
    birthday: (
      <svg className="w-8 h-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
      </svg>
    ),
    sympathy: (
      <svg className="w-8 h-8 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    anniversary: (
      <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    'get-well': (
      <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    'thank-you': (
      <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    'love-romance': (
      <svg className="w-8 h-8 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    'new-baby': (
      <svg className="w-8 h-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'just-because': (
      <svg className="w-8 h-8 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    congratulations: (
      <svg className="w-8 h-8 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  };
  return icons[occasion] || icons.birthday;
}

function getOccasionSubtitle(occasion: OccasionSlug): string {
  const subtitles: Record<string, string> = {
    birthday: 'Celebrate life',
    sympathy: 'Express condolences',
    anniversary: 'Mark milestones',
    'get-well': 'Brighten their day',
    'thank-you': 'Show gratitude',
    'love-romance': 'Express your love',
    'new-baby': 'Welcome new life',
    'just-because': 'No reason needed',
    congratulations: 'Celebrate success',
  };
  return subtitles[occasion] || '';
}

function getProductTypeIcon(slug: string): JSX.Element {
  const icons: Record<string, JSX.Element> = {
    plants: (
      <svg className="w-10 h-10 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    'rose-bouquets': (
      <svg className="w-10 h-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    'mixed-arrangements': (
      <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    'premium-collection': (
      <svg className="w-10 h-10 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  };
  return icons[slug] || icons.plants;
}

function getTypeIconBg(slug: string): string {
  const bgs: Record<string, string> = {
    plants: 'bg-sage-100',
    'rose-bouquets': 'bg-rose-100',
    'mixed-arrangements': 'bg-amber-100',
    'premium-collection': 'bg-gold-100',
  };
  return bgs[slug] || 'bg-cream-100';
}

function getSeasonalIcon(slug: string): JSX.Element {
  const icons: Record<string, JSX.Element> = {
    'valentines-day': (
      <svg className="w-7 h-7 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    'mothers-day': (
      <svg className="w-7 h-7 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    christmas: (
      <svg className="w-7 h-7 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 3l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" />
      </svg>
    ),
    'seasonal-specials': (
      <svg className="w-7 h-7 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  };
  return icons[slug] || icons['seasonal-specials'];
}

function getSeasonalBg(slug: string): string {
  const bgs: Record<string, string> = {
    'valentines-day': 'bg-gradient-to-br from-rose-100 to-rose-50 border border-rose-200',
    'mothers-day': 'bg-gradient-to-br from-pink-100 to-pink-50 border border-pink-200',
    christmas: 'bg-gradient-to-br from-sage-100 to-sage-50 border border-sage-200',
    'seasonal-specials': 'bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200',
  };
  return bgs[slug] || 'bg-gradient-to-br from-cream-100 to-cream-50 border border-cream-200';
}

function getSeasonalIconBg(slug: string): string {
  const bgs: Record<string, string> = {
    'valentines-day': 'bg-rose-200',
    'mothers-day': 'bg-pink-200',
    christmas: 'bg-sage-200',
    'seasonal-specials': 'bg-amber-200',
  };
  return bgs[slug] || 'bg-cream-200';
}
