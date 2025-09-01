import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import UnifiedItemCard from './UnifiedItemCard';
import { UnifiedRoute66Item } from '../types';

interface VirtualizedCarouselProps {
  items: UnifiedRoute66Item[];
}

// Optimized for DOM size - minimal elements per render
const ITEMS_PER_PAGE = 2; // Reduced from 3 to 2 for DOM optimization
const MAX_VISIBLE_ITEMS = 6; // Hard limit to prevent DOM bloat

const VirtualizedCarousel: React.FC<VirtualizedCarouselProps> = ({ items }) => {
  const [currentPage, setCurrentPage] = useState(0);
  
  // Limit total items to prevent excessive DOM
  const limitedItems = useMemo(() => 
    items.slice(0, MAX_VISIBLE_ITEMS), 
    [items]
  );
  
  // Calculate pagination based on limited items
  const totalPages = Math.ceil(limitedItems.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, limitedItems.length);
  const currentItems = useMemo(() => 
    limitedItems.slice(startIndex, endIndex), 
    [limitedItems, startIndex, endIndex]
  );

  const canGoNext = currentPage < totalPages - 1;
  const canGoPrev = currentPage > 0;

  const handleNextPage = useCallback(() => {
    if (canGoNext) {
      setCurrentPage(prev => prev + 1);
    }
  }, [canGoNext]);

  const handlePrevPage = useCallback(() => {
    if (canGoPrev) {
      setCurrentPage(prev => prev - 1);
    }
  }, [canGoPrev]);

  // Reset when items change
  React.useEffect(() => {
    setCurrentPage(0);
  }, [limitedItems.length]);

  if (limitedItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Simplified navigation - only show when needed */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={!canGoPrev}
            className="h-8 w-8 p-0"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm px-2">
            {currentPage + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!canGoNext}
            className="h-8 w-8 p-0"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Simplified grid layout - no carousel complexity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentItems.map(item => (
          <div key={item.id} className="w-full">
            <UnifiedItemCard item={item} />
          </div>
        ))}
      </div>

      {/* Show total count info if items were limited */}
      {items.length > MAX_VISIBLE_ITEMS && (
        <div className="text-center text-sm text-route66-text-secondary">
          Showing {MAX_VISIBLE_ITEMS} of {items.length} items
        </div>
      )}
    </div>
  );
};

export default VirtualizedCarousel;