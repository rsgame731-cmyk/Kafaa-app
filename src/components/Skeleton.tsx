import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = 'h-4 w-full rounded-md' }) => {
  return (
    <div className={`shimmer-loading rounded-md ${className}`} />
  );
};

export const PostSkeleton: React.FC = () => {
  return (
    <div className="bg-brand-surface border border-brand-border/80 rounded-card p-4 space-y-3.5">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-3.5 w-1/3" />
          <Skeleton className="h-2.5 w-1/2" />
        </div>
      </div>
      <div className="space-y-2 pt-1">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <Skeleton className="h-40 w-full rounded-card" />
    </div>
  );
};
