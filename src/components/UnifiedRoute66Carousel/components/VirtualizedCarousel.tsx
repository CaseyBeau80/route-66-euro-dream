import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronDown } from 'lucide-react';
import UnifiedItemCard from './UnifiedItemCard';
import { UnifiedRoute66Item } from '../types';

interface VirtualizedCarouselProps {
  items: UnifiedRoute66Item[];
}

const VirtualizedCarousel: React.FC<VirtualizedCarouselProps> = ({ items }) => {
  // Get current column count based on breakpoints matching CSS grid
  const getColumnCount = useCallback(() => {
    if (typeof window === 'undefined') return 4;
    const width = window.innerWidth;
    if (width >= 1280) return 4;  // xl:grid-cols-4
    if (width >= 1024) return 3;  // lg:grid-cols-3
    if (width >= 640) return 2;   // sm:grid-cols-2
    return 1;                      // grid-cols-1
  }, []);

  // Get initial visible count (2 full rows)
  const getInitialVisibleCount = useCallback(() => {
    return getColumnCount() * 2;
  }, [getColumnCount]);

  // Get load-more count (2 full rows per load)
  const getLoadMoreCount = useCallback(() => {
    return getColumnCount() * 2;
  }, [getColumnCount]);

  const [visibleCount, setVisibleCount] = useState(() => getInitialVisibleCount());
  const [isLoading, setIsLoading] = useState(false);
  const [newlyLoadedIndices, setNewlyLoadedIndices] = useState<Set<number>>(new Set());

  // Handle resize: round up visible items to nearest multiple of columns
  useEffect(() => {
    const handleResize = () => {
      const cols = getColumnCount();
      setVisibleCount(prev => {
        // Round up current visible to nearest multiple of new column count
        const rows = Math.ceil(prev / cols);
        const newCount = Math.min(rows * cols, items.length);
        return newCount || cols * 2;
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getColumnCount, items.length]);

  // Reset when items change (filters/search)
  useEffect(() => {
    setVisibleCount(getInitialVisibleCount());
    setNewlyLoadedIndices(new Set());
  }, [items.length, getInitialVisibleCount]);

  const visibleItems = useMemo(() => 
    items.slice(0, visibleCount), 
    [items, visibleCount]
  );

  const hasMoreItems = visibleCount < items.length;

  const handleSeeMore = useCallback(() => {
    setIsLoading(true);
    const currentCount = visibleCount;
    const loadMoreCount = getLoadMoreCount();
    
    // Simulate loading delay for smooth UX
    setTimeout(() => {
      const newCount = Math.min(visibleCount + loadMoreCount, items.length);
      
      // Track newly loaded items for fade-in animation
      const newIndices = new Set<number>();
      for (let i = currentCount; i < newCount; i++) {
        newIndices.add(i);
      }
      setNewlyLoadedIndices(newIndices);
      setVisibleCount(newCount);
      setIsLoading(false);
      
      // Smooth scroll to first new card after render
      setTimeout(() => {
        const firstNewCard = document.querySelector(`[data-index="${currentCount}"]`);
        if (firstNewCard) {
          firstNewCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
      // Clear animation tracking after animation completes
      setTimeout(() => setNewlyLoadedIndices(new Set()), 700);
    }, 300);
  }, [visibleCount, items.length, getLoadMoreCount]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Showing count indicator */}
      <div className="text-center text-sm text-route66-text-muted">
        Showing {Math.min(visibleCount, items.length)} of {items.length} locations
      </div>

      {/* Responsive grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {visibleItems.map((item, index) => (
          <div 
            key={item.id}
            data-index={index}
            className={`w-full transition-all duration-500 ease-out ${
              newlyLoadedIndices.has(index) ? 'animate-fade-in-up' : ''
            }`}
          >
            <UnifiedItemCard item={item} />
          </div>
        ))}
      </div>

      {/* "See More Directory" button */}
      {hasMoreItems && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleSeeMore}
            disabled={isLoading}
            className="bg-route66-primary hover:bg-route66-primary-light text-white px-8 py-4 
                       text-xl font-bold rounded-lg shadow-md hover:shadow-lg 
                       hover:scale-105 transition-all duration-200 
                       disabled:opacity-70 disabled:cursor-wait 
                       min-w-[200px] md:min-w-[280px] h-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              <>
                See More Directory
                <span className="ml-2 text-sm opacity-80">
                  ({items.length - visibleCount} more)
                </span>
                <ChevronDown className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}

    </div>
  );
};

export default VirtualizedCarousel;
