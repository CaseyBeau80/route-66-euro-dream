
import React from 'react';
import ForecastWeatherDisplay from './ForecastWeatherDisplay';
import DismissibleSeasonalWarning from './DismissibleSeasonalWarning';
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
  console.log(`🎯 WeatherDataDisplay: Rendering for ${segmentEndCity}`, {
    hasWeather: !!weather,
    segmentDate: segmentDate?.toISOString(),
    isPDFExport,
    isSharedView
  });

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

  // CRITICAL FIX: Use the exact segmentDate passed in - do not re-normalize
  const displayDate = segmentDate;

  // Determine display strategy based on data quality
  const displayStrategy = getDisplayStrategy(weather, displayDate, error, retryCount);
  
  console.log(`🎯 Display strategy for ${segmentEndCity}: ${displayStrategy}`, {
    isActualForecast: weather.isActualForecast,
    hasValidTemps: !!(weather.highTemp && weather.lowTemp),
    segmentDate: displayDate?.toDateString()
  });

  switch (displayStrategy) {
    case 'live-forecast':
      return renderLiveForecast(weather, displayDate, isPDFExport, isSharedView);
      
    case 'seasonal-estimate':
      return renderSeasonalEstimate(weather, displayDate, isPDFExport, isSharedView);
      
    case 'service-unavailable':
      return renderServiceUnavailable(error, isPDFExport, segmentEndCity);
      
    default:
      return renderFallback(isPDFExport);
  }
};

// Simplified display strategy determination
function getDisplayStrategy(weather: any, segmentDate: Date | null, error: string | null, retryCount: number): string {
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

// Simplified render functions with FIXED DATE LABELS
function renderLiveForecast(weather: any, segmentDate: Date | null, isPDFExport: boolean, isSharedView: boolean) {
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
      <ForecastWeatherDisplay weather={forecastWeather} segmentDate={segmentDate} />
    </div>
  );
}

function renderSeasonalEstimate(weather: any, segmentDate: Date | null, isPDFExport: boolean, isSharedView: boolean) {
  const forecastWeather = weather as ForecastWeatherData;
  
  // Calculate days from now for display purposes ONLY
  const daysFromNow = segmentDate ? 
    Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : null;
  
  let warningMessage = isPDFExport ? 'Historical weather patterns' : 'Based on historical weather patterns for this date';
  if (daysFromNow && daysFromNow > 5) {
    warningMessage = isPDFExport ? 
      `Historical data (${daysFromNow} days ahead)` :
      `Historical data for this date (${daysFromNow} days ahead, beyond forecast range)`;
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
      <ForecastWeatherDisplay weather={forecastWeather} segmentDate={segmentDate} />
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
