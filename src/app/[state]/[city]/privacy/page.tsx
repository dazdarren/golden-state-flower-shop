import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCityConfig, getCityPath, getAllCityPaths } from '@/data/cities';

interface PrivacyPageProps {
  params: {
    state: string;
    city: string;
  };
}

export function generateStaticParams() {
  return getAllCityPaths();
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const cityConfig = getCityConfig(params.state, params.city);
  if (!cityConfig) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const basePath = getCityPath(cityConfig);

  return {
    title: `Privacy Policy - ${cityConfig.cityName} Flower Delivery`,
    description: `Our privacy policy explains how we collect, use, and protect your information when you use our ${cityConfig.cityName} flower delivery service.`,
    alternates: {
      canonical: `${siteUrl}${basePath}/privacy/`,
    },
  };
}

export default function PrivacyPage({ params }: PrivacyPageProps) {
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
            Privacy Policy
          </h1>
          <p className="text-gray-600">Last updated: January 2024</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container-narrow prose prose-gray max-w-none">
          <h2>Introduction</h2>
          <p>
            {cityConfig.cityName} Flower Delivery (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your
            privacy and is committed to protecting your personal information. This privacy
            policy explains how we collect, use, and safeguard your information when you
            use our flower delivery service.
          </p>

          <h2>Information We Collect</h2>
          <h3>Information You Provide</h3>
          <ul>
            <li>
              <strong>Order Information:</strong> When you place an order, we collect the
              recipient&apos;s name, address, phone number, and delivery instructions.
            </li>
            <li>
              <strong>Your Information:</strong> Your name, email address, phone number,
              and billing information.
            </li>
            <li>
              <strong>Card Messages:</strong> The personal messages you include with your
              flower deliveries.
            </li>
          </ul>

          <h3>Information Collected Automatically</h3>
          <ul>
            <li>
              <strong>Device Information:</strong> Browser type, operating system, and
              device type.
            </li>
            <li>
              <strong>Usage Information:</strong> Pages visited, time spent on site, and
              interaction patterns.
            </li>
            <li>
              <strong>Cookies:</strong> We use cookies to maintain your shopping cart and
              improve your experience.
            </li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process and deliver your flower orders</li>
            <li>Communicate with you about your orders</li>
            <li>Provide customer support</li>
            <li>Improve our services and website</li>
            <li>Send promotional emails (with your consent)</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>Information Sharing</h2>
          <p>
            We share your information only as necessary to fulfill your order:
          </p>
          <ul>
            <li>
              <strong>Local Florists:</strong> We share delivery information with our
              partner florists to complete your order.
            </li>
            <li>
              <strong>Payment Processors:</strong> Your payment information is processed
              securely by our payment partners.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose information if required
              by law.
            </li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information.
            Payment information is encrypted using SSL technology and processed by PCI-compliant
            payment processors.
          </p>

          <h2>Cookies</h2>
          <p>
            We use cookies to maintain your shopping cart and remember your preferences.
            You can disable cookies in your browser settings, but this may affect some
            site functionality.
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt out of marketing communications</li>
          </ul>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of
            significant changes by posting the new policy on our website.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this privacy policy, please contact us at
            privacy@example.com.
          </p>
        </div>
      </section>
    </>
  );
}
