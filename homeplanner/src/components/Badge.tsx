import { forwardRef, type HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    const variants = {
      default: 'bg-secondary-light text-text-secondary',
      primary: 'bg-primary-light text-primary',
      success: 'bg-accent-light text-accent',
      warning: 'bg-warning-light text-warning',
      danger: 'bg-danger-light text-danger',
      outline: 'bg-transparent border border-border text-text-secondary',
    };

    return (
      <span
        ref={ref}
        className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
