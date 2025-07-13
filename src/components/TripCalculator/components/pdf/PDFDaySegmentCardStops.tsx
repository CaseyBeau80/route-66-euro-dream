
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';

interface PDFDaySegmentCardStopsProps {
  segment: DailySegment;
  exportFormat: 'full' | 'summary' | 'route-only';
}

const PDFDaySegmentCardStops: React.FC<PDFDaySegmentCardStopsProps> = ({
  segment,
  exportFormat
}) => {
  // Skip stops for route-only format
  if (exportFormat === 'route-only') {
    return null;
  }

  console.log('📄 PDFDaySegmentCardStops: Using existing recommendedStops data for', segment.endCity, {
    recommendedStopsCount: segment.recommendedStops?.length || 0,
    exportFormat,
    hasData: !!segment.recommendedStops
  });

  // Use existing recommendedStops data from the segment
  const recommendedStops = segment.recommendedStops || [];

  if (recommendedStops.length === 0) {
    return (
      <div className="pdf-stops-section mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">🎯 Recommended Stops</h4>
        <p className="text-sm text-gray-500 italic">
          No specific attractions listed for {segment.endCity}. Explore the area when you arrive!
        </p>
      </div>
    );
  }

  // Limit stops based on export format
  const maxStops = exportFormat === 'summary' ? 3 : 6;
  const limitedStops = recommendedStops.slice(0, maxStops);
  const hasMoreStops = recommendedStops.length > maxStops;

  return (
    <div className="pdf-stops-section mb-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">
        🎯 Recommended Stops ({hasMoreStops ? `${limitedStops.length} of ${recommendedStops.length}` : limitedStops.length})
      </h4>
      <div className="space-y-2">
        {limitedStops.map((stop, index) => {
          // Handle both object and string formats
          const stopName = typeof stop === 'string' ? stop : stop.name || 'Unknown Stop';
          const stopDescription = typeof stop === 'object' && stop.description ? stop.description : null;
          const stopCategory = typeof stop === 'object' && stop.category ? stop.category : 'attraction';
          
          // Get icon based on category
          const getStopIcon = (category: string) => {
            switch (category) {
              case 'restaurant': return '🍽️';
              case 'attraction': return '🎯';
              case 'gas_station': return '⛽';
              case 'lodging': return '🏨';
              case 'route66_waypoint': return '🛣️';
              case 'destination_city': return '🏙️';
              case 'hidden_gem': return '💎';
              default: return '📍';
            }
          };

          const getCategoryLabel = (category: string) => {
            switch (category) {
              case 'restaurant': return 'Restaurant';
              case 'attraction': return 'Attraction';
              case 'gas_station': return 'Gas Station';
              case 'lodging': return 'Lodging';
              case 'route66_waypoint': return 'Route 66 Waypoint';
              case 'destination_city': return 'City';
              case 'hidden_gem': return 'Hidden Gem';
              default: return 'Point of Interest';
            }
          };
          
          return (
            <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded text-sm">
              <span className="text-gray-600 mt-0.5">{getStopIcon(stopCategory)}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800 truncate">
                  {stopName}
                </div>
                {stopDescription && (
                  <div className="text-gray-600 text-xs mt-1 line-clamp-2">
                    {stopDescription}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span className="px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                    {getCategoryLabel(stopCategory)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        
        {hasMoreStops && (
          <div className="text-xs text-gray-500 text-center py-1">
            + {recommendedStops.length - limitedStops.length} more stops available
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFDaySegmentCardStops;
