import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityConfig, getCityPath, getAllCityPaths } from '@/data/cities';
import { OCCASIONS, OccasionSlug } from '@/types/city';
import ZipChecker from '@/components/ZipChecker';
import DynamicProductGrid from '@/components/DynamicProductGrid';

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const canonicalUrl = `${siteUrl}${getCityPath(cityConfig)}/`;

  return {
    title: `Flower Delivery in ${cityConfig.cityName}, ${cityConfig.stateAbbr} | Same Day Delivery`,
    description: `Order fresh flowers for delivery in ${cityConfig.cityName}. Same-day delivery available to ${cityConfig.neighborhoods.slice(0, 3).join(', ')}, and more. Birthday, sympathy, anniversary arrangements.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Flower Delivery in ${cityConfig.cityName}, ${cityConfig.stateAbbr}`,
      description: `Same-day flower delivery throughout ${cityConfig.cityName}. Fresh arrangements for every occasion.`,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

export default function CityHomePage({ params }: CityPageProps) {
  const cityConfig = getCityConfig(params.state, params.city);

  if (!cityConfig) {
    notFound();
  }

  const basePath = getCityPath(cityConfig);
  const occasionList = Object.values(OCCASIONS);

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
              latitude: '37.7749',
              longitude: '-122.4194',
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

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-cream-50 to-sage-50" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAxOGMtMy4zMTQgMC02LTIuNjg2LTYtNnMyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNnoiIGZpbGw9IiM4Yjk5NmYiIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvZz48L3N2Zz4=')] opacity-60" />

        {/* Decorative botanical elements */}
        <div className="absolute top-20 right-10 w-72 h-72 opacity-[0.07]">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-sage-600">
            <path d="M100 20c0 40-30 60-30 90s15 40 30 40 30-10 30-40-30-50-30-90z" fill="currentColor"/>
            <path d="M70 80c20-10 40 0 60 20M130 80c-20-10-40 0-60 20" stroke="currentColor" strokeWidth="3"/>
          </svg>
        </div>
        <div className="absolute bottom-32 left-10 w-48 h-48 opacity-[0.05] rotate-45">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-rose-400">
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2"/>
            <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="2"/>
            <circle cx="100" cy="100" r="20" fill="currentColor"/>
          </svg>
        </div>

        <div className="container-wide relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left content */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-100/80
                            text-sage-700 text-sm font-medium mb-8 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
                Same-day delivery available
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold
                           text-forest-900 leading-[1.1] tracking-tight mb-6">
                Fresh Flowers
                <span className="block text-sage-600">in {cityConfig.cityName}</span>
              </h1>

              <p className="text-lg sm:text-xl text-forest-800/70 leading-relaxed mb-10 max-w-lg">
                Artisan floral arrangements delivered throughout {cityConfig.cityName}.
                From {cityConfig.neighborhoods[0]} to {cityConfig.neighborhoods[2]},
                we bring nature's beauty to your doorstep.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href={`${basePath}/flowers/birthday`} className="btn-primary">
                  <span>Browse Collection</span>
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href={`${basePath}/flowers/sympathy`} className="btn-secondary">
                  Sympathy Flowers
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-cream-300/50">
                <div className="flex items-center gap-2 text-sm text-forest-800/60">
                  <svg className="w-5 h-5 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Order by 2pm</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-forest-800/60">
                  <svg className="w-5 h-5 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Freshness guaranteed</span>
                </div>
              </div>
            </div>

            {/* Right content - ZIP checker */}
            <div className="flex justify-center lg:justify-end">
              <ZipChecker cityConfig={cityConfig} />
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
            {occasionList.map((occasion, index) => (
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
    </>
  );
}

function getOccasionIcon(occasion: OccasionSlug): JSX.Element {
  const icons: Record<OccasionSlug, JSX.Element> = {
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
      <svg className="w-8 h-8 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };
  return icons[occasion] || icons.birthday;
}

function getOccasionSubtitle(occasion: OccasionSlug): string {
  const subtitles: Record<OccasionSlug, string> = {
    birthday: 'Celebrate life',
    sympathy: 'Express condolences',
    anniversary: 'Mark milestones',
    'get-well': 'Brighten their day',
    'thank-you': 'Show gratitude',
  };
  return subtitles[occasion] || '';
}
