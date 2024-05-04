import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/api/blog";
import BlogPostContents from '@/app/(public)/blog/[slug]/page-contents';

interface BlogPostProps {
  params: {
    slug: string;
  }
}

export function generateMetadata({ params }: BlogPostProps): Metadata {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  return {
    title: post.title,
    openGraph: {
      title: post.title,
      images: [post.ogImage.url],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: BlogPostProps) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  return <BlogPostContents post={post} />
}

