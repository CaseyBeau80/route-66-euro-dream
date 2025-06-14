
import React from 'react';
import { format } from 'date-fns';
import WeatherIcon from '../WeatherIcon';
import WeatherBadge from './WeatherBadge';
import { WeatherTypeDetector } from '../utils/WeatherTypeDetector';
import { WeatherSourceType } from '@/components/Route66Map/services/weather/WeatherServiceTypes';

interface WeatherHeaderProps {
  weather: {
    icon?: string;
    description?: string;
    source?: string;
    isActualForecast?: boolean;
    dateMatchInfo?: { source?: string };
    temperature?: number;
    humidity?: number;
    windSpeed?: number;
    precipitationChance?: number;
    cityName?: string;
    forecast?: any[];
    forecastDate?: Date;
  };
  segmentDate?: Date | null;
  cityName: string;
}

const WeatherHeader: React.FC<WeatherHeaderProps> = ({
  weather,
  segmentDate,
  cityName
}) => {
  const weatherType = React.useMemo(() => {
    // Only detect weather type if we have enough data
    if (weather.temperature !== undefined && weather.humidity !== undefined && weather.windSpeed !== undefined) {
      // Ensure source matches ForecastWeatherData type requirements
      const validSource: "live_forecast" | "historical_fallback" = 
        weather.source === 'live_forecast' ? 'live_forecast' : 'historical_fallback';
      
      // Create a proper DateMatchInfo object
      const dateMatchInfo = {
        requestedDate: segmentDate?.toISOString() || new Date().toISOString(),
        matchedDate: weather.forecastDate?.toISOString() || new Date().toISOString(),
        matchType: 'fallback' as const,
        daysOffset: 0,
        hoursOffset: 0,
        source: validSource,
        confidence: 'medium' as const
      };
      
      // Create a complete weather object for type detection
      const completeWeather = {
        temperature: weather.temperature,
        humidity: weather.humidity,
        windSpeed: weather.windSpeed,
        precipitationChance: weather.precipitationChance || 0,
        cityName: weather.cityName || cityName,
        description: weather.description || '',
        icon: weather.icon || '',
        forecast: weather.forecast || [],
        forecastDate: weather.forecastDate || new Date(),
        isActualForecast: weather.isActualForecast || false,
        source: validSource,
        dateMatchInfo: dateMatchInfo
      };
      return WeatherTypeDetector.detectWeatherType(completeWeather);
    }
    
    // Return a default type info for incomplete data
    return {
      type: 'unknown' as const,
      isActualForecast: false,
      source: weather.source || 'unknown',
      confidence: 'low' as const,
      dataQuality: 'poor' as const,
      description: 'Incomplete weather data',
      displayLabel: weather.description || 'Weather Data'
    };
  }, [weather.source, weather.isActualForecast, weather.dateMatchInfo?.source, weather.temperature, weather.humidity, weather.windSpeed, cityName, segmentDate]);

  // Safely convert source to WeatherSourceType with fallback
  const sourceType: WeatherSourceType = (weather.source as WeatherSourceType) || 'historical_fallback';

  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        {weather.icon && (
          <WeatherIcon iconCode={weather.icon} className="w-8 h-8" />
        )}
        <div>
          <h4 className="font-medium text-blue-900">
            {weather.description || weatherType.displayLabel}
          </h4>
          {segmentDate && (
            <div className="text-sm text-blue-600">
              {format(segmentDate, 'EEEE, MMMM d, yyyy')}
            </div>
          )}
        </div>
      </div>
      
      <WeatherBadge
        source={sourceType}
        isActualForecast={weather.isActualForecast}
        dateMatchSource={weather.dateMatchInfo?.source}
        cityName={cityName}
      />
    </div>
  );
};

export default WeatherHeader;
