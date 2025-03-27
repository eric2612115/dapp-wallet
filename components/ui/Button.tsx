// components/ui/Button.tsx
import React from 'react';
import clsx from 'clsx';

type ButtonVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'default', 
    size = 'md', 
    fullWidth = false, 
    startIcon, 
    endIcon, 
    isLoading = false,
    className, 
    disabled,
    ...props 
  }, ref) => {
    const variantClasses = {
      default: 'bg-warm-paper dark:bg-dark-200 border border-warm-divider dark:border-dark-100 text-warm-text dark:text-gray-200 hover:bg-warm-bg dark:hover:bg-dark-100',
      primary: 'bg-warm-primary hover:bg-warm-primary/90 text-white border border-transparent',
      secondary: 'bg-blue-600 hover:bg-blue-700 text-white border border-transparent',
      outline: 'bg-transparent border border-warm-primary dark:border-warm-primary/80 text-warm-primary dark:text-warm-primary/80 hover:bg-warm-primary/10 dark:hover:bg-warm-primary/20',
      ghost: 'bg-transparent text-warm-text dark:text-gray-300 hover:bg-warm-bg dark:hover:bg-dark-100 border-transparent',
      danger: 'bg-red-600 hover:bg-red-700 text-white border border-transparent',
    };
    
    const sizeClasses = {
      sm: 'px-3 py-1 text-xs rounded',
      md: 'px-4 py-2 text-sm rounded-md',
      lg: 'px-6 py-3 text-base rounded-md',
    };
    
    return (
      <button
        ref={ref}
        className={clsx(
          'font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warm-primary dark:focus:ring-warm-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth ? 'w-full' : '',
          'inline-flex items-center justify-center',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {startIcon && !isLoading && <span className="mr-2">{startIcon}</span>}
        {children}
        {endIcon && <span className="ml-2">{endIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;