
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherUtilityService } from './services/WeatherUtilityService';
import SimpleTemperatureDisplay from './SimpleTemperatureDisplay';

interface SimpleWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate: Date;
  cityName: string;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const SimpleWeatherDisplay: React.FC<SimpleWeatherDisplayProps> = ({
  weather,
  segmentDate,
  cityName,
  isSharedView = false,
  isPDFExport = false
}) => {
  // PLAN STEP 1: Immediate debugging to identify the exact moment when label switches
  const debugKey = `${cityName}-${segmentDate.toISOString().split('T')[0]}`;
  
  console.log('🔍 PLAN STEP 1: SimpleWeatherDisplay IMMEDIATE DEBUG:', {
    debugKey,
    weatherInput: {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      temperature: weather.temperature,
      description: weather.description
    },
    renderContext: {
      isSharedView,
      isPDFExport,
      segmentDate: segmentDate.toISOString()
    },
    planStep: 'immediate_debugging'
  });

  // PLAN STEP 2: Deterministic label calculation that doesn't depend on React state timing
  const weatherSourceInfo = React.useMemo(() => {
    const isLiveForecast = WeatherUtilityService.isLiveForecast(weather, segmentDate);
    const sourceLabel = WeatherUtilityService.getWeatherSourceLabel(weather, segmentDate);
    
    console.log('🎯 PLAN STEP 2: DETERMINISTIC LABEL CALCULATION:', {
      debugKey,
      weatherAnalysis: {
        source: weather.source,
        isActualForecast: weather.isActualForecast,
        bothConditionsMet: weather.source === 'live_forecast' && weather.isActualForecast === true
      },
      calculatedResults: {
        isLiveForecast,
        sourceLabel
      },
      deterministicCalculation: true,
      planStep: 'deterministic_calculation'
    });
    
    return {
      isLiveForecast,
      sourceLabel
    };
  }, [weather.source, weather.isActualForecast, segmentDate.getTime(), debugKey]);

  // PLAN STEP 3: Weather object stability to prevent recreation during renders
  const stableWeather = React.useMemo(() => {
    console.log('🔒 PLAN STEP 3: WEATHER OBJECT STABILITY:', {
      debugKey,
      weatherStability: {
        source: weather.source,
        isActualForecast: weather.isActualForecast,
        temperature: weather.temperature,
        highTemp: weather.highTemp,
        lowTemp: weather.lowTemp
      },
      objectStabilization: true,
      planStep: 'object_stability'
    });
    
    return weather;
  }, [
    weather.source,
    weather.isActualForecast,
    weather.temperature,
    weather.highTemp,
    weather.lowTemp,
    weather.description,
    weather.icon,
    weather.humidity,
    weather.windSpeed,
    weather.precipitationChance
  ]);

  // PLAN STEP 4: Force synchronous label updates when weather data changes
  React.useEffect(() => {
    console.log('🔄 PLAN STEP 4: SYNCHRONOUS LABEL UPDATE TRIGGER:', {
      debugKey,
      weatherChange: {
        source: weather.source,
        isActualForecast: weather.isActualForecast
      },
      labelInfo: weatherSourceInfo,
      synchronousUpdate: true,
      planStep: 'synchronous_updates'
    });
  }, [weather.source, weather.isActualForecast, weatherSourceInfo.sourceLabel, debugKey]);

  // Final comprehensive debug before render
  console.log('🚀 PLAN FINAL: SimpleWeatherDisplay RENDER STATE:', {
    debugKey,
    finalState: {
      weatherSource: stableWeather.source,
      isActualForecast: stableWeather.isActualForecast,
      calculatedIsLive: weatherSourceInfo.isLiveForecast,
      finalSourceLabel: weatherSourceInfo.sourceLabel,
      temperature: stableWeather.temperature
    },
    renderDecision: {
      willShowLiveForecast: weatherSourceInfo.isLiveForecast,
      labelToDisplay: weatherSourceInfo.sourceLabel
    },
    planImplementation: 'complete'
  });

  return (
    <div className="space-y-3">
      {/* Weather Icon and Description */}
      <div className="flex items-center gap-3">
        <div className="text-3xl">
          {stableWeather.icon?.includes('01') ? '☀️' :
           stableWeather.icon?.includes('02') ? '⛅' :
           stableWeather.icon?.includes('03') ? '☁️' :
           stableWeather.icon?.includes('04') ? '☁️' :
           stableWeather.icon?.includes('09') ? '🌧️' :
           stableWeather.icon?.includes('10') ? '🌦️' :
           stableWeather.icon?.includes('11') ? '⛈️' :
           stableWeather.icon?.includes('13') ? '❄️' :
           stableWeather.icon?.includes('50') ? '🌫️' : '🌤️'}
        </div>
        <div className="flex-1">
          <div className="text-lg font-semibold text-gray-800 capitalize">
            {stableWeather.description}
          </div>
          <div className="text-sm text-gray-600">
            {weatherSourceInfo.sourceLabel}
          </div>
        </div>
      </div>

      {/* Temperature Display */}
      <SimpleTemperatureDisplay 
        weather={stableWeather}
        isSharedView={isSharedView}
        segmentDate={segmentDate}
      />

      {/* Additional Weather Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {stableWeather.humidity && (
          <div className="flex items-center gap-1">
            <span className="text-blue-500">💧</span>
            <span className="text-gray-600">Humidity: {stableWeather.humidity}%</span>
          </div>
        )}
        {stableWeather.windSpeed !== undefined && (
          <div className="flex items-center gap-1">
            <span className="text-gray-500">💨</span>
            <span className="text-gray-600">Wind: {stableWeather.windSpeed} mph</span>
          </div>
        )}
        {stableWeather.precipitationChance !== undefined && stableWeather.precipitationChance > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-blue-500">🌧️</span>
            <span className="text-gray-600">Rain: {stableWeather.precipitationChance}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleWeatherDisplay;
