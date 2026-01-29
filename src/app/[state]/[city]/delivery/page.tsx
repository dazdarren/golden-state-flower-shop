import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityConfig, getCityPath, getAllCityPaths } from '@/data/cities';

interface DeliveryPageProps {
  params: {
    state: string;
    city: string;
  };
}

export function generateStaticParams() {
  return getAllCityPaths();
}

export async function generateMetadata({ params }: DeliveryPageProps): Promise<Metadata> {
  const cityConfig = getCityConfig(params.state, params.city);
  if (!cityConfig) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const basePath = getCityPath(cityConfig);

  return {
    title: `Flower Delivery Information - ${cityConfig.cityName}, ${cityConfig.stateAbbr}`,
    description: `Learn about our flower delivery options in ${cityConfig.cityName}. Same-day delivery, hospital delivery, and more.`,
    alternates: {
      canonical: `${siteUrl}${basePath}/delivery/`,
    },
  };
}

export default function DeliveryPage({ params }: DeliveryPageProps) {
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
            Delivery Information
          </h1>
          <p className="text-lg text-gray-600">
            Everything you need to know about flower delivery in {cityConfig.cityName}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container-narrow space-y-12">
          {/* Same-Day Delivery */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🚚</span> Same-Day Delivery
            </h2>
            <div className="card p-6">
              <p className="text-gray-600 mb-4">
                {cityConfig.deliveryInfo.sameDay.description}
              </p>
              <div className="bg-primary-50 rounded-lg p-4">
                <p className="font-semibold text-primary-700">
                  Cutoff Time: {cityConfig.deliveryInfo.sameDay.cutoffTime}
                </p>
                <p className="text-sm text-primary-600 mt-1">
                  {cityConfig.deliveryInfo.nextDay.description}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Areas */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📍</span> Delivery Areas
            </h2>
            <div className="card p-6">
              <p className="text-gray-600 mb-4">
                We deliver throughout {cityConfig.cityName} and surrounding areas.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Neighborhoods</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {cityConfig.neighborhoods.map((neighborhood) => (
                      <li key={neighborhood}>• {neighborhood}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">ZIP Codes</h3>
                  <div className="flex flex-wrap gap-2">
                    {cityConfig.primaryZipCodes.map((zip) => (
                      <span
                        key={zip}
                        className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-600"
                      >
                        {zip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hospital Delivery */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🏥</span> Hospital Delivery
            </h2>
            <div className="card p-6">
              <p className="text-gray-600 mb-4">
                We deliver to all major hospitals in {cityConfig.cityName}. Please include
                the patient&apos;s room number when available for faster delivery.
              </p>
              <h3 className="font-semibold text-gray-900 mb-2">Hospitals We Serve</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {cityConfig.hospitals.map((hospital) => (
                  <li key={hospital}>• {hospital}</li>
                ))}
              </ul>
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-700">
                <strong>Note:</strong> Some hospital rooms (ICU, allergy-sensitive) may
                have flower restrictions. Please check with the hospital beforehand or
                consider our plant options.
              </div>
            </div>
          </div>

          {/* Funeral Homes */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🕊️</span> Funeral & Memorial Services
            </h2>
            <div className="card p-6">
              <p className="text-gray-600 mb-4">
                We deliver sympathy flowers to all funeral homes and memorial services
                in {cityConfig.cityName}. For funeral deliveries, please include the name
                of the deceased and service time.
              </p>
              <h3 className="font-semibold text-gray-900 mb-2">Funeral Homes We Serve</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {cityConfig.funeralHomes.map((home) => (
                  <li key={home}>• {home}</li>
                ))}
              </ul>
              <div className="mt-4">
                <Link href={`${basePath}/flowers/sympathy`} className="text-primary-600 hover:text-primary-700 font-medium">
                  Browse Sympathy Flowers →
                </Link>
              </div>
            </div>
          </div>

          {/* Substitution Policy */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🌻</span> Substitution Policy
            </h2>
            <div className="card p-6">
              <p className="text-gray-600">
                {cityConfig.deliveryInfo.substitutionPolicy}
              </p>
            </div>
          </div>

          {/* Delivery Fees */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>💰</span> Delivery Fees
            </h2>
            <div className="card p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-semibold text-gray-900">Delivery Type</th>
                    <th className="text-right py-2 font-semibold text-gray-900">Fee</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b">
                    <td className="py-3">Same-Day Delivery</td>
                    <td className="text-right">From $14.99</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Next-Day Delivery</td>
                    <td className="text-right">From $9.99</td>
                  </tr>
                  <tr>
                    <td className="py-3">Scheduled Delivery</td>
                    <td className="text-right">From $9.99</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs text-gray-500 mt-4">
                Exact delivery fees depend on the delivery address and are calculated at checkout.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
