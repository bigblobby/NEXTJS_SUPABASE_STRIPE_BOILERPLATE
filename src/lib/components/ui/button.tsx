import * as React from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';
import SpinnerIcon from '@/lib/components/icons/spinner-icon';

function getSpinnerColors(buttonVariant: string | null): string {
  switch (buttonVariant) {
    case 'default':
    case 'primary':
      return 'bg-primary';
    case 'destructive':
      return 'bg-destructive';
    case 'outline':
    default:
      return 'bg-white'
  }
}

const buttonVariants = cva(
  'relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold text-center ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input text-accent-foreground bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        black: 'bg-black text-white'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  showSpinnerOnDisabled?: boolean;
  disabled?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'default',
  size,
  asChild = false,
  showSpinnerOnDisabled = true,
  disabled,
  children,
  ...props
}, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      <Slottable>
        {children}
      </Slottable>
      {showSpinnerOnDisabled ? (
        <>
          {disabled && <div className={`absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center rounded-lg ${getSpinnerColors(variant)}`}><SpinnerIcon /></div>}
        </>
      ) : null}
    </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
