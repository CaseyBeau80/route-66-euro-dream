
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { ListingCard } from './ListingCard';
import { LoadingCard } from './LoadingCard';
import { ListingItem } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
      <div className="text-center py-12 text-gray-900">
        <p className="text-lg font-semibold">No {categoryTitle.toLowerCase()} found at the moment.</p>
        <p className="text-sm font-medium">Check back soon for new additions!</p>
      </div>
    );
  }

  return (
    <div className="relative group">
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

      {/* Modern Desktop Navigation */}
      {(canScrollPrev || canScrollNext) && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-route66-red hover:bg-route66-orange border-2 border-route66-vintage-brown shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:hover:scale-100 hidden md:flex"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
          >
            <ChevronLeft className="h-5 w-5 text-white" />
            <span className="sr-only">Previous items</span>
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-route66-red hover:bg-route66-orange border-2 border-route66-vintage-brown shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:hover:scale-100 hidden md:flex"
            onClick={scrollNext}
            disabled={!canScrollNext}
          >
            <ChevronRight className="h-5 w-5 text-white" />
            <span className="sr-only">Next items</span>
          </Button>
        </>
      )}

      {/* Modern Mobile Navigation */}
      {(canScrollPrev || canScrollNext) && (
        <div className="md:hidden flex justify-center gap-3 mt-6">
          <Button
            variant="outline"
            size="sm"
            className="h-11 px-4 rounded-full bg-route66-red hover:bg-route66-orange border-2 border-route66-vintage-brown shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-white"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
          >
            <ChevronLeft className="h-4 w-4 mr-1 text-white" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-11 px-4 rounded-full bg-route66-red hover:bg-route66-orange border-2 border-route66-vintage-brown shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-white"
            onClick={scrollNext}
            disabled={!canScrollNext}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1 text-white" />
          </Button>
        </div>
      )}
    </div>
  );
};
