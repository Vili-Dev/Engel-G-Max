import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass' | 'cta';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    fullWidth = false,
    leftIcon,
    rightIcon,
    ...props
  }, ref) => {
    
    const baseClasses = clsx(
      'inline-flex items-center justify-center font-medium rounded-lg',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
      'transition-all duration-200 ease-in-out',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      'relative overflow-hidden',
      fullWidth && 'w-full'
    );

    const variantClasses = {
      primary: clsx(
        'bg-primary-600 hover:bg-primary-700 active:bg-primary-800',
        'text-white shadow-lg hover:shadow-xl',
        'border border-primary-600 hover:border-primary-700'
      ),
      secondary: clsx(
        'bg-secondary-600 hover:bg-secondary-700 active:bg-secondary-800',
        'text-white shadow-lg hover:shadow-xl',
        'border border-secondary-600 hover:border-secondary-700'
      ),
      outline: clsx(
        'bg-transparent hover:bg-primary-50 active:bg-primary-100',
        'text-primary-600 hover:text-primary-700',
        'border-2 border-primary-300 hover:border-primary-400',
        'dark:hover:bg-primary-950 dark:active:bg-primary-900',
        'dark:text-primary-400 dark:hover:text-primary-300',
        'dark:border-primary-700 dark:hover:border-primary-600'
      ),
      ghost: clsx(
        'bg-transparent hover:bg-gray-100 active:bg-gray-200',
        'text-gray-700 hover:text-gray-900',
        'border-0',
        'dark:hover:bg-gray-800 dark:active:bg-gray-700',
        'dark:text-gray-300 dark:hover:text-gray-100'
      ),
      glass: clsx(
        'glass-btn-secondary backdrop-blur-xl',
        'text-white hover:text-white',
        'border border-white/20 hover:border-white/30',
        'shadow-lg hover:shadow-2xl hover:shadow-primary-500/25',
        'hover:scale-105 hover:-translate-y-1'
      ),
      cta: clsx(
        'cta-button relative overflow-hidden',
        'text-white font-bold',
        'shadow-2xl hover:shadow-2xl hover:shadow-secondary-500/50',
        'border-0',
        'animate-pulse-glow hover:animate-none'
      )
    };

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm min-h-[36px]',
      md: 'px-4 py-2.5 text-base min-h-[44px]',
      lg: 'px-6 py-3 text-lg min-h-[52px]',
      xl: 'px-8 py-4 text-xl min-h-[60px]'
    };

    const classes = clsx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {/* Shimmer effect for glass buttons */}
        {variant === 'glass' && (
          <span className="absolute inset-0 -top-full bg-gradient-to-b from-transparent via-white/20 to-transparent transform rotate-12 animate-shimmer" />
        )}
        
        {/* CTA pulse effect */}
        {variant === 'cta' && (
          <span className="absolute inset-0 bg-gradient-to-r from-secondary-400 to-red-400 animate-pulse opacity-75" />
        )}

        {/* Content wrapper */}
        <span className="relative flex items-center justify-center gap-2">
          {loading ? (
            <Loader2 className={clsx(
              'animate-spin',
              size === 'sm' ? 'w-4 h-4' :
              size === 'md' ? 'w-5 h-5' :
              size === 'lg' ? 'w-6 h-6' :
              'w-7 h-7'
            )} />
          ) : leftIcon}
          
          {children && (
            <span className={loading ? 'opacity-0' : 'opacity-100'}>
              {children}
            </span>
          )}
          
          {!loading && rightIcon}
        </span>

        {/* Ripple effect */}
        <span className="absolute inset-0 overflow-hidden">
          <span className="absolute inset-0 rounded-lg bg-white opacity-0 scale-0 transition-all duration-500 ease-out group-active:opacity-20 group-active:scale-100" />
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;