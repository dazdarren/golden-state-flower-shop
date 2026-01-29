import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityConfig, getCityPath, getAllCityPaths } from '@/data/cities';

interface ContactPageProps {
  params: {
    state: string;
    city: string;
  };
}

export function generateStaticParams() {
  return getAllCityPaths();
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const cityConfig = getCityConfig(params.state, params.city);
  if (!cityConfig) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const basePath = getCityPath(cityConfig);

  return {
    title: `Contact Us - ${cityConfig.cityName} Flower Delivery`,
    description: `Contact our ${cityConfig.cityName} flower delivery team. We're here to help with orders, questions, and special requests.`,
    alternates: {
      canonical: `${siteUrl}${basePath}/contact/`,
    },
  };
}

export default function ContactPage({ params }: ContactPageProps) {
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
            Contact Us
          </h1>
          <p className="text-lg text-gray-600">
            We&apos;re here to help with your {cityConfig.cityName} flower delivery
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12">
        <div className="container-narrow">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Methods */}
            <div className="space-y-6">
              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📧</span> Email Support
                </h2>
                <p className="text-gray-600 mb-2">
                  For general inquiries and order questions
                </p>
                <a
                  href="mailto:support@example.com"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  support@example.com
                </a>
              </div>

              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📞</span> Phone Support
                </h2>
                <p className="text-gray-600 mb-2">
                  Available Monday - Saturday, 8 AM - 6 PM PST
                </p>
                <a
                  href="tel:+14155551234"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  (415) 555-1234
                </a>
              </div>

              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>⏰</span> Hours of Operation
                </h2>
                <table className="text-sm text-gray-600 w-full">
                  <tbody>
                    <tr>
                      <td className="py-1">Monday - Friday</td>
                      <td className="text-right">8:00 AM - 6:00 PM</td>
                    </tr>
                    <tr>
                      <td className="py-1">Saturday</td>
                      <td className="text-right">9:00 AM - 5:00 PM</td>
                    </tr>
                    <tr>
                      <td className="py-1">Sunday</td>
                      <td className="text-right">Closed</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="space-y-6">
              <div className="card p-6 bg-primary-50 border-primary-100">
                <h2 className="font-semibold text-gray-900 mb-4">
                  Check our FAQ first
                </h2>
                <p className="text-gray-600 mb-4">
                  Many common questions are already answered in our FAQ section.
                </p>
                <Link href={`${basePath}/faq`} className="btn-primary">
                  View FAQ
                </Link>
              </div>

              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 mb-4">
                  Service Areas
                </h2>
                <p className="text-gray-600 mb-4">
                  We deliver to all {cityConfig.cityName} neighborhoods including:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {cityConfig.neighborhoods.slice(0, 8).map((n) => (
                    <li key={n}>• {n}</li>
                  ))}
                  <li>• and more...</li>
                </ul>
                <Link
                  href={`${basePath}/delivery`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-3 inline-block"
                >
                  View all delivery areas →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
