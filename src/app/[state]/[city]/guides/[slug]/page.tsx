import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityConfig, getCityPath, getAllCityPaths } from '@/data/cities';
import { GUIDES, getGuideBySlug, getRelatedGuides } from '@/data/guides';
import { getBlogPostsByGuide } from '@/data/blogPosts';
import GuideCard from '@/components/GuideCard';

interface GuidePageProps {
  params: {
    state: string;
    city: string;
    slug: string;
  };
}

export function generateStaticParams() {
  const cityPaths = getAllCityPaths();
  const guideSlugs = GUIDES.map((g) => g.slug);

  return cityPaths.flatMap((city) =>
    guideSlugs.map((slug) => ({
      ...city,
      slug,
    }))
  );
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const cityConfig = getCityConfig(params.state, params.city);
  const guide = getGuideBySlug(params.slug);

  if (!cityConfig || !guide) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com';
  const basePath = getCityPath(cityConfig);
  const canonicalUrl = `${siteUrl}${basePath}/guides/${params.slug}/`;
  const ogImageUrl = `${siteUrl}/images/og-default.svg`;

  const title = guide.metaTitle.replace('{cityName}', cityConfig.cityName);
  const description = guide.metaDescription.replace('{cityName}', cityConfig.cityName);

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
          alt: guide.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function GuidePage({ params }: GuidePageProps) {
  const cityConfig = getCityConfig(params.state, params.city);
  const guide = getGuideBySlug(params.slug);

  if (!cityConfig || !guide) {
    notFound();
  }

  const basePath = getCityPath(cityConfig);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com';
  const relatedGuides = getRelatedGuides(params.slug, 3);

  // Get blog posts that link to this guide
  const relatedBlogPosts = getBlogPostsByGuide(params.slug);

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
      {
        '@type': 'ListItem',
        position: 4,
        name: guide.title,
        item: `${siteUrl}${basePath}/guides/${params.slug}`,
      },
    ],
  };

  // Content Schema based on guide type
  const getContentSchema = () => {
    if (guide.schemaType === 'HowTo' && guide.steps) {
      return {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: guide.title,
        description: guide.excerpt,
        step: guide.steps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.title,
          text: step.description,
        })),
      };
    }

    if (guide.faqs && guide.faqs.length > 0) {
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: guide.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      };
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guide.title,
      description: guide.excerpt,
      author: {
        '@type': 'Organization',
        name: 'Golden State Flower Shop',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Golden State Flower Shop',
        url: siteUrl,
      },
    };
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
          __html: JSON.stringify(getContentSchema()),
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
              <Link href={`${basePath}/guides`} className="hover:text-forest-900 transition-colors">
                Guides
              </Link>
            </li>
            <li>/</li>
            <li className="text-forest-900 font-medium line-clamp-1">{guide.title}</li>
          </ol>
        </div>
      </nav>

      {/* Article Header */}
      <article className="py-12 lg:py-16">
        <div className="container-narrow">
          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-sage-100 text-sage-700">
                {guide.category}
              </span>
              <span className="text-sm text-forest-800/50">{guide.readingTime}</span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-forest-900 mb-6">
              {guide.title}
            </h1>

            <p className="text-lg md:text-xl text-forest-800/70 leading-relaxed">
              {guide.excerpt.replace('{cityName}', cityConfig.cityName)}
            </p>
          </header>

          {/* HowTo Steps */}
          {guide.schemaType === 'HowTo' && guide.steps && (
            <section className="mb-12">
              <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6">
                Step-by-Step Guide
              </h2>
              <ol className="space-y-6">
                {guide.steps.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sage-100 text-sage-700
                                  flex items-center justify-center font-semibold text-lg">
                      {index + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="font-display text-lg font-medium text-forest-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-forest-800/70">
                        {step.description.replace('{cityName}', cityConfig.cityName)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Article Sections */}
          <div className="prose prose-lg prose-forest max-w-none">
            {guide.sections.map((section, index) => (
              <section key={index} className="mb-10">
                <h2 className="font-display text-2xl font-semibold text-forest-900 mb-4">
                  {section.heading}
                </h2>
                <p className="text-forest-800/70 leading-relaxed">
                  {section.content.replace(/{cityName}/g, cityConfig.cityName)}
                </p>
              </section>
            ))}
          </div>

          {/* FAQs */}
          {guide.faqs && guide.faqs.length > 0 && (
            <section className="mt-12 pt-10 border-t border-cream-200">
              <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {guide.faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="group bg-cream-50 rounded-xl border border-cream-200 overflow-hidden"
                  >
                    <summary className="flex justify-between items-center p-5 cursor-pointer list-none">
                      <span className="font-medium text-forest-900 pr-4">
                        {faq.question.replace('{cityName}', cityConfig.cityName)}
                      </span>
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cream-200
                                     flex items-center justify-center text-sage-600
                                     group-open:bg-sage-500 group-open:text-white
                                     transition-colors duration-200">
                        <svg className="w-3 h-3 group-open:rotate-180 transition-transform duration-200"
                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-5 pb-5">
                      <p className="text-forest-800/70">
                        {faq.answer.replace(/{cityName}/g, cityConfig.cityName)}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="mt-12 p-8 bg-gradient-to-br from-sage-50 to-cream-50 rounded-2xl border border-sage-100">
            <h2 className="font-display text-xl font-semibold text-forest-900 mb-3">
              Ready to Order Flowers in {cityConfig.cityName}?
            </h2>
            <p className="text-forest-800/60 mb-6">
              Browse our beautiful arrangements for same-day delivery.
            </p>
            <div className="flex flex-wrap gap-3">
              {guide.relatedOccasions.slice(0, 2).map((occasion) => (
                <Link
                  key={occasion}
                  href={`${basePath}/flowers/${occasion}`}
                  className="btn-primary text-sm"
                >
                  Shop {occasion.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())} Flowers
                </Link>
              ))}
            </div>
          </section>
        </div>
      </article>

      {/* Related Articles */}
      {relatedBlogPosts.length > 0 && (
        <section className="py-12 lg:py-16 bg-white border-t border-cream-200">
          <div className="container-wide">
            <h2 className="font-display text-2xl font-semibold text-forest-900 mb-8">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogPosts.slice(0, 3).map((post) => (
                <Link
                  key={post.slug}
                  href={`${basePath}/blog/${post.slug}`}
                  className="group bg-cream-50 rounded-xl border border-cream-200 hover:border-sage-300 overflow-hidden transition-colors"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-sage-600 text-xs font-medium uppercase tracking-wider">
                      {post.category}
                    </span>
                    <h3 className="font-display text-lg font-semibold text-forest-900 mt-2 mb-2 group-hover:text-sage-700 transition-colors line-clamp-2">
                      {post.localTitle
                        ? post.localTitle.replace(/{cityName}/g, cityConfig.cityName)
                        : post.title}
                    </h3>
                    <p className="text-sm text-forest-800/60 line-clamp-2">
                      {post.localExcerpt
                        ? post.localExcerpt.replace(/{cityName}/g, cityConfig.cityName)
                        : post.excerpt}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-sm text-forest-800/50">
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Guides */}
      {relatedGuides.length > 0 && (
        <section className="py-12 lg:py-16 bg-cream-50">
          <div className="container-wide">
            <h2 className="font-display text-2xl font-semibold text-forest-900 mb-8">
              More Helpful Guides
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedGuides.map((relatedGuide) => (
                <GuideCard key={relatedGuide.slug} guide={relatedGuide} basePath={basePath} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
