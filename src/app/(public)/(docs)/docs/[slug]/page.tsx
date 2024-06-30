import { createReader } from "@keystatic/core/reader";
import React from "react";
import Markdoc from "@markdoc/markdoc";

import keystaticConfig from '../../../../../../keystatic.config';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/lib/components/ui/container';
import { Heading } from '@/lib/components/ui/heading';
import markdownStyles from '@/styles/markdown-styles.module.css';
import DateFormatter from '@/lib/components/date-formatter';
import { Text } from '@/lib/components/ui/text';
import { DocNav } from '@/lib/components/nav/docs/doc-nav';

const reader = createReader(process.cwd(), keystaticConfig);

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const doc = await reader.collections.docs.read(params.slug);

  if (!doc) {
    return notFound();
  }

  return {
    title: doc.title,
    openGraph: {
      title: doc.title,
    },
  };
}

export async function generateStaticParams() {
  const slugs = await reader.collections.docs.list();

  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function Doc({ params }: { params: { slug: string } }) {
  const doc = await reader.collections.docs.read(params.slug);
  const allDocs = await reader.collections.docs.all();
  const allCategories = await reader.collections.doc_categories.all();

  if (!doc) {
    return <div>No Doc Found</div>;
  }

  const { node } = await doc.content();
  const errors = Markdoc.validate(node);

  if (errors.length) {
    console.error(errors);
    throw new Error('Invalid content');
  }

  const renderable = Markdoc.transform(node);

  function getDocsForNav() {
    return [...allDocs].map((doc:any) => {
      return {
        slug: doc.slug,
        title: doc.entry.title,
        category: doc.entry.category,
        priority: doc.entry.priority,
      }
    });
  }

  function getCategoriesForNav() {
    return [...allCategories].map((category:any) => {
      return {
        slug: category.slug,
        title: category.entry.name,
        priority: category.entry.priority,
      }
    });
  }

  return (
    <Container size={10} className="py-6 relative min-h-screen">
      <DocNav docs={getDocsForNav()} categories={getCategoriesForNav()} />
      <article className="md:pl-60">
        <div className="md:pl-10">
          <Heading className="mb-3" as="h1">{doc.title}</Heading>
          {doc.last_updated && (
            <Text>Last updated: <DateFormatter dateString={doc.last_updated} /></Text>
          )}
          <div className={markdownStyles['markdown']}>
            {Markdoc.renderers.react(renderable, React)}
          </div>
        </div>
      </article>
    </Container>
  );
}