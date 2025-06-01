
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ListingCard } from './ListingCard';
import { LoadingCard } from './LoadingCard';
import { ListingItem } from '../types';
import { ChevronFirst, ChevronLast } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';

interface ListingCarouselProps {
  items: ListingItem[];
  loading: boolean;
  categoryTitle: string;
}

export const ListingCarousel = ({ items, loading, categoryTitle }: ListingCarouselProps) => {
  const [api, setApi] = useState<any>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  console.log(`🎠 ListingCarousel render for ${categoryTitle}`, { 
    loading, 
    itemCount: items.length 
  });

  const scrollToStart = useCallback(() => {
    if (api) {
      api.scrollTo(0);
    }
  }, [api]);

  const scrollToEnd = useCallback(() => {
    if (api) {
      api.scrollTo(api.scrollSnapList().length - 1);
    }
  }, [api]);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);

    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api]);

  if (loading) {
    return (
      <div className="relative">
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent className="-ml-2 md:-ml-4">
            {[1, 2, 3].map(i => (
              <CarouselItem key={i} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <LoadingCard />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-route66-gray/60">
        <p className="text-lg">No {categoryTitle.toLowerCase()} found at the moment.</p>
        <p className="text-sm">Check back soon for new additions!</p>
      </div>
    );
  }

  return (
    <div className="relative">
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
          {items.map((item) => (
            <CarouselItem key={item.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <ListingCard item={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Enhanced Navigation Controls */}
        <div className="hidden md:flex absolute -left-20 top-1/2 -translate-y-1/2 flex-col gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-lg border-route66-gray/20"
            onClick={scrollToStart}
            disabled={!canScrollPrev}
          >
            <ChevronFirst className="h-4 w-4" />
            <span className="sr-only">Go to beginning</span>
          </Button>
          <CarouselPrevious className="static shadow-lg bg-white/90 hover:bg-white border-route66-gray/20" />
        </div>
        
        <div className="hidden md:flex absolute -right-20 top-1/2 -translate-y-1/2 flex-col gap-2">
          <CarouselNext className="static shadow-lg bg-white/90 hover:bg-white border-route66-gray/20" />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-lg border-route66-gray/20"
            onClick={scrollToEnd}
            disabled={!canScrollNext}
          >
            <ChevronLast className="h-4 w-4" />
            <span className="sr-only">Go to end</span>
          </Button>
        </div>
      </Carousel>

      {/* Mobile Navigation - Compact horizontal layout */}
      <div className="md:hidden flex justify-center gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 bg-white/90 hover:bg-white shadow-md border-route66-gray/20"
          onClick={scrollToStart}
          disabled={!canScrollPrev}
        >
          <ChevronFirst className="h-3 w-3 mr-1" />
          Start
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 bg-white/90 hover:bg-white shadow-md border-route66-gray/20"
          onClick={api?.scrollPrev}
          disabled={!canScrollPrev}
        >
          Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 bg-white/90 hover:bg-white shadow-md border-route66-gray/20"
          onClick={api?.scrollNext}
          disabled={!canScrollNext}
        >
          Next
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 bg-white/90 hover:bg-white shadow-md border-route66-gray/20"
          onClick={scrollToEnd}
          disabled={!canScrollNext}
        >
          <ChevronLast className="h-3 w-3 mr-1" />
          End
        </Button>
      </div>
    </div>
  );
};
