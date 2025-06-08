
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
  date?: string;
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
  console.log(`📄 PDFWeatherForecast: Rendering for ${cityName}`, {
    hasWeatherData: !!weatherData,
    exportFormat,
    isActualForecast: weatherData?.isActualForecast,
    source: weatherData?.source
  });

  // Skip weather display for route-only format
  if (exportFormat === 'route-only') {
    return null;
  }

  // If no weather data, show unavailable message
  if (!weatherData || (!weatherData.lowTemp && !weatherData.highTemp)) {
    return (
      <div className="pdf-weather-section mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          🌤️ Weather Information
          {segmentDate && (
            <span className="text-xs text-gray-500">
              ({format(segmentDate, 'MMM d')})
            </span>
          )}
        </h4>
        <p className="text-sm text-gray-500">
          Weather forecast not available for {cityName}
        </p>
      </div>
    );
  }

  const getWeatherIcon = (description?: string): string => {
    if (!description) return '🌤️';
    const desc = description.toLowerCase();
    if (desc.includes('sunny') || desc.includes('clear')) return '☀️';
    if (desc.includes('rain') || desc.includes('shower')) return '🌧️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('storm')) return '⛈️';
    return '🌤️';
  };

  const getDataSourceLabel = () => {
    if (weatherData.isActualForecast) {
      return '📡 Live Weather Forecast';
    } else {
      return '📊 Historical Seasonal Data';
    }
  };

  return (
    <div className="pdf-weather-section mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-sm font-semibold text-blue-800 flex items-center gap-2">
          {getWeatherIcon(weatherData.description)} Weather Forecast
          {segmentDate && (
            <span className="text-xs text-blue-600">
              ({format(segmentDate, 'MMM d')})
            </span>
          )}
        </h4>
        <span className="text-xs text-blue-600 font-medium">
          {getDataSourceLabel()}
        </span>
      </div>
      
      {/* Temperature Display - Matching UI Layout */}
      <div className="flex items-center justify-center gap-4 mb-3 p-3 bg-white rounded border">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-700">
            {weatherData.lowTemp ? Math.round(weatherData.lowTemp) : '--'}°
          </div>
          <div className="text-xs text-blue-600">Low</div>
        </div>
        
        <div className="text-2xl">
          {getWeatherIcon(weatherData.description)}
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-blue-700">
            {weatherData.highTemp ? Math.round(weatherData.highTemp) : '--'}°
          </div>
          <div className="text-xs text-blue-600">High</div>
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="text-center">
          <div className="font-medium text-blue-700">
            {weatherData.description || 'N/A'}
          </div>
          <div className="text-blue-600 text-xs">Conditions</div>
        </div>
        
        {weatherData.precipitationChance !== undefined && (
          <div className="text-center">
            <div className="font-medium text-blue-700">{weatherData.precipitationChance}%</div>
            <div className="text-blue-600 text-xs">Rain Chance</div>
          </div>
        )}
        
        {weatherData.humidity && (
          <div className="text-center">
            <div className="font-medium text-blue-700">{weatherData.humidity}%</div>
            <div className="text-blue-600 text-xs">Humidity</div>
          </div>
        )}
        
        {weatherData.windSpeed && (
          <div className="text-center">
            <div className="font-medium text-blue-700">{Math.round(weatherData.windSpeed)} mph</div>
            <div className="text-blue-600 text-xs">Wind Speed</div>
          </div>
        )}
      </div>
      
      {/* Data Reliability Notice */}
      <div className="mt-3 text-xs text-blue-500 text-center">
        {weatherData.isActualForecast 
          ? 'Live forecast data from weather service' 
          : 'Based on historical weather patterns for this location and time of year'
        }
      </div>
    </div>
  );
};

export default PDFWeatherForecast;
