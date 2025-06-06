
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import SegmentWeatherWidget from '../SegmentWeatherWidget';
import TemperatureDisplay from '../weather/TemperatureDisplay';
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

  // Extract weather data from the segment if available
  const weatherData = segment.weather || {};
  const hasWeatherData = weatherData && (weatherData.main || weatherData.temp || weatherData.weather);
  
  // Format month and day for displaying the date
  const dateDisplay = segmentDate 
    ? segmentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : null;

  return (
    <div className="pdf-weather-card mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
      {/* Weather Card Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-blue-600">🌤️</span>
          <h6 className="text-sm font-semibold text-blue-800">Weather</h6>
          {dateDisplay && (
            <span className="text-xs text-blue-600">
              {dateDisplay}
            </span>
          )}
        </div>
      </div>
      
      <div className="pdf-weather-content bg-white rounded-lg p-2">
        {hasWeatherData ? (
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <WeatherIcon 
                iconCode={weatherData.weather?.[0]?.icon || '01d'} 
                size="large"
              />
              <div className="ml-2">
                <div className="text-sm font-medium">
                  {weatherData.weather?.[0]?.main || 'Weather data'}
                </div>
                <div className="text-xs text-gray-500">
                  {weatherData.weather?.[0]?.description || ''}
                </div>
              </div>
            </div>
            
            <div>
              {weatherData.main?.temp !== undefined && (
                <div className="text-lg font-bold text-blue-600">
                  {Math.round(weatherData.main.temp)}°F
                </div>
              )}
              {weatherData.temp?.day !== undefined && (
                <div className="text-lg font-bold text-blue-600">
                  {Math.round(weatherData.temp.day)}°F
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="text-sm text-gray-600">
              {segmentDate ? (
                <span>
                  Typical weather for {segmentDate.toLocaleDateString('en-US', { month: 'long' })}
                </span>
              ) : (
                <span>Weather information</span>
              )}
            </div>
          </div>
        )}
        
        {/* Weather Temperature Range if available */}
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
      
      {/* Seasonal Info for PDF only */}
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
