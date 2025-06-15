
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { GeographicAttractionService, NearbyAttraction } from '../../services/attractions/GeographicAttractionService';
import { AttractionLimitingService } from '../../services/attractions/AttractionLimitingService';
import { getDestinationCityWithState } from '../../utils/DestinationUtils';

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

  const context = `PDFDaySegmentCardStops-Day${segment.day}-${exportFormat}`;
  
  // Load attractions instead of showing destination city as a stop
  const [attractions, setAttractions] = React.useState<NearbyAttraction[]>([]);
  
  React.useEffect(() => {
    const loadAttractions = async () => {
      if (!segment?.endCity) return;
      
      try {
        const { city, state } = getDestinationCityWithState(segment.endCity);
        const searchResult = await GeographicAttractionService.findAttractionsNearCity(
          city, 
          state, 
          40 // 40 mile radius
        );
        
        // Extract the attractions array from the search result
        setAttractions(searchResult.attractions);
      } catch (error) {
        console.error('❌ Error loading attractions for PDF:', error);
        setAttractions([]);
      }
    };
    
    loadAttractions();
  }, [segment?.endCity]);

  if (attractions.length === 0) {
    return (
      <div className="pdf-stops-section mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">🎯 Attractions & Hidden Gems</h4>
        <p className="text-sm text-gray-500">Loading attractions near {segment.endCity}...</p>
      </div>
    );
  }

  // Use centralized limiting based on export format
  const requestedMax = exportFormat === 'summary' ? 3 : 6;
  const limitResult = AttractionLimitingService.limitAttractions(
    attractions,
    context,
    requestedMax
  );
  
  // Validate the result
  if (!AttractionLimitingService.validateAttractionLimit(limitResult.limitedAttractions, context)) {
    console.error(`🚨 CRITICAL: PDF stops limit validation failed for ${context}`);
    return (
      <div className="pdf-stops-section mb-4">
        <h4 className="text-sm font-semibold text-red-600 mb-3">⚠️ Stops Limit Error</h4>
        <p className="text-xs text-red-500">Attraction limiting failed for this segment.</p>
      </div>
    );
  }

  return (
    <div className="pdf-stops-section mb-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">
        🎯 Attractions & Hidden Gems ({limitResult.hasMoreAttractions ? `${limitResult.limitedAttractions.length} of ${limitResult.totalAttractions}` : limitResult.limitedAttractions.length})
      </h4>
      <div className="space-y-2">
        {limitResult.limitedAttractions.map((attraction, index) => {
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
        
        {limitResult.hasMoreAttractions && (
          <div className="text-xs text-gray-500 text-center py-1">
            + {limitResult.remainingCount} more attractions available
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFDaySegmentCardStops;
