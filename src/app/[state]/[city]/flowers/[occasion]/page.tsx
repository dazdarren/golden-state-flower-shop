import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityConfig, getCityPath } from '@/data/cities';
import { OCCASIONS, OccasionSlug } from '@/types/city';
import DynamicProductGrid from '@/components/DynamicProductGrid';

interface OccasionPageProps {
  params: {
    state: string;
    city: string;
    occasion: string;
  };
}

// Generate static params for all occasion pages
export function generateStaticParams() {
  const occasions = Object.keys(OCCASIONS) as OccasionSlug[];
  return occasions.map((occasion) => ({ occasion }));
}

export async function generateMetadata({ params }: OccasionPageProps): Promise<Metadata> {
  const cityConfig = getCityConfig(params.state, params.city);
  const occasion = OCCASIONS[params.occasion as OccasionSlug];

  if (!cityConfig || !occasion) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const basePath = getCityPath(cityConfig);
  const canonicalUrl = `${siteUrl}${basePath}/flowers/${params.occasion}/`;

  const description = occasion.metaDescription.replace('{cityName}', cityConfig.cityName);

  return {
    title: `${occasion.title} in ${cityConfig.cityName}, ${cityConfig.stateAbbr}`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${occasion.title} - ${cityConfig.cityName} Delivery`,
      description,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

export default function OccasionPage({ params }: OccasionPageProps) {
  const cityConfig = getCityConfig(params.state, params.city);
  const occasion = OCCASIONS[params.occasion as OccasionSlug];

  if (!cityConfig || !occasion) {
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
        name: occasion.title,
        item: `${siteUrl}${basePath}/flowers/${params.occasion}`,
      },
    ],
  };

  // Collection/ItemList Schema for product grid
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${occasion.title} - ${cityConfig.cityName} Flower Delivery`,
    description: getOccasionIntro(params.occasion as OccasionSlug, cityConfig.cityName),
    url: `${siteUrl}${basePath}/flowers/${params.occasion}`,
    mainEntity: {
      '@type': 'ItemList',
      name: occasion.title,
      description: occasion.description,
      numberOfItems: 12,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
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
            <li className="text-forest-900 font-medium">{occasion.title}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-cream-50 to-white py-12 lg:py-16">
        <div className="container-wide">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-forest-900 mb-4">
            {occasion.title} in {cityConfig.cityName}
          </h1>
          <p className="text-lg text-forest-800/60 max-w-2xl">
            {getOccasionIntro(params.occasion as OccasionSlug, cityConfig.cityName)}
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 lg:py-16">
        <div className="container-wide">
          <DynamicProductGrid
            basePath={basePath}
            occasion={params.occasion}
            count={12}
          />
        </div>
      </section>

      {/* Occasion-specific info */}
      <section className="py-12 lg:py-16 bg-cream-50">
        <div className="container-narrow">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-forest-900 mb-6">
            About {occasion.name} Flowers in {cityConfig.cityName}
          </h2>
          <div className="prose prose-forest max-w-none text-forest-800/70">
            {getOccasionContent(params.occasion as OccasionSlug, cityConfig)}
          </div>
        </div>
      </section>

      {/* Related occasions */}
      <section className="py-12 lg:py-16">
        <div className="container-wide">
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6">
            Other Occasions
          </h2>
          <div className="flex flex-wrap gap-3">
            {Object.values(OCCASIONS)
              .filter((o) => o.slug !== params.occasion)
              .map((o) => (
                <Link
                  key={o.slug}
                  href={`${basePath}/flowers/${o.slug}`}
                  className="px-5 py-2.5 rounded-full border border-cream-300 text-forest-800
                           hover:border-sage-300 hover:bg-sage-50 transition-all duration-200"
                >
                  {o.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}

function getOccasionIntro(occasion: OccasionSlug, cityName: string): string {
  const intros: Record<OccasionSlug, string> = {
    birthday: `Make their birthday unforgettable with fresh flower delivery in ${cityName}. From vibrant mixed bouquets to elegant rose arrangements, we have the perfect gift to celebrate their special day.`,
    sympathy: `Express your condolences with thoughtful sympathy flowers delivered throughout ${cityName}. We offer funeral sprays, standing arrangements, and comforting plants for homes and services.`,
    anniversary: `Celebrate your love story with romantic anniversary flowers delivered in ${cityName}. Choose from classic red roses, mixed arrangements, or contemporary designs to mark your special milestone.`,
    'get-well': `Brighten their day and lift their spirits with cheerful get-well flowers delivered to homes and hospitals across ${cityName}. We deliver to all major medical centers.`,
    'thank-you': `Show your gratitude with beautiful thank-you flowers delivered in ${cityName}. Perfect for teachers, caregivers, hosts, or anyone who deserves a special thank you.`,
  };
  return intros[occasion];
}

function getOccasionContent(
  occasion: OccasionSlug,
  cityConfig: { cityName: string; hospitals: string[]; neighborhoods: string[] }
): React.ReactNode {
  switch (occasion) {
    case 'sympathy':
      return (
        <>
          <p>
            During difficult times, flowers can offer comfort and express what words
            cannot. Our sympathy arrangements are designed with care and delivered
            with respect throughout {cityConfig.cityName}.
          </p>
          <p>
            We deliver funeral flowers to all {cityConfig.cityName} funeral homes and
            memorial services. For home delivery, we ensure arrangements arrive at
            the appropriate time with a personal card message.
          </p>
        </>
      );
    case 'get-well':
      return (
        <>
          <p>
            A cheerful bouquet can make all the difference during recovery. We
            deliver get-well flowers to all major {cityConfig.cityName} hospitals
            including {cityConfig.hospitals.slice(0, 3).join(', ')}.
          </p>
          <p>
            Please note: Some hospital rooms may have flower restrictions. We
            recommend calling ahead or choosing one of our plant options for ICU
            or allergy-sensitive patients.
          </p>
        </>
      );
    default:
      return (
        <p>
          Whether you&apos;re celebrating in {cityConfig.neighborhoods.slice(0, 3).join(', ')}{' '}
          or anywhere else in {cityConfig.cityName}, our local florist partners ensure
          fresh, beautiful arrangements delivered right on time.
        </p>
      );
  }
}
