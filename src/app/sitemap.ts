import { MetadataRoute } from 'next';
import { getAllCities } from '@/data/cities';
import { OCCASIONS, PRODUCT_TYPES, SEASONAL, FUNERAL_TYPES } from '@/data/categories';
import { GUIDES } from '@/data/guides';
import { getAllBlogSlugs } from '@/data/blogPosts';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenstateflowershop.com';
  const urls: MetadataRoute.Sitemap = [];
  const currentDate = new Date();

  // Homepage
  urls.push({
    url: `${siteUrl}/`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 1.0,
  });

  // Get all cities
  const cities = getAllCities();

  for (const city of cities) {
    const cityPath = `/${city.stateSlug}/${city.citySlug}`;

    // City home page
    urls.push({
      url: `${siteUrl}${cityPath}/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    });

    // Occasion pages (9 occasions × 11 cities = 99 pages)
    for (const occasion of OCCASIONS) {
      urls.push({
        url: `${siteUrl}${cityPath}/flowers/${occasion.slug}/`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }

    // Product type pages (9 types × 11 cities = 99 pages)
    for (const productType of PRODUCT_TYPES) {
      urls.push({
        url: `${siteUrl}${cityPath}/shop/${productType.slug}/`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }

    // Seasonal pages (5 seasonal × 11 cities = 55 pages)
    for (const seasonal of SEASONAL) {
      urls.push({
        url: `${siteUrl}${cityPath}/seasonal/${seasonal.slug}/`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }

    // Utility pages (5 pages × 11 cities = 55 pages)
    const utilityPages = ['faq', 'contact', 'delivery', 'privacy', 'terms'];
    for (const page of utilityPages) {
      urls.push({
        url: `${siteUrl}${cityPath}/${page}/`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }

    // Guides hub page (11 cities = 11 pages)
    urls.push({
      url: `${siteUrl}${cityPath}/guides/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    });

    // Individual guide pages (5 guides × 11 cities = 55 pages)
    for (const guide of GUIDES) {
      urls.push({
        url: `${siteUrl}${cityPath}/guides/${guide.slug}/`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }

    // Funeral collection pages (11 types × 11 cities = 121 pages)
    for (const funeral of FUNERAL_TYPES) {
      urls.push({
        url: `${siteUrl}${cityPath}/funeral/${funeral.slug}/`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }

    // Blog hub page (11 cities = 11 pages)
    urls.push({
      url: `${siteUrl}${cityPath}/blog/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    });

    // Individual blog posts (14 posts × 11 cities = 154 pages)
    const blogSlugs = getAllBlogSlugs();
    for (const slug of blogSlugs) {
      urls.push({
        url: `${siteUrl}${cityPath}/blog/${slug}/`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }

    // Hospital delivery pages (~7 hospitals × 11 cities = ~77 pages)
    for (const hospital of city.hospitals) {
      const hospitalSlug = hospital
        .toLowerCase()
        .replace(/['']/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      urls.push({
        url: `${siteUrl}${cityPath}/hospital/${hospitalSlug}/`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }

    // Neighborhood delivery pages (~15 neighborhoods × 11 cities = ~165 pages)
    for (const neighborhood of city.neighborhoods) {
      const neighborhoodSlug = neighborhood
        .toLowerCase()
        .replace(/['']/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      urls.push({
        url: `${siteUrl}${cityPath}/neighborhood/${neighborhoodSlug}/`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return urls;
}
