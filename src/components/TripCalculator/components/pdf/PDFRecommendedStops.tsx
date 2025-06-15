
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { useRecommendedStops } from '../../hooks/useRecommendedStops';
import { StopRecommendationService } from '../../services/recommendations/StopRecommendationService';

interface PDFRecommendedStopsProps {
  segment: DailySegment;
  exportFormat: 'full' | 'summary' | 'route-only';
}

const PDFRecommendedStops: React.FC<PDFRecommendedStopsProps> = ({
  segment,
  exportFormat
}) => {
  // Skip for route-only format
  if (exportFormat === 'route-only') {
    return null;
  }

  const maxStops = exportFormat === 'summary' ? 2 : 3;
  const { recommendedStops, hasStops } = useRecommendedStops(segment, maxStops);

  if (!hasStops) {
    return null;
  }

  return (
    <div className="pdf-recommended-stops mb-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">
        🎯 Recommended Stops ({recommendedStops.length})
      </h4>
      <div className="space-y-2">
        {recommendedStops.map((stop, index) => {
          const formatted = StopRecommendationService.formatStopForDisplay(stop);
          
          return (
            <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded text-sm">
              <span className="text-blue-600 mt-0.5">{formatted.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800 truncate">
                  {formatted.name}
                </div>
                <div className="text-gray-600 text-xs mt-1">
                  {formatted.location}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-1 py-0.5 bg-blue-200 text-blue-800 rounded text-xs">
                    {formatted.category}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PDFRecommendedStops;
