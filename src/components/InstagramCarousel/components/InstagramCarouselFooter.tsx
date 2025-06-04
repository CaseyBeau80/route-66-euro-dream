
import React from 'react';
import CarouselNavigation from './CarouselNavigation';

interface InstagramCarouselFooterProps {
  currentPage: number;
  totalPages: number;
  visiblePostsCount: number;
  totalPostsCount: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const InstagramCarouselFooter: React.FC<InstagramCarouselFooterProps> = ({
  currentPage,
  totalPages,
  visiblePostsCount,
  totalPostsCount,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center text-gray-600">
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages} • Showing {visiblePostsCount} of {totalPostsCount} posts
        </span>
      </div>
      
      <CarouselNavigation 
        onPrevious={onPrevious}
        onNext={onNext}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
      />
    </div>
  );
};

export default InstagramCarouselFooter;
