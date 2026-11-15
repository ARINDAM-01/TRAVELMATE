import React from 'react';

export const LoadingSkeleton = ({ lines = 3, className = '' }) => (
  <div className={`animate-pulse space-y-2.5 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`h-4 bg-white/10 rounded-lg ${i === lines - 1 ? 'w-3/5' : 'w-full'}`}
      />
    ))}
  </div>
);

export const CardSkeleton = () => (
  <div className="animate-pulse bg-white/5 border border-white/10 rounded-2xl p-6">
    <div className="h-40 bg-white/10 rounded-xl mb-4" />
    <div className="space-y-3">
      <div className="h-5 bg-white/10 rounded-lg w-3/4" />
      <div className="h-4 bg-white/10 rounded-lg w-full" />
      <div className="h-4 bg-white/10 rounded-lg w-1/2" />
    </div>
  </div>
);

export default LoadingSkeleton;
