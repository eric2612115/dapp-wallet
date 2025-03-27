// components/ui/Tabs.tsx
import React from 'react';
import clsx from 'clsx';

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'boxed' | 'pills';
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ children, className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'w-full',
          variant === 'default' && 'border-b border-gray-200 dark:border-dark-100',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';

interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'boxed' | 'pills';
}

const TabList = React.forwardRef<HTMLDivElement, TabListProps>(
  ({ children, className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'flex',
          variant === 'pills' && 'space-x-2',
          variant === 'boxed' && 'border-b border-gray-200 dark:border-dark-100',
          className
        )}
        role="tablist"
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabList.displayName = 'TabList';

interface TabTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  value: string;
  isActive?: boolean;
  variant?: 'default' | 'boxed' | 'pills';
}

const TabTrigger = React.forwardRef<HTMLButtonElement, TabTriggerProps>(
  ({ children, className, isActive, variant = 'default', ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center text-sm font-medium transition-all focus:outline-none disabled:pointer-events-none disabled:opacity-50";
    
    const variantClasses = {
      default: clsx(
        "relative h-10 px-4 -mb-px border-b-2",
        isActive 
          ? "border-clay-500 dark:border-clay-400 text-clay-500 dark:text-clay-400" 
          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
      ),
      boxed: clsx(
        "relative h-10 px-4 -mb-px border-b-2",
        isActive 
          ? "bg-white dark:bg-dark-200 border-gray-200 dark:border-dark-100 border-b-0 border-t-2 border-t-clay-500 dark:border-t-clay-400 border-r-2 border-l-2 rounded-t-md text-clay-500 dark:text-clay-400" 
          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
      ),
      pills: clsx(
        "rounded-md px-3 py-1.5",
        isActive 
          ? "bg-clay-500 text-white shadow-sm" 
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-100 hover:text-gray-900 dark:hover:text-white"
      ),
    };
    
    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

TabTrigger.displayName = 'TabTrigger';

interface TabContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  value: string;
  activeTab: string;
}

const TabContent = React.forwardRef<HTMLDivElement, TabContentProps>(
  ({ children, className, value, activeTab, ...props }, ref) => {
    if (value !== activeTab) return null;
    
    return (
      <div
        ref={ref}
        role="tabpanel"
        tabIndex={0}
        className={clsx(
          'mt-4 focus:outline-none',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabContent.displayName = 'TabContent';

export { Tabs, TabList, TabTrigger, TabContent };