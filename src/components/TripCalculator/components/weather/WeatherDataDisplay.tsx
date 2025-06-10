
import React from 'react';
import ForecastWeatherDisplay from './ForecastWeatherDisplay';
import DismissibleSeasonalWarning from './DismissibleSeasonalWarning';
import { DateNormalizationService } from './DateNormalizationService';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

interface WeatherDataDisplayProps {
  weather: any;
  segmentDate: Date | null;
  segmentEndCity: string;
  isSharedView?: boolean;
  error?: string | null;
  retryCount?: number;
  isPDFExport?: boolean;
}

const WeatherDataDisplay: React.FC<WeatherDataDisplayProps> = ({
  weather,
  segmentDate,
  segmentEndCity,
  isSharedView = false,
  error = null,
  retryCount = 0,
  isPDFExport = false
}) => {
  // Enhanced validation with simplified logging
  if (!weather) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-gray-400 text-2xl mb-2">🌤️</div>
        <p className="text-sm text-gray-600">
          {isPDFExport ? 'Weather information processing for export...' : 'Weather information not available'}
        </p>
      </div>
    );
  }

  // Normalize segment date for consistent handling
  const normalizedSegmentDate = segmentDate ? 
    DateNormalizationService.normalizeSegmentDate(segmentDate) : null;

  // Simplified logging for development
  if (process.env.NODE_ENV === 'development' && normalizedSegmentDate) {
    console.log(`🗓️ WeatherDataDisplay for ${segmentEndCity}:`, {
      segmentDate: DateNormalizationService.toDateString(normalizedSegmentDate),
      isActualForecast: weather.isActualForecast
    });
  }

  // Determine display strategy based on data quality
  const displayStrategy = getDisplayStrategy(weather, normalizedSegmentDate, error, retryCount);
  
  console.log(`🎯 Display strategy for ${segmentEndCity}: ${displayStrategy}`);

  switch (displayStrategy) {
    case 'live-forecast':
      return renderLiveForecast(weather, normalizedSegmentDate, isPDFExport, isSharedView);
      
    case 'seasonal-estimate':
      return renderSeasonalEstimate(weather, normalizedSegmentDate, isPDFExport, isSharedView);
      
    case 'service-unavailable':
      return renderServiceUnavailable(error, isPDFExport, segmentEndCity);
      
    default:
      return renderFallback(isPDFExport);
  }
};

// Simplified display strategy determination
function getDisplayStrategy(weather: any, normalizedSegmentDate: Date | null, error: string | null, retryCount: number): string {
  // Error conditions
  if (error && retryCount > 3) {
    return 'service-unavailable';
  }

  // No weather data
  if (!weather) {
    return 'service-unavailable';
  }

  // Check for live forecast data
  if (weather.isActualForecast === true) {
    return 'live-forecast';
  }

  // Check for valid temperature data
  if ((weather.highTemp !== undefined && weather.lowTemp !== undefined) || 
      weather.temperature !== undefined) {
    return 'seasonal-estimate';
  }

  return 'service-unavailable';
}

// Simplified render functions
function renderLiveForecast(weather: any, normalizedSegmentDate: Date | null, isPDFExport: boolean, isSharedView: boolean) {
  const forecastWeather = weather as ForecastWeatherData;
  
  const warningMessage = isPDFExport ? 'Live weather forecast' : 'Live forecast from OpenWeatherMap';
  
  return (
    <div className="space-y-2">
      {!isPDFExport && (
        <DismissibleSeasonalWarning
          message={warningMessage}
          type="forecast-unavailable"
          isSharedView={isSharedView}
        />
      )}
      <ForecastWeatherDisplay weather={forecastWeather} segmentDate={normalizedSegmentDate} />
    </div>
  );
}

function renderSeasonalEstimate(weather: any, normalizedSegmentDate: Date | null, isPDFExport: boolean, isSharedView: boolean) {
  const forecastWeather = weather as ForecastWeatherData;
  
  // Calculate days from now for display purposes
  const daysFromNow = normalizedSegmentDate ? 
    Math.ceil((normalizedSegmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : null;
  
  let warningMessage = isPDFExport ? 'Historical weather patterns' : 'Based on historical weather patterns';
  if (daysFromNow && daysFromNow > 5) {
    warningMessage = isPDFExport ? 
      `Historical data (${daysFromNow} days ahead)` :
      `Historical data (${daysFromNow} days ahead, beyond forecast range)`;
  }
  
  return (
    <div className="space-y-2">
      {!isPDFExport && (
        <DismissibleSeasonalWarning
          message={warningMessage}
          type="seasonal"
          isSharedView={isSharedView}
        />
      )}
      <ForecastWeatherDisplay weather={forecastWeather} segmentDate={normalizedSegmentDate} />
    </div>
  );
}

function renderServiceUnavailable(error: string | null, isPDFExport: boolean, segmentEndCity: string) {
  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="text-gray-400 text-2xl mb-2">🌤️</div>
      <p className="text-sm text-gray-600">
        {isPDFExport 
          ? "Weather information temporarily unavailable" 
          : error || "Weather service temporarily unavailable"}
      </p>
      {isPDFExport && (
        <p className="text-xs text-gray-500 mt-1">
          Check the live version for current conditions
        </p>
      )}
    </div>
  );
}

function renderFallback(isPDFExport: boolean) {
  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="animate-pulse text-gray-500 text-sm">
        {isPDFExport ? 'Processing weather for export...' : 'Loading weather information...'}
      </div>
    </div>
  );
}

export default WeatherDataDisplay;
