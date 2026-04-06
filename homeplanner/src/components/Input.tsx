import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3.5 py-2.5 border border-border rounded-lg bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150 ${
            error ? 'border-danger focus:ring-danger/20 focus:border-danger' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-sm text-text-tertiary">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
