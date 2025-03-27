// components/ui/Modal.tsx
import React from 'react';
import clsx from 'clsx';
import { Close as CloseIcon } from '@mui/icons-material';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  className,
}) => {
  // Handle ESC key
  React.useEffect(() => {
    if (!isOpen) return;
    
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    'full': 'max-w-full',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          className={clsx(
            'relative transform overflow-hidden rounded-lg bg-white dark:bg-dark-200 text-left shadow-xl transition-all sm:my-8 w-full',
            maxWidthClasses[maxWidth],
            className
          )}
        >
          {/* Header with Close Button */}
          {title && (
            <div className="border-b border-gray-200 dark:border-dark-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {title}
                </h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
                  onClick={onClose}
                >
                  <CloseIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
          
          {/* Modal Content */}
          <div className={!title ? 'pt-5' : ''}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

const ModalBody: React.FC<ModalBodyProps> = ({ children, className }) => {
  return (
    <div className={clsx('px-6 py-4', className)}>
      {children}
    </div>
  );
};

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ children, className }) => {
  return (
    <div className={clsx('px-6 py-4 border-t border-gray-200 dark:border-dark-100 bg-gray-50 dark:bg-dark-200 flex justify-end space-x-3', className)}>
      {children}
    </div>
  );
};

export { Modal, ModalBody, ModalFooter };