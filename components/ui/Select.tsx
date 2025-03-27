// components/ui/Select.tsx
import React from 'react';
import clsx from 'clsx';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  fullWidth?: boolean;
  className?: string;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    options, 
    value, 
    onChange, 
    label, 
    error, 
    fullWidth = false, 
    className, 
    placeholder = 'Select an option', 
    disabled,
    ...props 
  }, ref) => {
    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" 
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={clsx(
              'block appearance-none w-full border border-gray-300 dark:border-dark-100 rounded-md shadow-sm',
              'focus:outline-none focus:ring-clay-500 dark:focus:ring-clay-400 focus:border-clay-500 dark:focus:border-clay-400',
              'bg-white dark:bg-dark-300 text-gray-700 dark:text-gray-200',
              'pr-10 pl-3 py-2',
              'disabled:bg-gray-100 dark:disabled:bg-dark-200 disabled:cursor-not-allowed disabled:text-gray-500 dark:disabled:text-gray-400',
              error ? 'border-red-500 dark:border-red-500' : '',
              className
            )}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;