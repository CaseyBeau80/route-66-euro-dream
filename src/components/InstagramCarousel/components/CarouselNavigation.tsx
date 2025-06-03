
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CarouselNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

const CarouselNavigation: React.FC<CarouselNavigationProps> = ({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <Button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        variant="outline"
        size="icon"
        className="rounded-full bg-white/90 border-2 border-route66-vintage-brown hover:bg-route66-vintage-yellow hover:border-route66-rust disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        <ChevronLeft className="h-5 w-5 text-route66-vintage-brown" />
      </Button>
      
      <Button
        onClick={onNext}
        disabled={!canGoNext}
        variant="outline"
        size="icon"
        className="rounded-full bg-white/90 border-2 border-route66-vintage-brown hover:bg-route66-vintage-yellow hover:border-route66-rust disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        <ChevronRight className="h-5 w-5 text-route66-vintage-brown" />
      </Button>
    </div>
  );
};

export default CarouselNavigation;
