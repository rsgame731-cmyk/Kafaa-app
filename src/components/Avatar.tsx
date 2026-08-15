import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  verified?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  verified = false,
  className = ''
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`${sizes[size]} rounded-full object-cover border border-brand-border shadow-dark-soft`}
      />
      {verified && (
        <span
          title="Verified Algerian Professional"
          className="absolute bottom-0 right-0 ltr:right-0 rtl:left-0 bg-brand-bronze text-brand-dark p-0.5 rounded-full border-2 border-brand-dark flex items-center justify-center"
        >
          <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
          </svg>
        </span>
      )}
    </div>
  );
};
