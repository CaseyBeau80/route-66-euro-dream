
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { useUnifiedData } from './hooks/useUnifiedData';
import FilterPanel from './components/FilterPanel';
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
      <section className={`py-16 lg:py-20 bg-route66-background-section ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-route66 text-route66-primary mb-4 font-bold">
              Explore Route 66
            </h2>
            <p className="text-xl text-route66-text-secondary max-w-3xl mx-auto font-semibold">
              Discover historic attractions, drive-in theaters, and hidden gems along America's most famous highway
            </p>
          </div>

          {/* Loading Filters */}
          <div className="bg-route66-background-alt rounded-xl p-6 border border-route66-border mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <Skeleton className="h-10 w-full max-w-md" />
          </div>

          {/* Loading Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    <section className={`py-16 lg:py-20 bg-route66-background-section ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-route66 text-route66-primary mb-4 font-bold">
            Explore Route 66
          </h2>
          <p className="text-xl text-route66-text-secondary max-w-3xl mx-auto font-semibold">
            Discover historic attractions, drive-in theaters, and hidden gems along America's most famous highway
          </p>
        </div>

        {/* Filter Panel */}
        <FilterPanel
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
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              {/* Enhanced Navigation Controls with Route 66 Styling */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-4">
                  <CarouselPrevious className="relative translate-x-0 translate-y-0 h-14 w-14 rounded-xl bg-gradient-to-r from-route66-primary to-route66-primary-dark border-3 border-route66-border text-white hover:from-route66-primary-dark hover:to-route66-primary hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl" />
                  <CarouselNext className="relative translate-x-0 translate-y-0 h-14 w-14 rounded-xl bg-gradient-to-r from-route66-primary to-route66-primary-dark border-3 border-route66-border text-white hover:from-route66-primary-dark hover:to-route66-primary hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl" />
                </div>
                
                {/* Navigation Hint */}
                <div className="hidden sm:block text-sm text-route66-text-muted font-medium">
                  Use arrows to browse more locations →
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
          </div>
        )}
      </div>
    </section>
  );
};

export default UnifiedRoute66Carousel;
