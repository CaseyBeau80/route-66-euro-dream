
import React from 'react';
import { Star, MapPin, ExternalLink, X } from 'lucide-react';
import { HiddenGem } from '../types';

interface RegularGemCardProps {
  gem: HiddenGem;
  onClose: () => void;
  onWebsiteClick: (website: string) => void;
}

const RegularGemCard: React.FC<RegularGemCardProps> = ({ gem, onClose, onWebsiteClick }) => {
  console.log(`💎 RegularGemCard rendering for ${gem.title} - using new color system`);
  
  return (
    <div 
      className="w-87 rounded-lg overflow-hidden touch-manipulation border border-hidden-gem-border bg-hidden-gem-background relative shadow-hidden-gem"
      style={{ 
        minHeight: '44px'
      }}
    >
      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          console.log(`💎 Close button clicked for hidden gem: ${gem.title}`);
          onClose();
        }}
        className="absolute top-3 right-3 w-11 h-11 rounded-full flex items-center justify-center transition-colors z-20 text-sm font-bold touch-manipulation bg-hidden-gem-accent text-white hover:bg-hidden-gem-accent-hover shadow-md"
        style={{ 
          minWidth: '44px',
          minHeight: '44px'
        }}
      >
        <X className="h-4 w-4" />
      </button>

      {/* Header */}
      <div className="px-6 py-4 bg-hidden-gem-accent text-white">
        <div className="flex items-center justify-between pr-8">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center shadow-sm bg-white">
              <Star 
                className="h-4 w-4 text-hidden-gem-accent" 
                fill="currentColor" 
              />
            </div>
            <span className="text-sm font-bold tracking-wide uppercase text-white">
              Hidden Gem
            </span>
          </div>
          <div className="text-xs font-bold px-3 py-1 rounded-md transform -rotate-2 shadow-sm bg-white text-hidden-gem-accent">
            ROUTE 66
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="text-center">
          <h3 className="font-black text-xl leading-tight uppercase tracking-wide pb-3 mb-4 text-hidden-gem-text border-b-2 border-hidden-gem-border">
            {gem.title}
          </h3>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="h-4 w-4 text-hidden-gem-accent" />
            <span className="px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-md bg-hidden-gem-accent text-white border border-hidden-gem-border">
              {gem.city_name}
            </span>
          </div>
          
          {gem.description && (
            <div className="rounded-lg p-4 mb-4 shadow-inner bg-white/60 border border-hidden-gem-border">
              <p className="text-sm leading-relaxed font-medium text-hidden-gem-text">
                {gem.description}
              </p>
            </div>
          )}
          
          {gem.website && (
            <button
              onClick={() => onWebsiteClick(gem.website!)}
              className="px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wide shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-full touch-manipulation bg-hidden-gem-accent text-white border border-hidden-gem-border hover:bg-hidden-gem-accent-hover hover:shadow-xl"
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
