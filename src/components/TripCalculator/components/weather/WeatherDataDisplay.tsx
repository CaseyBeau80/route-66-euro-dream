
import React from 'react';
import ForecastWeatherDisplay from './ForecastWeatherDisplay';
import CurrentWeatherDisplay from './CurrentWeatherDisplay';
import DismissibleSeasonalWarning from './DismissibleSeasonalWarning';
import WeatherDateMatchDebug from './WeatherDateMatchDebug';
import { validateWeatherData, getWeatherDisplayType } from './WeatherValidationService';
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
  console.log(`🎨 WeatherDataDisplay: Enhanced rendering for ${segmentEndCity}:`, {
    hasWeather: !!weather,
    error,
    retryCount,
    segmentDate: segmentDate?.toISOString(),
    isSharedView,
    isPDFExport,
    dateMatchInfo: weather?.dateMatchInfo,
    isActualForecast: weather?.isActualForecast,
    hasHighTemp: weather?.highTemp !== undefined,
    hasLowTemp: weather?.lowTemp !== undefined,
    hasTemperature: weather?.temperature !== undefined,
    hasForecast: !!weather?.forecast?.length,
    daysFromNow: segmentDate ? Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : null
  });

  // **PDF EXPORT**: Enhanced logging for PDF weather rendering
  if (isPDFExport) {
    console.log(`📄 PDF WEATHER DISPLAY: Processing ${segmentEndCity}`, {
      isActualForecast: weather?.isActualForecast,
      hasDateMatchInfo: !!weather?.dateMatchInfo,
      hasTemperatureRange: weather?.highTemp !== undefined && weather?.lowTemp !== undefined,
      weatherType: weather?.isActualForecast ? 'forecast' : 'fallback'
    });
  }

  // Show debug info in development or when there are date matching issues
  const showDebugInfo = (process.env.NODE_ENV === 'development' || 
                       (weather?.dateMatchInfo?.matchType !== 'exact' && weather?.isActualForecast)) &&
                       !isPDFExport; // Hide debug in PDF exports

  // **PHASE 2 FIX**: Enhanced validation with segmentDate parameter for fallback calculations
  const validation = validateWeatherData(weather, segmentEndCity, segmentDate);
  const displayType = getWeatherDisplayType(validation, error, retryCount, weather);
  
  console.log(`🎯 Enhanced display decision for ${segmentEndCity}:`, {
    validation,
    displayType,
    error,
    retryCount,
    dateMatchInfo: weather?.dateMatchInfo,
    isActualForecast: weather?.isActualForecast,
    isPDFExport
  });

  // **PHASE 2 FIX**: Priority override - always show live forecast if available, regardless of validation quality
  const shouldShowLiveForecast = weather?.isActualForecast === true && 
                                (validation.hasTemperatureRange || validation.isWithinForecastRange);

  if (shouldShowLiveForecast && displayType !== 'live-forecast') {
    console.log(`🚀 OVERRIDE: Forcing live forecast display despite validation quality (${validation.dataQuality})`);
  }

  // Handle each display type with enhanced logic
  switch (displayType) {
    case 'live-forecast':
      if (weather?.isActualForecast !== undefined) {
        const forecastWeather = weather as ForecastWeatherData;
        
        // Enhanced warning message based on data quality
        let warningMessage = isPDFExport ? 'Live forecast data' : 'Live forecast from OpenWeatherMap';
        if (validation.dataQuality === 'good' && validation.warnings.length > 0) {
          warningMessage += ` (${validation.warnings[0]})`;
        } else if (segmentDate) {
          warningMessage += ` for ${segmentDate.toLocaleDateString()}`;
        }
        
        // **PHASE 2**: Add dev mode warning for quality issues (but not in PDF exports)
        if (process.env.NODE_ENV === 'development' && validation.dataQuality !== 'excellent' && !isPDFExport) {
          warningMessage += ` [DEV: Quality=${validation.dataQuality}]`;
        }
        
        return (
          <div className="space-y-2">
            {/* **PDF EXPORT**: Conditional warning display */}
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
      // Fallback to current weather if not forecast structure
      return <CurrentWeatherDisplay weather={weather} segmentDate={segmentDate} />;

    case 'seasonal-estimate':
      // **PHASE 2 FIX**: Check if this should actually be live forecast
      if (shouldShowLiveForecast) {
        console.log(`🚀 PROMOTING seasonal-estimate to live-forecast for ${segmentEndCity}`);
        const forecastWeather = weather as ForecastWeatherData;
        
        return (
          <div className="space-y-2">
            {!isPDFExport && (
              <DismissibleSeasonalWarning
                message={`Live forecast available (promoted from seasonal estimate)`}
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

      if (weather?.isActualForecast !== undefined) {
        const forecastWeather = weather as ForecastWeatherData;
        
        // Enhanced message for seasonal estimates
        let warningMessage = isPDFExport ? 'Historical weather patterns' : 'Based on historical weather patterns';
        if (validation.daysFromNow !== null && validation.daysFromNow > 5) {
          warningMessage = isPDFExport 
            ? `Historical data (${validation.daysFromNow} days ahead)`
            : `Historical data (${validation.daysFromNow} days ahead, beyond forecast range)`;
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
      break;

    case 'service-unavailable':
      console.log(`❌ Service unavailable for ${segmentEndCity} - suppressing all forecast data`);
      return (
        <div className="space-y-2">
          {!isPDFExport && (
            <DismissibleSeasonalWarning
              message={error || "Weather service temporarily unavailable"}
              type="forecast-unavailable"
              isSharedView={isSharedView}
            />
          )}
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-gray-400 text-2xl mb-2">🌤️</div>
            <p className="text-sm text-gray-600">
              {isPDFExport 
                ? "Weather information temporarily unavailable" 
                : "Weather information temporarily unavailable"}
            </p>
            {isPDFExport && (
              <p className="text-xs text-gray-500 mt-1">
                Check the live version for current conditions
              </p>
            )}
          </div>
        </div>
      );

    case 'loading':
    default:
      return (
        <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="animate-pulse text-gray-500 text-sm">
            {isPDFExport ? 'Processing weather for export...' : 'Loading weather information...'}
          </div>
        </div>
      );
  }

  // **PHASE 2**: Enhanced fallback with better error messaging and live forecast detection
  console.warn(`⚠️ WeatherDataDisplay: Reached enhanced fallback for ${segmentEndCity}`, {
    weather,
    validation,
    displayType,
    shouldShowLiveForecast,
    isPDFExport
  });
  
  // Final check for live forecast before giving up
  if (shouldShowLiveForecast) {
    console.log(`🚀 FINAL ATTEMPT: Showing live forecast in fallback for ${segmentEndCity}`);
    const forecastWeather = weather as ForecastWeatherData;
    return (
      <div className="space-y-2">
        {!isPDFExport && (
          <DismissibleSeasonalWarning
            message="Live forecast (fallback rendering)"
            type="forecast-unavailable"
            isSharedView={isSharedView}
          />
        )}
        <ForecastWeatherDisplay weather={forecastWeather} segmentDate={segmentDate} />
      </div>
    );
  }
  
  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="text-gray-400 text-2xl mb-2">🌤️</div>
      <p className="text-sm text-gray-600">
        {isPDFExport ? 'Weather information processing for export...' : 'Weather information processing...'}
      </p>
      {process.env.NODE_ENV === 'development' && !isPDFExport && (
        <div className="text-xs text-gray-500 mt-2">
          Debug: {JSON.stringify({ validation: validation.dataQuality, displayType, shouldShowLiveForecast })}
        </div>
      )}
    </div>
  );
};

export default WeatherDataDisplay;
