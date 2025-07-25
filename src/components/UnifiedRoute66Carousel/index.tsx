
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { useUnifiedData } from './hooks/useUnifiedData';
import FilterPanel from './components/FilterPanel';
import UnifiedItemCard from './components/UnifiedItemCard';
import EmptyState from './components/EmptyState';
import { UnifiedCarouselProps } from './types';

const UnifiedRoute66Carousel: React.FC<UnifiedCarouselProps> = ({
  className = ''
}) => {
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
    return <section className={`py-16 lg:py-20 bg-route66-background-section ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* SEO-Friendly Section Header - Loading State */}
          <div className="text-center mb-12">
            <div className="bg-route66-background rounded-xl p-6 border-4 border-route66-primary shadow-xl max-w-4xl mx-auto">
              <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
              <Skeleton className="h-6 w-2/3 mx-auto" />
            </div>
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
            {Array.from({
            length: 8
          }).map((_, index) => <div key={index} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-16 w-full" />
              </div>)}
          </div>
        </div>
      </section>;
  }

  return <section className={`py-10 lg:py-12 bg-route66-background-section ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* SEO-Friendly Section Header */}
        <div className="text-center mb-12">
          <div className="bg-route66-background rounded-xl p-6 border-4 border-route66-primary shadow-xl max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-route66 text-route66-primary font-bold uppercase mb-4 tracking-wide">
              Route 66 Attractions & Hidden Gems Directory
            </h2>
            <p className="text-lg text-route66-text-secondary max-w-2xl mx-auto leading-relaxed">
              Discover the complete collection of destinations, attractions, and hidden gems along America's most famous highway
            </p>
          </div>
        </div>

        {/* Filter Panel */}
        <FilterPanel filters={filters} onFiltersChange={updateFilters} onResetFilters={resetFilters} hasActiveFilters={hasActiveFilters} states={states} cities={cities} filteredCount={filteredCount} totalCount={totalCount} />

        {/* Content */}
        {items.length === 0 ? <EmptyState filters={filters} onResetFilters={resetFilters} hasActiveFilters={hasActiveFilters} /> : <div className="relative">
            <div className="relative">
              <Carousel opts={{
            align: "start",
            loop: false
          }} className="w-full">
                {/* Inline Navigation Arrows */}
                <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-xl bg-gradient-to-r from-route66-primary to-route66-primary-dark border-2 border-route66-border text-white hover:from-route66-primary-dark hover:to-route66-primary hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl -translate-x-6" />
                
                <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-xl bg-gradient-to-r from-route66-primary to-route66-primary-dark border-2 border-route66-border text-white hover:from-route66-primary-dark hover:to-route66-primary hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl translate-x-6" />

                {/* Navigation Hint */}
                <div className="text-center mb-6">
                  
                </div>

                <CarouselContent className="-ml-2 md:-ml-4">
                  {items.map(item => <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <UnifiedItemCard item={item} />
                    </CarouselItem>)}
                </CarouselContent>
              </Carousel>
            </div>
          </div>}
      </div>
    </section>;
};

export default UnifiedRoute66Carousel;
