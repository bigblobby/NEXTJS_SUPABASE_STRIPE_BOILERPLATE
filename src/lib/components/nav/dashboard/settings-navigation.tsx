'use client'

import { cn } from '@/lib/utils/cn';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { buttonVariants } from '@/lib/components/ui/button';

interface SettingsNavigationProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    name: string
  }[];
}

export default function SettingsNavigation({ className, items, ...props }: SettingsNavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === item.href
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
            'justify-start'
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}