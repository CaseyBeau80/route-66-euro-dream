
import React from 'react';
import { Star, MapPin, ExternalLink } from 'lucide-react';
import { HiddenGem } from '../types';

interface RegularGemHoverCardProps {
  gem: HiddenGem;
  onWebsiteClick: (website: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const RegularGemHoverCard: React.FC<RegularGemHoverCardProps> = ({ 
  gem, 
  onWebsiteClick,
  onMouseEnter,
  onMouseLeave 
}) => {
  return (
    <div 
      className="w-80 shadow-2xl rounded-lg overflow-hidden pointer-events-auto touch-manipulation border-3 border-teal-500 bg-white"
      style={{ 
        minHeight: '44px'
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Header */}
      <div 
        className="px-4 py-3 bg-teal-500 text-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center shadow-sm bg-white border border-teal-500"
            >
              <Star 
                className="h-3 w-3 text-teal-500" 
                fill="currentColor" 
              />
            </div>
            <span 
              className="text-sm font-bold tracking-wide uppercase text-white"
            >
              Hidden Gem
            </span>
          </div>
          <div 
            className="text-xs font-bold px-2 py-1 rounded transform -rotate-2 shadow-sm bg-white text-teal-500"
          >
            ROUTE 66
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="text-center">
          <h3 
            className="font-black text-xl leading-tight uppercase tracking-wide pb-3 mb-4 text-teal-600 border-b-2 border-teal-500"
          >
            {gem.title}
          </h3>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin 
              className="h-4 w-4 text-teal-500" 
            />
            <span 
              className="px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg bg-teal-500 text-white"
            >
              {gem.city_name}
            </span>
          </div>
          
          {gem.description && (
            <div 
              className="rounded-lg p-4 mb-4 shadow-inner bg-teal-50 border-2 border-dashed border-teal-300"
            >
              <p 
                className="text-sm leading-relaxed font-medium text-teal-700"
              >
                {gem.description}
              </p>
            </div>
          )}
          
          {gem.website && (
            <button
              onClick={() => onWebsiteClick(gem.website!)}
              className="px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wide shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-full touch-manipulation bg-teal-500 text-white border-2 border-teal-500 hover:bg-teal-600"
              style={{ 
                minHeight: '44px'
              }}
            >
              <ExternalLink className="h-4 w-4" />
              Learn More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegularGemHoverCard;
