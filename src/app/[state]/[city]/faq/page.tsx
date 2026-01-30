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
        a: 'Browse arrangements, add to cart, and check out. You\'ll enter delivery details and payment info. We\'ll email you a confirmation with your order number.',
      },
      {
        q: 'Can I customize my order?',
        a: 'Every order includes a free card message. Type your message at checkout and we\'ll include a printed card. For other requests (specific colors, no fragrant flowers), add a note at checkout or call us.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept Visa, Mastercard, American Express, Discover, and Apple Pay. All payments are processed securely.',
      },
    ],
  },
  {
    category: 'Delivery',
    questions: [
      {
        q: 'What is the cutoff time for same-day delivery?',
        a: 'Order by 2pm for same-day delivery. Orders placed after 2pm will be delivered the next business day. Cutoff times may vary on holidays.',
      },
      {
        q: 'Do you deliver on weekends?',
        a: 'Yes, we deliver on Saturdays. Sunday delivery is available for select arrangements in some areas. You\'ll see availability at checkout.',
      },
      {
        q: 'Can you deliver to a hospital?',
        a: 'Yes. We deliver to all major hospitals. Some ICU and maternity wards have restrictions, so we call ahead to confirm. Include the patient\'s full name and room number if you have it.',
      },
      {
        q: 'What if no one is home?',
        a: 'For residential deliveries, our driver may leave flowers in a safe spot (covered porch, with a neighbor). If that\'s not possible, we\'ll contact you to reschedule. No extra charge for redelivery.',
      },
      {
        q: 'Do you deliver to businesses?',
        a: 'Yes. We deliver to offices, restaurants, and hotels during business hours. Tip: include the recipient\'s name and company name for smooth delivery.',
      },
    ],
  },
  {
    category: 'Products',
    questions: [
      {
        q: 'Are your flowers fresh?',
        a: 'Yes. Flowers are sourced fresh and arranged by local florists the same day. We guarantee freshness for 7 days. If flowers wilt early, we\'ll replace them.',
      },
      {
        q: 'What is your substitution policy?',
        a: 'If a flower is unavailable, we\'ll substitute with a similar bloom of equal or greater value. We keep the same style, colors, and overall look. No substitutions without your OK? Add a note at checkout.',
      },
      {
        q: 'How long will my flowers last?',
        a: 'Most arrangements last 5-7 days with proper care. Keep them in fresh water, away from direct sunlight and heat. Trim stems every few days. We include care instructions with delivery.',
      },
    ],
  },
  {
    category: 'Changes & Cancellations',
    questions: [
      {
        q: 'Can I change my order after placing it?',
        a: 'Call us right away at (510) 485-9113. We can usually make changes if the order hasn\'t gone to the florist yet. Same-day orders are harder to change, so call as soon as possible.',
      },
      {
        q: 'Can I cancel my order?',
        a: 'Orders can be cancelled before they go to the florist. Same-day orders typically can\'t be cancelled because florists start preparing immediately. Call us to check.',
      },
      {
        q: 'What if my flowers arrive damaged?',
        a: 'Contact us within 24 hours with photos. We\'ll send a replacement or issue a full refund. No need to return the damaged flowers. Call (510) 485-9113 or email support@goldenstateflowershop.com.',
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
