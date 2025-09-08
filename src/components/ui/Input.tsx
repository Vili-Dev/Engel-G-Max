import React, { InputHTMLAttributes, forwardRef, useState } from 'react';
import { clsx } from 'clsx';
import { Eye, EyeOff, Search, X } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'glass' | 'floating' | 'search';
  fullWidth?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = 'text',
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    variant = 'default',
    fullWidth = true,
    clearable = false,
    value,
    onClear,
    disabled,
    ...props
  }, ref) => {
    
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    
    const actualType = type === 'password' && showPassword ? 'text' : type;
    const hasValue = value !== undefined && value !== null && value !== '';
    
    const containerClasses = clsx(
      'relative',
      fullWidth ? 'w-full' : 'w-auto'
    );

    const inputClasses = clsx(
      'w-full rounded-lg border transition-all duration-200',
      'placeholder:text-gray-500 dark:placeholder:text-gray-400',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      
      // Variant styles
      variant === 'default' && clsx(
        'bg-white dark:bg-gray-900',
        'border-gray-300 dark:border-gray-600',
        'text-gray-900 dark:text-gray-100',
        'focus:border-primary-500 dark:focus:border-primary-400',
        error ? 'border-red-500 focus:ring-red-500' : '',
      ),
      
      variant === 'glass' && clsx(
        'glass-input backdrop-blur-xl',
        'bg-white/10 dark:bg-white/5',
        'border-white/20 dark:border-white/10',
        'text-gray-900 dark:text-gray-100',
        'focus:bg-white/20 dark:focus:bg-white/10',
        'focus:border-white/30 dark:focus:border-white/20',
        error ? 'border-red-400/60 focus:ring-red-400/50' : '',
      ),
      
      variant === 'floating' && clsx(
        'bg-transparent border-b-2 border-gray-300 dark:border-gray-600',
        'rounded-none pb-2 pt-6',
        'text-gray-900 dark:text-gray-100',
        'focus:border-primary-500 dark:focus:border-primary-400',
        error ? 'border-red-500 focus:ring-red-500' : '',
      ),
      
      variant === 'search' && clsx(
        'glass-search-input rounded-full px-6 py-3',
        'bg-white/10 dark:bg-white/5 backdrop-blur-xl',
        'border-white/20 dark:border-white/10',
        'text-gray-900 dark:text-gray-100',
        'focus:bg-white/20 dark:focus:bg-white/10',
        'focus:scale-105',
      ),
      
      // Padding adjustments for icons
      leftIcon && (variant === 'search' ? 'pl-12' : 'pl-10'),
      (rightIcon || type === 'password' || clearable) && 'pr-10',
      
      className
    );

    const labelClasses = clsx(
      'block text-sm font-medium mb-2',
      error ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300',
      
      // Floating label styles
      variant === 'floating' && clsx(
        'absolute left-0 transition-all duration-200 pointer-events-none',
        'origin-top-left transform',
        isFocused || hasValue ? 
          'text-xs -translate-y-4 scale-90 text-primary-600 dark:text-primary-400' :
          'text-base translate-y-2 text-gray-500 dark:text-gray-400'
      )
    );

    return (
      <div className={containerClasses}>
        {/* Label */}
        {label && variant !== 'floating' && (
          <label className={labelClasses}>
            {label}
          </label>
        )}
        
        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className={clsx(
              'absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none',
              'text-gray-400 dark:text-gray-500',
              variant === 'search' && 'text-gray-600 dark:text-gray-300'
            )}>
              {leftIcon}
            </div>
          )}
          
          {/* Search Icon for search variant */}
          {variant === 'search' && !leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
          )}
          
          {/* Input Field */}
          <input
            ref={ref}
            type={actualType}
            className={inputClasses}
            value={value}
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          
          {/* Floating Label */}
          {label && variant === 'floating' && (
            <label className={labelClasses}>
              {label}
            </label>
          )}
          
          {/* Right Side Icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {/* Clear Button */}
            {clearable && hasValue && !disabled && (
              <button
                type="button"
                onClick={onClear}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            {/* Password Toggle */}
            {type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}
            
            {/* Custom Right Icon */}
            {rightIcon && type !== 'password' && (
              <div className="text-gray-400 dark:text-gray-500">
                {rightIcon}
              </div>
            )}
          </div>
        </div>
        
        {/* Helper Text or Error */}
        {(helperText || error) && (
          <p className={clsx(
            'mt-2 text-sm',
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;