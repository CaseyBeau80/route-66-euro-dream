
import React from 'react';
import { format } from 'date-fns';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import PDFWeatherForecast from './PDFWeatherForecast';

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

  console.log(`📄 PDFDaySegmentCard Day ${segment.day}: Rendering with enhanced layout matching UI`);

  // Extract weather data with proper priority
  const weatherData = segment.weather || segment.weatherData || null;
  const distance = segment.distance || segment.approximateMiles || 0;

  // Format drive time
  const formatDriveTime = (hours: number): string => {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}m`;
    }
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  };

  return (
    <div className="pdf-day-segment no-page-break bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
      {/* Day Header - Enhanced to match UI */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-route66-primary">
              Day {segment.day}: {segment.endCity}
            </h3>
            {segmentDate && (
              <p className="text-sm text-gray-600">
                {format(segmentDate, 'EEEE, MMMM d, yyyy')}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="bg-route66-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
              Day {segment.day}
            </div>
          </div>
        </div>
        
        {/* Route Stats - Matching UI Layout */}
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="font-medium">📍</span>
            <span>{segment.startCity} → {segment.endCity}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">🛣️</span>
            <span>{Math.round(distance)} miles</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">⏱️</span>
            <span>{formatDriveTime(segment.driveTimeHours)} driving</span>
          </div>
        </div>
      </div>

      {/* Weather Forecast - New Unified Component */}
      <PDFWeatherForecast
        weatherData={weatherData}
        segmentDate={segmentDate}
        cityName={segment.endCity}
        exportFormat={exportFormat}
      />

      {/* Route Details */}
      {exportFormat !== 'route-only' && (
        <div className="space-y-4">
          {/* Recommended Stops - Using the correct property name */}
          {segment.stops && segment.stops.length > 0 && (
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                🎯 Recommended Stops
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {segment.stops.slice(0, 4).map((stop, index) => (
                  <div key={index} className="text-sm p-2 bg-gray-50 rounded border">
                    <div className="font-medium text-gray-700">{stop.name || stop.title}</div>
                    {stop.description && (
                      <div className="text-xs text-gray-600 mt-1">{stop.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attractions */}
          {segment.attractions && segment.attractions.length > 0 && (
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                🎭 Notable Attractions
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {segment.attractions.slice(0, 4).map((attraction, index) => (
                  <div key={index} className="text-sm p-2 bg-orange-50 rounded border border-orange-200">
                    <div className="font-medium text-orange-700">{attraction.name || attraction.title}</div>
                    {attraction.description && (
                      <div className="text-xs text-orange-600 mt-1">{attraction.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Travel Notes */}
          {segment.notes && (
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <h5 className="text-sm font-semibold text-blue-700 mb-1">📝 Travel Notes</h5>
              <p className="text-sm text-blue-700">{segment.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Drive Time Warning */}
      {segment.driveTimeHours > 7 && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 text-orange-700">
            <span className="text-sm">⚠️</span>
            <span className="text-sm font-medium">Long Drive Day</span>
          </div>
          <p className="text-xs text-orange-600 mt-1">
            Consider breaking this into shorter segments or plan for extra rest stops.
          </p>
        </div>
      )}
    </div>
  );
};

export default PDFDaySegmentCard;
