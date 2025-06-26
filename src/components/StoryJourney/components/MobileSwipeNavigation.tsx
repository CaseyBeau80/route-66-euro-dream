
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileSwipeNavigationProps {
  currentIndex: number;
  totalSections: number;
  onNavigate: (index: number) => void;
  currentYear: number;
  currentCategory: string;
}

export const MobileSwipeNavigation: React.FC<MobileSwipeNavigationProps> = ({
  currentIndex,
  totalSections,
  onNavigate,
  currentYear,
  currentCategory
}) => {
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < totalSections - 1;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 lg:hidden">
      <div className="bg-black/80 backdrop-blur-md rounded-2xl p-4">
        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-1 mb-4">
          <motion.div
            className="bg-gradient-to-r from-route66-primary to-route66-accent-gold h-1 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / totalSections) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Current Section Info */}
        <div className="text-center mb-4">
          <div className="text-xl font-bold text-white">
            {currentYear}
          </div>
          <div className="text-xs text-white/70 uppercase tracking-wider">
            {currentCategory.replace('_', ' ')}
          </div>
          <div className="text-xs text-white/50 mt-1">
            {currentIndex + 1} of {totalSections}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(currentIndex - 1)}
            disabled={!canGoPrevious}
            className="text-white hover:bg-white/20 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Previous
          </Button>

          {/* Section Dots */}
          <div className="flex space-x-2">
            {Array.from({ length: totalSections }).map((_, index) => (
              <button
                key={index}
                onClick={() => onNavigate(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-route66-accent-gold scale-150'
                    : index < currentIndex
                    ? 'bg-route66-primary'
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(currentIndex + 1)}
            disabled={!canGoNext}
            className="text-white hover:bg-white/20 disabled:opacity-30"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
