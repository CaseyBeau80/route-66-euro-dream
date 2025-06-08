
import React from 'react';
import { Search, MapPin, Star } from 'lucide-react';
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
  const getEmptyStateContent = () => {
    if (filters.search) {
      return {
        icon: Search,
        title: 'No results found',
        description: `No attractions match your search for "${filters.search}". Try a different search term or clear your filters.`,
        showResetButton: true
      };
    }

    if (hasActiveFilters) {
      return {
        icon: MapPin,
        title: 'No matches found',
        description: 'No attractions match your current filter settings. Try adjusting your filters or reset them to see all attractions.',
        showResetButton: true
      };
    }

    return {
      icon: Star,
      title: 'Loading Route 66 Adventures',
      description: 'Discovering amazing attractions along America\'s most famous highway...',
      showResetButton: false
    };
  };

  const { icon: Icon, title, description, showResetButton } = getEmptyStateContent();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-route66-background-section rounded-full p-6 mb-6">
        <Icon className="h-12 w-12 text-route66-primary" />
      </div>
      
      <h3 className="text-xl font-semibold text-route66-text-primary mb-2">
        {title}
      </h3>
      
      <p className="text-route66-text-secondary max-w-md mb-6">
        {description}
      </p>

      {showResetButton && (
        <Button
          onClick={onResetFilters}
          variant="outline"
          className="border-route66-primary text-route66-primary hover:bg-route66-primary hover:text-white"
        >
          Clear all filters
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
