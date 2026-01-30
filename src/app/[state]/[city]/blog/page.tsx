import { Metadata } from 'next';
import Link from 'next/link';
import { getCityConfig, getAllCityPaths } from '@/data/cities';
import { blogPosts, getAllCategories } from '@/data/blogPosts';

interface BlogPageProps {
  params: {
    state: string;
    city: string;
  };
}

export function generateStaticParams() {
  return getAllCityPaths();
}

export function generateMetadata({ params }: BlogPageProps): Metadata {
  const cityConfig = getCityConfig(params.state, params.city);

  if (!cityConfig) {
    return { title: 'Blog' };
  }

  return {
    title: `Flower Blog & Tips | ${cityConfig.cityName} Flower Delivery`,
    description: `Expert flower care tips, gift guides, and floral inspiration from ${cityConfig.cityName}'s trusted florists. Learn about flower meanings, occasions, and more.`,
  };
}

export default function BlogPage({ params }: BlogPageProps) {
  const cityConfig = getCityConfig(params.state, params.city);

  if (!cityConfig) {
    return null;
  }

  const basePath = `/${cityConfig.stateSlug}/${cityConfig.citySlug}`;
  const categories = getAllCategories();
  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  return (
    <div className="bg-cream-50">
      {/* Hero */}
      <section className="py-12 md:py-16 bg-white border-b border-cream-200">
        <div className="container-wide">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-forest-900 mb-4">
            Flower Blog & Tips
          </h1>
          <p className="text-lg text-forest-800/70 max-w-2xl">
            Expert advice, gift guides, and floral inspiration from our team of professional florists.
          </p>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-8">
            <span className="px-4 py-2 bg-forest-900 text-cream-100 rounded-full text-sm font-medium">
              All Posts
            </span>
            {categories.map((category) => (
              <span
                key={category}
                className="px-4 py-2 bg-cream-100 text-forest-800 rounded-full text-sm font-medium hover:bg-cream-200 transition-colors cursor-pointer"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12">
        <div className="container-wide">
          <Link
            href={`${basePath}/blog/${featuredPost.slug}`}
            className="group block bg-white rounded-2xl overflow-hidden border border-cream-200 hover:border-sage-300 hover:shadow-soft-lg transition-all"
          >
            <div className="grid md:grid-cols-2">
              <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <span className="text-sage-600 text-sm font-medium uppercase tracking-wider mb-3">
                  {featuredPost.category}
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-forest-900 mb-4 group-hover:text-sage-700 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-forest-800/70 mb-6 line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-forest-800/50">
                  <span>{new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span>•</span>
                  <span>{featuredPost.readTime} min read</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Other Posts Grid */}
      <section className="py-12">
        <div className="container-wide">
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-8">
            Latest Articles
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <Link
                key={post.slug}
                href={`${basePath}/blog/${post.slug}`}
                className="group bg-white rounded-xl overflow-hidden border border-cream-200 hover:border-sage-300 hover:shadow-soft transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <span className="text-sage-600 text-xs font-medium uppercase tracking-wider">
                    {post.category}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-forest-900 mt-2 mb-3 group-hover:text-sage-700 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-forest-800/60 text-sm line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-forest-800/50">
                    <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span>•</span>
                    <span>{post.readTime} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-white border-t border-cream-200">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl font-semibold text-forest-900 mb-4">
              Get Flower Tips in Your Inbox
            </h2>
            <p className="text-forest-800/70 mb-8">
              Subscribe to our newsletter for seasonal flower guides, care tips, and exclusive offers.
            </p>
            <form className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl border border-cream-300 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-forest-900 text-cream-100 rounded-xl font-medium hover:bg-forest-800 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
