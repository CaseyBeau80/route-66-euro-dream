
import React from 'react';
import { createPortal } from 'react-dom';
import { MapPin, ExternalLink, X, Users } from 'lucide-react';
import { NativeAmericanSite } from './types';
import { useCardPosition } from './hooks/useCardPosition';
import { useMobileCardDismissal } from '@/hooks/useMobileCardDismissal';

interface NativeAmericanClickableCardProps {
  site: NativeAmericanSite;
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onWebsiteClick: (website: string) => void;
}

const NativeAmericanClickableCard: React.FC<NativeAmericanClickableCardProps> = ({
  site,
  isVisible,
  position,
  onClose,
  onWebsiteClick
}) => {
  const cardPosition = useCardPosition({
    isVisible,
    position,
    cardWidth: 350,
    cardHeight: 320
  });

  const cardId = `native-site-${site.id}`;
  
  console.log(`🪶 NativeAmericanClickableCard render - ${site.name}:`, { isVisible, cardId });
  
  useMobileCardDismissal({
    isVisible,
    onClose,
    cardId
  });

  if (!isVisible) return null;

  const cardContent = (
    <div
      className="fixed pointer-events-auto z-50 touch-manipulation"
      style={{
        left: `${cardPosition.left}px`,
        top: `${cardPosition.top}px`,
        zIndex: 60000
      }}
      data-card-id={cardId}
    >
      <div 
        className="w-87 rounded-lg overflow-hidden touch-manipulation border-2 border-amber-700/40 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 relative shadow-xl"
        style={{ minHeight: '44px' }}
      >
        {/* Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log(`🪶 Close button clicked for native site: ${site.name}`);
            onClose();
          }}
          className="absolute top-3 right-3 w-11 h-11 rounded-full flex items-center justify-center transition-colors z-20 text-sm font-bold touch-manipulation bg-amber-700 text-white hover:bg-amber-800 shadow-md"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header with earth tones */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white">
          <div className="flex items-center justify-between pr-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm bg-teal-400/90">
                <span className="text-lg">🪶</span>
              </div>
              <span className="text-sm font-bold tracking-wide uppercase text-amber-100">
                Native American Heritage
              </span>
            </div>
            <div className="text-xs font-bold px-3 py-1 rounded-md transform -rotate-2 shadow-sm bg-teal-400 text-amber-900">
              ROUTE 66
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="text-center">
            {/* Site name */}
            <h3 className="font-black text-xl leading-tight uppercase tracking-wide pb-3 mb-3 text-amber-900 border-b-2 border-amber-300">
              {site.name}
            </h3>
            
            {/* Tribe/Nation badge */}
            {site.tribe_nation && (
              <div className="flex items-center justify-center gap-2 mb-3">
                <Users className="h-4 w-4 text-teal-600" />
                <span className="px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-md bg-teal-500 text-white border border-teal-600">
                  {site.tribe_nation}
                </span>
              </div>
            )}
            
            {/* Location */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-amber-700" />
              <span className="px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide shadow-sm bg-amber-200 text-amber-900 border border-amber-300">
                {site.city_name}{site.state ? `, ${site.state}` : ''}
              </span>
            </div>
            
            {/* Site type badge */}
            {site.site_type && (
              <div className="mb-4">
                <span className="inline-block px-3 py-1 rounded text-xs font-medium uppercase tracking-wide bg-amber-100 text-amber-800 border border-amber-300">
                  {site.site_type.replace(/_/g, ' ')}
                </span>
              </div>
            )}
            
            {/* Description */}
            {site.description && (
              <div className="rounded-lg p-4 mb-4 shadow-inner bg-white/70 border border-amber-200">
                <p className="text-sm leading-relaxed font-medium text-amber-800">
                  {site.description}
                </p>
              </div>
            )}
            
            {/* Cultural protocol reminder */}
            <div className="rounded-lg p-3 mb-4 bg-teal-50 border border-teal-200">
              <p className="text-xs text-teal-700 italic">
                Please respect tribal sovereignty and cultural protocols when visiting.
              </p>
            </div>
            
            {/* Website button */}
            {site.website && (
              <button
                onClick={() => onWebsiteClick(site.website!)}
                className="px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wide shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-full touch-manipulation bg-gradient-to-r from-amber-600 to-amber-700 text-white border border-amber-800 hover:from-amber-700 hover:to-amber-800 hover:shadow-xl"
                style={{ minHeight: '44px' }}
              >
                <ExternalLink className="h-4 w-4" />
                Visit Official Site
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(cardContent, document.body);
};

export default NativeAmericanClickableCard;
