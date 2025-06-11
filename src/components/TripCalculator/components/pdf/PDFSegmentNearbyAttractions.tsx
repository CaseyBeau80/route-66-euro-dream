
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { NearbyAttraction, GeographicAttractionService } from '../../services/attractions/GeographicAttractionService';

interface PDFSegmentNearbyAttractionsProps {
  segment: DailySegment;
  attractions: NearbyAttraction[];
  exportFormat: 'full' | 'summary' | 'route-only';
}

const PDFSegmentNearbyAttractions: React.FC<PDFSegmentNearbyAttractionsProps> = ({
  segment,
  attractions,
  exportFormat
}) => {
  // Skip attractions for route-only format
  if (exportFormat === 'route-only' || attractions.length === 0) {
    return null;
  }

  const maxAttractions = exportFormat === 'summary' ? 3 : 6;
  const displayAttractions = attractions.slice(0, maxAttractions);

  return (
    <div className="pdf-attractions-section mb-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">🎯 Nearby Attractions</h4>
      <div className="space-y-2">
        {displayAttractions.map((attraction, index) => {
          const icon = GeographicAttractionService.getAttractionIcon(attraction);
          const typeLabel = GeographicAttractionService.getAttractionTypeLabel(attraction);
          
          return (
            <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded text-sm">
              <span className="text-gray-600 mt-0.5">{icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800 truncate">
                  {attraction.name}
                </div>
                {attraction.description && (
                  <div className="text-gray-600 text-xs mt-1 line-clamp-2">
                    {attraction.description}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span className="px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                    {typeLabel}
                  </span>
                  <span>{attraction.distanceFromCity.toFixed(1)} mi from {segment.endCity}</span>
                </div>
              </div>
            </div>
          );
        })}
        
        {attractions.length > maxAttractions && (
          <div className="text-xs text-gray-500 text-center py-1">
            + {attractions.length - maxAttractions} more attractions available
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFSegmentNearbyAttractions;
