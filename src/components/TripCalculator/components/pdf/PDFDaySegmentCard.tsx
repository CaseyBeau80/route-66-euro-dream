
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import PDFDaySegmentCardHeader from './PDFDaySegmentCardHeader';
import PDFDaySegmentCardStats from './PDFDaySegmentCardStats';
import PDFDaySegmentCardWeather from './PDFDaySegmentCardWeather';
import PDFDaySegmentCardStops from './PDFDaySegmentCardStops';
import PDFDaySegmentCardFooter from './PDFDaySegmentCardFooter';

interface PDFDaySegmentCardProps {
  segment: DailySegment;
  segmentIndex: number;
  exportFormat: 'full' | 'summary' | 'route-only';
  tripStartDate?: Date;
}

const PDFDaySegmentCard: React.FC<PDFDaySegmentCardProps> = ({
  segment,
  segmentIndex,
  exportFormat,
  tripStartDate
}) => {
  console.log('📄 PDFDaySegmentCard rendering for day', segmentIndex + 1, 'with format:', exportFormat);

  // Calculate the date for this segment
  const segmentDate = tripStartDate ? 
    new Date(tripStartDate.getTime() + segmentIndex * 24 * 60 * 60 * 1000) : 
    undefined;

  return (
    <div className="pdf-day-card no-page-break mb-6 bg-white border-2 border-route66-border rounded-lg shadow-lg overflow-hidden">
      {/* Day Header with Route 66 Styling */}
      <PDFDaySegmentCardHeader 
        segment={segment} 
        segmentIndex={segmentIndex}
        segmentDate={segmentDate}
      />
      
      {/* Stats Section */}
      <PDFDaySegmentCardStats 
        segment={segment} 
        exportFormat={exportFormat}
      />
      
      {/* Weather Section - Enhanced for PDF */}
      {exportFormat !== 'route-only' && (
        <div className="pdf-weather-section px-4 py-3 bg-route66-vintage-beige border-t border-route66-tan">
          <PDFDaySegmentCardWeather 
            segment={segment}
            segmentDate={segmentDate}
            exportFormat={exportFormat}
          />
        </div>
      )}
      
      {/* Stops and Attractions Section */}
      {exportFormat !== 'route-only' && (
        <div className="pdf-stops-section px-4 py-3 bg-route66-cream border-t border-route66-border">
          <PDFDaySegmentCardStops 
            segment={segment}
            exportFormat={exportFormat}
          />
        </div>
      )}
      
      {/* Footer with Route Progression */}
      <PDFDaySegmentCardFooter 
        segment={segment}
        segmentIndex={segmentIndex}
        exportFormat={exportFormat}
      />
    </div>
  );
};

export default PDFDaySegmentCard;
