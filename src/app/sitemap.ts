import type { MetadataRoute } from 'next';

// Single-page site — one URL, so crawlers stop 404ing on /sitemap.xml.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: 'https://yusufanilyazici.com', changeFrequency: 'monthly', priority: 1 }];
}
