
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherUtilityService } from './services/WeatherUtilityService';
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
  // CENTRALIZED: Enhanced validation logic using utility service
  React.useEffect(() => {
    if (weather) {
      const daysFromNow = WeatherUtilityService.getDaysFromToday(segmentDate);
      const isWithinRange = WeatherUtilityService.isWithinLiveForecastRange(segmentDate);
      const isLive = WeatherUtilityService.isLiveForecast(weather, segmentDate);
      
      console.log('🎯 CENTRALIZED: WeatherDisplayDecision enhanced validation:', {
        city: segmentEndCity,
        segmentDate: segmentDate.toISOString(),
        daysFromNow,
        isWithinRange,
        isLive,
        weather: {
          source: weather.source,
          isActualForecast: weather.isActualForecast,
          temperature: weather.temperature,
          highTemp: weather.highTemp,
          lowTemp: weather.lowTemp
        },
        validationChecks: {
          hasExplicitSource: !!weather.source,
          isWithinForecastRange: isWithinRange,
          sourceMatchesRange: weather.source === 'live_forecast' ? isWithinRange : true,
          temperatureValid: !!(weather.temperature || (weather.highTemp && weather.lowTemp))
        }
      });

      // CENTRALIZED: Enhanced validation using utility service
      if (weather.source === 'live_forecast' && !isWithinRange) {
        console.warn('⚠️ CENTRALIZED: Source validation warning:', {
          city: segmentEndCity,
          source: weather.source,
          daysFromNow,
          isWithinRange,
          issue: 'live_forecast_source_outside_range',
          recommendation: 'should_be_historical_fallback'
        });
      }

      if (weather.source === 'historical_fallback' && isWithinRange) {
        console.warn('⚠️ CENTRALIZED: Source validation warning:', {
          city: segmentEndCity,
          source: weather.source,
          daysFromNow,
          isWithinRange,
          issue: 'historical_fallback_within_forecast_range',
          recommendation: 'consider_live_forecast_if_api_available'
        });
      }
    }
  }, [weather, segmentDate, segmentEndCity]);

  console.log('🎯 CENTRALIZED: WeatherDisplayDecision component render:', {
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
