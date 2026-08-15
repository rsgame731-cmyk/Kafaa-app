import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-medium uppercase tracking-wider text-brand-muted">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-4 ltr:left-4 rtl:right-4 text-brand-muted pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`w-full bg-brand-surface border border-brand-border text-brand-cream placeholder-brand-muted text-sm rounded-input py-3 px-4 ${
            icon ? 'ltr:pl-11 rtl:pr-11' : ''
          } focus:outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze transition-colors ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
};
