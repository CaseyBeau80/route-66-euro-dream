
import React from 'react';
import { Newspaper, Calendar } from 'lucide-react';

interface FunFactsHeaderProps {
  currentDate: string;
}

const FunFactsHeader: React.FC<FunFactsHeaderProps> = ({ currentDate }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="text-center mb-8">
      {/* Main title */}
      <div className="relative inline-block">
        <h2 className="font-playfair text-4xl md:text-5xl font-bold text-route66-text-primary mb-2 relative">
          <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
            Fun Facts of the Day
          </span>
        </h2>
        
        {/* Decorative underline */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 rounded-full"></div>
      </div>
      
      {/* Subtitle and date */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <Newspaper className="w-5 h-5 text-amber-600" />
        <p className="font-special-elite text-lg text-gray-700">
          Daily Route 66 Discoveries
        </p>
        <Newspaper className="w-5 h-5 text-amber-600" />
      </div>
      
      {/* Current date */}
      <div className="flex items-center justify-center gap-2 mt-3 text-amber-600">
        <Calendar className="w-4 h-4" />
        <span className="font-courier-prime text-sm font-bold">
          {formatDate(currentDate)}
        </span>
      </div>
      
      {/* Decorative elements */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="w-8 h-px bg-amber-300"></div>
        <span className="text-amber-500">★</span>
        <div className="w-8 h-px bg-amber-300"></div>
      </div>
    </div>
  );
};

export default FunFactsHeader;
