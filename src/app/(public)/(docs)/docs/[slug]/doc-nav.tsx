'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/lib/components/ui/sheet';
import { Button } from '@/lib/components/ui/button';
import { AlignJustify } from 'lucide-react';
import React from 'react';
import { Heading } from '@/lib/components/ui/heading';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function DocNav({
  docs,
  categories
}: { docs: any; categories: any; }) {
  const pathname = usePathname();

  function generateNav() {
    const objNav = docs.reduce((acc: any, doc: any) => {
      if (!acc[doc.category]) {
        acc[doc.category] = [];
      }

      acc[doc.category].push(doc);
      return acc;
    }, {});


    const sortedSections = Object.fromEntries(Object.entries(objNav).sort(([a], [b]) => {
      const categoryA = categories.find((category: any) => category.slug === objNav[a][0].category);
      const categoryB = categories.find((category: any) => category.slug === objNav[b][0].category);

      if (!categoryA?.priority || !categoryB?.priority) return 0;

      return categoryA.priority - categoryB.priority;
    }));

    return Object.entries(sortedSections).map(([key, docs]: [string, any]) => {
      const section: any[] = [];
      const category = categories.find((category: any) => category.slug === key);

      if (category) {
        section.push(<Heading className="px-2" variant="h6">{category.title}</Heading>);
      }

      section.push(
        <ul className="pb-4">
          {docs.sort((docA: any, docB: any) => {
            if (!docA.priority || !docB.priority) return 0;
            return docA.priority - docB.priority;
          }).map((doc: any) => {
            return <li key={doc.slug} className={`rounded-md px-2 py-1 ${pathname === `/docs/${doc.slug}` ? 'bg-muted' : ''}`}><Link href={`/docs/${doc.slug}`}>{doc.title}</Link></li>;
          })}
        </ul>
      );

      return section;
    });
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild className="flex md:hidden">
          <Button variant="outline" size="icon" className="fixed bottom-6 right-6 flex items-center justify-center border-primary bg-primary text-white">
            <AlignJustify width={22} height={22} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="h-full space-y-3">
            {generateNav()}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="fixed z-20 hidden h-screen w-60 pl-6 md:block">
        <nav className="-ml-6 h-full overflow-y-auto border-r border-slate-4 pl-4 pr-6 pb-28 space-y-3">
          {generateNav()}
        </nav>
      </div>
    </>
  )
}