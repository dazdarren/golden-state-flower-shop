import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityConfig, getCityPath } from '@/data/cities';
import { PRODUCT_TYPES, getProductTypeBySlug, CategoryConfig } from '@/data/categories';
import DynamicProductGrid from '@/components/DynamicProductGrid';

interface ProductTypePageProps {
  params: {
    state: string;
    city: string;
    'product-type': string;
  };
}

// Generate static params for all product type pages
export function generateStaticParams() {
  return PRODUCT_TYPES.map((type) => ({ 'product-type': type.slug }));
}

export async function generateMetadata({ params }: ProductTypePageProps): Promise<Metadata> {
  const cityConfig = getCityConfig(params.state, params.city);
  const productType = getProductTypeBySlug(params['product-type']);

  if (!cityConfig || !productType) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const basePath = getCityPath(cityConfig);
  const canonicalUrl = `${siteUrl}${basePath}/shop/${params['product-type']}/`;

  const description = productType.metaDescription.replace('{cityName}', cityConfig.cityName);

  return {
    title: `${productType.title} in ${cityConfig.cityName}, ${cityConfig.stateAbbr}`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${productType.title} - ${cityConfig.cityName} Delivery`,
      description,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

export default function ProductTypePage({ params }: ProductTypePageProps) {
  const cityConfig = getCityConfig(params.state, params.city);
  const productType = getProductTypeBySlug(params['product-type']);

  if (!cityConfig || !productType) {
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
        name: 'Shop',
        item: `${siteUrl}${basePath}/shop`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: productType.title,
        item: `${siteUrl}${basePath}/shop/${params['product-type']}`,
      },
    ],
  };

  // Collection Schema with AggregateOffer
  const priceRange = productType.priceRange;
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${productType.title} - ${cityConfig.cityName} Flower Delivery`,
    description: productType.description,
    url: `${siteUrl}${basePath}/shop/${params['product-type']}`,
    mainEntity: {
      '@type': 'ItemList',
      name: productType.title,
      description: productType.description,
      numberOfItems: 12,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
    },
    ...(priceRange && {
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: priceRange.low.toFixed(2),
        highPrice: priceRange.high.toFixed(2),
        priceCurrency: 'USD',
        offerCount: 12,
        availability: 'https://schema.org/InStock',
      },
    }),
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
            <li>
              <span className="text-forest-800/40">Shop</span>
            </li>
            <li>/</li>
            <li className="text-forest-900 font-medium">{productType.name}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className={`py-12 lg:py-16 ${getProductTypeGradient(params['product-type'])}`}>
        <div className="container-wide">
          <div className="flex items-center gap-4 mb-4">
            {getProductTypeIcon(params['product-type'])}
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-forest-900">
              {productType.title}
            </h1>
          </div>
          <p className="text-lg text-forest-800/60 max-w-2xl">
            {getProductTypeIntro(params['product-type'], cityConfig.cityName)}
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 lg:py-16">
        <div className="container-wide">
          <DynamicProductGrid
            basePath={basePath}
            occasion={params['product-type']}
            count={12}
            showFilters={true}
          />
        </div>
      </section>

      {/* Product Type Info */}
      <section className="py-12 lg:py-16 bg-cream-50">
        <div className="container-narrow">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-forest-900 mb-6">
            About {productType.name} in {cityConfig.cityName}
          </h2>
          <div className="prose prose-forest max-w-none text-forest-800/70">
            {getProductTypeContent(params['product-type'], cityConfig)}
          </div>
        </div>
      </section>

      {/* Related Product Types */}
      <section className="py-12 lg:py-16">
        <div className="container-wide">
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6">
            More Ways to Shop
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PRODUCT_TYPES.filter((t) => t.slug !== params['product-type']).map((type) => (
              <Link
                key={type.slug}
                href={`${basePath}/shop/${type.slug}`}
                className="group p-6 rounded-2xl bg-cream-50 border border-cream-200 hover:border-sage-300 hover:shadow-soft transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 shadow-soft group-hover:scale-110 transition-transform">
                  {getSmallProductTypeIcon(type.slug)}
                </div>
                <h3 className="font-display text-lg font-medium text-forest-900 mb-1">{type.name}</h3>
                <p className="text-sm text-forest-800/50 line-clamp-2">{type.description.split('.')[0]}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function getProductTypeGradient(slug: string): string {
  const gradients: Record<string, string> = {
    plants: 'bg-gradient-to-br from-sage-50 to-cream-50',
    'rose-bouquets': 'bg-gradient-to-br from-rose-50 to-cream-50',
    'mixed-arrangements': 'bg-gradient-to-br from-amber-50 to-cream-50',
    'premium-collection': 'bg-gradient-to-br from-gold-50 to-cream-50',
    centerpieces: 'bg-gradient-to-br from-amber-50 to-cream-50',
    'vase-arrangements': 'bg-gradient-to-br from-sky-50 to-cream-50',
    'exotic-flowers': 'bg-gradient-to-br from-purple-50 to-cream-50',
    balloons: 'bg-gradient-to-br from-pink-50 to-cream-50',
    'one-of-a-kind': 'bg-gradient-to-br from-indigo-50 to-cream-50',
  };
  return gradients[slug] || 'bg-gradient-to-br from-cream-50 to-white';
}

function getProductTypeIcon(slug: string): JSX.Element {
  const icons: Record<string, JSX.Element> = {
    plants: (
      <div className="w-14 h-14 rounded-2xl bg-sage-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      </div>
    ),
    'rose-bouquets': (
      <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
    ),
    'mixed-arrangements': (
      <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      </div>
    ),
    'premium-collection': (
      <div className="w-14 h-14 rounded-2xl bg-gold-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </div>
    ),
    centerpieces: (
      <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      </div>
    ),
    'vase-arrangements': (
      <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
    ),
    'exotic-flowers': (
      <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      </div>
    ),
    balloons: (
      <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 3c-2.76 0-5 2.69-5 6 0 2.76 1.79 5.1 4.25 5.79V18H9v2h6v-2h-2.25v-3.21C15.21 14.1 17 11.76 17 9c0-3.31-2.24-6-5-6z" />
        </svg>
      </div>
    ),
    'one-of-a-kind': (
      <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
    ),
  };
  return icons[slug] || icons['plants'];
}

function getSmallProductTypeIcon(slug: string): JSX.Element {
  const icons: Record<string, JSX.Element> = {
    plants: (
      <svg className="w-6 h-6 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    'rose-bouquets': (
      <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    'mixed-arrangements': (
      <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    'premium-collection': (
      <svg className="w-6 h-6 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    centerpieces: (
      <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    'vase-arrangements': (
      <svg className="w-6 h-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    'exotic-flowers': (
      <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    balloons: (
      <svg className="w-6 h-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 3c-2.76 0-5 2.69-5 6 0 2.76 1.79 5.1 4.25 5.79V18H9v2h6v-2h-2.25v-3.21C15.21 14.1 17 11.76 17 9c0-3.31-2.24-6-5-6z" />
      </svg>
    ),
    'one-of-a-kind': (
      <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  };
  return icons[slug] || icons['plants'];
}

function getProductTypeIntro(slug: string, cityName: string): string {
  const intros: Record<string, string> = {
    plants: `Discover our collection of long-lasting plants and succulents for delivery in ${cityName}. From lush green potted plants to trendy succulents, find the perfect living gift that keeps on growing.`,
    'rose-bouquets': `Express your feelings with classic rose bouquets delivered in ${cityName}. Choose from red, pink, white, yellow, and mixed rose arrangements - the timeless choice for any occasion.`,
    'mixed-arrangements': `Explore our vibrant mixed flower arrangements for delivery throughout ${cityName}. These colorful bouquets combine the best seasonal blooms for a stunning, varied display.`,
    'premium-collection': `Indulge in our luxury premium flower collection, featuring the finest blooms and expert craftsmanship. These exceptional arrangements are perfect for making a lasting impression in ${cityName}.`,
    centerpieces: `Stunning floral centerpieces for tables and events in ${cityName}. Perfect for dinner parties, weddings, corporate events, and special occasions. Make your gathering unforgettable.`,
    'vase-arrangements': `Beautiful flowers in elegant vases delivered in ${cityName}. Ready to display with no additional vase needed - the perfect hassle-free gift that arrives complete.`,
    'exotic-flowers': `Discover unique tropical and exotic flower arrangements in ${cityName}. Orchids, birds of paradise, anthuriums, and rare blooms that make a distinctive statement.`,
    balloons: `Festive balloon bouquets delivered in ${cityName}. Add joy to birthdays, congratulations, get well wishes, and celebrations with colorful balloon arrangements.`,
    'one-of-a-kind': `Let our expert florists create something truly special in ${cityName}. Designer-choice arrangements using the freshest available blooms - each one unique and stunning.`,
  };
  return intros[slug] || '';
}

function getProductTypeContent(
  slug: string,
  cityConfig: { cityName: string; neighborhoods: string[] }
): React.ReactNode {
  switch (slug) {
    case 'plants':
      return (
        <>
          <p>
            Plants make wonderful gifts that last far beyond fresh-cut flowers. Our collection
            includes easy-care options perfect for both green thumbs and beginners. From air-purifying
            pothos to elegant orchids, find the ideal plant for any {cityConfig.cityName} home or office.
          </p>
          <p>
            We deliver plants throughout {cityConfig.cityName}, including {cityConfig.neighborhoods.slice(0, 3).join(', ')}.
            Each plant arrives carefully packaged with care instructions to help it thrive in its new home.
          </p>
        </>
      );
    case 'rose-bouquets':
      return (
        <>
          <p>
            Roses have been the symbol of love and elegance for centuries. Our rose bouquets
            are crafted with premium long-stem roses, perfect for anniversaries, romantic
            gestures, or simply to brighten someone&apos;s day in {cityConfig.cityName}.
          </p>
          <p>
            Each rose arrangement is hand-designed by local artisan florists who understand
            the importance of every petal. Choose from classic red, soft pink, pure white,
            cheerful yellow, or stunning mixed rose bouquets.
          </p>
        </>
      );
    case 'mixed-arrangements':
      return (
        <>
          <p>
            Our mixed flower arrangements bring together the best of each season in stunning,
            colorful combinations. These versatile bouquets are perfect for birthdays, thank you
            gifts, or whenever you want to send a cheerful surprise in {cityConfig.cityName}.
          </p>
          <p>
            Each mixed arrangement is thoughtfully designed to create visual harmony while
            showcasing the natural beauty of multiple flower varieties. Delivery is available
            to all {cityConfig.cityName} neighborhoods.
          </p>
        </>
      );
    case 'premium-collection':
      return (
        <>
          <p>
            Our premium collection represents the pinnacle of floral artistry. These luxury
            arrangements feature the finest imported blooms, exotic flowers, and meticulous
            attention to detail that sets them apart.
          </p>
          <p>
            Perfect for special occasions, corporate gifts, or when only the best will do.
            Premium arrangements in {cityConfig.cityName} include complimentary gift packaging
            and a personalized card to make your gift truly memorable.
          </p>
        </>
      );
    case 'centerpieces':
      return (
        <>
          <p>
            Our floral centerpieces are designed to be the star of any table setting. Whether
            you&apos;re hosting a dinner party, wedding reception, or corporate event in {cityConfig.cityName},
            these arrangements create an elegant focal point.
          </p>
          <p>
            Each centerpiece is crafted to complement your decor and occasion. Low arrangements
            allow for easy conversation across the table, while taller designs make impressive
            statements at buffets and display areas.
          </p>
        </>
      );
    case 'vase-arrangements':
      return (
        <>
          <p>
            Our vase arrangements arrive ready to display - no need for the recipient to find
            a container. Each bouquet is expertly arranged in an elegant vase that complements
            the flowers perfectly.
          </p>
          <p>
            The ideal hassle-free gift for any occasion in {cityConfig.cityName}. From sleek
            modern designs to classic crystal vases, we select containers that enhance each
            arrangement&apos;s beauty.
          </p>
        </>
      );
    case 'exotic-flowers':
      return (
        <>
          <p>
            Make a bold statement with our exotic flower collection. Featuring tropical orchids,
            birds of paradise, anthuriums, proteas, and other unique blooms that stand out
            from traditional arrangements.
          </p>
          <p>
            These distinctive flowers are perfect for those who appreciate the unusual and
            beautiful. Delivery available throughout {cityConfig.cityName} with special care
            to protect these precious blooms.
          </p>
        </>
      );
    case 'balloons':
      return (
        <>
          <p>
            Add extra joy to any celebration with our balloon bouquets. Perfect for birthdays,
            congratulations, get well wishes, new baby celebrations, and more. Available for
            same-day delivery in {cityConfig.cityName}.
          </p>
          <p>
            Our balloon arrangements feature high-quality helium balloons that stay festive
            for days. Combine with flowers for an extra special surprise that&apos;s sure to
            bring smiles.
          </p>
        </>
      );
    case 'one-of-a-kind':
      return (
        <>
          <p>
            Trust our talented florists to create something truly special. Designer-choice
            arrangements let our experts showcase their creativity using the freshest and
            most beautiful blooms available that day.
          </p>
          <p>
            Perfect when you want a unique gift that no one else will have. Each one-of-a-kind
            arrangement in {cityConfig.cityName} is a personal work of art, tailored to
            your budget and the occasion.
          </p>
        </>
      );
    default:
      return (
        <p>
          Explore our curated collection of floral arrangements, designed to bring joy
          to any recipient in {cityConfig.cityName}. Same-day delivery available for orders
          placed before 2pm.
        </p>
      );
  }
}
