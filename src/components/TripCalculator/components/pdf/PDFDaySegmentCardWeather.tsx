
import React from 'react';
import { format } from 'date-fns';
import { DailySegment, getDestinationCityName } from '../../services/planning/TripPlanBuilder';

interface PDFDaySegmentCardWeatherProps {
  segment: DailySegment;
  segmentDate?: Date;
  exportFormat: 'full' | 'summary' | 'route-only';
}

const PDFDaySegmentCardWeather: React.FC<PDFDaySegmentCardWeatherProps> = ({
  segment,
  segmentDate,
  exportFormat
}) => {
  // Get weather data for the segment's end city (destination)
  const weatherData = segment.weather;
  const endCityName = segment.endCity || getDestinationCityName(segment.destination);

  console.log('🌤️ FRESH PDF Weather rendering for:', endCityName, 'Date:', segmentDate, 'Weather:', weatherData);

  if (!weatherData) {
    console.log('⚠️ No weather data available for', endCityName);
    return (
      <div className="pdf-weather-card">
        <h4 className="text-sm font-semibold text-route66-navy mb-2 flex items-center gap-2">
          🌤️ Weather Forecast for {endCityName}
        </h4>
        <div className="text-xs text-route66-vintage-brown bg-white p-3 rounded border border-route66-tan">
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>Weather data will be available closer to your travel date</span>
          </div>
          <div className="mt-2 text-route66-text-secondary">
            Check local weather forecasts before departure for the most accurate conditions.
          </div>
        </div>
      </div>
    );
  }

  // Handle different weather data formats - ensure we get the right temperature values
  const lowTemp = weatherData.lowTemp || weatherData.temp?.min;
  const highTemp = weatherData.highTemp || weatherData.temp?.max;
  const condition = weatherData.condition || weatherData.description || weatherData.main;
  const humidity = weatherData.humidity;
  const windSpeed = weatherData.windSpeed || weatherData.wind?.speed;

  console.log('🌡️ FRESH Temperature data for', endCityName, ':', {
    lowTemp,
    highTemp,
    condition,
    humidity,
    windSpeed,
    isActualForecast: weatherData.isActualForecast
  });

  return (
    <div className="pdf-weather-card">
      <h4 className="text-sm font-semibold text-route66-navy mb-3 flex items-center gap-2">
        🌤️ Weather Forecast for {endCityName}
        {segmentDate && (
          <span className="text-xs text-route66-vintage-brown font-normal">
            ({format(segmentDate, 'MMM d')})
          </span>
        )}
        {weatherData.isActualForecast && (
          <span className="text-xs text-green-600 font-normal">✓ Live</span>
        )}
      </h4>
      
      <div className="bg-white p-3 rounded border border-route66-tan">
        <div className="grid grid-cols-2 gap-3 text-xs">
          {/* Temperature */}
          <div className="flex items-center gap-2">
            <span className="text-route66-primary">🌡️</span>
            <div>
              <div className="font-medium text-route66-navy">Temperature</div>
              <div className="text-route66-vintage-brown font-semibold">
                {(lowTemp !== undefined && highTemp !== undefined) ? 
                  `${Math.round(highTemp)}°/${Math.round(lowTemp)}°F` :
                  highTemp !== undefined ? `${Math.round(highTemp)}°F` :
                  lowTemp !== undefined ? `${Math.round(lowTemp)}°F` :
                  'N/A'
                }
              </div>
            </div>
          </div>
          
          {/* Condition */}
          <div className="flex items-center gap-2">
            <span className="text-route66-primary">☁️</span>
            <div>
              <div className="font-medium text-route66-navy">Conditions</div>
              <div className="text-route66-vintage-brown capitalize">
                {condition || 'Variable'}
              </div>
            </div>
          </div>
          
          {/* Humidity (if available) */}
          {humidity && (
            <div className="flex items-center gap-2">
              <span className="text-route66-primary">💧</span>
              <div>
                <div className="font-medium text-route66-navy">Humidity</div>
                <div className="text-route66-vintage-brown">{humidity}%</div>
              </div>
            </div>
          )}
          
          {/* Wind Speed (if available) */}
          {windSpeed && (
            <div className="flex items-center gap-2">
              <span className="text-route66-primary">💨</span>
              <div>
                <div className="font-medium text-route66-navy">Wind</div>
                <div className="text-route66-vintage-brown">{windSpeed} mph</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Travel Advisory */}
        <div className="mt-3 pt-2 border-t border-route66-border">
          <div className="text-xs text-route66-vintage-brown italic">
            💡 <strong>Travel Tip:</strong> Route 66 weather can vary greatly between destinations. 
            Check current conditions before departing each day.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFDaySegmentCardWeather;
