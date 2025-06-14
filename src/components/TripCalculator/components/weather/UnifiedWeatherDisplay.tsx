
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';

interface UnifiedWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate: Date;
  cityName: string;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const UnifiedWeatherDisplay: React.FC<UnifiedWeatherDisplayProps> = ({
  weather,
  segmentDate,
  cityName,
  isSharedView = false,
  isPDFExport = false
}) => {
  // FIXED: More robust live weather detection with multiple checks
  const isLiveForecast = React.useMemo(() => {
    // Primary check: both source and isActualForecast must be correct
    const primaryCheck = weather.source === 'live_forecast' && weather.isActualForecast === true;
    
    // Secondary check: look for realistic temperature variations and proper data structure
    const hasRealisticData = weather.temperature && weather.temperature > 0 && weather.temperature < 150;
    const hasProperStructure = weather.highTemp && weather.lowTemp && weather.description;
    
    const result = primaryCheck && hasRealisticData && hasProperStructure;
    
    console.log('🔧 FIXED: UnifiedWeatherDisplay - Enhanced live weather detection:', {
      cityName,
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      primaryCheck,
      hasRealisticData,
      hasProperStructure,
      finalResult: result,
      temperature: weather.temperature,
      isSharedView,
      detectionMethod: 'enhanced_robust'
    });
    
    return result;
  }, [weather, cityName, isSharedView]);

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '🌨️', '13n': '🌨️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '⛅';
  };

  const weatherIcon = getWeatherIcon(weather.icon);
  const formattedDate = format(segmentDate, 'EEEE, MMM d');

  // FIXED: Use the enhanced detection result
  const sourceLabel = isLiveForecast ? 'Live Weather Forecast' : 'Historical Weather Data';
  const badgeText = isLiveForecast ? '✅ Current live forecast' : '📊 Based on historical patterns';
  const statusEmoji = isLiveForecast ? '🟢' : '🟡';

  return (
    <div className={isLiveForecast ? 
      'bg-green-50 border-2 border-green-300 text-green-900 rounded-lg p-4 relative' :
      'bg-amber-50 border-2 border-amber-300 text-amber-900 rounded-lg p-4 relative'
    }>
      {/* Weather Source Indicator - ENHANCED */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{statusEmoji}</span>
          <span className={`text-sm font-bold ${isLiveForecast ? 'text-green-800' : 'text-amber-800'}`}>
            {sourceLabel}
          </span>
        </div>
        <span className="text-xs text-gray-600">
          {formattedDate}
        </span>
      </div>

      {/* Main Weather Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{weatherIcon}</div>
          <div>
            <div className="text-3xl font-bold text-gray-900">
              {Math.round(weather.temperature)}°F
            </div>
            <div className="text-sm text-gray-700 capitalize font-medium">
              {weather.description}
            </div>
          </div>
        </div>

        <div className="text-right">
          {weather.highTemp && weather.lowTemp && (
            <div className="text-base text-gray-700 font-medium">
              H: {Math.round(weather.highTemp)}° L: {Math.round(weather.lowTemp)}°
            </div>
          )}
          <div className="text-sm text-gray-600 mt-1">
            💧 {weather.precipitationChance}% • 💨 {weather.windSpeed} mph
          </div>
        </div>
      </div>

      {/* Enhanced Status Badge */}
      <div className="mt-3 text-center">
        <span className={`inline-block text-sm px-3 py-1 rounded-full font-bold border-2 ${
          isLiveForecast ? 
            'bg-green-100 text-green-900 border-green-400' :
            'bg-amber-100 text-amber-900 border-amber-400'
        }`}>
          {badgeText}
        </span>
      </div>

      {/* Debug info for troubleshooting */}
      {isSharedView && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          Debug: source={weather.source}, actual={weather.isActualForecast?.toString()}, live={isLiveForecast.toString()}
        </div>
      )}
    </div>
  );
};

export default UnifiedWeatherDisplay;
