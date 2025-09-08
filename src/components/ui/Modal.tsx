import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'glass';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  footer?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  variant = 'glass',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  className,
  overlayClassName,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Handle focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Focus the modal after a brief delay to ensure it's rendered
      setTimeout(() => {
        if (modalRef.current) {
          const focusableElement = modalRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement;
          
          if (focusableElement) {
            focusableElement.focus();
          } else {
            modalRef.current.focus();
          }
        }
      }, 100);
    } else {
      // Restore focus when modal closes
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw] max-h-[95vh]',
  };

  const variantClasses = {
    default: clsx(
      'bg-white dark:bg-gray-900',
      'border border-gray-200 dark:border-gray-700',
      'shadow-2xl'
    ),
    glass: clsx(
      'glass-modal backdrop-blur-2xl',
      'bg-white/10 dark:bg-white/5',
      'border border-white/20 dark:border-white/10',
      'shadow-2xl'
    ),
  };

  const overlayVariantClasses = {
    default: 'bg-black/50',
    glass: 'glass-modal-backdrop',
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          className={clsx(
            'fixed inset-0 z-50 flex items-center justify-center p-4',
            overlayVariantClasses[variant],
            overlayClassName
          )}
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={description ? 'modal-description' : undefined}
        >
          <motion.div
            ref={modalRef}
            className={clsx(
              'relative w-full rounded-3xl p-6 focus:outline-none',
              sizeClasses[size],
              variantClasses[variant],
              size === 'full' && 'h-full overflow-auto',
              className
            )}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
              mass: 0.8,
            }}
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            {/* Close Button */}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                className={clsx(
                  'absolute right-4 top-4 z-10',
                  'rounded-full p-2 min-h-8 w-8',
                  variant === 'glass' && 'text-white hover:bg-white/10'
                )}
                onClick={onClose}
                aria-label="Fermer la modal"
              >
                <X className="w-4 h-4" />
              </Button>
            )}

            {/* Header */}
            {(title || description) && (
              <div className="mb-6 pr-10">
                {title && (
                  <h2
                    id="modal-title"
                    className={clsx(
                      'text-2xl font-bold mb-2',
                      variant === 'glass' 
                        ? 'text-white' 
                        : 'text-gray-900 dark:text-gray-100'
                    )}
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    id="modal-description"
                    className={clsx(
                      'text-base',
                      variant === 'glass' 
                        ? 'text-gray-200' 
                        : 'text-gray-600 dark:text-gray-400'
                    )}
                  >
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Content */}
            <div className={clsx(
              size === 'full' && 'flex-1 overflow-auto'
            )}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-3">
                {footer}
              </div>
            )}

            {/* Glass effect overlay for better contrast */}
            {variant === 'glass' && (
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-3xl" />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // Render modal in portal
  return createPortal(modalContent, document.body);
};

// Confirmation Modal Component
export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'info',
  loading = false,
}) => {
  const variantColors = {
    danger: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  };

  const buttonVariants = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    info: 'bg-primary-600 hover:bg-primary-700 text-white',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      variant="glass"
    >
      <div className="text-center">
        <div className={clsx(
          'mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4',
          variantColors[variant]
        )}>
          <span className="text-2xl">
            {variant === 'danger' ? '⚠️' : variant === 'warning' ? '⚠️' : 'ℹ️'}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2">
          {title}
        </h3>
        
        <p className="text-gray-200 mb-6">
          {message}
        </p>
        
        <div className="flex space-x-3 justify-center">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className="text-gray-300 hover:text-white hover:bg-white/10"
          >
            {cancelText}
          </Button>
          
          <Button
            onClick={onConfirm}
            loading={loading}
            className={buttonVariants[variant]}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Modal;