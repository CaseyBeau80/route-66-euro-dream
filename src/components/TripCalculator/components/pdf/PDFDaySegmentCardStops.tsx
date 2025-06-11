
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

  const stops = segment.stops || [];
  const attractions = segment.attractions || [];
  
  // Combine and deduplicate stops and attractions by name
  const combinedStops = [...stops, ...attractions];
  const deduplicatedStops = combinedStops.filter((stop, index, array) => {
    // Keep only the first occurrence of each stop name (case-insensitive)
    return array.findIndex(s => 
      (s.name || s.title || '').toLowerCase() === (stop.name || stop.title || '').toLowerCase()
    ) === index;
  });

  if (deduplicatedStops.length === 0) {
    return (
      <div className="pdf-stops-section mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">🏛️ Historic Route 66 Stops</h4>
        <p className="text-sm text-gray-500">No historic stops listed for this segment - check nearby attractions instead</p>
      </div>
    );
  }

  return (
    <div className="pdf-stops-section mb-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">🏛️ Historic Route 66 Stops</h4>
      <div className="space-y-2">
        {deduplicatedStops.slice(0, exportFormat === 'summary' ? 3 : 6).map((stop, index) => (
          <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded text-sm">
            <span className="text-gray-600 mt-0.5">📍</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-800 truncate">
                {stop.name || stop.title || 'Historic Stop'}
              </div>
              {stop.description && (
                <div className="text-gray-600 text-xs mt-1 line-clamp-2">
                  {stop.description}
                </div>
              )}
              {stop.city && (
                <div className="text-gray-500 text-xs">📍 {stop.city}</div>
              )}
            </div>
          </div>
        ))}
        
        {deduplicatedStops.length > (exportFormat === 'summary' ? 3 : 6) && (
          <div className="text-xs text-gray-500 text-center py-1">
            + {deduplicatedStops.length - (exportFormat === 'summary' ? 3 : 6)} more stops available
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFDaySegmentCardStops;
