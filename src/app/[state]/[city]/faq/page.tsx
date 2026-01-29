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
        a: 'Simply browse our flower arrangements, add items to your cart, and proceed to checkout. You&apos;ll need to provide delivery details and your payment information.',
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
        a: 'Yes! We deliver to all major hospitals. Please include the patient&apos;s full name and room number for faster delivery.',
      },
      {
        q: 'What if no one is home?',
        a: 'For residential deliveries, our driver may leave the arrangement in a safe location. For sensitive locations, we&apos;ll attempt redelivery or contact you.',
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
        a: 'Contact us as soon as possible. We can make changes if the order hasn&apos;t been sent to the florist yet.',
      },
      {
        q: 'Can I cancel my order?',
        a: 'Orders can be cancelled before they are sent to the florist. Same-day orders typically cannot be cancelled due to the short turnaround.',
      },
      {
        q: 'What if my flowers arrive damaged?',
        a: 'Please contact us within 24 hours with photos of the damage. We&apos;ll arrange a replacement or refund.',
      },
    ],
  },
];

export default function FAQPage({ params }: FAQPageProps) {
  const cityConfig = getCityConfig(params.state, params.city);

  if (!cityConfig) {
    notFound();
  }

  const basePath = getCityPath(cityConfig);

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-12">
        <div className="container-narrow">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about ordering and delivery
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="container-narrow space-y-10">
          {faqs.map((category) => (
            <div key={category.category}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {category.category}
              </h2>
              <div className="space-y-3">
                {category.questions.map((faq, idx) => (
                  <details key={idx} className="card p-4 group">
                    <summary className="font-medium text-gray-900 cursor-pointer list-none flex justify-between items-center">
                      {faq.q}
                      <span className="text-primary-600 group-open:rotate-180 transition-transform ml-4">
                        ▼
                      </span>
                    </summary>
                    <p className="text-gray-600 mt-3 text-sm">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}

          {/* Contact CTA */}
          <div className="card p-6 text-center bg-primary-50 border-primary-100">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Still have questions?
            </h2>
            <p className="text-gray-600 mb-4">
              Our customer service team is happy to help
            </p>
            <Link href={`${basePath}/contact`} className="btn-primary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
