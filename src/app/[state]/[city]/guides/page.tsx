import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityConfig, getCityPath, getAllCityPaths } from '@/data/cities';
import { GUIDES, getAllCategories, getFeaturedGuides } from '@/data/guides';
import GuideCard from '@/components/GuideCard';

interface GuidesPageProps {
  params: {
    state: string;
    city: string;
  };
}

export function generateStaticParams() {
  return getAllCityPaths();
}

export async function generateMetadata({ params }: GuidesPageProps): Promise<Metadata> {
  const cityConfig = getCityConfig(params.state, params.city);
  if (!cityConfig) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com';
  const basePath = getCityPath(cityConfig);
  const canonicalUrl = `${siteUrl}${basePath}/guides/`;
  const ogImageUrl = `${siteUrl}/images/og-default.svg`;

  const title = `Flower Guides & Tips | ${cityConfig.cityName} Flower Delivery`;
  const description = `Expert flower care guides, etiquette tips, and delivery advice for ${cityConfig.cityName}. Learn how to keep flowers fresh, choose the right arrangement, and more.`;

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
      siteName: 'Golden State Flower Shop',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'Flower care guides and tips',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Flower Guides | ${cityConfig.cityName}`,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function GuidesPage({ params }: GuidesPageProps) {
  const cityConfig = getCityConfig(params.state, params.city);

  if (!cityConfig) {
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
        name: 'Guides',
        item: `${siteUrl}${basePath}/guides`,
      },
    ],
  };

  // CollectionPage Schema
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Flower Guides & Tips - ${cityConfig.cityName}`,
    description: `Expert flower care guides and tips for ${cityConfig.cityName} residents.`,
    url: `${siteUrl}${basePath}/guides`,
    mainEntity: {
      '@type': 'ItemList',
      name: 'Flower Guides',
      numberOfItems: GUIDES.length,
      itemListElement: GUIDES.map((guide, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: guide.title,
        url: `${siteUrl}${basePath}/guides/${guide.slug}`,
      })),
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
            <li className="text-forest-900 font-medium">Guides</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-cream-50 via-white to-sage-50 py-12 lg:py-16">
        <div className="container-wide">
          <div className="max-w-2xl">
            <span className="text-sage-600 text-sm font-medium uppercase tracking-widest">
              Expert Advice
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-forest-900 mt-4 mb-4">
              Flower Guides & Tips
            </h1>
            <p className="text-lg text-forest-800/60">
              Expert advice on flower care, etiquette, and choosing the perfect arrangement.
              Tailored for {cityConfig.cityName} residents.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      <section className="py-12 lg:py-16">
        <div className="container-wide">
          <div className="flex items-center gap-3 mb-8">
            <svg className="w-6 h-6 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <h2 className="font-display text-2xl font-semibold text-forest-900">
              Popular Guides
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {getFeaturedGuides(3).map((guide) => (
              <GuideCard key={guide.slug} guide={guide} basePath={basePath} />
            ))}
          </div>
        </div>
      </section>

      {/* All Guides by Category */}
      <section className="py-12 lg:py-16 bg-cream-50">
        <div className="container-wide">
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-8">
            All Guides
          </h2>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-10">
            {getAllCategories().map((category) => (
              <span
                key={category}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-cream-200 text-forest-800"
              >
                {category}
              </span>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GUIDES.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} basePath={basePath} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-16 bg-cream-50">
        <div className="container-narrow text-center">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-forest-900 mb-4">
            Ready to Order Flowers?
          </h2>
          <p className="text-forest-800/60 mb-8 max-w-xl mx-auto">
            Put your new knowledge to use! Browse our beautiful arrangements for same-day
            delivery throughout {cityConfig.cityName}.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={`${basePath}/flowers/birthday`} className="btn-primary">
              Shop Birthday Flowers
            </Link>
            <Link href={`${basePath}/flowers/sympathy`} className="btn-secondary">
              Sympathy Arrangements
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
