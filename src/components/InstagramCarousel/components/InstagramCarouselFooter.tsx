
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Page Info */}
      <div className="text-center">
        <p className="text-route66-text-muted font-medium">
          Page {currentPage} of {totalPages} • Showing {visiblePostsCount} of {totalPostsCount} posts
        </p>
      </div>

      {/* Enhanced Pagination Controls */}
      <div className="flex items-center justify-center gap-6">
        <Button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          variant="outline"
          size="lg"
          className="
            flex items-center gap-3 px-8 py-4 rounded-full 
            bg-white border-2 border-route66-border text-route66-text-primary
            hover:bg-route66-background-alt hover:border-route66-primary hover:text-route66-primary
            disabled:opacity-40 disabled:cursor-not-allowed
            shadow-md hover:shadow-lg transition-all duration-300
            font-semibold text-lg
          "
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </Button>

        <Button
          onClick={onNext}
          disabled={!canGoNext}
          variant="outline"
          size="lg"
          className="
            flex items-center gap-3 px-8 py-4 rounded-full 
            bg-route66-primary border-2 border-route66-primary text-white
            hover:bg-route66-primary-dark hover:border-route66-primary-dark
            disabled:opacity-40 disabled:cursor-not-allowed
            shadow-md hover:shadow-lg transition-all duration-300
            font-semibold text-lg
          "
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default InstagramCarouselFooter;
