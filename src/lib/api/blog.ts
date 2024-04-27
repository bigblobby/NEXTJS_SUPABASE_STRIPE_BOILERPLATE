import { BlogPost } from '@/src/lib/types/blog.types';
import fs from 'fs';
import matter from 'gray-matter';
import { join } from 'path';

const postsDirectory = join(process.cwd(), 'src', '_blog-posts');

export function getBlogPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getBlogPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return { ...data, slug: realSlug, content } as BlogPost;
  } catch (err) {
    console.error(err);
    return null
  }
}

export function getAllBlogPosts(): BlogPost[] {
  const slugs = getBlogPostSlugs();
  // @ts-ignore
  return slugs
    .map((slug) => getBlogPostBySlug(slug))
    // @ts-ignore
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
}