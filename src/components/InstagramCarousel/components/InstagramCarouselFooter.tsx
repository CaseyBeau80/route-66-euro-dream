
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
        <p className="text-gray-600 font-medium">
          Page {currentPage} of {totalPages} • Showing {visiblePostsCount} of {totalPostsCount} posts
        </p>
      </div>

      {/* Enhanced Pagination Controls with Blue Theme */}
      <div className="flex items-center justify-center gap-6">
        <Button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          variant="outline"
          size="lg"
          className="
            flex items-center gap-3 px-8 py-4 rounded-full 
            bg-white border-2 border-blue-500 text-blue-500
            hover:bg-blue-50 hover:border-blue-600 hover:text-blue-600
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
            bg-blue-500 border-2 border-blue-500 text-white
            hover:bg-blue-700 hover:border-blue-700
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
