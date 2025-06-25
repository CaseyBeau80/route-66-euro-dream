
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
    <div className="space-y-4 mt-8">
      {/* Page Info */}
      <div className="text-center">
        <p className="text-gray-600 font-medium">
          Page {currentPage} of {totalPages} • Showing {visiblePostsCount} of {totalPostsCount} posts
        </p>
      </div>

      {/* Pagination Controls with blue color scheme */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          variant="outline"
          size="lg"
          className="
            flex items-center gap-2 px-6 py-3 rounded-md 
            bg-blue-100 border-2 border-blue-300 text-route66-primary
            hover:bg-blue-200 hover:border-blue-400
            disabled:opacity-40 disabled:cursor-not-allowed
            shadow-sm hover:shadow-md transition-all duration-200
            font-medium
          "
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <Button
          onClick={onNext}
          disabled={!canGoNext}
          variant="outline"
          size="lg"
          className="
            flex items-center gap-2 px-6 py-3 rounded-md 
            bg-route66-primary border-2 border-route66-primary text-white
            hover:bg-route66-primary-dark hover:border-route66-primary-dark
            disabled:opacity-40 disabled:cursor-not-allowed
            shadow-sm hover:shadow-md transition-all duration-200
            font-medium
          "
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default InstagramCarouselFooter;
