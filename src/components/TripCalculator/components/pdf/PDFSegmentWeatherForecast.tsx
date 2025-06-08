
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

interface PDFSegmentWeatherForecastProps {
  forecastData?: WeatherForecastData | null;
  segmentDate?: Date | null;
  cityName: string;
  exportFormat: 'full' | 'summary' | 'route-only';
}

const PDFSegmentWeatherForecast: React.FC<PDFSegmentWeatherForecastProps> = ({
  forecastData,
  segmentDate,
  cityName,
  exportFormat
}) => {
  console.log(`📄 PDFSegmentWeatherForecast: Rendering for ${cityName}`, {
    hasForecastData: !!forecastData,
    exportFormat,
    segmentDate: segmentDate?.toISOString()
  });

  // Skip weather display for route-only format
  if (exportFormat === 'route-only') {
    return null;
  }

  // If no forecast data, show unavailable message
  if (!forecastData || (!forecastData.lowTemp && !forecastData.highTemp)) {
    return (
      <div className="pdf-weather-section mb-4 p-3 bg-gray-50 rounded border">
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          ☁️ Weather Information
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
    if (!description) return '☁️';
    const desc = description.toLowerCase();
    if (desc.includes('sunny') || desc.includes('clear')) return '☀️';
    if (desc.includes('rain') || desc.includes('shower')) return '🌧️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('storm')) return '⛈️';
    return '🌤️';
  };

  return (
    <div className="pdf-weather-section mb-4 p-3 bg-blue-50 rounded border border-blue-200">
      <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
        {getWeatherIcon(forecastData.description)} Weather Forecast
        {segmentDate && (
          <span className="text-xs text-blue-600">
            ({format(segmentDate, 'MMM d')})
          </span>
        )}
      </h4>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        {/* Temperature Range */}
        <div className="text-center">
          <div className="font-bold text-blue-700">
            {forecastData.lowTemp && forecastData.highTemp ? (
              `${Math.round(forecastData.lowTemp)}°-${Math.round(forecastData.highTemp)}°F`
            ) : forecastData.lowTemp ? (
              `${Math.round(forecastData.lowTemp)}°F`
            ) : forecastData.highTemp ? (
              `${Math.round(forecastData.highTemp)}°F`
            ) : (
              'N/A'
            )}
          </div>
          <div className="text-blue-600 text-xs">Temperature</div>
        </div>
        
        {/* Weather Condition */}
        <div className="text-center">
          <div className="font-medium text-blue-700">
            {forecastData.description || 'N/A'}
          </div>
          <div className="text-blue-600 text-xs">Conditions</div>
        </div>
        
        {/* Precipitation Chance */}
        {forecastData.precipitationChance !== undefined && (
          <div className="text-center">
            <div className="font-medium text-blue-700">{forecastData.precipitationChance}%</div>
            <div className="text-blue-600 text-xs">Rain Chance</div>
          </div>
        )}
        
        {/* Humidity */}
        {forecastData.humidity && (
          <div className="text-center">
            <div className="font-medium text-blue-700">{forecastData.humidity}%</div>
            <div className="text-blue-600 text-xs">Humidity</div>
          </div>
        )}
        
        {/* Wind Speed */}
        {forecastData.windSpeed && (
          <div className="text-center">
            <div className="font-medium text-blue-700">{Math.round(forecastData.windSpeed)} mph</div>
            <div className="text-blue-600 text-xs">Wind Speed</div>
          </div>
        )}
      </div>
      
      {/* Data Source Information */}
      {forecastData.source && (
        <div className="mt-2 text-xs text-blue-500">
          {forecastData.isActualForecast 
            ? '📡 Live weather forecast' 
            : '📊 Historical seasonal data'
          }
        </div>
      )}
    </div>
  );
};

export default PDFSegmentWeatherForecast;
