import { createReader } from "@keystatic/core/reader";
import keystaticConfig from '../../../keystatic.config';

export const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

const reader = createReader(process.cwd(), keystaticConfig);

export default async function sitemap() {
  const slugs = await reader.collections.posts.list();
  let blogs = slugs.map((slug) => ({
    url: `${baseUrl}blog/${slug}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  let routes = ['', 'blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs]
}