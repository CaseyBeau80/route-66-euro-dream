
import React from 'react';
import { NearbyAttraction, GeographicAttractionService } from '../services/attractions/GeographicAttractionService';

interface AttractionItemProps {
  attraction: NearbyAttraction;
  index: number;
}

const AttractionItem: React.FC<AttractionItemProps> = ({ attraction, index }) => {
  const icon = GeographicAttractionService.getAttractionIcon(attraction);
  const typeLabel = GeographicAttractionService.getAttractionTypeLabel(attraction);

  console.log('🎯 AttractionItem render:', {
    name: attraction.name,
    category: attraction.category,
    source: attraction.source,
    index
  });

  return (
    <div className="flex items-start gap-3 p-3 bg-route66-vintage-beige rounded-lg border border-route66-tan hover:bg-route66-cream transition-colors">
      <div className="flex-shrink-0 w-8 h-8 bg-route66-primary text-white rounded-full flex items-center justify-center text-sm">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h5 className="font-travel font-bold text-route66-vintage-brown text-sm mb-1 truncate">
          {attraction.name}
        </h5>
        {attraction.description && (
          <p className="text-xs text-route66-vintage-brown mb-2 line-clamp-2">
            {attraction.description}
          </p>
        )}
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-route66-accent text-route66-navy text-xs font-medium rounded">
            {typeLabel}
          </span>
          {attraction.distanceFromCity > 0 && (
            <span className="text-xs text-route66-vintage-brown">
              {attraction.distanceFromCity.toFixed(1)} mi away
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttractionItem;
