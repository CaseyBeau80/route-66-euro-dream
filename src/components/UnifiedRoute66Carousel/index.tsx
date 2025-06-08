
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { useUnifiedData } from './hooks/useUnifiedData';
import CarouselFilters from './components/CarouselFilters';
import UnifiedItemCard from './components/UnifiedItemCard';
import EmptyState from './components/EmptyState';
import { UnifiedCarouselProps } from './types';

const UnifiedRoute66Carousel: React.FC<UnifiedCarouselProps> = ({ className = '' }) => {
  const {
    items,
    loading,
    filters,
    updateFilters,
    resetFilters,
    hasActiveFilters,
    states,
    cities,
    totalCount,
    filteredCount
  } = useUnifiedData();

  if (loading) {
    return (
      <section className={`py-16 bg-route66-background-section ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-route66 text-route66-primary mb-4">Explore Route 66</h2>
            <p className="text-xl text-route66-text-secondary max-w-3xl mx-auto">
              Discover historic attractions, drive-in theaters, and hidden gems along America's most famous highway
            </p>
          </div>

          {/* Loading Filters */}
          <div className="space-y-4 mb-6">
            <div className="flex gap-3">
              <Skeleton className="h-10 w-[180px]" />
              <Skeleton className="h-10 w-[150px]" />
              <Skeleton className="h-10 w-[150px]" />
            </div>
            <Skeleton className="h-10 w-full max-w-md" />
          </div>

          {/* Loading Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 bg-route66-background-section ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-route66 text-route66-primary mb-4 font-bold">
            Explore Route 66
          </h2>
          <p className="text-xl text-route66-text-secondary max-w-3xl mx-auto font-semibold">
            Discover historic attractions, drive-in theaters, and hidden gems along America's most famous highway
          </p>
        </div>

        {/* Filters */}
        <CarouselFilters
          filters={filters}
          onFiltersChange={updateFilters}
          onResetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
          states={states}
          cities={cities}
          filteredCount={filteredCount}
          totalCount={totalCount}
        />

        {/* Content */}
        {items.length === 0 ? (
          <EmptyState
            filters={filters}
            onResetFilters={resetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <CarouselPrevious className="relative translate-x-0 translate-y-0" />
                <CarouselNext className="relative translate-x-0 translate-y-0" />
              </div>
            </div>

            <CarouselContent className="-ml-2 md:-ml-4">
              {items.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <UnifiedItemCard item={item} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default UnifiedRoute66Carousel;
