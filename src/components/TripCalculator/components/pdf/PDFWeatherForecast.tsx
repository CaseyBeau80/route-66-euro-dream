
import React from 'react';
import { format } from 'date-fns';

interface WeatherForecastData {
  lowTemp?: number;
  highTemp?: number;
  description?: string;
  humidity?: number;
  windSpeed?: number;
  precipitationChance?: number;
  cityName?: string;
  isActualForecast?: boolean;
  source?: string;
}

interface PDFWeatherForecastProps {
  weatherData?: WeatherForecastData | null;
  segmentDate?: Date | null;
  cityName: string;
  exportFormat: 'full' | 'summary' | 'route-only';
}

const PDFWeatherForecast: React.FC<PDFWeatherForecastProps> = ({
  weatherData,
  segmentDate,
  cityName,
  exportFormat
}) => {
  // Skip weather display for route-only format
  if (exportFormat === 'route-only') {
    return null;
  }

  const getWeatherIcon = (description?: string): string => {
    if (!description) return '☁️';
    const desc = description.toLowerCase();
    if (desc.includes('sunny') || desc.includes('clear')) return '☀️';
    if (desc.includes('rain') || desc.includes('shower')) return '🌧️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('storm')) return '⛈️';
    return '🌤️';
  };

  // If no meaningful weather data, show informational card
  if (!weatherData || (!weatherData.lowTemp && !weatherData.highTemp)) {
    return (
      <div className="pdf-weather-info mb-4 p-3 bg-yellow-50 rounded border border-yellow-200">
        <h5 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center gap-2">
          🌤️ Weather Information
          {segmentDate && (
            <span className="text-xs text-yellow-600">
              ({format(segmentDate, 'MMM d')})
            </span>
          )}
        </h5>
        <p className="text-sm text-yellow-700">
          Check current weather conditions for {cityName} before departure
        </p>
        {segmentDate && (
          <p className="text-xs text-yellow-600 mt-1">
            Season: {
              segmentDate.getMonth() >= 2 && segmentDate.getMonth() <= 4 ? 'Spring' :
              segmentDate.getMonth() >= 5 && segmentDate.getMonth() <= 7 ? 'Summer' :
              segmentDate.getMonth() >= 8 && segmentDate.getMonth() <= 10 ? 'Fall' : 'Winter'
            }
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="pdf-weather-section no-page-break mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h5 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
        {getWeatherIcon(weatherData.description)} Weather Forecast
        {segmentDate && (
          <span className="text-xs text-blue-600">
            ({format(segmentDate, 'MMM d')})
          </span>
        )}
      </h5>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
        {/* Temperature Range */}
        <div className="text-center p-2 bg-white rounded border">
          <div className="font-bold text-blue-700">
            {weatherData.lowTemp && weatherData.highTemp ? (
              `${Math.round(weatherData.lowTemp)}° - ${Math.round(weatherData.highTemp)}°F`
            ) : (
              'Check forecast'
            )}
          </div>
          <div className="text-blue-600 text-xs">Temperature</div>
        </div>
        
        {/* Weather Condition */}
        <div className="text-center p-2 bg-white rounded border">
          <div className="font-medium text-blue-700">
            {weatherData.description || 'Variable'}
          </div>
          <div className="text-blue-600 text-xs">Conditions</div>
        </div>
        
        {/* Precipitation */}
        {weatherData.precipitationChance !== undefined && (
          <div className="text-center p-2 bg-white rounded border">
            <div className="font-medium text-blue-700">{weatherData.precipitationChance}%</div>
            <div className="text-blue-600 text-xs">Rain Chance</div>
          </div>
        )}
        
        {/* Additional Info */}
        <div className="text-center p-2 bg-white rounded border">
          <div className="font-medium text-blue-700">
            {weatherData.humidity ? `${weatherData.humidity}%` : 'Variable'}
          </div>
          <div className="text-blue-600 text-xs">Humidity</div>
        </div>
      </div>
      
      {/* Data Source */}
      <div className="mt-3 text-xs text-blue-600 bg-blue-100 p-2 rounded">
        {weatherData.isActualForecast 
          ? '📡 Live weather forecast data' 
          : '📊 Historical seasonal data - verify current conditions before departure'
        }
      </div>
    </div>
  );
};

export default PDFWeatherForecast;
