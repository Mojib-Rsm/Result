
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.bdedu.me';

  const staticPages = [
    '/',
    '/education-news',
    '/institute-result',
    '/suggestions',
    '/statistics',
    '/history',
    '/gpa-calculator',
    '/login',
    '/admin',
    '/admin/api-logs',
    '/admin/subscriptions',
    '/admin/search-history',
    '/developer',
    '/suggestions/public-universities',
    '/suggestions/private-universities',
    '/suggestions/medical-colleges',
    '/suggestions/engineering-colleges',
    '/suggestions/national-university',
    '/suggestions/polytechnic-institutes',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.8,
  }));
  
  // We can't dynamically generate result pages here easily without
  // querying Firestore, which is complex in this context.
  // We will rely on Google to crawl the links from the main page.

  return sitemapEntries;
}
