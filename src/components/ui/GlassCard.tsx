import React, { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  intensity?: 'light' | 'medium' | 'heavy' | 'extreme';
  gradient?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  animated?: boolean;
  glowEffect?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  shadow?: boolean;
  blur?: 'light' | 'medium' | 'heavy';
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({
    children,
    className,
    intensity = 'medium',
    gradient = false,
    bordered = true,
    hoverable = true,
    animated = true,
    glowEffect = false,
    padding = 'lg',
    rounded = 'xl',
    shadow = true,
    blur = 'medium',
    ...props
  }, ref) => {

    const intensityClasses = {
      light: clsx(
        'bg-white/5 dark:bg-white/5',
        bordered && 'border border-white/10',
        'backdrop-blur-sm'
      ),
      medium: clsx(
        'bg-white/10 dark:bg-white/8',
        bordered && 'border border-white/20',
        'backdrop-blur-md'
      ),
      heavy: clsx(
        'bg-white/15 dark:bg-white/12',
        bordered && 'border border-white/30',
        'backdrop-blur-lg'
      ),
      extreme: clsx(
        'bg-white/20 dark:bg-white/15',
        bordered && 'border border-white/40',
        'backdrop-blur-xl'
      ),
    };

    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    };

    const roundedClasses = {
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      '3xl': 'rounded-3xl',
    };

    const shadowClasses = shadow ? {
      light: 'shadow-lg shadow-black/10',
      medium: 'shadow-xl shadow-black/15',
      heavy: 'shadow-2xl shadow-black/20',
    }[intensity] : '';

    const baseClasses = clsx(
      'relative overflow-hidden',
      'transition-all duration-300 ease-out',
      intensityClasses[intensity],
      paddingClasses[padding],
      roundedClasses[rounded],
      shadowClasses,
      animated && 'transform-gpu will-change-transform',
      className
    );

    const hoverClasses = hoverable ? clsx(
      'hover:scale-[1.02] hover:-translate-y-1',
      'hover:shadow-2xl hover:shadow-primary-500/20',
      intensity === 'light' && 'hover:bg-white/10 hover:border-white/20',
      intensity === 'medium' && 'hover:bg-white/15 hover:border-white/30',
      intensity === 'heavy' && 'hover:bg-white/20 hover:border-white/40',
      intensity === 'extreme' && 'hover:bg-white/25 hover:border-white/50',
    ) : '';

    const motionProps = animated ? {
      initial: { opacity: 0, y: 20, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      whileHover: hoverable ? { 
        scale: 1.02, 
        y: -4,
        transition: { type: 'spring', damping: 25, stiffness: 400 }
      } : undefined,
      transition: { 
        type: 'spring', 
        damping: 30, 
        stiffness: 300,
        mass: 0.8
      }
    } : {};

    return (
      <motion.div
        ref={ref}
        className={clsx(baseClasses, hoverClasses)}
        {...motionProps}
        {...props}
      >
        {/* Background gradient overlay */}
        {gradient && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-purple-500/10 pointer-events-none" />
        )}

        {/* Glow effect */}
        {glowEffect && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-purple-400/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-xl -z-10" />
        )}

        {/* Shimmer effect */}
        {hoverable && (
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full animate-shimmer"
              style={{
                animation: 'shimmer 2s ease-in-out infinite',
              }}
            />
          </div>
        )}

        {/* Border gradient animation */}
        {bordered && hoverable && (
          <div className="absolute inset-0 rounded-inherit opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 rounded-inherit bg-gradient-to-r from-primary-400/50 via-purple-400/50 to-primary-400/50 p-[1px]">
              <div className={clsx(
                'w-full h-full rounded-inherit',
                intensityClasses[intensity]
              )} />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Noise texture overlay for realistic glass effect */}
        <div 
          className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '128px 128px',
          }}
        />
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

// Glass Card variants for specific use cases

// Testimonial Glass Card
export interface TestimonialGlassCardProps extends GlassCardProps {
  author?: string;
  role?: string;
  avatar?: string;
  rating?: number;
  featured?: boolean;
}

export const TestimonialGlassCard: React.FC<TestimonialGlassCardProps> = ({
  children,
  author,
  role,
  avatar,
  rating,
  featured = false,
  ...props
}) => {
  return (
    <GlassCard
      intensity={featured ? 'heavy' : 'medium'}
      gradient={featured}
      glowEffect={featured}
      className={clsx(
        'testimonial-card',
        featured && 'ring-2 ring-primary-400/50'
      )}
      {...props}
    >
      {/* Quote icon */}
      <div className="absolute top-4 left-4 text-primary-400/60">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
        </svg>
      </div>

      {/* Content */}
      <div className="pt-8">
        {children}
      </div>

      {/* Rating */}
      {rating && (
        <div className="flex items-center mt-4 mb-4">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={clsx(
                'w-5 h-5',
                i < rating ? 'text-yellow-400' : 'text-gray-600'
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )}

      {/* Author info */}
      {(author || role) && (
        <div className="flex items-center mt-6 pt-4 border-t border-white/20">
          {avatar && (
            <img
              src={avatar}
              alt={author}
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
          )}
          <div>
            {author && (
              <p className="font-semibold text-white">{author}</p>
            )}
            {role && (
              <p className="text-sm text-gray-300">{role}</p>
            )}
          </div>
        </div>
      )}
    </GlassCard>
  );
};

// Product Glass Card
export interface ProductGlassCardProps extends GlassCardProps {
  image?: string;
  title?: string;
  price?: number;
  originalPrice?: number;
  badge?: string;
  onAddToCart?: () => void;
}

export const ProductGlassCard: React.FC<ProductGlassCardProps> = ({
  image,
  title,
  price,
  originalPrice,
  badge,
  onAddToCart,
  children,
  ...props
}) => {
  return (
    <GlassCard
      intensity="medium"
      padding="none"
      className="group overflow-hidden"
      {...props}
    >
      {/* Image */}
      {image && (
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {badge && (
            <div className="absolute top-4 left-4 bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {badge}
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={onAddToCart}
              className="glass-btn-primary px-6 py-2 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {title && (
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
            {title}
          </h3>
        )}

        {children}

        {/* Price */}
        {price && (
          <div className="flex items-center space-x-2 mt-4">
            <span className="text-2xl font-bold text-primary-400">
              €{price}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-400 line-through">
                €{originalPrice}
              </span>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default GlassCard;