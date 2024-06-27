import { createReader } from "@keystatic/core/reader";
import keystaticConfig from '../../../keystatic.config';

export const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

const reader = createReader(process.cwd(), keystaticConfig);

export default async function sitemap() {
  const blogSlugs = await reader.collections.posts.list();
  const docSlugs = await reader.collections.docs.list();

  const blogs = blogSlugs.map((slug) => ({
    url: `${baseUrl}blog/${slug}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  const docs = docSlugs.map((slug) => ({
    url: `${baseUrl}docs/${slug}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  const routes = ['', 'blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs, ...docs];
}