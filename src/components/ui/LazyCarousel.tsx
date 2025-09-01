import React, { useMemo } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyCarouselProps {
  children: React.ReactNode[];
  className?: string;
  maxVisibleItems?: number;
  showNavigation?: boolean;
  itemClassName?: string;
  contentClassName?: string;
}

const LazyCarousel: React.FC<LazyCarouselProps> = ({
  children,
  className = '',
  maxVisibleItems = 8, // Reduced from unlimited to 8 items max
  showNavigation = true,
  itemClassName = 'pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4',
  contentClassName = '-ml-2 md:-ml-4'
}) => {
  const { elementRef, isVisible, hasBeenVisible } = useIntersectionObserver({
    freezeOnceVisible: true,
    threshold: 0.1,
  });

  // Limit the number of items to reduce DOM size
  const limitedChildren = useMemo(() => 
    children.slice(0, maxVisibleItems), 
    [children, maxVisibleItems]
  );

  const shouldRender = isVisible || hasBeenVisible;

  return (
    <div ref={elementRef} className={className}>
      {shouldRender ? (
        <Carousel className="w-full">
          {showNavigation && (
            <>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </>
          )}
          <CarouselContent className={contentClassName}>
            {limitedChildren.map((child, index) => (
              <CarouselItem key={index} className={itemClassName}>
                {child}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        // Loading skeleton with reduced elements
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: Math.min(4, maxVisibleItems) }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LazyCarousel;