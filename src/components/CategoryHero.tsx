'use client';

import Link from 'next/link';

type HeroTheme = 'default' | 'rose' | 'sage' | 'gold' | 'forest' | 'amber' | 'pink';

interface CategoryHeroProps {
  title: string;
  subtitle?: string;
  description: string;
  theme?: HeroTheme;
  badgeText?: string;
  showBadge?: boolean;
  breadcrumbs?: { label: string; href?: string }[];
  basePath: string;
}

const themeStyles: Record<HeroTheme, { gradient: string; badge: string; accent: string }> = {
  default: {
    gradient: 'bg-gradient-to-br from-cream-100 via-cream-50 to-white',
    badge: 'bg-sage-100 text-sage-700 border-sage-200',
    accent: 'text-sage-600',
  },
  rose: {
    gradient: 'bg-gradient-to-br from-rose-100 via-rose-50 to-cream-50',
    badge: 'bg-rose-100 text-rose-700 border-rose-200',
    accent: 'text-rose-500',
  },
  sage: {
    gradient: 'bg-gradient-to-br from-sage-100 via-sage-50 to-cream-50',
    badge: 'bg-sage-100 text-sage-700 border-sage-200',
    accent: 'text-sage-600',
  },
  gold: {
    gradient: 'bg-gradient-to-br from-gold-100 via-gold-50 to-cream-50',
    badge: 'bg-gold-100 text-gold-700 border-gold-200',
    accent: 'text-gold-600',
  },
  forest: {
    gradient: 'bg-gradient-to-br from-forest-100 via-sage-50 to-cream-50',
    badge: 'bg-forest-100 text-forest-700 border-forest-200',
    accent: 'text-forest-600',
  },
  amber: {
    gradient: 'bg-gradient-to-br from-amber-100 via-amber-50 to-cream-50',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    accent: 'text-amber-600',
  },
  pink: {
    gradient: 'bg-gradient-to-br from-pink-100 via-pink-50 to-cream-50',
    badge: 'bg-pink-100 text-pink-700 border-pink-200',
    accent: 'text-pink-500',
  },
};

export default function CategoryHero({
  title,
  subtitle,
  description,
  theme = 'default',
  badgeText,
  showBadge = false,
  breadcrumbs = [],
  basePath,
}: CategoryHeroProps) {
  const styles = themeStyles[theme];

  return (
    <>
      {/* Breadcrumb */}
      {breadcrumbs.length > 0 && (
        <nav className="bg-cream-50 border-b border-cream-200">
          <div className="container-wide py-3">
            <ol className="flex items-center gap-2 text-sm text-forest-800/60">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center gap-2">
                  {index > 0 && <span>/</span>}
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-forest-900 transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-forest-900 font-medium">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </nav>
      )}

      {/* Hero */}
      <section className={`relative py-12 lg:py-20 overflow-hidden ${styles.gradient}`}>
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 opacity-[0.07]">
            <svg viewBox="0 0 200 200" fill="none" className={`w-full h-full ${styles.accent}`}>
              <path d="M100 20c0 40-30 60-30 90s15 40 30 40 30-10 30-40-30-50-30-90z" fill="currentColor"/>
              <path d="M70 80c20-10 40 0 60 20M130 80c-20-10-40 0-60 20" stroke="currentColor" strokeWidth="3"/>
            </svg>
          </div>
          <div className="absolute bottom-10 left-10 w-48 h-48 opacity-[0.05] rotate-12">
            <svg viewBox="0 0 200 200" fill="none" className={`w-full h-full ${styles.accent}`}>
              <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2"/>
              <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="2"/>
              <circle cx="100" cy="100" r="20" fill="currentColor"/>
            </svg>
          </div>
        </div>

        <div className="container-wide relative z-10">
          <div className="max-w-3xl">
            {showBadge && badgeText && (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 border ${styles.badge}`}>
                <span className="w-2 h-2 rounded-full bg-current" />
                {badgeText}
              </div>
            )}

            {subtitle && (
              <p className={`text-sm font-medium uppercase tracking-widest mb-3 ${styles.accent}`}>
                {subtitle}
              </p>
            )}

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-forest-900 mb-4 leading-tight">
              {title}
            </h1>

            <p className="text-lg md:text-xl text-forest-800/70 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
