import { getAllBlogPosts } from "@/lib/api/blog";
import BlogPageContents from '@/app/(public)/blog/page-contents';
import type { Metadata } from 'next';
import { getURL } from '@/lib/utils/helpers';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'NextBoilerplate - Blog',
    description: 'The blog page',
    metadataBase: new URL(getURL()),
  };
}

export default function Blog() {
  const allPosts = getAllBlogPosts();

  return <BlogPageContents posts={allPosts} />
}