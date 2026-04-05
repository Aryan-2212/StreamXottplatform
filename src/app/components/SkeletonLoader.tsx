import React from 'react';
import { motion } from 'motion/react';

export const ContentCardSkeleton = () => {
  return (
    <div className="flex-shrink-0 w-40 sm:w-48">
      <div className="skeleton rounded-lg w-full aspect-[2/3] mb-2" />
      <div className="skeleton h-4 w-3/4 rounded mb-2" />
      <div className="skeleton h-3 w-1/2 rounded" />
    </div>
  );
};

export const HeroSkeleton = () => {
  return (
    <div className="relative h-[70vh] sm:h-[80vh] bg-gray-900">
      <div className="absolute inset-0 skeleton" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      
      <div className="relative h-full flex items-end">
        <div className="px-4 sm:px-6 pb-20 max-w-2xl space-y-4">
          <div className="skeleton h-6 w-24 rounded" />
          <div className="skeleton h-12 w-96 rounded" />
          <div className="skeleton h-20 w-full rounded" />
          <div className="flex gap-3">
            <div className="skeleton h-12 w-32 rounded-lg" />
            <div className="skeleton h-12 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContentRowSkeleton = () => {
  return (
    <div className="px-4 sm:px-6">
      <div className="flex items-center justify-between mb-4">
        <div className="skeleton h-8 w-48 rounded" />
        <div className="skeleton h-4 w-16 rounded" />
      </div>
      <div className="flex gap-3 overflow-hidden">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <ContentCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export const GridSkeleton = ({ count = 12 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="skeleton w-full aspect-[2/3] rounded-lg" />
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
      ))}
    </div>
  );
};
