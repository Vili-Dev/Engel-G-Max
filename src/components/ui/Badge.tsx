import React, { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'glass' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
  pulse?: boolean;
  glow?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    children,
    className,
    variant = 'default',
    size = 'md',
    rounded = true,
    removable = false,
    onRemove,
    icon,
    pulse = false,
    glow = false,
    ...props
  }, ref) => {

    const baseClasses = clsx(
      'inline-flex items-center justify-center font-medium',
      'transition-all duration-200 ease-in-out',
      'select-none',
      rounded ? 'rounded-full' : 'rounded-md',
      pulse && 'animate-pulse',
      glow && 'shadow-lg',
    );

    const variantClasses = {
      default: clsx(
        'bg-gray-100 text-gray-800 border border-gray-200',
        'dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700',
        glow && 'shadow-gray-500/20 dark:shadow-gray-400/20'
      ),
      
      primary: clsx(
        'bg-primary-100 text-primary-800 border border-primary-200',
        'dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-700/50',
        glow && 'shadow-primary-500/30'
      ),
      
      secondary: clsx(
        'bg-secondary-100 text-secondary-800 border border-secondary-200',
        'dark:bg-secondary-900/30 dark:text-secondary-300 dark:border-secondary-700/50',
        glow && 'shadow-secondary-500/30'
      ),
      
      success: clsx(
        'bg-green-100 text-green-800 border border-green-200',
        'dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50',
        glow && 'shadow-green-500/30'
      ),
      
      warning: clsx(
        'bg-yellow-100 text-yellow-800 border border-yellow-200',
        'dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700/50',
        glow && 'shadow-yellow-500/30'
      ),
      
      error: clsx(
        'bg-red-100 text-red-800 border border-red-200',
        'dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/50',
        glow && 'shadow-red-500/30'
      ),
      
      glass: clsx(
        'glass-badge backdrop-blur-xl',
        'bg-white/10 dark:bg-white/5 text-white',
        'border border-white/20 dark:border-white/10',
        glow && 'shadow-white/20'
      ),
      
      outline: clsx(
        'bg-transparent border-2',
        'border-gray-300 text-gray-700',
        'dark:border-gray-600 dark:text-gray-300',
        'hover:bg-gray-50 dark:hover:bg-gray-800/50'
      ),
    };

    const sizeClasses = {
      sm: clsx(
        'px-2 py-1 text-xs min-h-[20px]',
        icon && 'pl-1.5'
      ),
      md: clsx(
        'px-3 py-1.5 text-sm min-h-[24px]',
        icon && 'pl-2'
      ),
      lg: clsx(
        'px-4 py-2 text-base min-h-[32px]',
        icon && 'pl-3'
      ),
    };

    const iconSizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };

    const classes = clsx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    return (
      <span
        ref={ref}
        className={classes}
        {...props}
      >
        {/* Icon */}
        {icon && (
          <span className={clsx(
            'inline-flex items-center justify-center mr-1',
            iconSizeClasses[size]
          )}>
            {icon}
          </span>
        )}

        {/* Content */}
        {children}

        {/* Remove button */}
        {removable && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className={clsx(
              'inline-flex items-center justify-center ml-1 rounded-full',
              'hover:bg-black/10 dark:hover:bg-white/10',
              'transition-colors duration-150',
              size === 'sm' ? 'w-3 h-3 p-0.5' :
              size === 'md' ? 'w-4 h-4 p-0.5' :
              'w-5 h-5 p-1'
            )}
            aria-label="Supprimer"
          >
            <X className={clsx(
              size === 'sm' ? 'w-2 h-2' :
              size === 'md' ? 'w-3 h-3' :
              'w-4 h-4'
            )} />
          </button>
        )}

        {/* Glow effect overlay */}
        {glow && (
          <span className="absolute inset-0 rounded-inherit bg-current opacity-20 blur-sm -z-10" />
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Status Badge Component for specific status indicators
export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'online' | 'offline' | 'busy' | 'away' | 'active' | 'inactive' | 'pending' | 'approved' | 'rejected';
  showDot?: boolean;
  animated?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showDot = true,
  animated = true,
  children,
  ...props
}) => {
  const statusConfig = {
    online: { variant: 'success' as const, label: 'En ligne', dotColor: 'bg-green-500' },
    offline: { variant: 'default' as const, label: 'Hors ligne', dotColor: 'bg-gray-400' },
    busy: { variant: 'error' as const, label: 'Occupé', dotColor: 'bg-red-500' },
    away: { variant: 'warning' as const, label: 'Absent', dotColor: 'bg-yellow-500' },
    active: { variant: 'primary' as const, label: 'Actif', dotColor: 'bg-primary-500' },
    inactive: { variant: 'default' as const, label: 'Inactif', dotColor: 'bg-gray-400' },
    pending: { variant: 'warning' as const, label: 'En attente', dotColor: 'bg-yellow-500' },
    approved: { variant: 'success' as const, label: 'Approuvé', dotColor: 'bg-green-500' },
    rejected: { variant: 'error' as const, label: 'Rejeté', dotColor: 'bg-red-500' },
  };

  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      icon={showDot ? (
        <span className={clsx(
          'w-2 h-2 rounded-full',
          config.dotColor,
          animated && ['online', 'active', 'pending'].includes(status) && 'animate-pulse'
        )} />
      ) : undefined}
      {...props}
    >
      {children || config.label}
    </Badge>
  );
};

// Count Badge Component for numbers
export interface CountBadgeProps extends Omit<BadgeProps, 'children'> {
  count: number;
  max?: number;
  showZero?: boolean;
}

export const CountBadge: React.FC<CountBadgeProps> = ({
  count,
  max = 99,
  showZero = false,
  variant = 'error',
  size = 'sm',
  ...props
}) => {
  if (!showZero && count === 0) {
    return null;
  }

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge
      variant={variant}
      size={size}
      className="min-w-[20px] h-5 text-xs font-bold"
      {...props}
    >
      {displayCount}
    </Badge>
  );
};

// Notification Badge Component
export interface NotificationBadgeProps extends BadgeProps {
  dot?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  children,
  dot = false,
  position = 'top-right',
  variant = 'error',
  size = 'sm',
  className,
  ...props
}) => {
  const positionClasses = {
    'top-right': '-top-2 -right-2',
    'top-left': '-top-2 -left-2',
    'bottom-right': '-bottom-2 -right-2',
    'bottom-left': '-bottom-2 -left-2',
  };

  return (
    <Badge
      variant={variant}
      size={size}
      className={clsx(
        'absolute',
        positionClasses[position],
        dot && 'w-3 h-3 p-0 min-h-0',
        className
      )}
      {...props}
    >
      {!dot && children}
    </Badge>
  );
};

export default Badge;