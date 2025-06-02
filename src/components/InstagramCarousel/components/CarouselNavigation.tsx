
import React from 'react';

interface CarouselNavigationProps {
  totalSlides: number;
  currentIndex: number;
  onSlideChange: (index: number) => void;
}

const CarouselNavigation: React.FC<CarouselNavigationProps> = ({
  totalSlides,
  currentIndex,
  onSlideChange,
}) => {
  if (totalSlides <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {Array.from({ length: totalSlides }, (_, index) => (
        <button
          key={index}
          onClick={() => onSlideChange(index)}
          className={`w-3 h-3 rounded-full transition-all duration-200 ${
            index === currentIndex
              ? 'bg-route66-vintage-yellow scale-125'
              : 'bg-white bg-opacity-50 hover:bg-opacity-75'
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default CarouselNavigation;
