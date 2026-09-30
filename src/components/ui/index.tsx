import React, { ReactNode, useState } from 'react';
import { cn } from '../../lib/utils';
import { User } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm";

  const sizeStyles = {
    sm: "text-xs px-2.5 py-1.5 gap-1.5",
    md: "text-xs px-3.5 py-2 gap-2",
    lg: "text-sm px-4 py-2.5 gap-2"
  };

  const variantStyles = {
    primary: "bg-teal-700 hover:bg-teal-800 text-white border border-teal-800 focus:ring-teal-600 shadow-xs",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 focus:ring-slate-400 shadow-2xs",
    outline: "bg-transparent hover:bg-slate-100 text-slate-700 border border-slate-300 focus:ring-slate-400",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 shadow-none border-transparent focus:ring-slate-400",
    danger: "bg-rose-600 hover:bg-rose-700 text-white border border-rose-700 focus:ring-rose-500 shadow-xs",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 focus:ring-emerald-500 shadow-xs"
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};

export const Card: React.FC<{
  children: ReactNode;
  className?: string;
  id?: string;
  onClick?: () => void;
}> = ({ children, className, id, onClick }) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={cn(
        "rounded-xl border border-slate-200/90 bg-white text-slate-900 shadow-2xs",
        onClick && "cursor-pointer hover:border-teal-400/80 hover:shadow-xs transition-all",
        className
      )}
    >
      {children}
    </div>
  );
};

export const Badge: React.FC<{
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'outline';
  className?: string;
}> = ({ children, variant = 'default', className }) => {
  const variantStyles = {
    default: "bg-slate-50 text-slate-700 border-slate-200",
    primary: "bg-teal-50 text-teal-800 border-teal-200",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-rose-50 text-rose-800 border-rose-200",
    purple: "bg-indigo-50 text-indigo-800 border-indigo-200",
    outline: "bg-transparent text-slate-600 border-slate-300"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border tracking-wide whitespace-nowrap",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }> = ({
  label,
  error,
  className,
  id,
  ...props
}) => {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm transition-colors disabled:opacity-50 disabled:bg-slate-50",
          error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-[10px] text-rose-600 mt-1 font-medium">{error}</p>}
    </div>
  );
};

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}> = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'md' }) => {
  if (!isOpen) return null;

  const widthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div
        className={cn(
          "relative w-full rounded-xl border border-slate-200 bg-white p-5 shadow-xl transition-all my-8 text-slate-900",
          widthStyles[maxWidth]
        )}
      >
        <div className="flex items-start justify-between pb-3 border-b border-slate-200 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors text-sm"
            id="btn-modal-close"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export interface UserAvatarProps {
  avatarUrl?: string | null;
  name?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  avatarUrl,
  name,
  size = 'md',
  className
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeMap = {
    xs: { box: 'w-6 h-6 text-[10px]', icon: 'w-3 h-3' },
    sm: { box: 'w-8 h-8 text-xs', icon: 'w-4 h-4' },
    md: { box: 'w-10 h-10 text-sm', icon: 'w-5 h-5' },
    lg: { box: 'w-12 h-12 text-base', icon: 'w-6 h-6' },
    xl: { box: 'w-16 h-16 text-lg', icon: 'w-8 h-8' },
    '2xl': { box: 'w-20 h-20 text-xl font-bold', icon: 'w-10 h-10' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Compute clean initials if name is provided
  const getInitials = (n?: string | null): string => {
    if (!n || !n.trim()) return '';
    const parts = n.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  // If a valid avatar URL exists and hasn't errored
  if (avatarUrl && avatarUrl.trim() && !imageError) {
    return (
      <div className={cn("rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100 flex items-center justify-center", currentSize.box, className)}>
        <img
          src={avatarUrl.trim()}
          alt={name || 'User Avatar'}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // If no photo or errored, render clean initials
  if (initials) {
    return (
      <div
        className={cn(
          "rounded-lg overflow-hidden shrink-0 font-bold flex items-center justify-center bg-teal-800 text-teal-50 border border-teal-700/80 select-none shadow-2xs",
          currentSize.box,
          className
        )}
        title={name || undefined}
      >
        {initials}
      </div>
    );
  }

  // Fallback to neutral profile icon
  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-slate-100 text-slate-500 border border-slate-200 select-none",
        currentSize.box,
        className
      )}
      title="No profile picture"
    >
      <User className={currentSize.icon} />
    </div>
  );
};

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 text-slate-600 space-y-3",
        className
      )}
    >
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mb-1">
          {icon}
        </div>
      )}
      <div className="max-w-md space-y-1">
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <div className="pt-2">
          <Button size="sm" variant="primary" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};

