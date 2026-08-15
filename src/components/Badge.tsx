import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'bronze' | 'dark' | 'outline' | 'success';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'bronze',
  className = ''
}) => {
  const variants = {
    bronze: 'bg-brand-bronze/15 text-brand-bronze border border-brand-bronze/30',
    dark: 'bg-brand-elevated text-brand-cream border border-brand-border',
    outline: 'border border-brand-muted/40 text-brand-muted',
    success: 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium tracking-wide ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
