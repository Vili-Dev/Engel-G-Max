import React, { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'glassheavy' | 'outline' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  interactive?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  border?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    children,
    className,
    variant = 'default',
    padding = 'md',
    hover = false,
    interactive = false,
    rounded = 'lg',
    border = true,
    shadow = 'md',
    ...props
  }, ref) => {

    const baseClasses = clsx(
      'relative transition-all duration-200 ease-in-out',
      interactive && 'cursor-pointer select-none',
    );

    const variantClasses = {
      default: clsx(
        'bg-white dark:bg-gray-900',
        border && 'border border-gray-200 dark:border-gray-700',
        shadow !== 'none' && {
          'shadow-sm': shadow === 'sm',
          'shadow-md': shadow === 'md',
          'shadow-lg': shadow === 'lg',
          'shadow-xl': shadow === 'xl',
          'shadow-2xl': shadow === '2xl',
        }
      ),
      
      outline: clsx(
        'bg-transparent border-2',
        'border-gray-300 dark:border-gray-600',
        'hover:border-primary-400 dark:hover:border-primary-500'
      ),
      
      elevated: clsx(
        'bg-white dark:bg-gray-800',
        'shadow-lg hover:shadow-xl',
        border && 'border border-gray-100 dark:border-gray-700'
      ),
      
      glass: clsx(
        'glass-card backdrop-blur-xl',
        'bg-white/10 dark:bg-white/5',
        'border border-white/20 dark:border-white/10',
        'shadow-xl'
      ),
      
      glassheavy: clsx(
        'glass-card-heavy backdrop-blur-2xl',
        'bg-white/20 dark:bg-white/10',
        'border border-white/30 dark:border-white/20',
        'shadow-2xl'
      ),
    };

    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-4 sm:p-6',
      lg: 'p-6 sm:p-8',
      xl: 'p-8 sm:p-10',
    };

    const roundedClasses = {
      none: '',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      '3xl': 'rounded-3xl',
      full: 'rounded-full',
    };

    const hoverClasses = hover || interactive ? clsx(
      'hover:-translate-y-1 hover:scale-[1.02]',
      variant.startsWith('glass') ? 'hover:shadow-2xl hover:shadow-primary-500/25' : 'hover:shadow-lg',
      interactive && 'active:scale-[0.98] active:translate-y-0'
    ) : '';

    const classes = clsx(
      baseClasses,
      variantClasses[variant],
      paddingClasses[padding],
      roundedClasses[rounded],
      hoverClasses,
      className
    );

    return (
      <motion.div
        ref={ref}
        className={classes}
        whileHover={hover || interactive ? { y: -4, scale: 1.02 } : undefined}
        whileTap={interactive ? { scale: 0.98, y: 0 } : undefined}
        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
        {...props}
      >
        {children}
        
        {/* Glass shimmer effect */}
        {variant.startsWith('glass') && hover && (
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer" />
          </div>
        )}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

// Card Header Component
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
  title,
  subtitle,
  action,
  badge,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'flex items-start justify-between mb-4',
        className
      )}
      {...props}
    >
      <div className="flex-1 min-w-0">
        {badge && (
          <div className="mb-2">
            {badge}
          </div>
        )}
        
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-tight">
            {title}
          </h3>
        )}
        
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
        
        {children}
      </div>
      
      {action && (
        <div className="ml-4 flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

// Card Body Component
export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  // No additional props needed
}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx('flex-1', className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Footer Component  
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right' | 'between';
  border?: boolean;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
  align = 'right',
  border = true,
  ...props
}) => {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center', 
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={clsx(
        'flex items-center mt-6 pt-4',
        alignClasses[align],
        border && 'border-t border-gray-200 dark:border-gray-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Image Component
export interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: '16/9' | '4/3' | '1/1' | '3/4';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const CardImage: React.FC<CardImageProps> = ({
  className,
  aspectRatio = '16/9',
  objectFit = 'cover',
  rounded = 'lg',
  alt = '',
  ...props
}) => {
  const aspectRatioClasses = {
    '16/9': 'aspect-[16/9]',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    '3/4': 'aspect-[3/4]',
  };

  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  };

  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md', 
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  return (
    <div className={clsx(
      'relative overflow-hidden',
      aspectRatioClasses[aspectRatio],
      roundedClasses[rounded]
    )}>
      <img
        className={clsx(
          'w-full h-full',
          objectFitClasses[objectFit],
          'transition-transform duration-300 ease-in-out',
          'hover:scale-110',
          className
        )}
        alt={alt}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

export default Card;