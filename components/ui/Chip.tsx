// components/ui/Chip.tsx
import React from 'react';
import clsx from 'clsx';
import { Close as CloseIcon } from '@mui/icons-material';

type ChipVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
type ChipSize = 'sm' | 'md' | 'lg';

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: ChipVariant;
  size?: ChipSize;
  onDelete?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ 
    children, 
    variant = 'default', 
    size = 'md', 
    onDelete, 
    icon, 
    disabled = false,
    className, 
    ...props 
  }, ref) => {
    const variantClasses = {
      default: 'bg-gray-100 text-gray-800 dark:bg-dark-100 dark:text-gray-300',
      primary: 'bg-clay-100 text-clay-800 dark:bg-clay-900/30 dark:text-clay-300',
      secondary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      info: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    };
    
    const sizeClasses = {
      sm: 'text-xs h-6 px-2',
      md: 'text-sm h-8 px-3',
      lg: 'text-base h-10 px-4',
    };
    
    return (
      <div
        ref={ref}
        className={clsx(
          'inline-flex items-center rounded-full',
          variantClasses[variant],
          sizeClasses[size],
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          className
        )}
        {...props}
      >
        {icon && (
          <span className="mr-1.5 -ml-1">{icon}</span>
        )}
        <span className="truncate">{children}</span>
        {onDelete && !disabled && (
          <button
            type="button"
            className={clsx(
              "ml-1.5 -mr-1 text-current opacity-70 hover:opacity-100 focus:outline-none",
              size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6'
            )}
            onClick={onDelete}
            disabled={disabled}
            aria-label="Remove"
          >
            <CloseIcon fontSize="inherit" />
          </button>
        )}
      </div>
    );
  }
);

Chip.displayName = 'Chip';

export default Chip;