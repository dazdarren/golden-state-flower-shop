import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityConfig, getAllCityPaths } from '@/data/cities';
import { getBlogPost, getAllBlogSlugs, getRelatedBlogPosts } from '@/data/blogPosts';
import { getGuideBySlug } from '@/data/guides';
import NewsletterSignup from '@/components/NewsletterSignup';

interface BlogPostPageProps {
  params: {
    state: string;
    city: string;
    slug: string;
  };
}

export function generateStaticParams() {
  const cityPaths = getAllCityPaths();
  const blogSlugs = getAllBlogSlugs();

  const params: { state: string; city: string; slug: string }[] = [];

  cityPaths.forEach(({ state, city }) => {
    blogSlugs.forEach((slug) => {
      params.push({ state, city, slug });
    });
  });

  return params;
}

// Helper to localize content with city name
function localize(text: string | undefined, cityName: string): string {
  if (!text) return '';
  return text.replace(/\{cityName\}/g, cityName);
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = getBlogPost(params.slug);
  const cityConfig = getCityConfig(params.state, params.city);

  if (!post || !cityConfig) {
    return { title: 'Blog Post Not Found' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com';
  const basePath = `/${cityConfig.stateSlug}/${cityConfig.citySlug}`;
  const canonicalUrl = `${siteUrl}${basePath}/blog/${post.slug}`;

  // Use localized title/excerpt if available
  const displayTitle = post.localTitle
    ? localize(post.localTitle, cityConfig.cityName)
    : post.title;
  const displayExcerpt = post.localExcerpt
    ? localize(post.localExcerpt, cityConfig.cityName)
    : post.excerpt;

  return {
    title: `${displayTitle} | ${cityConfig.cityName} Flower Blog`,
    description: displayExcerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: displayTitle,
      description: displayExcerpt,
      url: canonicalUrl,
      siteName: 'Golden State Flower Shop',
      images: [
        {
          url: post.image,
          width: 1200,
          height: 675,
          alt: displayTitle,
        },
      ],
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.dateModified || post.publishedAt,
      authors: ['Golden State Flower Shop'],
    },
    twitter: {
      card: 'summary_large_image',
      title: displayTitle,
      description: displayExcerpt,
      images: [post.image],
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const cityConfig = getCityConfig(params.state, params.city);
  const post = getBlogPost(params.slug);

  if (!cityConfig || !post) {
    notFound();
  }

  const basePath = `/${cityConfig.stateSlug}/${cityConfig.citySlug}`;
  const relatedPosts = getRelatedBlogPosts(post.slug, 2);

  // Get the primary related guide for this blog post
  const primaryGuide = post.relatedGuides?.[0]
    ? getGuideBySlug(post.relatedGuides[0])
    : null;

  // Localized content
  const displayTitle = post.localTitle
    ? localize(post.localTitle, cityConfig.cityName)
    : post.title;
  const localIntro = post.localIntro
    ? localize(post.localIntro, cityConfig.cityName)
    : null;
  const localOutro = post.localOutro
    ? localize(post.localOutro, cityConfig.cityName)
    : null;

  // Helper to parse inline bold markdown
  const parseInlineFormatting = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIndex = 0;

    while (remaining.length > 0) {
      const boldStart = remaining.indexOf('**');
      if (boldStart === -1) {
        parts.push(remaining);
        break;
      }

      // Add text before bold
      if (boldStart > 0) {
        parts.push(remaining.slice(0, boldStart));
      }

      // Find closing **
      const boldEnd = remaining.indexOf('**', boldStart + 2);
      if (boldEnd === -1) {
        parts.push(remaining);
        break;
      }

      // Add bold text
      const boldText = remaining.slice(boldStart + 2, boldEnd);
      parts.push(<strong key={keyIndex++} className="text-forest-900">{boldText}</strong>);
      remaining = remaining.slice(boldEnd + 2);
    }

    return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts;
  };

  // Convert markdown-like content to HTML
  const formatContent = (content: string) => {
    const elements: React.ReactNode[] = [];
    let keyIndex = 0;

    content.split('\n\n').forEach((paragraph) => {
      // Check if paragraph has a header with following content
      if (paragraph.startsWith('## ') || paragraph.startsWith('### ')) {
        const lines = paragraph.split('\n');
        const headerLine = lines[0];
        const restLines = lines.slice(1).join('\n').trim();

        // Render header
        if (headerLine.startsWith('## ')) {
          elements.push(
            <h2 key={keyIndex++} className="font-display text-2xl font-semibold text-forest-900 mt-10 mb-4">
              {parseInlineFormatting(headerLine.replace('## ', ''))}
            </h2>
          );
        } else {
          elements.push(
            <h3 key={keyIndex++} className="font-display text-xl font-semibold text-forest-900 mt-8 mb-3">
              {parseInlineFormatting(headerLine.replace('### ', ''))}
            </h3>
          );
        }

        // Render following content if any
        if (restLines) {
          // Check if it's a list
          if (restLines.startsWith('- ')) {
            const items = restLines.split('\n').filter(Boolean);
            elements.push(
              <ul key={keyIndex++} className="list-disc list-inside text-forest-800/80 space-y-2 mb-6 ml-4">
                {items.map((item, i) => (
                  <li key={i}>{parseInlineFormatting(item.replace('- ', ''))}</li>
                ))}
              </ul>
            );
          } else {
            elements.push(
              <p key={keyIndex++} className="text-forest-800/80 leading-relaxed mb-4">
                {parseInlineFormatting(restLines)}
              </p>
            );
          }
        }
        return;
      }

      // Lists
      if (paragraph.startsWith('- ')) {
        const items = paragraph.split('\n').filter(Boolean);
        elements.push(
          <ul key={keyIndex++} className="list-disc list-inside text-forest-800/80 space-y-2 mb-6 ml-4">
            {items.map((item, i) => (
              <li key={i}>{parseInlineFormatting(item.replace('- ', ''))}</li>
            ))}
          </ul>
        );
        return;
      }

      // Numbered lists
      if (/^\d+\./.test(paragraph)) {
        const items = paragraph.split('\n').filter(Boolean);
        elements.push(
          <ol key={keyIndex++} className="list-decimal list-inside text-forest-800/80 space-y-2 mb-6 ml-4">
            {items.map((item, i) => (
              <li key={i}>{parseInlineFormatting(item.replace(/^\d+\.\s*/, ''))}</li>
            ))}
          </ol>
        );
        return;
      }

      // Regular paragraphs
      elements.push(
        <p key={keyIndex++} className="text-forest-800/80 leading-relaxed mb-4">
          {parseInlineFormatting(paragraph)}
        </p>
      );
    });

    return elements;
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com';
  const canonicalUrl = `${siteUrl}${basePath}/blog/${post.slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: displayTitle,
    description: post.localExcerpt ? localize(post.localExcerpt, cityConfig.cityName) : post.excerpt,
    image: post.image,
    author: {
      '@type': 'Organization',
      name: 'Golden State Flower Shop',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Golden State Flower Shop',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.png`,
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.dateModified || post.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };

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
        name: 'Blog',
        item: `${siteUrl}${basePath}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: displayTitle,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <div className="bg-cream-50">
      {/* Article JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* BreadcrumbList JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="bg-white py-3 border-b border-cream-200">
        <div className="container-wide">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href={basePath} className="text-forest-800/60 hover:text-sage-600 transition-colors">
                {cityConfig.cityName}
              </Link>
            </li>
            <li className="text-forest-800/30">/</li>
            <li>
              <Link href={`${basePath}/blog`} className="text-forest-800/60 hover:text-sage-600 transition-colors">
                Blog
              </Link>
            </li>
            <li className="text-forest-800/30">/</li>
            <li className="text-forest-900 font-medium line-clamp-1">{displayTitle}</li>
          </ol>
        </div>
      </nav>

      {/* Article */}
      <article className="py-12">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <header className="mb-10">
              <span className="text-sage-600 text-sm font-medium uppercase tracking-wider">
                {post.category}
              </span>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-forest-900 mt-3 mb-6">
                {displayTitle}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-forest-800/60">
                <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span>•</span>
                <span>{post.readTime} min read</span>
              </div>
            </header>

            {/* Featured Image */}
            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-10 border border-cream-200">
              <img
                src={post.image}
                alt={displayTitle}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="prose-forest">
              {/* Local intro for city-specific content */}
              {localIntro && (
                <div className="bg-sage-50 border-l-4 border-sage-400 p-6 rounded-r-xl mb-8">
                  <p className="text-forest-800 leading-relaxed m-0">
                    {localIntro}
                  </p>
                </div>
              )}

              {formatContent(post.content)}

              {/* Local outro for city-specific CTA */}
              {localOutro && (
                <div className="bg-cream-100 border border-cream-300 p-6 rounded-xl mt-10">
                  <p className="text-forest-800 leading-relaxed m-0 font-medium">
                    {localOutro}
                  </p>
                </div>
              )}

              {/* Related Guide Callout */}
              {primaryGuide && (
                <Link
                  href={`${basePath}/guides/${primaryGuide.slug}`}
                  className="block mt-10 p-6 bg-gradient-to-br from-sage-50 to-cream-50 rounded-xl border border-sage-200 hover:border-sage-300 transition-colors group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center flex-shrink-0 group-hover:bg-sage-200 transition-colors">
                      <svg className="w-6 h-6 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-medium text-sage-600 uppercase tracking-wider">Related Guide</span>
                      <h3 className="font-display text-lg font-semibold text-forest-900 mt-1 group-hover:text-sage-700 transition-colors">
                        {primaryGuide.title}
                      </h3>
                      <p className="text-sm text-forest-800/60 mt-1 line-clamp-2">
                        {primaryGuide.excerpt.replace(/{cityName}/g, cityConfig.cityName)}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-sage-400 group-hover:text-sage-600 transition-colors mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              )}
            </div>

            {/* Tags */}
            <div className="mt-10 pt-8 border-t border-cream-200">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-cream-100 text-forest-800/70 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="mt-8 flex items-center gap-4">
              <span className="text-sm text-forest-800/60">Share this article:</span>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-forest-800/60 hover:bg-sage-100 hover:text-sage-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-forest-800/60 hover:bg-sage-100 hover:text-sage-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-forest-800/60 hover:bg-sage-100 hover:text-sage-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 bg-white border-t border-cream-200">
          <div className="container-wide">
            <h2 className="font-display text-2xl font-semibold text-forest-900 mb-8">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`${basePath}/blog/${relatedPost.slug}`}
                  className="group flex gap-6 bg-cream-50 rounded-xl p-4 border border-cream-200 hover:border-sage-300 transition-colors"
                >
                  <div className="w-32 h-24 rounded-lg flex-shrink-0 overflow-hidden">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sage-600 text-xs font-medium uppercase tracking-wider">
                      {relatedPost.category}
                    </span>
                    <h3 className="font-display text-lg font-semibold text-forest-900 mt-1 mb-2 group-hover:text-sage-700 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <span className="text-sm text-forest-800/50">{relatedPost.readTime} min read</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-16 bg-cream-50">
        <div className="container-wide">
          <div className="max-w-xl mx-auto">
            <NewsletterSignup variant="card" source="blog" />
          </div>
        </div>
      </section>
    </div>
  );
}
