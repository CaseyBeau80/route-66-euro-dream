
import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Star } from 'lucide-react';
import { HiddenGem } from '../types';

interface HoverCardPortalProps {
  gem: HiddenGem;
  isVisible: boolean;
  position: { x: number; y: number };
  onWebsiteClick: (website: string) => void;
}

const HoverCardPortal: React.FC<HoverCardPortalProps> = ({
  gem,
  isVisible,
  position,
  onWebsiteClick
}) => {
  // Enhanced position calculations for drive-ins
  const cardPosition = useMemo(() => {
    if (!isVisible) return { left: 0, top: 0, display: 'none' };

    const cardWidth = 280;
    const cardHeight = 200;
    const padding = 20;
    const isDriveIn = gem.title.toLowerCase().includes('drive-in');
    const topOffset = isDriveIn ? 100 : 60; // More space for drive-ins

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let left = position.x - cardWidth / 2;
    let top = position.y - cardHeight - topOffset;

    // Horizontal positioning
    if (left < padding) {
      left = padding;
    } else if (left + cardWidth > viewport.width - padding) {
      left = viewport.width - cardWidth - padding;
    }

    // Vertical positioning with enhanced logic for drive-ins
    if (top < padding + (isDriveIn ? 150 : 100)) {
      top = position.y + topOffset + (isDriveIn ? 30 : 20);
    }

    if (top + cardHeight > viewport.height - padding) {
      top = viewport.height - cardHeight - padding;
    }

    console.log(`🎬 ${isDriveIn ? 'DRIVE-IN' : 'Hidden gem'} hover card positioned:`, {
      gemTitle: gem.title,
      markerPos: position,
      cardPos: { left, top }
    });

    return { left, top, display: 'block' };
  }, [isVisible, position, gem.title]);

  const isDriveIn = gem.title.toLowerCase().includes('drive-in');

  if (!isVisible) return null;

  const cardContent = (
    <div
      className="fixed pointer-events-none"
      style={{
        left: `${cardPosition.left}px`,
        top: `${cardPosition.top}px`,
        zIndex: isDriveIn ? 50000 : 45000 // Higher z-index for drive-ins
      }}
    >
      {isDriveIn ? (
        // Drive-in specific styling with red vintage theme
        <Card className="w-70 border-4 border-red-600 bg-gradient-to-br from-red-50 via-yellow-50 to-orange-100 shadow-2xl transition-all duration-200">
          {/* Drive-in specific decorative elements */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-red-800 via-yellow-600 to-red-800"></div>
          <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-red-800 via-yellow-600 to-red-800"></div>
          
          {/* Film strip perforations */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-red-800">
            <div className="flex flex-col justify-around h-full py-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-2 h-1 bg-yellow-100 rounded-sm mx-auto"></div>
              ))}
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-red-800">
            <div className="flex flex-col justify-around h-full py-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-2 h-1 bg-yellow-100 rounded-sm mx-auto"></div>
              ))}
            </div>
          </div>

          <CardContent className="p-4 pl-8 pr-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-yellow-200 px-3 py-2 rounded-lg shadow-lg mb-3 border-2 border-yellow-400">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl animate-pulse">🎬</span>
                  <span className="font-bold text-xs uppercase tracking-widest">Drive-In Theater</span>
                  <span className="text-xl animate-pulse">🍿</span>
                </div>
              </div>
              
              <h3 className="text-lg text-red-900 font-bold leading-tight uppercase tracking-wide mb-2">
                {gem.title}
              </h3>
              
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="bg-red-800 text-yellow-100 border border-yellow-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                  📍 {gem.city_name}
                </span>
              </div>
              
              {gem.description && (
                <div className="bg-gradient-to-br from-yellow-100 to-red-50 border-red-600 border-2 border-dashed rounded-lg p-3 mb-3 shadow-inner">
                  <p className="text-red-900 text-xs leading-relaxed font-medium">
                    {gem.description.length > 80 
                      ? `${gem.description.substring(0, 80)}...` 
                      : gem.description
                    }
                  </p>
                </div>
              )}
              
              {gem.website && (
                <button
                  className="bg-gradient-to-r from-red-600 to-red-700 text-yellow-200 border-yellow-400 hover:from-red-700 hover:to-red-800 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide shadow-lg border-2 transition-all duration-300 pointer-events-auto transform hover:scale-105"
                  onClick={() => onWebsiteClick(gem.website!)}
                >
                  <ExternalLink className="w-3 h-3 inline mr-1" />
                  Visit Theater
                </button>
              )}
              
              <div className="mt-3 pt-2 border-t-2 border-dashed border-red-600">
                <div className="flex items-center justify-center gap-2 text-red-800">
                  <span className="text-lg">🚗</span>
                  <span className="text-xs font-bold uppercase tracking-widest">Route 66 Classic</span>
                  <span className="text-lg">🌟</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Regular Hidden Gems with black and white color scheme
        <Card className="w-70 border-2 border-black bg-white shadow-2xl transition-all duration-200">
          {/* Header Banner - Black and white */}
          <div className="bg-black text-white px-4 py-2 border-b-2 border-black">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center border border-black shadow-sm">
                  <Star className="h-2.5 w-2.5 text-black" fill="currentColor" />
                </div>
                <span className="text-sm font-bold tracking-wide uppercase">Hidden Gem</span>
              </div>
              <div className="text-xs font-bold bg-white text-black px-2 py-1 rounded transform -rotate-2 shadow-sm">
                ROUTE 66
              </div>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-base text-black font-bold leading-tight uppercase tracking-wide mb-2 border-b-2 border-black pb-2">
                {gem.title}
              </h3>
              
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                  📍 {gem.city_name}
                </span>
              </div>
              
              {gem.description && (
                <div className="bg-gray-100 border-black border-2 border-dashed rounded-lg p-3 mb-3 shadow-inner">
                  <p className="text-black text-xs leading-relaxed font-medium">
                    {gem.description.length > 80 
                      ? `${gem.description.substring(0, 80)}...` 
                      : gem.description
                    }
                  </p>
                </div>
              )}
              
              {gem.website && (
                <button
                  className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide shadow-lg border-2 border-black transition-all duration-300 pointer-events-auto transform hover:scale-105"
                  onClick={() => onWebsiteClick(gem.website!)}
                >
                  <ExternalLink className="w-3 h-3 inline mr-1" />
                  Learn More
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return createPortal(cardContent, document.body);
};

export default React.memo(HoverCardPortal);
