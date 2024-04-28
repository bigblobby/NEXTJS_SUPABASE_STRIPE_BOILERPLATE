import React, { createElement } from 'react';
import { cn } from '@/lib/utils/cn';
import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';

const textVariants = cva(
  '',
  {
    variants: {
      variant: {
        default: 'text-zinc-600 dark:text-zinc-200',
        label: 'text-zinc-900 dark:text-white text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        muted: 'text-muted',
        leading: 'text-lg text-gray-500 dark:text-gray-400 lg:text-xl'
      }
    },
    defaultVariants: {
      variant: 'default',
    }
  }
);

type ComponentTypes = 'p' | 'span' | 'div' | 'label';

export interface TextProps extends React.HTMLAttributes<any>, VariantProps<typeof textVariants> {
  asChild?: boolean;
  as?: ComponentTypes;
  [key:string]: any;
}

function Text({
  asChild,
  as = 'p',
  variant = 'default',
  className = '',
  children,
  ...props
}: TextProps) {
  const Comp = asChild ? Slot : as;

  return createElement(
    Comp,
    {
      className: cn(textVariants({ variant, className })),
      ...props,
    },
    children
  );
}

export { Text };