
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, ExternalLink, X } from 'lucide-react';
import { HiddenGem } from '../types';

interface RegularGemCardProps {
  gem: HiddenGem;
  onClose: () => void;
  onWebsiteClick: (website: string) => void;
}

const RegularGemCard: React.FC<RegularGemCardProps> = ({ gem, onClose, onWebsiteClick }) => {
  return (
    <div 
      className="w-87 shadow-2xl rounded-lg overflow-hidden touch-manipulation border-3 border-turquoise bg-white"
      style={{ 
        minHeight: '44px' // Ensure minimum touch target
      }}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-11 h-11 rounded-full flex items-center justify-center transition-colors z-20 text-sm font-bold touch-manipulation bg-turquoise text-white hover:bg-turquoise-dark"
        style={{ 
          minWidth: '44px',
          minHeight: '44px'
        }}
      >
        <X className="h-4 w-4" />
      </button>

      {/* Header */}
      <div 
        className="px-4 py-3 bg-turquoise text-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center shadow-sm bg-white border border-turquoise"
            >
              <Star 
                className="h-3 w-3 text-turquoise" 
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
            className="text-xs font-bold px-2 py-1 rounded transform -rotate-2 shadow-sm bg-white text-turquoise"
          >
            ROUTE 66
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="text-center">
          <h3 
            className="font-black text-xl leading-tight uppercase tracking-wide pb-3 mb-4 text-turquoise border-b-2 border-turquoise"
          >
            {gem.title}
          </h3>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin 
              className="h-4 w-4 text-turquoise" 
            />
            <span 
              className="px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg bg-turquoise text-white"
            >
              {gem.city_name}
            </span>
          </div>
          
          {gem.description && (
            <div 
              className="rounded-lg p-4 mb-4 shadow-inner bg-turquoise-light border-2 border-dashed border-turquoise"
            >
              <p 
                className="text-sm leading-relaxed font-medium text-turquoise-dark"
              >
                {gem.description}
              </p>
            </div>
          )}
          
          {gem.website && (
            <button
              onClick={() => onWebsiteClick(gem.website!)}
              className="px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wide shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-full touch-manipulation bg-turquoise text-white border-2 border-turquoise hover:bg-turquoise-dark"
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

export default RegularGemCard;
