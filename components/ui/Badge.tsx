// components/ui/Badge.tsx
import React from 'react';
import clsx from 'clsx';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'default', size = 'md', className, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-gray-100 dark:bg-dark-100 text-gray-800 dark:text-gray-300',
      primary: 'bg-clay-100 dark:bg-clay-900/30 text-clay-800 dark:text-clay-300',
      secondary: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      danger: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      info: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300',
    };
    
    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-base',
    };
    
    return (
      <span
        ref={ref}
        className={clsx(
          'inline-flex items-center font-medium rounded-full',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;