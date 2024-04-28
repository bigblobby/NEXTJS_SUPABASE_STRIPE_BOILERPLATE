import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils/cn';

const containerVariants = cva(
  'mx-auto',
  {
    variants: {
      size: {
        default: 'max-w-7xl px-4 sm:px-6',
        1: 'max-w-xs px-4 sm:px-6',
        2: 'max-w-sm px-4 sm:px-6',
        3: 'max-w-md px-4 sm:px-6',
        4: 'max-w-lg px-4 sm:px-6',
        5: 'max-w-xl px-4 sm:px-6',
        6: 'max-w-2xl px-4 sm:px-6',
        7: 'max-w-3xl px-4 sm:px-6',
        8: 'max-w-4xl px-4 sm:px-6',
        9: 'max-w-5xl px-4 sm:px-6',
        10: 'max-w-6xl px-4 sm:px-6',
        11: 'max-w-7xl px-4 sm:px-6',
      }
    },
    defaultVariants: {
      size: 'default'
    }
  }
);

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof containerVariants> {
  asChild?: boolean;
}

function Container({
  size,
  className,
  asChild,
  children,
}: ContainerProps) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp className={cn(containerVariants({ size, className }))}>
      {children}
    </Comp>
  )
}

export { Container };