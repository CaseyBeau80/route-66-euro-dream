
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import WeatherDataDisplay from './WeatherDataDisplay';

interface WeatherDisplayDecisionProps {
  weather: ForecastWeatherData | null;
  segmentDate: Date;
  segmentEndCity: string;
  error: string | null;
  onRetry: () => void;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const WeatherDisplayDecision: React.FC<WeatherDisplayDecisionProps> = ({
  weather,
  segmentDate,
  segmentEndCity,
  error,
  onRetry,
  isSharedView = false,
  isPDFExport = false
}) => {
  // ENHANCED STEP 4: Add validation logic before rendering
  React.useEffect(() => {
    if (weather) {
      const daysFromNow = Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      
      console.log('🎯 WeatherDisplayDecision: Enhanced validation check:', {
        city: segmentEndCity,
        segmentDate: segmentDate.toISOString(),
        daysFromNow,
        weather: {
          source: weather.source,
          isActualForecast: weather.isActualForecast,
          dateMatchSource: weather.dateMatchInfo?.source,
          temperature: weather.temperature,
          highTemp: weather.highTemp,
          lowTemp: weather.lowTemp
        },
        validationChecks: {
          hasExplicitSource: !!weather.source,
          isWithinForecastRange: daysFromNow >= 0 && daysFromNow <= 5,
          sourceMatchesRange: weather.source === 'live_forecast' ? daysFromNow <= 5 : true,
          temperatureValid: !!(weather.temperature || (weather.highTemp && weather.lowTemp))
        }
      });

      // Enhanced validation: Check if source matches the date range
      if (weather.source === 'live_forecast' && daysFromNow > 5) {
        console.warn('⚠️ WeatherDisplayDecision: Source validation warning:', {
          city: segmentEndCity,
          source: weather.source,
          daysFromNow,
          issue: 'live_forecast_source_outside_5_day_range',
          recommendation: 'should_be_historical_fallback'
        });
      }

      if (weather.source === 'historical_fallback' && daysFromNow >= 0 && daysFromNow <= 5) {
        console.warn('⚠️ WeatherDisplayDecision: Source validation warning:', {
          city: segmentEndCity,
          source: weather.source,
          daysFromNow,
          issue: 'historical_fallback_within_forecast_range',
          recommendation: 'consider_live_forecast_if_api_available'
        });
      }
    }
  }, [weather, segmentDate, segmentEndCity]);

  console.log('🎯 WeatherDisplayDecision: Enhanced component render:', {
    city: segmentEndCity,
    hasWeather: !!weather,
    weather: weather ? {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      hasTemperature: !!(weather.temperature || weather.highTemp || weather.lowTemp)
    } : null,
    segmentDate: segmentDate.toISOString(),
    error,
    isSharedView,
    isPDFExport
  });

  // Always render WeatherDataDisplay - it will handle fallbacks internally
  return (
    <WeatherDataDisplay
      weather={weather}
      segmentDate={segmentDate}
      cityName={segmentEndCity}
      error={error}
      onRetry={onRetry}
      isSharedView={isSharedView}
      isPDFExport={isPDFExport}
    />
  );
};

export default WeatherDisplayDecision;
