
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';

interface PDFDaySegmentCardFooterProps {
  segment: DailySegment;
}

const PDFDaySegmentCardFooter: React.FC<PDFDaySegmentCardFooterProps> = ({
  segment
}) => {
  const hasNotes = segment.notes && segment.notes.length > 0;
  const hasRecommendations = segment.recommendations && segment.recommendations.length > 0;

  if (!hasNotes && !hasRecommendations) {
    return null;
  }

  return (
    <div className="pdf-day-footer pt-3 border-t border-gray-200">
      {hasNotes && (
        <div className="mb-2">
          <h5 className="text-xs font-semibold text-gray-700 mb-1">📝 Notes:</h5>
          <p className="text-xs text-gray-600">{segment.notes}</p>
        </div>
      )}
      
      {hasRecommendations && (
        <div>
          <h5 className="text-xs font-semibold text-gray-700 mb-1">💡 Recommendations:</h5>
          <ul className="text-xs text-gray-600 space-y-1">
            {segment.recommendations.slice(0, 3).map((rec, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-gray-400">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PDFDaySegmentCardFooter;
