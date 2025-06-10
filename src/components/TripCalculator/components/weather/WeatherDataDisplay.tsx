
import React from 'react';
import ForecastWeatherDisplay from './ForecastWeatherDisplay';
import CurrentWeatherDisplay from './CurrentWeatherDisplay';
import DismissibleSeasonalWarning from './DismissibleSeasonalWarning';
import WeatherDateMatchDebug from './WeatherDateMatchDebug';
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
  console.log(`🎨 WeatherDataDisplay: Rendering for ${segmentEndCity}:`, {
    hasWeather: !!weather,
    isActualForecast: weather?.isActualForecast,
    hasDateMatchInfo: !!weather?.dateMatchInfo,
    dateMatchSource: weather?.dateMatchInfo?.source,
    matchType: weather?.dateMatchInfo?.matchType,
    segmentDate: segmentDate?.toISOString(),
    isPDFExport
  });

  // Enhanced validation
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
  const normalizedDate = segmentDate ? 
    DateNormalizationService.normalizeSegmentDate(segmentDate, 1) : null;

  // Show debug info only in development and not in PDF exports
  const showDebugInfo = process.env.NODE_ENV === 'development' && 
                       !isPDFExport && 
                       weather?.dateMatchInfo?.matchType !== 'exact';

  // Determine display strategy based on data quality and source
  const displayStrategy = getDisplayStrategy(weather, normalizedDate, error, retryCount);
  
  console.log(`🎯 Display strategy for ${segmentEndCity}:`, {
    strategy: displayStrategy,
    isActualForecast: weather.isActualForecast,
    dateMatchSource: weather?.dateMatchInfo?.source,
    matchType: weather?.dateMatchInfo?.matchType
  });

  switch (displayStrategy) {
    case 'live-forecast':
      return renderLiveForecast(weather, segmentDate, showDebugInfo, isPDFExport, isSharedView, segmentEndCity);
      
    case 'enhanced-fallback':
      return renderEnhancedFallback(weather, segmentDate, showDebugInfo, isPDFExport, isSharedView, segmentEndCity);
      
    case 'seasonal-estimate':
      return renderSeasonalEstimate(weather, segmentDate, showDebugInfo, isPDFExport, isSharedView, segmentEndCity, normalizedDate);
      
    case 'service-unavailable':
      return renderServiceUnavailable(error, isPDFExport, segmentEndCity);
      
    default:
      return renderFallback(isPDFExport);
  }
};

// Display strategy determination
function getDisplayStrategy(weather: any, normalizedDate: any, error: string | null, retryCount: number): string {
  // Error conditions
  if (error && retryCount > 3) {
    return 'service-unavailable';
  }

  // No weather data
  if (!weather) {
    return 'service-unavailable';
  }

  // Check for live forecast data
  if (weather.isActualForecast === true && weather.dateMatchInfo) {
    const { source, matchType } = weather.dateMatchInfo;
    
    if (source === 'api-forecast' && (matchType === 'exact' || matchType === 'closest')) {
      return 'live-forecast';
    }
    
    if (source === 'enhanced-fallback') {
      return 'enhanced-fallback';
    }
  }

  // Check for valid temperature data
  if ((weather.highTemp !== undefined && weather.lowTemp !== undefined) || 
      weather.temperature !== undefined) {
    
    // If within forecast range but not marked as actual forecast
    if (normalizedDate?.isWithinForecastRange && !weather.isActualForecast) {
      return 'seasonal-estimate';
    }
    
    // Has temperature data but beyond forecast range
    return 'seasonal-estimate';
  }

  return 'service-unavailable';
}

// Render functions for each strategy
function renderLiveForecast(weather: any, segmentDate: Date | null, showDebugInfo: boolean, isPDFExport: boolean, isSharedView: boolean, segmentEndCity: string) {
  const forecastWeather = weather as ForecastWeatherData;
  
  let warningMessage = isPDFExport ? 'Live weather forecast' : 'Live forecast from OpenWeatherMap';
  if (weather.dateMatchInfo?.matchType === 'closest') {
    const offset = Math.abs(weather.dateMatchInfo.daysOffset);
    warningMessage += ` (${offset} day${offset !== 1 ? 's' : ''} offset)`;
  }
  
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
      {showDebugInfo && (
        <WeatherDateMatchDebug
          weather={forecastWeather}
          segmentDate={segmentDate}
          segmentEndCity={segmentEndCity}
          isVisible={showDebugInfo}
        />
      )}
    </div>
  );
}

function renderEnhancedFallback(weather: any, segmentDate: Date | null, showDebugInfo: boolean, isPDFExport: boolean, isSharedView: boolean, segmentEndCity: string) {
  const forecastWeather = weather as ForecastWeatherData;
  
  const warningMessage = isPDFExport ? 
    'Weather estimate from current conditions' : 
    'Estimate based on current weather conditions';
  
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
      {showDebugInfo && (
        <WeatherDateMatchDebug
          weather={forecastWeather}
          segmentDate={segmentDate}
          segmentEndCity={segmentEndCity}
          isVisible={showDebugInfo}
        />
      )}
    </div>
  );
}

function renderSeasonalEstimate(weather: any, segmentDate: Date | null, showDebugInfo: boolean, isPDFExport: boolean, isSharedView: boolean, segmentEndCity: string, normalizedDate: any) {
  const forecastWeather = weather as ForecastWeatherData;
  
  let warningMessage = isPDFExport ? 'Historical weather patterns' : 'Based on historical weather patterns';
  if (normalizedDate?.daysFromNow > 5) {
    warningMessage = isPDFExport ? 
      `Historical data (${normalizedDate.daysFromNow} days ahead)` :
      `Historical data (${normalizedDate.daysFromNow} days ahead, beyond forecast range)`;
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
      {showDebugInfo && (
        <WeatherDateMatchDebug
          weather={forecastWeather}
          segmentDate={segmentDate}
          segmentEndCity={segmentEndCity}
          isVisible={showDebugInfo}
        />
      )}
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
