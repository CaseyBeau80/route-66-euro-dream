
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ListingCard } from './ListingCard';
import { LoadingCard } from './LoadingCard';
import { ListingItem } from '../types';

interface ListingCarouselProps {
  items: ListingItem[];
  loading: boolean;
  categoryTitle: string;
}

export const ListingCarousel = ({ items, loading, categoryTitle }: ListingCarouselProps) => {
  console.log(`🎠 ListingCarousel render for ${categoryTitle}`, { 
    loading, 
    itemCount: items.length 
  });

  if (loading) {
    return (
      <div className="relative">
        <Carousel className="w-full">
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
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {items.map((item) => (
            <CarouselItem key={item.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <ListingCard item={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};
