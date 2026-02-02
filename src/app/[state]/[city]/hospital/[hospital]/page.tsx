import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityConfig, getCityPath, getAllCities } from '@/data/cities';
import DynamicProductGrid from '@/components/DynamicProductGrid';

interface HospitalPageProps {
  params: {
    state: string;
    city: string;
    hospital: string;
  };
}

// Helper to create URL-safe slug from hospital name
function hospitalToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper to get hospital name from slug
function getHospitalFromSlug(slug: string, hospitals: string[]): string | undefined {
  return hospitals.find(h => hospitalToSlug(h) === slug);
}

// Generate static params for all hospital pages
export function generateStaticParams() {
  const cities = getAllCities();
  const params: { state: string; city: string; hospital: string }[] = [];

  for (const city of cities) {
    for (const hospital of city.hospitals) {
      params.push({
        state: city.stateSlug,
        city: city.citySlug,
        hospital: hospitalToSlug(hospital),
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: HospitalPageProps): Promise<Metadata> {
  const cityConfig = getCityConfig(params.state, params.city);
  if (!cityConfig) return {};

  const hospitalName = getHospitalFromSlug(params.hospital, cityConfig.hospitals);
  if (!hospitalName) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com';
  const basePath = getCityPath(cityConfig);
  const canonicalUrl = `${siteUrl}${basePath}/hospital/${params.hospital}/`;

  const title = `Flower Delivery to ${hospitalName} | ${cityConfig.cityName}`;
  const description = `Send flowers to ${hospitalName} in ${cityConfig.cityName}. Same-day hospital flower delivery. We call ahead to confirm patient can receive flowers. Order by 2pm for delivery today.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

export default function HospitalPage({ params }: HospitalPageProps) {
  const cityConfig = getCityConfig(params.state, params.city);

  if (!cityConfig) {
    notFound();
  }

  const hospitalName = getHospitalFromSlug(params.hospital, cityConfig.hospitals);

  if (!hospitalName) {
    notFound();
  }

  const basePath = getCityPath(cityConfig);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com';

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
        name: 'Hospital Delivery',
        item: `${siteUrl}${basePath}/hospital/${params.hospital}`,
      },
    ],
  };

  // Service Schema for hospital delivery
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Flower Delivery to ${hospitalName}`,
    description: `Same-day flower delivery service to ${hospitalName} in ${cityConfig.cityName}. Fresh arrangements delivered with care.`,
    provider: {
      '@type': 'Florist',
      name: 'Golden State Flower Shop',
      url: siteUrl,
    },
    areaServed: {
      '@type': 'Hospital',
      name: hospitalName,
      address: {
        '@type': 'PostalAddress',
        addressLocality: cityConfig.cityName,
        addressRegion: cityConfig.stateAbbr,
      },
    },
    serviceType: 'Hospital Flower Delivery',
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="bg-cream-50 border-b border-cream-200">
        <div className="container-wide py-3">
          <ol className="flex items-center gap-2 text-sm text-forest-800/60">
            <li>
              <Link href={basePath} className="hover:text-forest-900 transition-colors">
                {cityConfig.cityName}
              </Link>
            </li>
            <li>/</li>
            <li className="text-forest-900 font-medium">Hospital Delivery</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-50 via-cream-50 to-white py-12 lg:py-16">
        <div className="container-wide">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-forest-900">
              Flower Delivery to {hospitalName}
            </h1>
          </div>
          <p className="text-lg text-forest-800/60 max-w-2xl">
            Send get-well flowers, cheerful arrangements, and plants to patients at {hospitalName}.
            We deliver directly to the hospital and call ahead to confirm the patient can receive flowers.
          </p>
        </div>
      </section>

      {/* Hospital Info Banner */}
      <section className="bg-sky-50 border-y border-sky-100">
        <div className="container-wide py-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-soft">
                <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-forest-900">Same-Day Delivery</h3>
                <p className="text-sm text-forest-800/60">Order by {cityConfig.deliveryInfo.sameDay.cutoffTime} for delivery today</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-soft">
                <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-forest-900">We Call Ahead</h3>
                <p className="text-sm text-forest-800/60">We verify the patient can receive flowers before delivery</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-soft">
                <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-forest-900">Delivery Confirmation</h3>
                <p className="text-sm text-forest-800/60">You&apos;ll receive confirmation when delivered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 lg:py-16">
        <div className="container-wide">
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6">
            Get Well Flowers for {hospitalName}
          </h2>
          <DynamicProductGrid
            basePath={basePath}
            occasion="get-well"
            count={12}
            showFilters={true}
          />
        </div>
      </section>

      {/* Hospital Delivery Tips */}
      <section className="py-12 lg:py-16 bg-cream-50">
        <div className="container-narrow">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-forest-900 mb-6">
            Hospital Flower Delivery Tips
          </h2>
          <div className="prose prose-forest max-w-none text-forest-800/70 space-y-4">
            <p>
              When sending flowers to {hospitalName}, keep these tips in mind for a smooth delivery:
            </p>
            <ul className="space-y-2">
              <li>
                <strong>Include the patient&apos;s full name</strong> - First and last name helps staff locate the recipient quickly.
              </li>
              <li>
                <strong>Add the room number if you have it</strong> - While we&apos;ll verify with the hospital, this speeds up delivery.
              </li>
              <li>
                <strong>Consider plant alternatives for ICU</strong> - Some intensive care units restrict fresh flowers. Our green plants are often allowed.
              </li>
              <li>
                <strong>Check visiting hours</strong> - We deliver during regular hospital hours when staff can receive deliveries.
              </li>
              <li>
                <strong>Keep arrangements modest in size</strong> - Hospital rooms have limited space. Mid-sized arrangements work best.
              </li>
            </ul>
            <p>
              We call ahead to {hospitalName} to confirm the patient&apos;s location and ability to receive flowers,
              so you can order with confidence knowing your gift will reach them.
            </p>
          </div>
        </div>
      </section>

      {/* Other Hospitals */}
      <section className="py-12 lg:py-16">
        <div className="container-wide">
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6">
            Other {cityConfig.cityName} Hospitals We Deliver To
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cityConfig.hospitals
              .filter(h => h !== hospitalName)
              .map((hospital) => (
                <Link
                  key={hospital}
                  href={`${basePath}/hospital/${hospitalToSlug(hospital)}/`}
                  className="p-5 rounded-xl bg-white border border-cream-200 hover:border-sky-200 hover:shadow-soft transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center group-hover:bg-sky-100 transition-colors">
                      <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <span className="font-medium text-forest-900 group-hover:text-sky-700 transition-colors">
                      {hospital}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 lg:py-16 bg-white border-t border-cream-200">
        <div className="container-narrow">
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="bg-cream-50 rounded-xl border border-cream-200 overflow-hidden group">
              <summary className="p-5 font-medium text-forest-900 cursor-pointer list-none flex justify-between items-center">
                <span>Can I send flowers to the ICU at {hospitalName}?</span>
                <svg className="w-5 h-5 text-sage-600 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-forest-800/70">
                ICU and intensive care units often have restrictions on fresh flowers due to infection control.
                We recommend our green plants or succulents as alternatives. We always call ahead to verify what&apos;s allowed.
              </div>
            </details>
            <details className="bg-cream-50 rounded-xl border border-cream-200 overflow-hidden group">
              <summary className="p-5 font-medium text-forest-900 cursor-pointer list-none flex justify-between items-center">
                <span>What if the patient has been discharged?</span>
                <svg className="w-5 h-5 text-sage-600 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-forest-800/70">
                If the patient is no longer at {hospitalName}, we&apos;ll contact you immediately to arrange delivery to their home or another location.
                There&apos;s no extra charge for rerouting same-day.
              </div>
            </details>
            <details className="bg-cream-50 rounded-xl border border-cream-200 overflow-hidden group">
              <summary className="p-5 font-medium text-forest-900 cursor-pointer list-none flex justify-between items-center">
                <span>What information do I need to provide?</span>
                <svg className="w-5 h-5 text-sage-600 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-forest-800/70">
                At minimum, provide the patient&apos;s full name (first and last). If you have the room number, include it.
                The hospital staff will help our delivery person locate the patient.
              </div>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
