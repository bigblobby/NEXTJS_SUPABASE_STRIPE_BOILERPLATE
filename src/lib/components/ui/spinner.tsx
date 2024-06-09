import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';
import SpinnerIcon from '@/lib/components/icons/spinner-icon';

const spinnerVariants = cva(
'absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center rounded-lg',
  {
    variants: {
      variant: {
        default: 'text-outline',
        primary: 'text-primary',
        destructive: 'text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    }
  }
);

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof spinnerVariants> {
  asChild?: boolean;
  size?: SizeType;
}

type SizeType = 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large';

function getSize(size?: SizeType) {
  let width;
  let height;

  switch (size) {
    case 'extra-large':
      width = 100;
      height = 100;
      break;
    case 'large':
      width = 80;
      height = 80;
      break;
    case 'medium':
      width = 60;
      height = 60;
      break;
    case 'small':
      width = 40;
      height = 40;
      break;
    default:
    case 'extra-small':
      width = 20;
      height = 20;
  }

  return {
    width,
    height
  };
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(({
  className,
  variant = 'default',
  size,
  asChild = false,
  children,
  ...props
}, ref) => {
    const Comp = asChild ? Slot : 'div';

    return (
      <Comp ref={ref} className={cn(spinnerVariants({ variant, className }))}><SpinnerIcon {...getSize(size)} /></Comp>
    );
  }
);
Spinner.displayName = 'Spinner';

export { Spinner };
