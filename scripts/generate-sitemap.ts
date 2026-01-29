/**
 * Generate sitemap.xml at build time
 * Run this script before build: npx ts-node scripts/generate-sitemap.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Configuration
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

// City configurations
const cities = [
  { state: 'ca', city: 'san-francisco' },
];

// Occasions
const occasions = ['birthday', 'sympathy', 'anniversary', 'get-well', 'thank-you'];

// Utility pages
const utilityPages = ['delivery', 'faq', 'contact', 'privacy', 'terms'];

// Featured product SKUs (from placeholder data)
const featuredSkus = [
  'FTD-MIX001', 'FTD-MIX002', 'FTD-MIX003', 'FTD-MIX004', 'FTD-MIX005', 'FTD-MIX006',
  'FTD-ROSE001', 'FTD-ROSE002', 'FTD-ROSE003', 'FTD-ROSE004', 'FTD-ROSE005', 'FTD-ROSE006',
  'FTD-PLT001', 'FTD-PLT002', 'FTD-PLT003', 'FTD-PLT004',
  'FTD-SYM001', 'FTD-SYM002', 'FTD-SYM003', 'FTD-SYM004',
  'FTD-SEA001', 'FTD-SEA002', 'FTD-SEA003', 'FTD-SEA004',
];

interface SitemapUrl {
  loc: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

function generateSitemap(): string {
  const urls: SitemapUrl[] = [];
  const today = new Date().toISOString().split('T')[0];

  // Add URLs for each city
  for (const { state, city } of cities) {
    const basePath = `/${state}/${city}`;

    // City home page (highest priority)
    urls.push({
      loc: `${SITE_URL}${basePath}/`,
      changefreq: 'weekly',
      priority: 1.0,
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
