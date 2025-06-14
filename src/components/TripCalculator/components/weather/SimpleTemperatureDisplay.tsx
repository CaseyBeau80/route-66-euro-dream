
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherUtilityService } from './services/WeatherUtilityService';

interface SimpleTemperatureDisplayProps {
  weather: ForecastWeatherData;
  isSharedView?: boolean;
  segmentDate?: Date;
}

const SimpleTemperatureDisplay: React.FC<SimpleTemperatureDisplayProps> = ({
  weather,
  isSharedView = false,
  segmentDate
}) => {
  // PLAN: Comprehensive debugging for temperature display
  const debugKey = `temp-${weather.cityName}-${segmentDate?.toISOString().split('T')[0] || 'no-date'}`;
  
  console.log('🌡️ PLAN: SimpleTemperatureDisplay COMPREHENSIVE DEBUG:', {
    debugKey,
    weatherInput: {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp
    },
    context: {
      isSharedView,
      hasSegmentDate: !!segmentDate
    },
    planImplementation: true
  });

  // PLAN: Deterministic live forecast calculation
  const isLiveForecast = React.useMemo(() => {
    const result = WeatherUtilityService.isLiveForecast(weather, segmentDate);
    
    console.log('🎯 PLAN: Temperature Display - Live Forecast Calculation:', {
      debugKey,
      weatherAnalysis: {
        source: weather.source,
        isActualForecast: weather.isActualForecast,
        verificationCriteria: {
          hasLiveSource: weather.source === 'live_forecast',
          isActualForecast: weather.isActualForecast === true,
          bothConditionsMet: weather.source === 'live_forecast' && weather.isActualForecast === true
        }
      },
      calculatedResult: result,
      deterministicCalculation: true,
      planImplementation: true
    });
    
    return result;
  }, [weather.source, weather.isActualForecast, segmentDate?.getTime(), debugKey]);

  const getTemperatureLabel = (temp: number): string => {
    if (temp >= 90) return 'Hot';
    if (temp >= 80) return 'Warm';
    if (temp >= 70) return 'Pleasant';
    if (temp >= 60) return 'Cool';
    if (temp >= 50) return 'Chilly';
    return 'Cold';
  };

  const highTemp = weather.highTemp || weather.temperature;
  const lowTemp = weather.lowTemp || weather.temperature;
  const highTempLabel = getTemperatureLabel(highTemp);

  // PLAN: Final state logging before render
  console.log('🚀 PLAN: SimpleTemperatureDisplay FINAL RENDER STATE:', {
    debugKey,
    finalCalculations: {
      isLiveForecast,
      highTemp,
      lowTemp,
      highTempLabel
    },
    renderDecision: {
      willShowLiveForecastBadge: isLiveForecast,
      temperatureDisplay: `${highTemp}°F${lowTemp && lowTemp !== highTemp ? ` / ${lowTemp}°F` : ''}`
    },
    planImplementation: 'complete'
  });

  return (
    <div className="temperature-display">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-800">
            {highTemp}°F
          </span>
          {lowTemp && lowTemp !== highTemp && (
            <span className="text-lg text-gray-600">
              / {lowTemp}°F
            </span>
          )}
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">
            {highTempLabel}
          </div>
          {isLiveForecast && (
            <div className="text-xs text-green-600 font-medium">
              ✓ Live Forecast
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleTemperatureDisplay;
