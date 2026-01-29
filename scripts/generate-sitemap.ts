/**
 * Generate sitemap.xml at build time
 * Run this script before build: npx ts-node scripts/generate-sitemap.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Configuration
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com';

// City configurations - all California cities
const cities = [
  { state: 'ca', city: 'san-francisco' },
  { state: 'ca', city: 'los-angeles' },
  { state: 'ca', city: 'san-diego' },
  { state: 'ca', city: 'san-jose' },
  { state: 'ca', city: 'sacramento' },
  { state: 'ca', city: 'oakland' },
  { state: 'ca', city: 'fresno' },
  { state: 'ca', city: 'long-beach' },
  { state: 'ca', city: 'irvine' },
  { state: 'ca', city: 'santa-barbara' },
  { state: 'ca', city: 'palm-springs' },
];

// Occasions
const occasions = ['birthday', 'sympathy', 'anniversary', 'get-well', 'thank-you'];

// Utility pages
const utilityPages = ['delivery', 'faq', 'contact', 'privacy', 'terms'];

// Featured product SKUs (Florist One real product codes)
const featuredSkus = [
  'T18-1A',   // Simply Sweet
  'F1-120',   // Happy Birthday Balloon Bouquet
  'FAA-100',  // Large Floral Arrangement
  'S5251s',   // Abundance Casket Spray
  'S5252s',   // Faithful Wishes Wreath
  'S5253s',   // Thoughts of Tranquility
];

interface SitemapUrl {
  loc: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

function generateSitemap(): string {
  const urls: SitemapUrl[] = [];
  const today = new Date().toISOString().split('T')[0];

  // Homepage (global)
  urls.push({
    loc: `${SITE_URL}/`,
    changefreq: 'weekly',
    priority: 1.0,
  });

  // Auth pages (global)
  urls.push({
    loc: `${SITE_URL}/auth/login/`,
    changefreq: 'monthly',
    priority: 0.3,
  });
  urls.push({
    loc: `${SITE_URL}/auth/register/`,
    changefreq: 'monthly',
    priority: 0.3,
  });

  // Add URLs for each city
  for (const { state, city } of cities) {
    const basePath = `/${state}/${city}`;

    // City home page (highest priority)
    urls.push({
      loc: `${SITE_URL}${basePath}/`,
      changefreq: 'weekly',
      priority: 0.9,
    });

    // Subscription page (high priority - key revenue page)
    urls.push({
      loc: `${SITE_URL}${basePath}/subscribe/`,
      changefreq: 'weekly',
      priority: 0.85,
    });

    // Occasion pages (high priority)
    for (const occasion of occasions) {
      urls.push({
        loc: `${SITE_URL}${basePath}/flowers/${occasion}/`,
        changefreq: 'weekly',
        priority: 0.8,
      });
    }

    // Product pages (medium priority)
    for (const sku of featuredSkus) {
      urls.push({
        loc: `${SITE_URL}${basePath}/product/${sku}/`,
        changefreq: 'weekly',
        priority: 0.7,
      });
    }

    // Utility pages (lower priority)
    for (const page of utilityPages) {
      urls.push({
        loc: `${SITE_URL}${basePath}/${page}/`,
        changefreq: 'monthly',
        priority: 0.5,
      });
    }
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
}

// Generate and write sitemap
const sitemap = generateSitemap();
const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

fs.writeFileSync(outputPath, sitemap, 'utf-8');
console.log(`Sitemap generated: ${outputPath}`);
console.log(`Total URLs: ${sitemap.split('<url>').length - 1}`);
