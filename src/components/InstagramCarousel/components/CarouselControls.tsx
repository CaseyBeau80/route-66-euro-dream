
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselControlsProps {
  carouselMedia: any[];
  currentCarouselIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
}

const CarouselControls: React.FC<CarouselControlsProps> = ({
  carouselMedia,
  currentCarouselIndex,
  onPrevious,
  onNext,
  onDotClick
}) => {
  const isCarousel = carouselMedia.length > 1;

  if (!isCarousel) return null;

  return (
    <>
      <button
        onClick={onPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-1 rounded-full transition-all duration-200 z-20"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={onNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-1 rounded-full transition-all duration-200 z-20"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      
      {/* Carousel Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
        {carouselMedia.map((_, index) => (
          <button
            key={index}
            onClick={() => onDotClick(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentCarouselIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </>
  );
};

export default CarouselControls;
