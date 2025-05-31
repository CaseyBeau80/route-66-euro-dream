
import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, ExternalLink, X } from 'lucide-react';
import { HiddenGem } from './types';

interface HiddenGemClickableCardProps {
  gem: HiddenGem;
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onWebsiteClick: (website: string) => void;
}

const HiddenGemClickableCard: React.FC<HiddenGemClickableCardProps> = ({
  gem,
  isVisible,
  position,
  onClose,
  onWebsiteClick
}) => {
  const cardPosition = useMemo(() => {
    if (!isVisible) return { left: 0, top: 0, display: 'none' };

    const cardWidth = 350;
    const cardHeight = 280;
    const padding = 20;
    const topOffset = 80;

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

    // Vertical positioning
    if (top < padding) {
      top = position.y + topOffset + 20;
    }

    if (top + cardHeight > viewport.height - padding) {
      top = viewport.height - cardHeight - padding;
    }

    return { left, top, display: 'block' };
  }, [isVisible, position]);

  const isDriveIn = gem.title.toLowerCase().includes('drive-in');

  if (!isVisible) return null;

  const cardContent = (
    <div
      className="fixed pointer-events-auto z-50"
      style={{
        left: `${cardPosition.left}px`,
        top: `${cardPosition.top}px`,
        zIndex: 55000
      }}
    >
      {isDriveIn ? (
        // Drive-in specific styling
        <Card className="w-87 border-4 border-red-600 bg-gradient-to-br from-red-50 via-yellow-50 to-orange-100 shadow-2xl overflow-hidden relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 bg-red-700 text-yellow-200 rounded-full flex items-center justify-center hover:bg-red-800 transition-colors z-20 text-sm font-bold border-2 border-yellow-400"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Film strip decorations */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-red-800 via-yellow-600 to-red-800"></div>
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-red-800 via-yellow-600 to-red-800"></div>
          
          <div className="absolute left-0 top-0 bottom-0 w-5 bg-red-800">
            <div className="flex flex-col justify-around h-full py-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-3 h-1 bg-yellow-100 rounded-sm mx-auto"></div>
              ))}
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-5 bg-red-800">
            <div className="flex flex-col justify-around h-full py-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-3 h-1 bg-yellow-100 rounded-sm mx-auto"></div>
              ))}
            </div>
          </div>

          <CardContent className="p-6 pl-10 pr-12">
            <div className="text-center">
              <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-yellow-200 px-4 py-3 rounded-lg shadow-lg mb-4 border-2 border-yellow-400">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl animate-pulse">🎬</span>
                  <span className="font-bold text-sm uppercase tracking-widest">Drive-In Theater</span>
                  <span className="text-2xl animate-pulse">🍿</span>
                </div>
              </div>
              
              <h3 className="font-black text-xl text-red-900 leading-tight uppercase tracking-wide mb-3">
                {gem.title}
              </h3>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <MapPin className="h-4 w-4 text-red-800" />
                <span className="bg-red-800 text-yellow-100 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg border border-yellow-400">
                  {gem.city_name}
                </span>
              </div>
              
              {gem.description && (
                <div className="bg-gradient-to-br from-yellow-100 to-red-50 border-2 border-dashed border-red-600 rounded-lg p-4 mb-4 shadow-inner">
                  <p className="text-sm text-red-900 leading-relaxed font-medium">
                    {gem.description}
                  </p>
                </div>
              )}
              
              {gem.website && (
                <button
                  onClick={() => onWebsiteClick(gem.website!)}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-yellow-200 px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wide shadow-lg border-2 border-yellow-400 hover:from-red-700 hover:to-red-800 hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-full"
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit Theater Website
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        // Regular Hidden Gems with black and white styling
        <Card className="w-87 border-3 border-black bg-white shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors z-20 text-sm font-bold"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="bg-black text-white px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center border border-black shadow-sm">
                  <Star className="h-3 w-3 text-black" fill="currentColor" />
                </div>
                <span className="text-sm font-bold tracking-wide uppercase">Hidden Gem</span>
              </div>
              <div className="text-xs font-bold bg-white text-black px-2 py-1 rounded transform -rotate-2 shadow-sm">
                ROUTE 66
              </div>
            </div>
          </div>
          
          <CardContent className="p-5">
            <div className="text-center">
              <h3 className="font-black text-xl text-black leading-tight uppercase tracking-wide border-b-2 border-black pb-3 mb-4">
                {gem.title}
              </h3>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <MapPin className="h-4 w-4 text-black" />
                <span className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
                  {gem.city_name}
                </span>
              </div>
              
              {gem.description && (
                <div className="bg-gray-100 border-2 border-dashed border-black rounded-lg p-4 mb-4 shadow-inner">
                  <p className="text-sm text-black leading-relaxed font-medium">
                    {gem.description}
                  </p>
                </div>
              )}
              
              {gem.website && (
                <button
                  onClick={() => onWebsiteClick(gem.website!)}
                  className="bg-black text-white px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wide shadow-lg border-2 border-black hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-full"
                >
                  <ExternalLink className="h-4 w-4" />
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

export default HiddenGemClickableCard;
