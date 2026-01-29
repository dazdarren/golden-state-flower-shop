import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCityConfig, getCityPath, getAllCityPaths } from '@/data/cities';

interface TermsPageProps {
  params: {
    state: string;
    city: string;
  };
}

export function generateStaticParams() {
  return getAllCityPaths();
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const cityConfig = getCityConfig(params.state, params.city);
  if (!cityConfig) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const basePath = getCityPath(cityConfig);

  return {
    title: `Terms of Service - ${cityConfig.cityName} Flower Delivery`,
    description: `Terms of service for our ${cityConfig.cityName} flower delivery service.`,
    alternates: {
      canonical: `${siteUrl}${basePath}/terms/`,
    },
  };
}

export default function TermsPage({ params }: TermsPageProps) {
  const cityConfig = getCityConfig(params.state, params.city);

  if (!cityConfig) {
    notFound();
  }

  return (
    <>
      {/* Header */}
      <section className="bg-gray-50 py-12">
        <div className="container-narrow">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600">Last updated: January 2024</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container-narrow prose prose-gray max-w-none">
          <h2>Acceptance of Terms</h2>
          <p>
            By using {cityConfig.cityName} Flower Delivery (&quot;the Service&quot;), you agree to
            be bound by these Terms of Service. If you do not agree to these terms,
            please do not use our service.
          </p>

          <h2>Orders and Delivery</h2>
          <h3>Placing Orders</h3>
          <ul>
            <li>All orders are subject to product availability.</li>
            <li>Prices are subject to change without notice.</li>
            <li>We reserve the right to refuse or cancel any order.</li>
          </ul>

          <h3>Delivery</h3>
          <ul>
            <li>
              We will make every effort to deliver on the requested date, but cannot
              guarantee specific delivery times.
            </li>
            <li>
              Same-day delivery is available for orders placed before the cutoff time
              (typically 2:00 PM PST).
            </li>
            <li>
              If the recipient is not available, our driver may leave the delivery in
              a safe location or with a neighbor.
            </li>
          </ul>

          <h3>Substitutions</h3>
          <p>
            Due to the perishable nature of flowers and availability of seasonal
            varieties, we may substitute flowers of equal or greater value while
            maintaining the overall style and color scheme of your arrangement.
          </p>

          <h2>Payment</h2>
          <ul>
            <li>Payment is required at the time of ordering.</li>
            <li>We accept major credit cards.</li>
            <li>All prices are in US dollars.</li>
            <li>
              Delivery fees are calculated based on the delivery location and are
              displayed at checkout.
            </li>
          </ul>

          <h2>Cancellations and Refunds</h2>
          <h3>Cancellations</h3>
          <ul>
            <li>
              Orders may be cancelled before they are sent to the florist for
              fulfillment.
            </li>
            <li>
              Same-day orders typically cannot be cancelled due to the short
              fulfillment window.
            </li>
          </ul>

          <h3>Refunds</h3>
          <ul>
            <li>
              If you are not satisfied with your order, please contact us within
              24 hours of delivery.
            </li>
            <li>
              Refunds or replacements are issued at our discretion based on the
              nature of the complaint.
            </li>
            <li>
              Photos of any damaged or unsatisfactory arrangements must be provided.
            </li>
          </ul>

          <h2>Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, {cityConfig.cityName} Flower Delivery
            shall not be liable for any indirect, incidental, special, consequential,
            or punitive damages arising from your use of the Service.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            All content on this website, including text, images, and logos, is the
            property of {cityConfig.cityName} Flower Delivery or its content suppliers
            and is protected by copyright laws.
          </p>

          <h2>Privacy</h2>
          <p>
            Your use of the Service is also governed by our Privacy Policy. Please
            review our Privacy Policy to understand our practices.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be
            effective immediately upon posting to the website. Your continued use of
            the Service after changes are posted constitutes acceptance of the modified
            terms.
          </p>

          <h2>Contact</h2>
          <p>
            For questions about these terms, please contact us at legal@example.com.
          </p>
        </div>
      </section>
    </>
  );
}
