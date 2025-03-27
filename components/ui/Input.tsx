// components/ui/Input.tsx
import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text', 
    label, 
    error, 
    startIcon, 
    endIcon, 
    fullWidth = false,
    ...props 
  }, ref) => {
    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label 
            className="block text-sm font-medium text-warm-text dark:text-gray-300 mb-1" 
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-warm-textSecondary">
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={clsx(
              'block border border-warm-divider dark:border-dark-100 rounded-md shadow-sm',
              'focus:outline-none focus:ring-warm-primary dark:focus:ring-warm-primary focus:border-warm-primary dark:focus:border-warm-primary',
              'bg-warm-paper dark:bg-dark-300 text-warm-text dark:text-gray-200',
              'placeholder-warm-textSecondary/70 dark:placeholder-gray-500',
              'disabled:bg-warm-bg dark:disabled:bg-dark-200 disabled:cursor-not-allowed disabled:text-warm-textSecondary dark:disabled:text-gray-400',
              startIcon ? 'pl-10' : 'pl-3',
              endIcon ? 'pr-10' : 'pr-3',
              'py-2',
              fullWidth ? 'w-full' : '',
              error ? 'border-red-500 dark:border-red-500' : '',
              className
            )}
            {...props}
          />
          {endIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-warm-textSecondary">
              {endIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;