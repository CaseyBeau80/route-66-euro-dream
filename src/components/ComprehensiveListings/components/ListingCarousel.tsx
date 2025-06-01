
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { ListingCard } from './ListingCard';
import { LoadingCard } from './LoadingCard';
import { ListingItem } from '../types';
import { ChevronLeft, ChevronRight, ChevronFirst, ChevronLast } from 'lucide-react';
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
    itemCount: items.length,
    canScrollPrev,
    canScrollNext,
    hasApi: !!api
  });

  const scrollToStart = useCallback(() => {
    console.log(`🔄 Scrolling to start for ${categoryTitle}`);
    if (api) {
      api.scrollTo(0);
    }
  }, [api, categoryTitle]);

  const scrollToEnd = useCallback(() => {
    console.log(`🔄 Scrolling to end for ${categoryTitle}`);
    if (api) {
      api.scrollTo(api.scrollSnapList().length - 1);
    }
  }, [api, categoryTitle]);

  const scrollPrev = useCallback(() => {
    console.log(`◀️ Scrolling prev for ${categoryTitle}`);
    if (api) {
      api.scrollPrev();
    }
  }, [api, categoryTitle]);

  const scrollNext = useCallback(() => {
    console.log(`▶️ Scrolling next for ${categoryTitle}`);
    if (api) {
      api.scrollNext();
    }
  }, [api, categoryTitle]);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const prevState = api.canScrollPrev();
      const nextState = api.canScrollNext();
      setCanScrollPrev(prevState);
      setCanScrollNext(nextState);
      console.log(`🎠 Navigation state for ${categoryTitle}:`, { canScrollPrev: prevState, canScrollNext: nextState });
    };

    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);

    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api, categoryTitle]);

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
      </Carousel>

      {/* Single Navigation System - Desktop */}
      <div className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 flex-col gap-2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-white hover:bg-gray-50 shadow-lg border-gray-200"
          onClick={scrollToStart}
          disabled={!canScrollPrev}
        >
          <ChevronFirst className="h-5 w-5" />
          <span className="sr-only">Go to beginning</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-white hover:bg-gray-50 shadow-lg border-gray-200"
          onClick={scrollPrev}
          disabled={!canScrollPrev}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous</span>
        </Button>
      </div>
      
      <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 flex-col gap-2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-white hover:bg-gray-50 shadow-lg border-gray-200"
          onClick={scrollNext}
          disabled={!canScrollNext}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-white hover:bg-gray-50 shadow-lg border-gray-200"
          onClick={scrollToEnd}
          disabled={!canScrollNext}
        >
          <ChevronLast className="h-5 w-5" />
          <span className="sr-only">Go to end</span>
        </Button>
      </div>

      {/* Single Navigation System - Mobile */}
      <div className="md:hidden flex justify-center gap-3 mt-6">
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 bg-white hover:bg-gray-50 shadow-md border-gray-200"
          onClick={scrollToStart}
          disabled={!canScrollPrev}
        >
          <ChevronFirst className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 bg-white hover:bg-gray-50 shadow-md border-gray-200"
          onClick={scrollPrev}
          disabled={!canScrollPrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 bg-white hover:bg-gray-50 shadow-md border-gray-200"
          onClick={scrollNext}
          disabled={!canScrollNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 bg-white hover:bg-gray-50 shadow-md border-gray-200"
          onClick={scrollToEnd}
          disabled={!canScrollNext}
        >
          <ChevronLast className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
