
import React from 'react';
import { ChevronLeft, ChevronRight, Map, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StoryNavigationProps {
  currentSection: number;
  totalSections: number;
  onSectionChange: (index: number) => void;
  isMapVisible: boolean;
  onToggleMap: () => void;
}

export const StoryNavigation: React.FC<StoryNavigationProps> = ({
  currentSection,
  totalSections,
  onSectionChange,
  isMapVisible,
  onToggleMap
}) => {
  const canGoPrevious = currentSection > 0;
  const canGoNext = currentSection < totalSections - 1;

  return (
    <div className="flex items-center gap-4">
      {/* Section counter */}
      <div className="text-sm text-route66-text-muted">
        {currentSection + 1} of {totalSections}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSectionChange(currentSection - 1)}
          disabled={!canGoPrevious}
          className="border-route66-border hover:bg-route66-primary/10"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSectionChange(currentSection + 1)}
          disabled={!canGoNext}
          className="border-route66-border hover:bg-route66-primary/10"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Map toggle */}
      <Button
        variant={isMapVisible ? "default" : "outline"}
        size="sm"
        onClick={onToggleMap}
        className={isMapVisible 
          ? "bg-route66-primary hover:bg-route66-primary-dark text-white" 
          : "border-route66-border hover:bg-route66-primary/10"
        }
      >
        <Map className="w-4 h-4 mr-2" />
        {isMapVisible ? 'Hide Map' : 'Show Map'}
      </Button>
    </div>
  );
};
