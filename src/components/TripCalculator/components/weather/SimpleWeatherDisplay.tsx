
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';
import { DateNormalizationService } from './DateNormalizationService';

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
  // Enhanced weather validation using centralized date logic
  const weatherValidation = React.useMemo(() => {
    const normalizedToday = DateNormalizationService.normalizeSegmentDate(new Date());
    const normalizedSegmentDate = DateNormalizationService.normalizeSegmentDate(segmentDate);
    const daysFromToday = DateNormalizationService.getDaysDifference(normalizedToday, normalizedSegmentDate);
    
    // A date is within reliable forecast range if it's 0-5 days from today
    const isWithinReliableRange = daysFromToday >= 0 && daysFromToday <= 5;
    
    // Determine if this should be treated as live weather
    const isLiveWeather = weather.source === 'live_forecast' && 
                         weather.isActualForecast === true && 
                         isWithinReliableRange;

    console.log('🌤️ IMPROVED: SimpleWeatherDisplay with enhanced validation:', {
      cityName,
      segmentDate: segmentDate.toISOString(),
      segmentDateLocal: segmentDate.toLocaleDateString(),
      normalizedToday: normalizedToday.toISOString(),
      normalizedSegmentDate: normalizedSegmentDate.toISOString(),
      daysFromToday,
      isWithinReliableRange,
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      finalIsLiveWeather: isLiveWeather,
      temperature: weather.temperature,
      description: weather.description,
      improvedValidation: true,
      validationResult: isLiveWeather ? 'LIVE_FORECAST' : 'HISTORICAL_FALLBACK',
      shouldShowLive: isLiveWeather ? 'YES' : 'NO'
    });

    return {
      isLiveWeather,
      daysFromToday,
      isWithinReliableRange
    };
  }, [weather, segmentDate, cityName]);

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

  // Temperature display logic
  const temperatureDisplay = React.useMemo(() => {
    const hasValidCurrent = !!(weather.temperature && !isNaN(weather.temperature));
    const hasValidHigh = !!(weather.highTemp && !isNaN(weather.highTemp));
    const hasValidLow = !!(weather.lowTemp && !isNaN(weather.lowTemp));
    
    // Show range if we have both high and low and they're different
    const shouldShowRange = hasValidHigh && hasValidLow && weather.highTemp !== weather.lowTemp;
    const shouldShowCurrent = hasValidCurrent && (!shouldShowRange || weather.temperature !== weather.highTemp);

    console.log('🌡️ TEMPERATURE DISPLAY: Decision logic:', {
      cityName,
      hasValidHigh,
      hasValidLow,
      hasValidCurrent,
      shouldShowRange,
      shouldShowCurrent,
      temperatures: {
        current: weather.temperature,
        high: weather.highTemp,
        low: weather.lowTemp
      }
    });

    if (shouldShowCurrent) {
      return `${Math.round(weather.temperature)}°F`;
    } else if (shouldShowRange) {
      return `${Math.round(weather.highTemp)}°F / ${Math.round(weather.lowTemp)}°F`;
    } else if (hasValidCurrent) {
      return `${Math.round(weather.temperature)}°F`;
    } else {
      return 'N/A';
    }
  }, [weather, cityName]);

  const weatherIcon = getWeatherIcon(weather.icon);
  const formattedDate = format(segmentDate, 'EEEE, MMM d');

  // Style based on whether this is live or historical weather
  const containerStyles = weatherValidation.isLiveWeather
    ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
    : 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200';

  const sourceLabel = weatherValidation.isLiveWeather
    ? '🟢 Live Weather Forecast'
    : '🟡 Historical Weather Data';

  const sourceColor = weatherValidation.isLiveWeather
    ? '#059669' // Green-600
    : '#d97706'; // Amber-600

  const badgeText = weatherValidation.isLiveWeather
    ? '✨ Live forecast'
    : '📊 Historical estimate';

  return (
    <div className={`${containerStyles} rounded-lg p-4 border`}>
      {/* Weather Source Indicator */}
      <div className="flex items-center justify-between mb-2">
        <span 
          className="text-xs font-medium"
          style={{ color: sourceColor }}
        >
          {sourceLabel}
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
              {temperatureDisplay}
            </div>
            <div className="text-sm text-gray-600 capitalize">
              {weather.description}
            </div>
          </div>
        </div>

        <div className="text-right text-sm text-gray-600">
          <div>💧 {weather.precipitationChance}%</div>
          <div>💨 {weather.windSpeed} mph</div>
        </div>
      </div>

      {/* Weather Status Badge */}
      <div className="mt-2 text-center">
        <span 
          className={`inline-block text-xs px-2 py-1 rounded-full font-medium border ${
            weatherValidation.isLiveWeather 
              ? 'bg-green-100 text-green-700 border-green-200'
              : 'bg-amber-100 text-amber-700 border-amber-200'
          }`}
        >
          {badgeText}
        </span>
      </div>
    </div>
  );
};

export default SimpleWeatherDisplay;
