
import React from 'react';
import { FunFact } from '../types';
import { DailyFactsService } from '../services/DailyFactsService';

interface NewspaperClippingProps {
  fact: FunFact;
  index: number;
}

const NewspaperClipping: React.FC<NewspaperClippingProps> = ({ fact, index }) => {
  const categoryIcon = DailyFactsService.getCategoryIcon(fact.category);
  const categoryColor = DailyFactsService.getCategoryColor(fact.category);
  const formattedFact = DailyFactsService.formatFact(fact);

  // Subtle rotation for carousel items (less dramatic than grid)
  const rotations = ['rotate-0.5', '-rotate-0.5', 'rotate-1', '-rotate-1', 'rotate-0'];
  const rotation = rotations[index % rotations.length];

  return (
    <div className={`${rotation} transform transition-all duration-300 hover:scale-[1.02] hover:rotate-0 h-full`}>
      <div className="relative h-full">
        {/* Newspaper clipping background */}
        <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 border-2 border-amber-200 rounded-lg shadow-md p-4 relative overflow-hidden h-full flex flex-col">
          {/* Vintage paper texture overlay */}
          <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-amber-100 via-transparent to-amber-200"></div>
          
          {/* Torn edge effect */}
          <div className="absolute -top-1 left-2 w-4 h-4 bg-white rounded-full opacity-30"></div>
          <div className="absolute -top-1 right-3 w-3 h-3 bg-white rounded-full opacity-20"></div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Header with category */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-300/40 flex-shrink-0">
              <span className="text-base">{categoryIcon}</span>
              <span className={`text-xs font-courier-prime font-bold uppercase tracking-wide ${categoryColor}`}>
                {fact.category.replace('-', ' ')}
              </span>
              {fact.year && (
                <span className="text-xs text-amber-600 font-courier-prime ml-auto">
                  {fact.year}
                </span>
              )}
            </div>
            
            {/* Main fact text - flex-grow to fill available space */}
            <div className="flex-grow flex items-center">
              <p className="text-sm leading-relaxed font-special-elite text-gray-800 text-center">
                {formattedFact}
              </p>
            </div>
            
            {/* Footer with vintage styling */}
            <div className="flex items-center justify-between text-xs text-amber-600 font-courier-prime mt-3 pt-2 border-t border-amber-300/40 flex-shrink-0">
              <span>Route 66 Tribune</span>
              <span>★ ★ ★</span>
            </div>
          </div>
          
          {/* Corner fold effect */}
          <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-bl from-amber-200 to-transparent transform rotate-45 translate-x-3 -translate-y-3"></div>
        </div>
        
        {/* Subtle shadow for depth */}
        <div className="absolute inset-0 bg-amber-900/10 rounded-lg transform translate-x-0.5 translate-y-0.5 -z-10"></div>
      </div>
    </div>
  );
};

export default NewspaperClipping;
