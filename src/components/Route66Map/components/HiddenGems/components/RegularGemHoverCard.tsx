
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
  const turquoiseColor = '#40E0D0';
  const darkTurquoise = '#20B2AA';
  const lightTurquoise = '#F0FFFF';

  return (
    <div 
      className="w-80 shadow-2xl rounded-lg overflow-hidden pointer-events-auto"
      style={{ 
        border: `3px solid ${turquoiseColor}`,
        backgroundColor: 'white'
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Header */}
      <div 
        className="px-4 py-3"
        style={{ 
          backgroundColor: turquoiseColor,
          color: 'white'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
              style={{ 
                backgroundColor: 'white',
                border: `1px solid ${turquoiseColor}`
              }}
            >
              <Star 
                className="h-3 w-3" 
                style={{ color: turquoiseColor }} 
                fill="currentColor" 
              />
            </div>
            <span 
              className="text-sm font-bold tracking-wide uppercase"
              style={{ color: 'white' }}
            >
              Hidden Gem
            </span>
          </div>
          <div 
            className="text-xs font-bold px-2 py-1 rounded transform -rotate-2 shadow-sm"
            style={{ 
              backgroundColor: 'white',
              color: turquoiseColor
            }}
          >
            ROUTE 66
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="text-center">
          <h3 
            className="font-black text-xl leading-tight uppercase tracking-wide pb-3 mb-4"
            style={{ 
              color: turquoiseColor,
              borderBottom: `2px solid ${turquoiseColor}`
            }}
          >
            {gem.title}
          </h3>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin 
              className="h-4 w-4" 
              style={{ color: turquoiseColor }} 
            />
            <span 
              className="px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg"
              style={{ 
                backgroundColor: turquoiseColor,
                color: 'white'
              }}
            >
              {gem.city_name}
            </span>
          </div>
          
          {gem.description && (
            <div 
              className="rounded-lg p-4 mb-4 shadow-inner"
              style={{ 
                backgroundColor: lightTurquoise,
                border: `2px dashed ${turquoiseColor}`
              }}
            >
              <p 
                className="text-sm leading-relaxed font-medium"
                style={{ color: darkTurquoise }}
              >
                {gem.description}
              </p>
            </div>
          )}
          
          {gem.website && (
            <button
              onClick={() => window.open(gem.website, '_blank', 'noopener,noreferrer')}
              className="px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wide shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-full"
              style={{ 
                backgroundColor: turquoiseColor,
                color: 'white',
                border: `2px solid ${turquoiseColor}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = darkTurquoise;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = turquoiseColor;
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
