import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityConfig, getCityPath, getAllCityPaths } from '@/data/cities';

interface FAQPageProps {
  params: {
    state: string;
    city: string;
  };
}

export function generateStaticParams() {
  return getAllCityPaths();
}

export async function generateMetadata({ params }: FAQPageProps): Promise<Metadata> {
  const cityConfig = getCityConfig(params.state, params.city);
  if (!cityConfig) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const basePath = getCityPath(cityConfig);

  return {
    title: `FAQ - ${cityConfig.cityName} Flower Delivery`,
    description: `Frequently asked questions about flower delivery in ${cityConfig.cityName}. Same-day delivery, hospital delivery, and more.`,
    alternates: {
      canonical: `${siteUrl}${basePath}/faq/`,
    },
  };
}

const faqs = [
  {
    category: 'Ordering',
    questions: [
      {
        q: 'How do I place an order?',
        a: 'Simply browse our flower arrangements, add items to your cart, and proceed to checkout. You\'ll need to provide delivery details and your payment information.',
      },
      {
        q: 'Can I customize my order?',
        a: 'You can add a personalized card message with your order. For specific customization requests, please contact us directly.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards including Visa, Mastercard, American Express, and Discover.',
      },
    ],
  },
  {
    category: 'Delivery',
    questions: [
      {
        q: 'What is the cutoff time for same-day delivery?',
        a: 'Order by 2:00 PM PST for same-day delivery. Orders placed after the cutoff will be delivered the next business day.',
      },
      {
        q: 'Do you deliver on weekends?',
        a: 'Yes, we deliver on Saturdays. Sunday delivery is limited to select arrangements. Check delivery availability at checkout.',
      },
      {
        q: 'Can you deliver to a hospital?',
        a: 'Yes! We deliver to all major hospitals. Please include the patient\'s full name and room number for faster delivery.',
      },
      {
        q: 'What if no one is home?',
        a: 'For residential deliveries, our driver may leave the arrangement in a safe location. For sensitive locations, we\'ll attempt redelivery or contact you.',
      },
      {
        q: 'Do you deliver to businesses?',
        a: 'Absolutely! We deliver to offices, restaurants, hotels, and other businesses during their operating hours.',
      },
    ],
  },
  {
    category: 'Products',
    questions: [
      {
        q: 'Are your flowers fresh?',
        a: 'Yes, all our flowers are sourced fresh and arranged by local florists to ensure maximum freshness and longevity.',
      },
      {
        q: 'What is your substitution policy?',
        a: 'If any flower in your arrangement is unavailable, we may substitute with a similar flower of equal or greater value. The overall style and color scheme will be maintained.',
      },
      {
        q: 'How long will my flowers last?',
        a: 'With proper care (fresh water, cool location, away from direct sunlight), most arrangements last 5-7 days or longer.',
      },
    ],
  },
  {
    category: 'Changes & Cancellations',
    questions: [
      {
        q: 'Can I change my order after placing it?',
        a: 'Contact us as soon as possible. We can make changes if the order hasn\'t been sent to the florist yet.',
      },
      {
        q: 'Can I cancel my order?',
        a: 'Orders can be cancelled before they are sent to the florist. Same-day orders typically cannot be cancelled due to the short turnaround.',
      },
      {
        q: 'What if my flowers arrive damaged?',
        a: 'Please contact us within 24 hours with photos of the damage. We\'ll arrange a replacement or refund.',
      },
    ],
  },
];

// Flatten all FAQs for schema
const allFaqs = faqs.flatMap(category => category.questions);

export default function FAQPage({ params }: FAQPageProps) {
  const cityConfig = getCityConfig(params.state, params.city);

  if (!cityConfig) {
    notFound();
  }

  const basePath = getCityPath(cityConfig);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com';

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
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
        name: 'FAQ',
        item: `${siteUrl}${basePath}/faq`,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="bg-cream-50 border-b border-cream-200">
        <div className="container-narrow py-3">
          <ol className="flex items-center gap-2 text-sm text-forest-800/60">
            <li>
              <Link href={basePath} className="hover:text-forest-900 transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-forest-900 font-medium">FAQ</li>
          </ol>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-br from-cream-50 to-white py-12">
        <div className="container-narrow">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-forest-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-forest-800/60">
            Find answers to common questions about ordering and delivery in {cityConfig.cityName}
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="container-narrow space-y-10">
          {faqs.map((category) => (
            <div key={category.category}>
              <h2 className="font-display text-xl font-semibold text-forest-900 mb-4">
                {category.category}
              </h2>
              <div className="space-y-3">
                {category.questions.map((faq, idx) => (
                  <details
                    key={idx}
                    className="bg-white rounded-xl border border-cream-200 overflow-hidden
                             hover:border-sage-200 hover:shadow-soft transition-all duration-300 group"
                  >
                    <summary className="p-5 font-medium text-forest-900 cursor-pointer list-none flex justify-between items-center">
                      <span>{faq.q}</span>
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cream-100
                                     flex items-center justify-center text-sage-600
                                     group-open:bg-sage-500 group-open:text-white
                                     transition-colors duration-300 ml-4">
                        <svg className="w-4 h-4 group-open:rotate-180 transition-transform duration-300"
                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-5 pb-5">
                      <p className="text-forest-800/70 leading-relaxed">{faq.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}

          {/* Contact CTA */}
          <div className="bg-gradient-to-br from-sage-50 to-cream-50 rounded-2xl p-8 text-center border border-sage-100">
            <h2 className="font-display text-xl font-semibold text-forest-900 mb-2">
              Still have questions?
            </h2>
            <p className="text-forest-800/60 mb-6">
              Our customer service team is happy to help
            </p>
            <Link
              href={`${basePath}/contact`}
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
        </div>
      </section>
    </>
  );
}
