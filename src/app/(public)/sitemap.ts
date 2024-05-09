import { getAllBlogPosts } from "@/lib/api/blog";

export const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

export default async function sitemap() {
  let blogs = getAllBlogPosts().map((post) => ({
    url: `${baseUrl}/blog2/${post.slug}`,
    lastModified: post.date,
  }))

  let routes = ['', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs]
}