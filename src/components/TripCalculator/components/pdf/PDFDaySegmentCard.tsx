
import React from 'react';
import { DailySegment, getDestinationCityName } from '../../services/planning/TripPlanBuilder';
import PDFDaySegmentCardHeader from './PDFDaySegmentCardHeader';
import PDFDaySegmentCardStats from './PDFDaySegmentCardStats';
import PDFDaySegmentCardWeather from './PDFDaySegmentCardWeather';
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

  // Safely get destination city name
  const destinationCity = segment.endCity || getDestinationCityName(segment.destination);

  return (
    <div className="pdf-day-card no-page-break mb-6 bg-white border-2 border-route66-border rounded-lg shadow-lg overflow-hidden">
      {/* Day Header with Route 66 Styling */}
      <PDFDaySegmentCardHeader 
        day={segment.day}
        endCity={destinationCity}
        segmentDate={segmentDate}
      />
      
      {/* Stats Section */}
      <PDFDaySegmentCardStats 
        distance={segment.distance}
        driveTimeHours={segment.driveTimeHours}
        startCity={segment.startCity || 'Unknown'}
        endCity={destinationCity}
      />
      
      {/* Weather Section - Enhanced for PDF */}
      {exportFormat !== 'route-only' && (
        <div className="pdf-weather-section px-4 py-3 bg-route66-vintage-beige border-t border-route66-tan">
          <PDFDaySegmentCardWeather 
            segment={segment}
            tripStartDate={tripStartDate}
            exportFormat={exportFormat}
          />
        </div>
      )}
      
      {/* Footer with Route Progression */}
      <PDFDaySegmentCardFooter 
        segment={segment}
      />
    </div>
  );
};

export default PDFDaySegmentCard;
