
import React from 'react';
import { createPortal } from 'react-dom';
import { NativeAmericanSite } from './types';

interface NativeAmericanHoverCardProps {
  site: NativeAmericanSite;
  isVisible: boolean;
  position: { x: number; y: number };
}

const NativeAmericanHoverCard: React.FC<NativeAmericanHoverCardProps> = ({
  site,
  isVisible,
  position
}) => {
  if (!isVisible) return null;

  const cardContent = (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 80}px`,
        transform: 'translateX(-50%)',
        zIndex: 55000
      }}
    >
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg shadow-lg border-2 border-amber-700/30 px-4 py-3 min-w-[200px] max-w-[280px]">
        {/* Header with feather icon */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🪶</span>
          <span className="text-xs font-bold uppercase tracking-wide text-amber-800">
            Native American Heritage
          </span>
        </div>
        
        {/* Site name */}
        <h4 className="font-bold text-sm text-amber-900 leading-tight mb-1">
          {site.name}
        </h4>
        
        {/* Tribe/Nation if available */}
        {site.tribe_nation && (
          <p className="text-xs text-teal-700 font-medium mb-1">
            {site.tribe_nation}
          </p>
        )}
        
        {/* Location */}
        <p className="text-xs text-amber-700">
          {site.city_name}{site.state ? `, ${site.state}` : ''}
        </p>
        
        {/* Click hint */}
        <p className="text-xs text-amber-600/70 mt-2 italic">
          Click for more info
        </p>
      </div>
    </div>
  );

  return createPortal(cardContent, document.body);
};

export default NativeAmericanHoverCard;
