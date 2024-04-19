import { ReactNode } from 'react';
import { Text } from '@/src/lib/components/ui/text';
import { Heading } from '@/src/lib/components/ui/heading';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export default function Card({ title, description, footer, children }: Props) {
  return (
    <div className="w-full max-w-3xl m-auto my-8 border rounded-md p border-zinc-700">
      <div className="px-5 py-4">
        <Heading className="mb-1 font-medium" as="h3" variant="h3">{title}</Heading>
        <Text>{description}</Text>
        {children}
      </div>
      {footer && (
        <div className="p-4 border-t rounded-b-md border-zinc-700 bg-zinc-100 dark:bg-zinc-900">
          {footer}
        </div>
      )}
    </div>
  );
}
