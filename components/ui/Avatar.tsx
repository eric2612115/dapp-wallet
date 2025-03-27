// components/ui/Avatar.tsx
import React from 'react';
import clsx from 'clsx';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'rounded' | 'square';
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ 
    src, 
    alt = '', 
    initials, 
    size = 'md', 
    variant = 'circle', 
    className, 
    ...props 
  }, ref) => {
    const sizeClasses = {
      xs: 'h-6 w-6 text-xs',
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg',
      xl: 'h-16 w-16 text-xl',
    };
    
    const variantClasses = {
      circle: 'rounded-full',
      rounded: 'rounded-md',
      square: 'rounded-none',
    };
    
    // Handle error if image fails to load
    const [error, setError] = React.useState(false);
    
    return (
      <div
        ref={ref}
        className={clsx(
          'flex items-center justify-center bg-gray-200 dark:bg-dark-100 text-gray-700 dark:text-gray-300 font-medium overflow-hidden',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {src && !error ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={() => setError(true)}
          />
        ) : initials ? (
          <span>{initials}</span>
        ) : (
          <span>
            {/* Default user icon if no image or initials */}
            <svg
              className="h-full w-full text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;