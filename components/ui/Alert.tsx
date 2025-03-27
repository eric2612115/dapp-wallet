// components/ui/Alert.tsx
import React from 'react';
import clsx from 'clsx';
import {
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

type AlertVariant = 'default' | 'info' | 'success' | 'warning' | 'error';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: AlertVariant;
  title?: string;
  onClose?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ children, variant = 'default', title, onClose, className, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-gray-50 dark:bg-dark-100 border-gray-200 dark:border-dark-100 text-gray-800 dark:text-gray-200',
      info: 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30 text-blue-800 dark:text-blue-300',
      success: 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30 text-green-800 dark:text-green-300',
      warning: 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      error: 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-300',
    };
    
    const iconMap = {
      default: null,
      info: <InfoIcon className="h-5 w-5" />,
      success: <SuccessIcon className="h-5 w-5" />,
      warning: <WarningIcon className="h-5 w-5" />,
      error: <ErrorIcon className="h-5 w-5" />,
    };
    
    const icon = iconMap[variant];
    
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-md border p-4 relative',
          variantClasses[variant],
          className
        )}
        role="alert"
        {...props}
      >
        <div className="flex">
          {icon && (
            <div className="flex-shrink-0 mr-3">
              {icon}
            </div>
          )}
          <div className="flex-1">
            {title && (
              <h3 className="text-sm font-medium mb-1">
                {title}
              </h3>
            )}

<div className="text-sm">
  {children}
</div>
</div>
{onClose && (
<div className="ml-auto pl-3">
  <button
    type="button"
    className="inline-flex rounded-md bg-transparent text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
    onClick={onClose}
    aria-label="Dismiss"
  >
    <CloseIcon className="h-5 w-5" />
  </button>
</div>
)}
</div>
</div>
);
}
);

Alert.displayName = 'Alert';

interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
children: React.ReactNode;
}

const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
({ children, className, ...props }, ref) => {
return (
<h3
ref={ref}
className={clsx('text-sm font-medium mb-1', className)}
{...props}
>
{children}
</h3>
);
}
);

AlertTitle.displayName = 'AlertTitle';

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
children: React.ReactNode;
}

const AlertDescription = React.forwardRef<HTMLDivElement, AlertDescriptionProps>(
({ children, className, ...props }, ref) => {
return (
<div
ref={ref}
className={clsx('text-sm', className)}
{...props}
>
{children}
</div>
);
}
);

AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };