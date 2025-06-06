
import React from 'react';
import { format } from 'date-fns';
import { DailySegment } from '../../services/planning/TripPlanBuilder';

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

  const formatTime = (hours: number): string => {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}m`;
    }
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  };

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

  return (
    <div className="pdf-day-segment no-page-break bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
      {/* Card Header */}
      <div className="pdf-card-header border-b border-gray-100 pb-3 mb-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="pdf-day-badge bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                Day {segment.day}
              </span>
              <span className="text-blue-600">•</span>
              <h5 className="font-semibold text-blue-800">
                📍 {segment.endCity}
              </h5>
            </div>
            {segmentDate && (
              <p className="text-xs text-gray-600">
                📅 {format(segmentDate, 'EEEE, MMMM d')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Card Stats */}
      <div className="pdf-card-stats grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-blue-600">🛣️</span>
          <span className="font-medium">{Math.round(segment.distance || segment.approximateMiles || 0)} mi</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-blue-600">⏱️</span>
          <span className="font-medium">{formatTime(segment.driveTimeHours)}</span>
        </div>
      </div>

      {/* Route Description */}
      {segment.startCity && (
        <div className="pdf-route-description text-sm text-gray-600 mb-3">
          <strong>Route:</strong> {segment.startCity} → {segment.endCity}
        </div>
      )}

      {/* Weather Section (Full and Summary formats) */}
      {exportFormat !== 'route-only' && (
        <div className="pdf-weather-section mb-4 p-3 bg-blue-50 rounded border border-blue-200">
          <h6 className="text-xs font-semibold text-blue-800 mb-2 flex items-center gap-1">
            🌤️ Weather Forecast
          </h6>
          
          {weatherInfo ? (
            <div className="space-y-2">
              {/* Current Weather */}
              <div className="flex items-center justify-between text-sm bg-white rounded p-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {weatherInfo.temperature || 
                     weatherInfo.main?.temp ? Math.round(weatherInfo.main.temp) : 
                     weatherInfo.temp?.day ? Math.round(weatherInfo.temp.day) :
                     '--'}°F
                  </span>
                  <span className="text-blue-600">•</span>
                  <span className="capitalize">
                    {weatherInfo.description || 
                     weatherInfo.weather?.[0]?.description || 
                     'Partly cloudy'}
                  </span>
                </div>
                {(weatherInfo.humidity || weatherInfo.main?.humidity) && (
                  <span className="text-xs text-gray-600">
                    💧 {weatherInfo.humidity || weatherInfo.main?.humidity}%
                  </span>
                )}
              </div>
              
              {/* 3-Day Forecast if available */}
              {weatherInfo.forecast && weatherInfo.forecast.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {weatherInfo.forecast.slice(0, 3).map((day: any, index: number) => (
                    <div key={index} className="text-center p-2 bg-white rounded border text-xs">
                      <div className="font-medium text-gray-700">{day.date}</div>
                      <div className="text-blue-600 font-semibold">
                        {day.temperature?.high || day.temp?.max ? Math.round(day.temp?.max || day.temperature.high) : '--'}°/
                        {day.temperature?.low || day.temp?.min ? Math.round(day.temp?.min || day.temperature.low) : '--'}°
                      </div>
                      <div className="text-gray-500 capitalize text-xs">
                        {day.description || day.weather?.[0]?.description || 'Clear'}
                      </div>
                      {day.precipitationChance && parseInt(day.precipitationChance) > 0 && (
                        <div className="text-blue-500 text-xs">
                          {day.precipitationChance}% rain
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Additional Weather Details */}
              <div className="flex gap-4 text-xs text-gray-600 mt-2">
                {(weatherInfo.windSpeed || weatherInfo.wind?.speed) && (
                  <span>💨 {weatherInfo.windSpeed || Math.round(weatherInfo.wind.speed)} mph wind</span>
                )}
                {(weatherInfo.visibility) && (
                  <span>👁️ {typeof weatherInfo.visibility === 'number' ? 
                    Math.round(weatherInfo.visibility > 100 ? weatherInfo.visibility / 1000 : weatherInfo.visibility) 
                    : weatherInfo.visibility} mi visibility</span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-sm text-gray-600 bg-white rounded p-3">
              <div>Weather data not available</div>
              <div className="text-xs text-gray-500 mt-1">
                Check live weather before departure
              </div>
              {segmentDate && (
                <div className="text-xs text-blue-600 mt-2">
                  Expected season: {
                    segmentDate.getMonth() >= 2 && segmentDate.getMonth() <= 4 ? 'Spring' :
                    segmentDate.getMonth() >= 5 && segmentDate.getMonth() <= 7 ? 'Summer' :
                    segmentDate.getMonth() >= 8 && segmentDate.getMonth() <= 10 ? 'Fall' : 'Winter'
                  }
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Recommended Stops - Show ALL stops in PDF */}
      {exportFormat !== 'route-only' && segment.recommendedStops && segment.recommendedStops.length > 0 && (
        <div className="pdf-recommended-stops mb-4">
          <h6 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
            🏛️ Recommended Stops ({segment.recommendedStops.length} total)
          </h6>
          <ul className="space-y-1">
            {segment.recommendedStops.map((stop, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>
                  <strong>{stop.name}</strong>
                  {stop.description && exportFormat === 'full' && (
                    <span className="text-gray-500"> - {stop.description}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Drive Time Category */}
      {segment.driveTimeCategory && (
        <div className="pdf-drive-time-category mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">Driving intensity:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              segment.driveTimeCategory.category === 'short' ? 'bg-green-100 text-green-700' :
              segment.driveTimeCategory.category === 'optimal' ? 'bg-blue-100 text-blue-700' :
              segment.driveTimeCategory.category === 'long' ? 'bg-orange-100 text-orange-700' :
              'bg-red-100 text-red-700'
            }`}>
              {segment.driveTimeCategory.message}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFDaySegmentCard;
