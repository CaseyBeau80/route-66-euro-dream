import React, { useState, useMemo } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import UnifiedItemCard from './UnifiedItemCard';
import { UnifiedRoute66Item } from '../types';

interface VirtualizedCarouselProps {
  items: UnifiedRoute66Item[];
}

const ITEMS_PER_PAGE = 6; // Reduced to 6 for optimal DOM performance
const ITEMS_PER_VIEW = 3; // Show 3 items at a time on desktop

const VirtualizedCarousel: React.FC<VirtualizedCarouselProps> = ({ items }) => {
  const [currentPage, setCurrentPage] = useState(0);
  
  // Calculate total pages and current items
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, items.length);
  const currentItems = useMemo(() => 
    items.slice(startIndex, endIndex), 
    [items, startIndex, endIndex]
  );

  const canGoNext = currentPage < totalPages - 1;
  const canGoPrev = currentPage > 0;

  const handleNextPage = () => {
    if (canGoNext) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (canGoPrev) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Reset to first page when items change (e.g., due to filtering)
  React.useEffect(() => {
    setCurrentPage(0);
  }, [items.length]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Page Navigation - Top */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-route66-text-secondary">
            Showing {startIndex + 1}-{endIndex} of {items.length} items
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={!canGoPrev}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm px-2">
              {currentPage + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!canGoNext}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Virtualized Carousel */}
      <div className="relative">
        <Carousel 
          opts={{
            align: "start",
            loop: false
          }} 
          className="w-full"
        >
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-xl bg-gradient-to-r from-route66-primary to-route66-primary-dark border-2 border-route66-border text-white hover:from-route66-primary-dark hover:to-route66-primary hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl -translate-x-6" />
          
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-xl bg-gradient-to-r from-route66-primary to-route66-primary-dark border-2 border-route66-border text-white hover:from-route66-primary-dark hover:to-route66-primary hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl translate-x-6" />

          <CarouselContent className="-ml-2 md:-ml-4">
            {currentItems.map(item => (
              <CarouselItem 
                key={item.id} 
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <UnifiedItemCard item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Page Navigation - Bottom (for longer lists) */}
      {totalPages > 3 && (
        <div className="flex justify-center">
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageIndex;
              if (totalPages <= 5) {
                pageIndex = i;
              } else if (currentPage < 2) {
                pageIndex = i;
              } else if (currentPage > totalPages - 3) {
                pageIndex = totalPages - 5 + i;
              } else {
                pageIndex = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageIndex}
                  variant={pageIndex === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageIndex)}
                  className="h-8 w-8 p-0"
                >
                  {pageIndex + 1}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualizedCarousel;