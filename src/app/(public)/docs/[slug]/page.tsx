import { createReader } from "@keystatic/core/reader";
import React from "react";
import Markdoc from "@markdoc/markdoc";

import keystaticConfig from "../../../../../keystatic.config";
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/lib/components/ui/container';
import { Heading } from '@/lib/components/ui/heading';
import markdownStyles from '@/styles/markdown-styles.module.css';
import DateFormatter from '@/lib/components/date-formatter';
import { Text } from '@/lib/components/ui/text';
import Link from 'next/link';

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

  function generateNav() {
    const objNav = allDocs.reduce((acc, doc) => {
      if (!acc[doc.entry.category]) {
        acc[doc.entry.category] = [];
      }

      acc[doc.entry.category].push(doc);
      return acc;
    }, {});

    const sortedSections = Object.fromEntries(Object.entries(objNav).sort(([a], [b]) => {
      const categoryA = allCategories.find((category) => category.slug === objNav[a][0].entry.category);
      const categoryB = allCategories.find((category) => category.slug === objNav[b][0].entry.category);

      if (!categoryA?.entry?.priority || !categoryB?.entry?.priority) return 0;

      return categoryA.entry.priority - categoryB.entry.priority;
    }));

    return Object.entries(sortedSections).map(([key, docs]: [string, any]) => {
      const section: any[] = [];
      const category = allCategories.find((category) => category.slug === key);

      if (category) {
        section.push(<Heading variant="h6">{category.entry.name}</Heading>);
      }

      section.push(
        <ul className="pb-4">
          {docs.map(doc => {
            return <li key={doc.slug}><Link href={`/docs/${doc.slug}`}>{doc.entry.title}</Link></li>;
          })}
        </ul>
      );

      return section;
    });
  }

  return (
    <Container size={10} className="py-14">
      <div className="grid grid-cols-12">
        <div className="col-span-3">
          <div className="space-y-3">
            {generateNav()}
          </div>
        </div>
        <article className="col-span-8">
          <Heading className="mb-3" as="h1">{doc.title}</Heading>
          {doc.last_updated && (
            <Text>Last updated: <DateFormatter dateString={doc.last_updated} /></Text>
          )}
          <div className={markdownStyles['markdown']}>
            {Markdoc.renderers.react(renderable, React)}
          </div>
        </article>
        <div className="col-span-3">
        {/*TODO add 'on this page' section that anchors to all of the sections on the page */}
        </div>
      </div>
    </Container>
  );
}