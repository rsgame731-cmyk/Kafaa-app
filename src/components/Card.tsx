import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  elevated = false
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-card p-5 border border-brand-border transition-all duration-200 ${
        elevated ? 'bg-brand-elevated shadow-elevated' : 'bg-brand-surface shadow-dark-soft'
      } ${
        hoverable ? 'hover:border-brand-bronze/40 hover:-translate-y-0.5 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
