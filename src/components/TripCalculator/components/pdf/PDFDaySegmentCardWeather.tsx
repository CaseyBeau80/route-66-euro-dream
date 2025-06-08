
import React from 'react';
import { format } from 'date-fns';

interface WeatherInfo {
  cityName?: string;
  lowTemp?: number;
  highTemp?: number;
  description?: string;
  humidity?: number;
  windSpeed?: number;
  isActualForecast?: boolean;
  source?: string;
  date?: string;
}

interface PDFDaySegmentCardWeatherProps {
  weatherInfo?: WeatherInfo | null;
  segmentDate?: Date | null;
  exportFormat: 'full' | 'summary' | 'route-only';
}

const PDFDaySegmentCardWeather: React.FC<PDFDaySegmentCardWeatherProps> = ({
  weatherInfo,
  segmentDate,
  exportFormat
}) => {
  // Skip weather display for route-only format
  if (exportFormat === 'route-only') {
    return null;
  }

  if (!weatherInfo) {
    return (
      <div className="pdf-weather-section mb-4 p-3 bg-gray-50 rounded border">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">☁️ Weather Information</h4>
        <p className="text-sm text-gray-500">Weather data not available</p>
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
        {getWeatherIcon(weatherInfo.description)} Weather Forecast
        {segmentDate && (
          <span className="text-xs text-blue-600">
            ({format(segmentDate, 'MMM d')})
          </span>
        )}
      </h4>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="text-center">
          <div className="font-bold text-blue-700">
            {weatherInfo.lowTemp}°-{weatherInfo.highTemp}°F
          </div>
          <div className="text-blue-600 text-xs">Temperature</div>
        </div>
        
        <div className="text-center">
          <div className="font-medium text-blue-700">
            {weatherInfo.description || 'N/A'}
          </div>
          <div className="text-blue-600 text-xs">Conditions</div>
        </div>
        
        {weatherInfo.humidity && (
          <div className="text-center">
            <div className="font-medium text-blue-700">{weatherInfo.humidity}%</div>
            <div className="text-blue-600 text-xs">Humidity</div>
          </div>
        )}
        
        {weatherInfo.windSpeed && (
          <div className="text-center">
            <div className="font-medium text-blue-700">{weatherInfo.windSpeed} mph</div>
            <div className="text-blue-600 text-xs">Wind Speed</div>
          </div>
        )}
      </div>
      
      {weatherInfo.source && (
        <div className="mt-2 text-xs text-blue-500">
          Data source: {weatherInfo.isActualForecast ? 'Live forecast' : 'Historical seasonal data'}
        </div>
      )}
    </div>
  );
};

export default PDFDaySegmentCardWeather;
