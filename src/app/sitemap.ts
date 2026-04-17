import { MetadataRoute } from 'next';
import { getArticlesList } from '@/lib/contents';
import { buildSubjectDirectory } from '@/lib/subjects';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://httt-uel-hub.vercel.app';
  
  // Base routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/curriculum`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }
  ];

  // Dynamic Curriculum pages
  const articles = await getArticlesList();
  const directory = buildSubjectDirectory(articles);
  
  directory.forEach((subject) => {
    routes.push({
      url: `${baseUrl}/curriculum/${subject.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    });

    subject.resources.forEach((res) => {
      routes.push({
        url: `${baseUrl}/curriculum/${subject.slug}${res.type === 'sim' ? '/sim/' : '/'}${res.slug}`,
        lastModified: res.updatedAt ? new Date(res.updatedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      });
    });
  });

  return routes;
}