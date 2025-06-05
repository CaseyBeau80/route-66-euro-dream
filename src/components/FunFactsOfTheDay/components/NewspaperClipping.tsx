
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

  // Rotate clippings slightly for realistic newspaper effect
  const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-0.5'];
  const rotation = rotations[index % rotations.length];

  return (
    <div className={`${rotation} transform transition-transform hover:scale-105 hover:rotate-0`}>
      <div className="relative">
        {/* Newspaper clipping background */}
        <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 border-2 border-amber-200 rounded-lg shadow-lg p-4 relative overflow-hidden">
          {/* Vintage paper texture overlay */}
          <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-amber-100 via-transparent to-amber-200"></div>
          
          {/* Torn edge effect */}
          <div className="absolute -top-1 left-2 w-6 h-6 bg-white rounded-full opacity-30"></div>
          <div className="absolute -top-1 right-4 w-4 h-4 bg-white rounded-full opacity-20"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Header with category */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-300/40">
              <span className="text-lg">{categoryIcon}</span>
              <span className={`text-xs font-courier-prime font-bold uppercase tracking-wider ${categoryColor}`}>
                {fact.category.replace('-', ' ')}
              </span>
              {fact.year && (
                <span className="text-xs text-amber-600 font-courier-prime ml-auto">
                  Est. {fact.year}
                </span>
              )}
            </div>
            
            {/* Main fact text */}
            <p className="text-sm leading-relaxed font-special-elite text-gray-800 mb-3">
              {formattedFact}
            </p>
            
            {/* Footer with vintage styling */}
            <div className="flex items-center justify-between text-xs text-amber-600 font-courier-prime">
              <span>Route 66 Daily Tribune</span>
              <span>★ ★ ★</span>
            </div>
          </div>
          
          {/* Corner fold effect */}
          <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-amber-200 to-transparent transform rotate-45 translate-x-4 -translate-y-4"></div>
        </div>
        
        {/* Subtle shadow for depth */}
        <div className="absolute inset-0 bg-amber-900/20 rounded-lg transform translate-x-1 translate-y-1 -z-10"></div>
      </div>
    </div>
  );
};

export default NewspaperClipping;
