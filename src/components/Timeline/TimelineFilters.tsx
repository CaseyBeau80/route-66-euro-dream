
import React from 'react';
import { Button } from '@/components/ui/button';
import { categoryLabels } from '../../data/timelineData';

interface TimelineFiltersProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export const TimelineFilters: React.FC<TimelineFiltersProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  const categories = Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>;

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => onCategoryChange(null)}
        className="text-sm"
      >
        All Eras
      </Button>
      
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onCategoryChange(category)}
          className="text-sm"
        >
          {categoryLabels[category]}
        </Button>
      ))}
    </div>
  );
};
