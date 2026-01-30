import Link from 'next/link';
import { GuideConfig } from '@/data/guides';

interface GuideCardProps {
  guide: GuideConfig;
  basePath: string;
}

const categoryColors: Record<string, string> = {
  'Flower Care': 'bg-sage-100 text-sage-700',
  'Etiquette': 'bg-rose-100 text-rose-700',
  'Delivery Guide': 'bg-cream-300 text-forest-800',
  'Flower Meanings': 'bg-gold-100 text-gold-700',
  'Holiday Guide': 'bg-rose-100 text-rose-700',
};

const categoryIcons: Record<string, JSX.Element> = {
  'Flower Care': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  'Etiquette': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  'Delivery Guide': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  'Flower Meanings': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  'Holiday Guide': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
};

export default function GuideCard({ guide, basePath }: GuideCardProps) {
  const colorClass = categoryColors[guide.category] || 'bg-cream-100 text-forest-700';
  const icon = categoryIcons[guide.category];

  return (
    <Link
      href={`${basePath}/guides/${guide.slug}`}
      className="group block bg-white rounded-2xl border border-cream-200 overflow-hidden
                 hover:border-sage-300 hover:shadow-soft-lg transition-all duration-300"
    >
      <div className="p-6 lg:p-8">
        {/* Category badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {icon}
            {guide.category}
          </span>
          <span className="text-xs text-forest-800/50">{guide.readingTime}</span>
        </div>

        {/* Title */}
        <h3 className="font-display text-xl font-semibold text-forest-900 mb-3
                       group-hover:text-sage-700 transition-colors">
          {guide.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-forest-800/50 line-clamp-3 mb-4">
          {guide.excerpt}
        </p>

        {/* Read more link */}
        <div className="flex items-center gap-2 text-sage-600 text-sm font-medium
                       group-hover:text-sage-700 transition-colors">
          <span>Read guide</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform"
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
