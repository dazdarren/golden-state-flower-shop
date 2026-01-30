import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityConfig, getAllCityPaths } from '@/data/cities';
import { getBlogPost, getAllBlogSlugs, getRecentPosts } from '@/data/blogPosts';
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

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = getBlogPost(params.slug);
  const cityConfig = getCityConfig(params.state, params.city);

  if (!post || !cityConfig) {
    return { title: 'Blog Post Not Found' };
  }

  return {
    title: `${post.title} | ${cityConfig.cityName} Flower Blog`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const cityConfig = getCityConfig(params.state, params.city);
  const post = getBlogPost(params.slug);

  if (!cityConfig || !post) {
    notFound();
  }

  const basePath = `/${cityConfig.stateSlug}/${cityConfig.citySlug}`;
  const recentPosts = getRecentPosts(3).filter((p) => p.slug !== post.slug).slice(0, 2);

  // Convert markdown-like content to HTML
  const formatContent = (content: string) => {
    return content
      .split('\n\n')
      .map((paragraph, idx) => {
        // Headers
        if (paragraph.startsWith('## ')) {
          return (
            <h2 key={idx} className="font-display text-2xl font-semibold text-forest-900 mt-10 mb-4">
              {paragraph.replace('## ', '')}
            </h2>
          );
        }
        if (paragraph.startsWith('### ')) {
          return (
            <h3 key={idx} className="font-display text-xl font-semibold text-forest-900 mt-8 mb-3">
              {paragraph.replace('### ', '')}
            </h3>
          );
        }
        // Bold text formatting
        if (paragraph.startsWith('**') && paragraph.includes(':**')) {
          const [boldPart, rest] = paragraph.split(':**');
          return (
            <p key={idx} className="text-forest-800/80 leading-relaxed mb-4">
              <strong className="text-forest-900">{boldPart.replace('**', '')}:</strong>
              {rest}
            </p>
          );
        }
        // Lists
        if (paragraph.startsWith('- ')) {
          const items = paragraph.split('\n').filter(Boolean);
          return (
            <ul key={idx} className="list-disc list-inside text-forest-800/80 space-y-2 mb-6 ml-4">
              {items.map((item, i) => (
                <li key={i}>{item.replace('- ', '')}</li>
              ))}
            </ul>
          );
        }
        // Numbered lists
        if (/^\d+\./.test(paragraph)) {
          const items = paragraph.split('\n').filter(Boolean);
          return (
            <ol key={idx} className="list-decimal list-inside text-forest-800/80 space-y-2 mb-6 ml-4">
              {items.map((item, i) => (
                <li key={i}>{item.replace(/^\d+\.\s*/, '')}</li>
              ))}
            </ol>
          );
        }
        // Regular paragraphs
        return (
          <p key={idx} className="text-forest-800/80 leading-relaxed mb-4">
            {paragraph}
          </p>
        );
      });
  };

  return (
    <div className="bg-cream-50">
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
            <li className="text-forest-900 font-medium line-clamp-1">{post.title}</li>
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
                {post.title}
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
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="prose-forest">
              {formatContent(post.content)}
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
      {recentPosts.length > 0 && (
        <section className="py-12 bg-white border-t border-cream-200">
          <div className="container-wide">
            <h2 className="font-display text-2xl font-semibold text-forest-900 mb-8">
              More Articles You Might Like
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {recentPosts.map((relatedPost) => (
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
