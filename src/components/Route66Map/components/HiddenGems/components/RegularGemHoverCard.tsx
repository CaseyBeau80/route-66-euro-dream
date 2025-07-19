
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
  console.log(`💎 RegularGemHoverCard rendering for ${gem.title} - using new color system`);
  
  return (
    <div 
      className="w-80 rounded-lg overflow-hidden pointer-events-auto touch-manipulation border border-hidden-gem-border bg-hidden-gem-background shadow-hidden-gem"
      style={{ 
        minHeight: '44px'
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-6 py-4 bg-hidden-gem-accent text-white">
        <div className="flex items-center justify-between">
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

export default RegularGemHoverCard;
