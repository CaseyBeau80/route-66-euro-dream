
import React from 'react';
import { format } from 'date-fns';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherUtilityService } from './services/WeatherUtilityService';
import { DataStandardizationService } from '@/services/DataStandardizationService';
import { useUnits } from '@/contexts/UnitContext';

interface EnhancedWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate: Date;
  cityName: string;
  isSharedView?: boolean;
  isPDFExport?: boolean;
  forceKey?: string;
  showDebug?: boolean;
}

const EnhancedWeatherDisplay: React.FC<EnhancedWeatherDisplayProps> = ({
  weather,
  segmentDate,
  cityName,
  isSharedView = false,
  isPDFExport = false,
  showDebug = false
}) => {
  const { preferences } = useUnits();
  
  // Standardize temperature data
  const standardizedTemps = React.useMemo(() => {
    const result: any = {};
    
    if (weather.temperature !== undefined) {
      result.current = DataStandardizationService.standardizeTemperature(weather.temperature, preferences);
    }
    
    if (weather.highTemp !== undefined) {
      result.high = DataStandardizationService.standardizeTemperature(weather.highTemp, preferences);
    }
    
    if (weather.lowTemp !== undefined) {
      result.low = DataStandardizationService.standardizeTemperature(weather.lowTemp, preferences);
    }
    
    return result;
  }, [weather, preferences]);

  const isLiveForecast = WeatherUtilityService.isLiveForecast(weather, segmentDate);
  const daysFromToday = WeatherUtilityService.getDaysFromToday(segmentDate);

  console.log('🌡️ STANDARDIZED: EnhancedWeatherDisplay with unified temperatures:', {
    cityName,
    originalWeather: {
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp
    },
    standardizedTemps,
    preferences: preferences.temperature,
    isLiveForecast,
    daysFromToday
  });

  return (
    <div className="bg-gradient-to-br from-blue-50 to-sky-100 border border-blue-200 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-blue-600 text-lg">🌤️</span>
          <h4 className="text-sm font-semibold text-blue-800">
            {format(segmentDate, 'EEE, MMM d')}
          </h4>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            isLiveForecast 
              ? 'bg-green-100 text-green-700' 
              : 'bg-amber-100 text-amber-700'
          }`}>
            {isLiveForecast ? '📡 Live' : '📊 Historical'}
          </span>
        </div>
      </div>

      {/* Temperature Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {weather.icon && (
            <img 
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description || 'Weather'}
              className="w-12 h-12"
            />
          )}
          
          <div>
            {/* Current/Main Temperature */}
            {standardizedTemps.current && (
              <div className="text-2xl font-bold text-blue-900">
                {standardizedTemps.current.formatted}
              </div>
            )}
            
            {/* High/Low Temperatures */}
            {(standardizedTemps.high || standardizedTemps.low) && (
              <div className="text-sm text-blue-700">
                {standardizedTemps.high && standardizedTemps.low ? (
                  <>H: {standardizedTemps.high.formatted} / L: {standardizedTemps.low.formatted}</>
                ) : standardizedTemps.high ? (
                  <>High: {standardizedTemps.high.formatted}</>
                ) : standardizedTemps.low ? (
                  <>Low: {standardizedTemps.low.formatted}</>
                ) : null}
              </div>
            )}
            
            {/* Weather Description */}
            {weather.description && (
              <div className="text-xs text-blue-600 capitalize mt-1">
                {weather.description}
              </div>
            )}
          </div>
        </div>

        {/* Additional Weather Info */}
        <div className="text-right text-xs text-blue-600 space-y-1">
          {weather.humidity !== undefined && (
            <div>💧 {weather.humidity}%</div>
          )}
          {weather.windSpeed !== undefined && (
            <div>💨 {Math.round(weather.windSpeed)} mph</div>
          )}
        </div>
      </div>

      {/* Debug Info */}
      {showDebug && !isPDFExport && (
        <div className="mt-3 pt-2 border-t border-blue-200">
          <div className="text-xs text-blue-600">
            Source: {weather.source} | Days: {daysFromToday} | 
            {isLiveForecast ? ' Live Forecast' : ' Historical Data'}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedWeatherDisplay;
