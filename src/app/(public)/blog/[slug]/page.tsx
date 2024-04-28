import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/api/blog";
import markdownToHtml from "@/lib/utils/markdown-to-html";
import { Heading } from '@/lib/components/ui/heading';
import { Text } from '@/lib/components/ui/text';
import { Container } from '@/lib/components/ui/container';
import DateFormatter from '@/lib/components/date-formatter';
import Image from "next/image";
import markdownStyles from "@/styles/markdown-styles.module.css";

export default async function BlogPost({ params }: Params) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");

  return (
    <Container size={6} className="py-14">
      <article>
        <Heading className="mb-3" as="h1">{post.title}</Heading>
        <div className="flex flex-row items-center">
          {post.author.picture && (
            <Image className="my-4 rounded-full object-cover w-16 h-16 mr-4" src={post.author.picture} alt="the alt" width={80} height={80}  />
          )}
          <div>
            <DateFormatter dateString={post.date} />
            <Text className="font-semibold text-lg">{post.author.name}</Text>
          </div>
        </div>
        <Image className="my-4" src={post.coverImage} alt="the alt" width={1300} height={630}  />
        <div
          className={markdownStyles['markdown']}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </Container>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: Params): Metadata {
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