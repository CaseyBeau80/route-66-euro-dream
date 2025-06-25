
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const InstagramCarouselLoading = () => {
  return (
    <div className="space-y-12">
      {/* Loading Grid with 4 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="px-6 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Loading Pagination */}
      <div className="flex items-center justify-center gap-6">
        <Skeleton className="h-12 w-32 rounded-full" />
        <Skeleton className="h-12 w-32 rounded-full" />
      </div>
    </div>
  );
};

export default InstagramCarouselLoading;
