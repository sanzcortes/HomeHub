import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    className = '', 
    children, 
    icon,
    iconPosition = 'left',
    disabled, 
    'aria-label': ariaLabel,
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none select-none';
    
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-hover focus:ring-primary shadow-sm hover:shadow-md',
      secondary: 'bg-secondary-light text-text-primary hover:bg-slate-200 active:bg-slate-300 focus:ring-secondary',
      ghost: 'text-text-secondary hover:text-text-primary hover:bg-secondary-light active:bg-slate-200 focus:ring-secondary',
      danger: 'bg-danger text-white hover:bg-red-700 active:bg-red-800 focus:ring-danger shadow-sm hover:shadow-md',
      outline: 'border-2 border-border text-text-primary hover:border-text-secondary hover:bg-secondary-light active:bg-slate-200 focus:ring-secondary',
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-5 py-3 text-base gap-2.5',
    };

    const iconOnly = !children && icon;
    const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };

    const computedAriaLabel = iconOnly && !ariaLabel && typeof icon === 'object' 
      ? 'Botón de acción' 
      : ariaLabel;

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled}
        aria-label={computedAriaLabel}
        aria-disabled={disabled}
        {...props}
      >
        {icon && iconPosition === 'left' && (
          <span className={iconOnly ? '' : iconSizes[size]} aria-hidden="true">
            {icon}
          </span>
        )}
        {children && <span>{children}</span>}
        {icon && iconPosition === 'right' && (
          <span className={iconOnly ? '' : iconSizes[size]} aria-hidden="true">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
