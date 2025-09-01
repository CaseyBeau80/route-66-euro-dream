import React, { useState, useMemo } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { ListingCard } from '@/components/ComprehensiveListings/components/ListingCard';
import { LoadingCard } from '@/components/ComprehensiveListings/components/LoadingCard';
import { ListingItem } from '@/components/ComprehensiveListings/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface VirtualizedListingCarouselProps {
  items: ListingItem[];
  loading: boolean;
  categoryTitle: string;
  maxVisibleItems?: number;
}

const VirtualizedListingCarousel: React.FC<VirtualizedListingCarouselProps> = ({ 
  items, 
  loading, 
  categoryTitle,
  maxVisibleItems = 8
}) => {
  const [api, setApi] = useState<any>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  
  const { elementRef, isVisible, hasBeenVisible } = useIntersectionObserver({
    freezeOnceVisible: true,
    threshold: 0.1,
  });

  // Virtualization: only render items within viewport or that have been visible
  const shouldRender = isVisible || hasBeenVisible;
  const limitedItems = useMemo(() => 
    items.slice(0, maxVisibleItems), 
    [items, maxVisibleItems]
  );

  const hasMoreItems = items.length > maxVisibleItems;

  if (loading) {
    return (
      <div ref={elementRef} className="relative">
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent className="-ml-2 md:-ml-4">
            {[1, 2, 3].map(i => (
              <CarouselItem key={i} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <LoadingCard />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-900">
        <p className="text-lg font-semibold">No {categoryTitle.toLowerCase()} found at the moment.</p>
        <p className="text-sm font-medium">Check back soon for new additions!</p>
      </div>
    );
  }

  return (
    <div ref={elementRef} className="relative group">
      {shouldRender ? (
        <Carousel 
          className="w-full" 
          setApi={setApi}
          opts={{
            align: "start",
            loop: false,
            dragFree: true,
            duration: 25,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {limitedItems.map((item) => (
              <CarouselItem key={item.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <ListingCard item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        // Skeleton while not visible
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      )}

      {/* Show item count if truncated */}
      {hasMoreItems && (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Showing {limitedItems.length} of {items.length} {categoryTitle.toLowerCase()}
          </p>
        </div>
      )}
    </div>
  );
};

export default VirtualizedListingCarousel;