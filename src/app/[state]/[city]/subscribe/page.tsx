import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityConfig, getCityPath, getAllCityPaths } from '@/data/cities';
import SubscriptionTiers from './SubscriptionTiers';

interface SubscribePageProps {
  params: {
    state: string;
    city: string;
  };
}

export function generateStaticParams() {
  return getAllCityPaths();
}

export async function generateMetadata({ params }: SubscribePageProps): Promise<Metadata> {
  const cityConfig = getCityConfig(params.state, params.city);
  if (!cityConfig) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com';
  const basePath = getCityPath(cityConfig);

  return {
    title: `Golden Bloom Club - Flower Subscription in ${cityConfig.cityName}`,
    description: `Join the Golden Bloom Club for premium flower delivery in ${cityConfig.cityName}. Fresh, hand-arranged bouquets delivered monthly. Skip or pause anytime.`,
    alternates: {
      canonical: `${siteUrl}${basePath}/subscribe/`,
    },
    openGraph: {
      title: `Golden Bloom Club - Premium Flower Subscription`,
      description: `Fresh flowers delivered monthly to ${cityConfig.cityName}. Starting at $65/month.`,
      url: `${siteUrl}${basePath}/subscribe/`,
      type: 'website',
    },
  };
}

export default function SubscribePage({ params }: SubscribePageProps) {
  const cityConfig = getCityConfig(params.state, params.city);

  if (!cityConfig) {
    notFound();
  }

  const basePath = getCityPath(cityConfig);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com';

  // Subscription Service Schema
  const subscriptionSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Golden Bloom Club Flower Subscription',
    description: 'Premium monthly flower subscription with hand-arranged seasonal bouquets delivered to your door.',
    brand: {
      '@type': 'Brand',
      name: 'Golden State Flower Shop',
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Classic',
        price: '65.00',
        priceCurrency: 'USD',
        description: 'Beautiful seasonal bouquet delivered monthly',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Luxe',
        price: '95.00',
        priceCurrency: 'USD',
        description: 'Premium arrangement with elegant vase included',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Grand',
        price: '145.00',
        priceCurrency: 'USD',
        description: 'Luxury statement centerpiece with extras',
        availability: 'https://schema.org/InStock',
      },
    ],
  };

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
        name: 'Subscribe',
        item: `${siteUrl}${basePath}/subscribe`,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(subscriptionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900 text-cream-100 py-20 lg:py-28 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-sage-400">
              <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1"/>
              <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1"/>
              <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
          <div className="absolute bottom-10 right-10 w-48 h-48 rotate-45">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-sage-400">
              <path d="M100 20c0 40-30 60-30 90s15 40 30 40 30-10 30-40-30-50-30-90z" fill="currentColor"/>
            </svg>
          </div>
        </div>

        <div className="container-wide relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-600/20
                          text-sage-300 text-sm font-medium mb-8 backdrop-blur-sm border border-sage-500/20">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span>Premium Flower Subscription</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight mb-6">
              Join the
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sage-300 to-sage-400">
                Golden Bloom Club
              </span>
            </h1>

            <p className="text-xl text-cream-200/80 mb-8 leading-relaxed">
              Fresh, hand-arranged flowers delivered to your door every month.
              Elevate your space with the beauty of nature, effortlessly.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-cream-200/60">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-sage-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Skip or pause anytime
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-sage-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Free delivery
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-sage-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Cancel anytime
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto">
            <path d="M0 60V30c240-20 480-30 720-30s480 10 720 30v30H0z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Subscription Tiers */}
      <section className="py-20 lg:py-28 bg-white" id="plans">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sage-600 text-sm font-medium uppercase tracking-widest">
              Choose Your Plan
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-forest-900 mt-4 mb-4">
              Subscription Plans
            </h2>
            <p className="text-forest-800/60">
              Select the perfect tier to match your style and space.
              All plans include free delivery and the flexibility to skip or pause.
            </p>
          </div>

          <SubscriptionTiers basePath={basePath} cityName={cityConfig.cityName} />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28 bg-cream-50">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sage-600 text-sm font-medium uppercase tracking-widest">
              Simple & Effortless
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-forest-900 mt-4">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: '1',
                title: 'Choose Your Plan',
                description: 'Select from Classic, Luxe, or Grand tiers based on your style and budget.',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                step: '2',
                title: 'Set Your Delivery',
                description: 'Tell us where and when to deliver. We\'ll handle the rest.',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                step: '3',
                title: 'Enjoy Fresh Flowers',
                description: 'Receive a stunning hand-arranged bouquet every month.',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white shadow-soft
                              flex items-center justify-center text-sage-600
                              border border-cream-200">
                  {item.icon}
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2
                              w-8 h-8 rounded-full bg-sage-600 text-white
                              flex items-center justify-center font-bold text-sm">
                  {item.step}
                </div>
                <h3 className="font-display text-xl font-semibold text-forest-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-forest-800/60">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="text-sage-600 text-sm font-medium uppercase tracking-widest">
                Why Subscribe
              </span>
              <h2 className="font-display text-3xl lg:text-4xl font-semibold text-forest-900 mt-4 mb-6">
                More Than Just Flowers
              </h2>
              <p className="text-forest-800/60 text-lg mb-8">
                A Golden Bloom Club subscription brings joy, beauty, and a touch of nature
                into your life every month, without the hassle of ordering.
              </p>

              <ul className="space-y-4">
                {[
                  'Farm-fresh flowers, never from a warehouse',
                  'Hand-arranged by local artisan florists',
                  'Seasonal varieties for unique arrangements each month',
                  'Eco-friendly packaging and sustainable sourcing',
                  'Flexible scheduling - skip, pause, or gift anytime',
                  'Exclusive access to limited-edition arrangements',
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-sage-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-forest-800">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-sage-100 to-cream-100 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-20">
                  🌸
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-soft-lg p-6 border border-cream-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-display font-semibold text-forest-900">500+</p>
                    <p className="text-sm text-forest-800/60">Happy subscribers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gift Subscription CTA */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-sage-50 to-cream-50">
        <div className="container-narrow text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-100
                        text-sage-700 text-sm font-medium mb-6">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            <span>The Perfect Gift</span>
          </div>

          <h2 className="font-display text-3xl lg:text-4xl font-semibold text-forest-900 mb-4">
            Gift a Subscription
          </h2>
          <p className="text-forest-800/60 text-lg mb-8 max-w-xl mx-auto">
            Give the gift of fresh flowers delivered monthly. Perfect for birthdays,
            Mother's Day, or just to show someone you care.
          </p>

          <Link
            href="#plans"
            className="inline-flex items-center gap-2 px-8 py-4 bg-forest-900 text-cream-100
                     rounded-full font-medium transition-all duration-300
                     hover:bg-forest-800 hover:shadow-soft-lg hover:-translate-y-0.5"
          >
            <span>Shop Gift Subscriptions</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container-narrow">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-forest-900">
              Subscription FAQ
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Can I skip a month?',
                a: 'Yes! You can skip any delivery up to 48 hours before your scheduled delivery date. Just log into your account and manage your subscription.',
              },
              {
                q: 'Can I choose my delivery day?',
                a: 'You\'ll set your preferred delivery day when you subscribe. You can change it anytime from your account dashboard.',
              },
              {
                q: 'What if I\'m not home?',
                a: 'Our delivery partners will leave your flowers in a safe spot. You can also add delivery instructions to your account.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Absolutely. There\'s no commitment - cancel anytime from your account. You\'ll continue to receive flowers until the end of your billing period.',
              },
              {
                q: 'Can I gift a subscription?',
                a: 'Yes! Select "Gift" when checking out and enter the recipient\'s details. They\'ll receive an email with the good news.',
              },
              {
                q: 'What if I have flower allergies or preferences?',
                a: 'Contact us after subscribing and we\'ll note any allergies or preferences on your account. Our florists will accommodate where possible.',
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-cream-50 rounded-2xl border border-cream-200 overflow-hidden
                         hover:border-sage-200 transition-all duration-300"
              >
                <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                  <span className="font-display text-lg font-medium text-forest-900 pr-8">
                    {faq.q}
                  </span>
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white
                                 flex items-center justify-center text-sage-600
                                 group-open:bg-sage-500 group-open:text-white
                                 transition-colors duration-300 shadow-soft">
                    <svg className="w-4 h-4 group-open:rotate-180 transition-transform duration-300"
                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-forest-800/70 leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href={`${basePath}/faq`}
              className="text-sage-600 hover:text-sage-700 font-medium transition-colors"
            >
              View all FAQs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
