
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import WeatherIcon from '../weather/WeatherIcon';

interface PDFWeatherCardProps {
  segment: DailySegment;
  tripStartDate?: Date;
  cardIndex?: number;
  tripId?: string;
}

const PDFWeatherCard: React.FC<PDFWeatherCardProps> = ({
  segment,
  tripStartDate,
  cardIndex,
  tripId
}) => {
  const segmentDate = tripStartDate 
    ? new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000)
    : null;

  console.log(`🌤️ PDFWeatherCard for Day ${segment.day}:`, {
    segmentDate: segmentDate?.toISOString(),
    hasWeatherData: !!segment.weatherData,
    hasWeather: !!segment.weather
  });

  // Get weather data from segment (prioritize weatherData over weather)
  const weatherData = segment.weatherData || segment.weather || {};
  
  // Check if we have meaningful weather data
  const hasWeatherData = weatherData && (
    weatherData.main || 
    weatherData.temp || 
    weatherData.weather || 
    weatherData.temperature ||
    weatherData.description
  );
  
  // Format the trip date for display
  const dateDisplay = segmentDate 
    ? segmentDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      })
    : null;

  // Extract temperature from various possible formats
  const getTemperature = () => {
    if (weatherData.temperature) return Math.round(weatherData.temperature);
    if (weatherData.main?.temp) return Math.round(weatherData.main.temp);
    if (weatherData.temp?.day) return Math.round(weatherData.temp.day);
    return null;
  };

  // Extract weather description
  const getWeatherDescription = () => {
    if (weatherData.description) return weatherData.description;
    if (weatherData.weather?.[0]?.description) return weatherData.weather[0].description;
    return null;
  };

  // Extract weather main category
  const getWeatherMain = () => {
    if (weatherData.weather?.[0]?.main) return weatherData.weather[0].main;
    return getWeatherDescription() || 'Weather';
  };

  // Extract weather icon
  const getWeatherIcon = () => {
    if (weatherData.icon) return weatherData.icon;
    if (weatherData.weather?.[0]?.icon) return weatherData.weather[0].icon;
    return '01d'; // default sunny icon
  };

  const temperature = getTemperature();
  const description = getWeatherDescription();
  const weatherMain = getWeatherMain();
  const iconCode = getWeatherIcon();

  return (
    <div className="pdf-weather-card mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
      {/* Weather Card Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-blue-600">🌤️</span>
          <h6 className="text-sm font-semibold text-blue-800">Weather</h6>
        </div>
        {dateDisplay && (
          <span className="text-xs text-blue-600">
            {dateDisplay}
          </span>
        )}
      </div>
      
      <div className="pdf-weather-content bg-white rounded-lg p-2">
        {hasWeatherData ? (
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <WeatherIcon 
                iconCode={iconCode} 
                className="h-12 w-12"
              />
              <div className="ml-2">
                <div className="text-sm font-medium">
                  {weatherMain}
                </div>
                {description && (
                  <div className="text-xs text-gray-500 capitalize">
                    {description}
                  </div>
                )}
              </div>
            </div>
            
            {temperature && (
              <div className="text-lg font-bold text-blue-600">
                {temperature}°F
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="text-sm text-gray-600">
              {segmentDate ? (
                <span>
                  Weather for {segmentDate.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              ) : (
                <span>Weather information</span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Check live weather before departure
            </div>
          </div>
        )}
        
        {/* Temperature Range if available */}
        {weatherData.main?.temp_min !== undefined && weatherData.main?.temp_max !== undefined && (
          <div className="mt-2 text-xs flex justify-between">
            <span>Min: {Math.round(weatherData.main.temp_min)}°F</span>
            <span>Max: {Math.round(weatherData.main.temp_max)}°F</span>
          </div>
        )}
        
        {/* Forecast Temperature Range if available */}
        {weatherData.temp?.min !== undefined && weatherData.temp?.max !== undefined && (
          <div className="mt-2 text-xs flex justify-between">
            <span>Min: {Math.round(weatherData.temp.min)}°F</span>
            <span>Max: {Math.round(weatherData.temp.max)}°F</span>
          </div>
        )}
      </div>
      
      {/* Reference info for non-actual forecasts */}
      {weatherData.isActualForecast === false && (
        <div className="mt-2 text-xs text-blue-700 bg-blue-100 p-2 rounded">
          ⚠️ Current conditions shown as reference - check live weather before departure
        </div>
      )}
      
      {/* Seasonal Info for PDF when no weather data */}
      {segmentDate && !hasWeatherData && (
        <div className="mt-2 text-xs text-blue-700">
          <strong>Season:</strong> {
            segmentDate.getMonth() >= 2 && segmentDate.getMonth() <= 4 ? 'Spring' :
            segmentDate.getMonth() >= 5 && segmentDate.getMonth() <= 7 ? 'Summer' :
            segmentDate.getMonth() >= 8 && segmentDate.getMonth() <= 10 ? 'Fall' : 'Winter'
          } - Check current weather before departure
        </div>
      )}
    </div>
  );
};

export default PDFWeatherCard;
