import { forwardRef, type HTMLAttributes } from 'react';

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const gapSizes = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ gap = 'lg', className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex flex-col ${gapSizes[gap]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Stack.displayName = 'Stack';
