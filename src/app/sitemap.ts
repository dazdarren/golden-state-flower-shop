import { MetadataRoute } from 'next';
import { getAllCities } from '@/data/cities';
import { OCCASIONS, PRODUCT_TYPES, SEASONAL } from '@/data/categories';
import { GUIDES } from '@/data/guides';

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

    // Product type pages (4 types × 11 cities = 44 pages)
    for (const productType of PRODUCT_TYPES) {
      urls.push({
        url: `${siteUrl}${cityPath}/shop/${productType.slug}/`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }

    // Seasonal pages (4 seasonal × 11 cities = 44 pages)
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
  }

  return urls;
}
