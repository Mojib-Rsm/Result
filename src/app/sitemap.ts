
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.bdedu.me';

  const staticPages = [
    '/',
    '/education-news',
    '/education-news/board-and-ministry',
    '/education-news/exam-and-results',
    '/institute-result',
    '/suggestions',
    '/statistics',
    '/history',
    '/gpa-calculator',
    '/login',
    '/register',
    '/admin',
    '/admin/api-logs',
    '/admin/subscriptions',
    '/admin/search-history',
    '/admin/settings',
    '/developer',
    '/suggestions/public-universities',
    '/suggestions/private-universities',
    '/suggestions/medical-colleges',
    '/suggestions/engineering-colleges',
    '/suggestions/national-university',
    '/suggestions/polytechnic-institutes',
    '/suggestions/model-test',
    '/suggestions/study-guide',
    '/suggestions/ebook-pdf-notes',
    '/career',
    '/career/education-jobs',
    '/career/teacher-recruitment',
    '/career/scholarships',
    '/career/guidelines',
    '/career/post-job',
    '/seeding',
    '/about-us',
    '/contact-us',
    '/privacy-policy',
    '/disclaimer',
    '/terms-and-conditions',
    '/image-hosting',
    '/dashboard',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : (path === '/career/post-job' ? 0.5 : 0.8),
  }));
  
  // We can't dynamically generate result pages here easily without
  // querying Firestore, which is complex in this context.
  // We will rely on Google to crawl the links from the main page.

  return sitemapEntries;
}
