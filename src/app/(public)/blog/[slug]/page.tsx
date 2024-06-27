import { createReader } from "@keystatic/core/reader";
import React from "react";
import Markdoc from "@markdoc/markdoc";

import keystaticConfig from "../../../../../keystatic.config";
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/lib/components/ui/container';
import { Heading } from '@/lib/components/ui/heading';
import markdownStyles from '@/styles/markdown-styles.module.css';
import Image from 'next/image';
import DateFormatter from '@/lib/components/date-formatter';
import { Text } from '@/lib/components/ui/text';

const reader = createReader(process.cwd(), keystaticConfig);

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await reader.collections.posts.read(params.slug);

  if (!post) {
    return notFound();
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
    },
  };
}

export async function generateStaticParams() {
  const slugs = await reader.collections.posts.list();

  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await reader.collections.posts.read(params.slug);

  if (!post) {
    return <div>No Post Found</div>;
  }

  const author = await reader.collections.authors.read(post.authors[0]);
  const { node } = await post.content();
  const errors = Markdoc.validate(node);

  if (errors.length) {
    console.error(errors);
    throw new Error('Invalid content');
  }

  const renderable = Markdoc.transform(node);

  return (
    <Container size={10} className="py-14">
      <article>
        <Heading className="mb-3" as="h1">{post.title}</Heading>
        <div className="flex flex-row items-center">
          {author?.avatar && (
            <Image className="my-4 rounded-full object-cover w-16 h-16 mr-4" src={`/images/avatars/${post.authors[0]}/${author.avatar}`} alt="the alt" width={80} height={80} />
          )}
          <div>
            {post.published && <DateFormatter dateString={post.published} />}
            {author?.name && <Text className="font-semibold text-lg">{author.name}</Text>}
          </div>
        </div>
        {post.coverImage && <Image className="my-4 rounded-md" src={`/images/blog/cover-image/${params.slug}/${post.coverImage}`} alt="the alt" width={1300} height={630} />}
        <div className={markdownStyles['markdown']}>
          {Markdoc.renderers.react(renderable, React)}
        </div>
      </article>
    </Container>
  );
}