
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
  // SINGLE SOURCE OF TRUTH: Direct check for live weather
  const isLiveForecast = weather.source === 'live_forecast' && weather.isActualForecast === true;

  console.log('🔥 UNIFIED: UnifiedWeatherDisplay - DIRECT DETECTION:', {
    cityName,
    weatherSource: weather.source,
    isActualForecast: weather.isActualForecast,
    directDetection: isLiveForecast,
    temperature: weather.temperature,
    isSharedView,
    isPDFExport,
    unifiedLogic: true
  });

  // FORCE STYLING BASED ON DIRECT DETECTION
  const isGreen = isLiveForecast;
  const styleConfig = React.useMemo(() => {
    if (isGreen) {
      return {
        sourceLabel: '🟢 Live Weather Forecast',
        sourceColor: '#059669',
        badgeText: '✨ Current live forecast',
        containerBg: '#dcfce7',
        containerBorder: '#bbf7d0',
        textColor: '#166534',
        type: 'LIVE'
      };
    } else {
      return {
        sourceLabel: '🟡 Historical Weather Data',
        sourceColor: '#d97706',
        badgeText: '📊 Based on historical patterns',
        containerBg: '#fef3c7',
        containerBorder: '#fde68a',
        textColor: '#92400e',
        type: 'HISTORICAL'
      };
    }
  }, [isGreen]);

  console.log('🔥 UNIFIED: Applying styling:', {
    cityName,
    isGreen,
    styleType: styleConfig.type,
    containerBg: styleConfig.containerBg,
    sourceLabel: styleConfig.sourceLabel,
    unifiedStyling: true
  });

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

  return (
    <div 
      className="rounded-lg p-4 border relative"
      style={{
        backgroundColor: styleConfig.containerBg,
        borderColor: styleConfig.containerBorder
      }}
    >
      {/* Debug Overlay */}
      <div className="absolute top-0 right-0 bg-black bg-opacity-95 text-white p-2 text-xs rounded-bl z-50 max-w-xs">
        <div className="font-bold mb-1">🔥 UNIFIED: {cityName}</div>
        <div className={`mb-1 font-bold ${isGreen ? 'text-green-400' : 'text-yellow-400'}`}>
          {isGreen ? '🟢 UNIFIED: LIVE' : '🟡 UNIFIED: HISTORICAL'}
        </div>
        <div>Source: {weather.source}</div>
        <div>ActualForecast: {String(weather.isActualForecast)}</div>
        <div>Direct Detection: {String(isLiveForecast)}</div>
        <div className={isGreen ? 'text-green-400' : 'text-yellow-400'}>
          Style Applied: {styleConfig.type}
        </div>
        <div>View: {isSharedView ? 'SHARED' : 'PREVIEW'}</div>
        <div>Temp: {weather.temperature}°F</div>
      </div>

      {/* Weather Source Indicator */}
      <div className="flex items-center justify-between mb-2">
        <span 
          className="text-xs font-medium"
          style={{ color: styleConfig.sourceColor }}
        >
          {styleConfig.sourceLabel}
        </span>
        <span className="text-xs text-gray-500">
          {formattedDate}
        </span>
      </div>

      {/* Main Weather Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{weatherIcon}</div>
          <div>
            <div className="text-2xl font-bold text-gray-800">
              {Math.round(weather.temperature)}°F
            </div>
            <div className="text-sm text-gray-600 capitalize">
              {weather.description}
            </div>
          </div>
        </div>

        <div className="text-right">
          {weather.highTemp && weather.lowTemp && (
            <div className="text-sm text-gray-600">
              H: {Math.round(weather.highTemp)}° L: {Math.round(weather.lowTemp)}°
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            💧 {weather.precipitationChance}% • 💨 {weather.windSpeed} mph
          </div>
        </div>
      </div>

      {/* Weather Status Badge */}
      <div className="mt-2 text-center">
        <span 
          className="inline-block text-xs px-2 py-1 rounded-full font-medium border"
          style={{
            backgroundColor: styleConfig.containerBg,
            color: styleConfig.textColor,
            borderColor: styleConfig.containerBorder
          }}
        >
          {styleConfig.badgeText}
        </span>
      </div>
    </div>
  );
};

export default UnifiedWeatherDisplay;
