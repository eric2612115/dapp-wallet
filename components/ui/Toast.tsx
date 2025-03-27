// components/ui/Toast.tsx
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { 
  CheckCircle as SuccessIcon, 
  Error as ErrorIcon, 
  Info as InfoIcon, 
  Warning as WarningIcon,
  Close as CloseIcon
} from '@mui/icons-material';

type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
type ToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface ToastProps {
  open: boolean;
  variant?: ToastVariant;
  title?: string;
  description?: string;
  duration?: number; // in milliseconds
  onClose: () => void;
  position?: ToastPosition;
}

const Toast: React.FC<ToastProps> = ({
  open,
  variant = 'default',
  title,
  description,
  duration = 5000,
  onClose,
  position = 'bottom-right',
}) => {
  const [isVisible, setIsVisible] = useState(open);
  
  useEffect(() => {
    setIsVisible(open);
    
    let timer: NodeJS.Timeout;
    if (open && duration !== Infinity) {
      timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300); // Allow exit animation to complete
      }, duration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [open, duration, onClose]);
  
  if (!open) return null;
  
  const variantClasses = {
    default: 'bg-white dark:bg-dark-200 border-gray-200 dark:border-dark-100',
    success: 'bg-white dark:bg-dark-200 border-green-500 dark:border-green-600',
    error: 'bg-white dark:bg-dark-200 border-red-500 dark:border-red-600',
    warning: 'bg-white dark:bg-dark-200 border-yellow-500 dark:border-yellow-600',
    info: 'bg-white dark:bg-dark-200 border-blue-500 dark:border-blue-600',
  };
  
  const iconMap = {
    default: null,
    success: <SuccessIcon className="h-5 w-5 text-green-500 dark:text-green-400" />,
    error: <ErrorIcon className="h-5 w-5 text-red-500 dark:text-red-400" />,
    warning: <WarningIcon className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />,
    info: <InfoIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
  };
  
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };
  
  const icon = iconMap[variant];
  
  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300); // Allow exit animation to complete
  };
  
  return (
    <div
      className={clsx(
        'fixed z-50 max-w-sm shadow-lg rounded-lg border-l-4 overflow-hidden transition-all duration-300 ease-in-out',
        variantClasses[variant],
        positionClasses[position],
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}
      role="alert"
    >
      <div className="p-4 flex">
        {icon && (
          <div className="flex-shrink-0 mr-3">
            {icon}
          </div>
        )}
        <div className="flex-1">
          {title && (
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              {title}
            </h4>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        <button
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
          onClick={handleDismiss}
          aria-label="Close"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>
      
      {/* Progress bar */}
      {duration !== Infinity && (
        <div className="h-0.5 bg-gray-100 dark:bg-dark-100 overflow-hidden">
          <div 
            className={clsx(
              'h-full transition-all',
              variant === 'default' ? 'bg-gray-500 dark:bg-gray-400' :
              variant === 'success' ? 'bg-green-500 dark:bg-green-400' :
              variant === 'error' ? 'bg-red-500 dark:bg-red-400' :
              variant === 'warning' ? 'bg-yellow-500 dark:bg-yellow-400' :
              'bg-blue-500 dark:bg-blue-400'
            )}
            style={{ 
              width: '100%', 
              animationName: 'toast-progress',
              animationDuration: `${duration}ms`,
              animationTimingFunction: 'linear',
              animationFillMode: 'forwards'
            }}
          />
        </div>
      )}
      
      <style jsx>{`
        @keyframes toast-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;