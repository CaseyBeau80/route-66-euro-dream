
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
  // Enhanced validation with date alignment logging
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

  // Normalize segment date for consistent handling across all weather displays
  const normalizedSegmentDate = segmentDate ? 
    DateNormalizationService.normalizeSegmentDate(segmentDate) : null;

  // CRITICAL: Date alignment logging for debugging
  if (process.env.NODE_ENV === 'development' && normalizedSegmentDate) {
    console.log(`🗓️ WeatherDataDisplay Date Alignment for ${segmentEndCity}:`, {
      originalSegmentDate: segmentDate?.toISOString(),
      normalizedSegmentDate: normalizedSegmentDate.toISOString(),
      normalizedDateString: DateNormalizationService.toDateString(normalizedSegmentDate),
      weatherDateMatchInfo: weather.dateMatchInfo,
      isActualForecast: weather.isActualForecast
    });

    // Check for date misalignment and warn
    if (weather.dateMatchInfo?.requestedDate) {
      const expectedDateString = DateNormalizationService.toDateString(normalizedSegmentDate);
      if (weather.dateMatchInfo.requestedDate !== expectedDateString) {
        console.warn(`⚠️ DATE MISMATCH DETECTED for ${segmentEndCity}:`, {
          segmentDate: expectedDateString,
          weatherRequestedDate: weather.dateMatchInfo.requestedDate,
          weatherMatchedDate: weather.dateMatchInfo.matchedDate
        });
      }
    }
  }

  // Show debug info only in development and not in PDF exports
  const showDebugInfo = process.env.NODE_ENV === 'development' && 
                       !isPDFExport && 
                       weather?.dateMatchInfo?.matchType !== 'exact';

  // Determine display strategy based on data quality and exact date alignment
  const displayStrategy = getDisplayStrategy(weather, normalizedSegmentDate, error, retryCount);
  
  console.log(`🎯 Display strategy for ${segmentEndCity}:`, {
    strategy: displayStrategy,
    isActualForecast: weather.isActualForecast,
    dateMatchSource: weather?.dateMatchInfo?.source,
    matchType: weather?.dateMatchInfo?.matchType,
    normalizedSegmentDate: normalizedSegmentDate?.toISOString()
  });

  switch (displayStrategy) {
    case 'live-forecast':
      return renderLiveForecast(weather, normalizedSegmentDate, showDebugInfo, isPDFExport, isSharedView, segmentEndCity);
      
    case 'enhanced-fallback':
      return renderEnhancedFallback(weather, normalizedSegmentDate, showDebugInfo, isPDFExport, isSharedView, segmentEndCity);
      
    case 'seasonal-estimate':
      return renderSeasonalEstimate(weather, normalizedSegmentDate, showDebugInfo, isPDFExport, isSharedView, segmentEndCity);
      
    case 'service-unavailable':
      return renderServiceUnavailable(error, isPDFExport, segmentEndCity);
      
    default:
      return renderFallback(isPDFExport);
  }
};

// Enhanced display strategy determination with strict date validation
function getDisplayStrategy(weather: any, normalizedSegmentDate: Date | null, error: string | null, retryCount: number): string {
  // Error conditions
  if (error && retryCount > 3) {
    return 'service-unavailable';
  }

  // No weather data
  if (!weather) {
    return 'service-unavailable';
  }

  // Check for live forecast data with proper date alignment
  if (weather.isActualForecast === true && weather.dateMatchInfo && normalizedSegmentDate) {
    const { source, matchType, requestedDate } = weather.dateMatchInfo;
    const expectedDateString = DateNormalizationService.toDateString(normalizedSegmentDate);
    
    // Verify date alignment before using forecast
    if (requestedDate === expectedDateString) {
      if (source === 'api-forecast' && (matchType === 'exact' || matchType === 'closest')) {
        return 'live-forecast';
      }
      
      if (source === 'enhanced-fallback') {
        return 'enhanced-fallback';
      }
    } else {
      console.warn('⚠️ Date misalignment detected, using seasonal estimate instead');
    }
  }

  // Check for valid temperature data - use seasonal estimate for consistency
  if ((weather.highTemp !== undefined && weather.lowTemp !== undefined) || 
      weather.temperature !== undefined) {
    return 'seasonal-estimate';
  }

  return 'service-unavailable';
}

// Render functions for each strategy - now all use normalizedSegmentDate
function renderLiveForecast(weather: any, normalizedSegmentDate: Date | null, showDebugInfo: boolean, isPDFExport: boolean, isSharedView: boolean, segmentEndCity: string) {
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
      <ForecastWeatherDisplay weather={forecastWeather} segmentDate={normalizedSegmentDate} />
      {showDebugInfo && (
        <WeatherDateMatchDebug
          weather={forecastWeather}
          segmentDate={normalizedSegmentDate}
          segmentEndCity={segmentEndCity}
          isVisible={showDebugInfo}
        />
      )}
    </div>
  );
}

function renderEnhancedFallback(weather: any, normalizedSegmentDate: Date | null, showDebugInfo: boolean, isPDFExport: boolean, isSharedView: boolean, segmentEndCity: string) {
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
      <ForecastWeatherDisplay weather={forecastWeather} segmentDate={normalizedSegmentDate} />
      {showDebugInfo && (
        <WeatherDateMatchDebug
          weather={forecastWeather}
          segmentDate={normalizedSegmentDate}
          segmentEndCity={segmentEndCity}
          isVisible={showDebugInfo}
        />
      )}
    </div>
  );
}

function renderSeasonalEstimate(weather: any, normalizedSegmentDate: Date | null, showDebugInfo: boolean, isPDFExport: boolean, isSharedView: boolean, segmentEndCity: string) {
  const forecastWeather = weather as ForecastWeatherData;
  
  // Calculate days from now using normalized dates for display purposes only
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
      {showDebugInfo && (
        <WeatherDateMatchDebug
          weather={forecastWeather}
          segmentDate={normalizedSegmentDate}
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
