
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import PDFDaySegmentCardHeader from './PDFDaySegmentCardHeader';
import PDFDaySegmentCardStats from './PDFDaySegmentCardStats';
import PDFSegmentWeatherForecast from './PDFSegmentWeatherForecast';
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

  console.log(`📄 PDFDaySegmentCard Day ${segment.day}: Rendering with forecast-only approach:`, {
    hasDirectWeather: !!segment.weather,
    hasWeatherData: !!segment.weatherData,
    city: segment.endCity,
    exportFormat
  });

  // Extract weather data - prioritize the enriched data
  const weatherData = segment.weather || segment.weatherData || null;

  console.log(`🌤️ Weather data for Day ${segment.day} (${segment.endCity}):`, weatherData);

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

      <PDFSegmentWeatherForecast
        forecastData={weatherData}
        segmentDate={segmentDate}
        cityName={segment.endCity}
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
