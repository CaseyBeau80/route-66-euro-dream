
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

      {/* Pagination Controls matching reference design */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          variant="outline"
          size="lg"
          className="
            flex items-center gap-2 px-6 py-3 rounded-md 
            bg-red-100 border-2 border-red-300 text-red-600
            hover:bg-red-200 hover:border-red-400
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
            bg-red-500 border-2 border-red-500 text-white
            hover:bg-red-600 hover:border-red-600
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
