
import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterState } from '../types';

interface EmptyStateProps {
  filters: FilterState;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  filters,
  onResetFilters,
  hasActiveFilters
}) => {
  return (
    <div className="text-center py-12 sm:py-16 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-route66-background-section rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <Search className="h-10 w-10 text-route66-text-muted" />
        </div>
        
        <h3 className="text-xl font-semibold text-route66-text-primary mb-3">
          No locations found
        </h3>
        
        <p className="text-route66-text-secondary mb-6">
          {hasActiveFilters 
            ? "We couldn't find any Route 66 locations matching your current filters. Try adjusting your search criteria."
            : "No Route 66 locations available at the moment."
          }
        </p>

        {hasActiveFilters && (
          <Button
            onClick={onResetFilters}
            variant="outline"
            className="border-route66-primary text-route66-primary hover:bg-route66-primary hover:text-white transition-all duration-200"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear all filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
