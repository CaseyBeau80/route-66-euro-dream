import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Pause, Play, RefreshCcw } from 'lucide-react';

interface EnhancedInstagramCarouselFooterProps {
  currentPage: number;
  totalPages: number;
  visiblePostsCount: number;
  totalPostsCount: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isRotating: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onStartRotation: () => void;
  onStopRotation: () => void;
  onRefresh: () => void;
}

const EnhancedInstagramCarouselFooter: React.FC<EnhancedInstagramCarouselFooterProps> = ({
  currentPage,
  totalPages,
  visiblePostsCount,
  totalPostsCount,
  canGoPrevious,
  canGoNext,
  isRotating,
  onPrevious,
  onNext,
  onStartRotation,
  onStopRotation,
  onRefresh
}) => {
  return (
    <div className="space-y-4 mt-8">
      {/* Status Info with Rotation Indicator */}
      <div className="flex items-center justify-center gap-4 text-sm text-route66-text-secondary">
        <span>
          Page {currentPage} of {totalPages} • {visiblePostsCount} of {totalPostsCount} posts
        </span>
        
        {totalPostsCount > visiblePostsCount && (
          <div className="flex items-center gap-2">
            {isRotating ? (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            ) : (
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
            )}
            <span className="text-xs">
              {isRotating ? 'Auto-rotating every 6 seconds' : 'Rotation paused'}
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        {/* Auto-rotation controls */}
        {totalPostsCount > visiblePostsCount && (
          <>
            <Button
              onClick={isRotating ? onStopRotation : onStartRotation}
              variant="ghost"
              size="sm"
              className="text-xs px-3 py-2"
            >
              {isRotating ? (
                <>
                  <Pause className="h-3 w-3 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 mr-1" />
                  Auto-rotate
                </>
              )}
            </Button>
            
            <Button
              onClick={onRefresh}
              variant="ghost"
              size="sm"
              className="text-xs px-3 py-2"
            >
              <RefreshCcw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          </>
        )}

        {/* Navigation Controls */}
        <div className="flex items-center gap-2 ml-4">
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
    </div>
  );
};

export default EnhancedInstagramCarouselFooter;