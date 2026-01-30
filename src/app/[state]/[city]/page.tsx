import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityConfig, getCityPath, getAllCityPaths } from '@/data/cities';
import { OCCASIONS as OCCASIONS_OLD, OccasionSlug } from '@/types/city';
import { OCCASIONS } from '@/data/categories';
import { getFeaturedGuides } from '@/data/guides';
import DynamicProductGrid from '@/components/DynamicProductGrid';
import ValuePropStrip from '@/components/ValuePropStrip';
import NewsletterSignup from '@/components/NewsletterSignup';
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

      {/* Hero Section - Compact, Centered */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Background - Simple gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-cream-50 to-sage-50" />

        <div className="container-wide relative z-10">
          <div className="max-w-3xl mx-auto text-center">
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
              Same-Day Flower Delivery
              <span className="block text-sage-600">in {cityConfig.cityName}</span>
            </h1>

            {/* Value proposition */}
            <p className="text-lg sm:text-xl text-forest-800/70 leading-relaxed mb-6">
              Fresh arrangements. Local florists. Guaranteed satisfaction. Bouquets from <span className="font-semibold text-forest-900">$49</span>
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Link href={`${basePath}/flowers/birthday`} className="btn-primary">
                <span>Birthday Flowers</span>
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
                Romantic Flowers
              </Link>
            </div>

            {/* Inline Trust Badges */}
            <div className="pt-6 border-t border-cream-300/50 max-w-xl mx-auto">
              <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
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
      </section>

      {/* Value Proposition Strip */}
      <ValuePropStrip cutoffTime={cityConfig.deliveryInfo.sameDay.cutoffTime} />

      {/* Featured Products - Moved up for immediate visibility */}
      <section className="py-16 lg:py-20 bg-cream-50">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div>
              <span className="text-sage-600 text-sm font-medium uppercase tracking-widest">
                Curated Selection
              </span>
              <h2 className="font-display text-3xl lg:text-4xl font-semibold text-forest-900 mt-3">
                Popular in {cityConfig.cityName}
              </h2>
              <p className="text-forest-800/50 mt-2 max-w-lg">
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

          <div className="text-center mt-10 md:hidden">
            <Link href={`${basePath}/flowers/birthday`} className="btn-primary">
              View All Arrangements
            </Link>
          </div>
        </div>
      </section>

      {/* Occasion Categories - Compact Horizontal Strip */}
      <section className="py-10 bg-white border-b border-cream-200">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-forest-900">
              Shop by Occasion
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {OCCASIONS.slice(0, 10).map((occasion) => (
              <Link
                key={occasion.slug}
                href={`${basePath}/flowers/${occasion.slug}`}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5
                         bg-cream-50 rounded-full border border-cream-200
                         hover:border-sage-300 hover:bg-sage-50 transition-colors"
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  {getOccasionIconSmall(occasion.slug as OccasionSlug)}
                </span>
                <span className="text-sm font-medium text-forest-800">
                  {occasion.name}
                </span>
              </Link>
            ))}
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

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
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
                className="group bg-cream-50 rounded-3xl p-6 lg:p-8 border border-cream-200
                         hover:border-sage-200 hover:shadow-soft-lg
                         transition-all duration-500 opacity-0 animate-fade-up"
                style={{
                  animationDelay: `${index * 100}ms`,
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
                <p className="text-forest-800/50 leading-relaxed">
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
                  animationDelay: `${index * 100}ms`,
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
              <p className="text-forest-800/50 mt-3 max-w-lg">
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

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
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

function getOccasionIconSmall(occasion: OccasionSlug): JSX.Element {
  const icons: Record<string, JSX.Element> = {
    birthday: (
      <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
      </svg>
    ),
    sympathy: (
      <svg className="w-5 h-5 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    anniversary: (
      <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    'get-well': (
      <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    'thank-you': (
      <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    'love-romance': (
      <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    'new-baby': (
      <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'just-because': (
      <svg className="w-5 h-5 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    congratulations: (
      <svg className="w-5 h-5 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  };
  return icons[occasion] || icons.birthday;
}
