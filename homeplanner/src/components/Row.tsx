import { forwardRef, type HTMLAttributes } from 'react';

interface RowProps extends HTMLAttributes<HTMLDivElement> {
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}

const gapSizes = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
};

const alignItems = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const justifyContent = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
};

export const Row = forwardRef<HTMLDivElement, RowProps>(
  ({ gap = 'md', align = 'center', justify = 'start', className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex ${gapSizes[gap]} ${alignItems[align]} ${justifyContent[justify]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Row.displayName = 'Row';
