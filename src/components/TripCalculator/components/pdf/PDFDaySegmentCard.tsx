
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import PDFDaySegmentCardHeader from './PDFDaySegmentCardHeader';
import PDFDaySegmentCardStats from './PDFDaySegmentCardStats';
import PDFDaySegmentCardWeather from './PDFDaySegmentCardWeather';
import PDFDaySegmentCardStops from './PDFDaySegmentCardStops';
import PDFDaySegmentCardFooter from './PDFDaySegmentCardFooter';

interface PDFDaySegmentCardProps {
  segment: DailySegment;
  tripStartDate?: Date;
  cardIndex?: number;
  tripId?: string;
  exportFormat: 'full' | 'summary' | 'route-only';
}

const PDFDaySegmentCard: React.FC<PDFDaySegmentCardProps> = ({
  segment,
  tripStartDate,
  cardIndex,
  tripId,
  exportFormat
}) => {
  const segmentDate = tripStartDate 
    ? new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000)
    : null;

  // Comprehensive debug of segment data
  console.log(`📄 PDFDaySegmentCard Day ${segment.day}: Complete segment inspection:`, {
    segment: segment,
    hasDirectWeather: !!segment.weather,
    hasWeatherData: !!segment.weatherData,
    hasDestinationWeather: !!(segment.destination as any)?.weather,
    hasDestinationWeatherData: !!(segment.destination as any)?.weatherData,
    destinationObject: segment.destination,
    allSegmentKeys: Object.keys(segment),
    city: segment.endCity
  });

  // Try to find weather data in multiple locations
  const weatherInfo = segment.weather || 
                     segment.weatherData || 
                     (segment.destination as any)?.weather || 
                     (segment.destination as any)?.weatherData ||
                     null;

  console.log(`🌤️ Weather info for Day ${segment.day}:`, weatherInfo);

  const distance = segment.distance || segment.approximateMiles || 0;

  return (
    <div className="pdf-day-segment no-page-break bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
      <PDFDaySegmentCardHeader
        day={segment.day}
        endCity={segment.endCity}
        segmentDate={segmentDate}
      />

      <PDFDaySegmentCardStats
        distance={distance}
        driveTimeHours={segment.driveTimeHours}
        startCity={segment.startCity}
        endCity={segment.endCity}
      />

      <PDFDaySegmentCardWeather
        weatherInfo={weatherInfo}
        segmentDate={segmentDate}
        exportFormat={exportFormat}
      />

      <PDFDaySegmentCardStops
        segment={segment}
        exportFormat={exportFormat}
      />

      <PDFDaySegmentCardFooter
        segment={segment}
      />
    </div>
  );
};

export default PDFDaySegmentCard;
