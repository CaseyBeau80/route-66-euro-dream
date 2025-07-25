
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, MapPin, Music, Heart } from 'lucide-react';
import { categoryLabels, categoryColors } from '@/data/timelineData';

interface TimelineFiltersProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const categoryIcons = {
  establishment: MapPin,
  cultural: Music,
  decline: Heart,
  modern: Sparkles
} as const;

export const TimelineFilters: React.FC<TimelineFiltersProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  // Fix the type issues by properly typing the categories
  const categories = Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>;

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => onCategoryChange(null)}
        className="text-sm bg-route66-primary hover:bg-route66-primary-dark text-white border-route66-primary hover:border-route66-primary-dark"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        All Eras
      </Button>
      
      {categories.map((category) => {
        const IconComponent = categoryIcons[category];
        const isSelected = selectedCategory === category;
        
        return (
          <Button
            key={category}
            variant={isSelected ? "default" : "outline"}
            onClick={() => onCategoryChange(category)}
            className={`text-sm ${
              isSelected 
                ? 'bg-route66-primary hover:bg-route66-primary-dark text-white border-route66-primary'
                : 'border-route66-border hover:bg-route66-hover hover:border-route66-primary text-route66-text-primary'
            }`}
          >
            <IconComponent className="w-4 h-4 mr-2" />
            {categoryLabels[category]}
          </Button>
        );
      })}
    </div>
  );
};
