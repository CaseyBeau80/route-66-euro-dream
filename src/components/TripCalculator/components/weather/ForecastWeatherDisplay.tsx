
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import WeatherIcon from './WeatherIcon';
import WeatherStatusBadge from './WeatherStatusBadge';
import TemperatureDisplay from './TemperatureDisplay';
import WeatherStats from './WeatherStats';
import SeasonalReferenceCard from './SeasonalReferenceCard';

interface ForecastWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate?: Date | null;
}

const ForecastWeatherDisplay: React.FC<ForecastWeatherDisplayProps> = ({ 
  weather, 
  segmentDate 
}) => {
  const daysFromNow = segmentDate 
    ? Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    : null;

  console.log('🌤️ ForecastWeatherDisplay render:', {
    hasHighTemp: weather.highTemp !== undefined,
    hasLowTemp: weather.lowTemp !== undefined,
    highTemp: weather.highTemp,
    lowTemp: weather.lowTemp,
    isActualForecast: weather.isActualForecast,
    daysFromNow
  });

  // Check if forecast is not available (beyond 3 days)
  if (!weather.isActualForecast && daysFromNow && daysFromNow > 3) {
    return (
      <div className="space-y-3">
        <WeatherStatusBadge 
          type="forecast-not-available"
          daysFromNow={daysFromNow}
        />
        
        <div className="text-center p-4 bg-gray-50 rounded">
          <div className="text-gray-600 mb-2">
            Trip date: {segmentDate?.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div className="text-sm text-gray-500">
            Weather forecasts are only available 3 days in advance. 
            Check back closer to your departure date for accurate weather information.
          </div>
        </div>

        {segmentDate && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <SeasonalReferenceCard 
              segmentDate={segmentDate}
              cityName={weather.cityName}
            />
          </div>
        )}
      </div>
    );
  }

  const weatherType = weather.isActualForecast ? 'forecast' : 'current';

  return (
    <div className="space-y-3">
      <WeatherStatusBadge 
        type={weatherType} 
        daysFromNow={daysFromNow || undefined}
      />
      
      {/* Weather Icon and Condition */}
      <div className="flex flex-col items-center gap-2 mb-4">
        <WeatherIcon iconCode={weather.icon} description={weather.description} className="h-16 w-16 text-3xl" />
        <div className="text-center">
          <div className="font-semibold text-gray-800 capitalize text-sm">{weather.description}</div>
          <div className="text-xs text-gray-600">
            {segmentDate?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Temperature Display - Prioritize High/Low for forecasts */}
      {weather.isActualForecast && weather.highTemp !== undefined && weather.lowTemp !== undefined ? (
        <TemperatureDisplay 
          type="range"
          highTemp={weather.highTemp}
          lowTemp={weather.lowTemp}
        />
      ) : (
        <TemperatureDisplay 
          type="current"
          currentTemp={weather.temperature}
        />
      )}

      <WeatherStats 
        humidity={weather.humidity}
        windSpeed={weather.windSpeed}
      />

      {!weather.isActualForecast && daysFromNow && daysFromNow <= 3 && (
        <div className="text-xs text-gray-500 italic bg-gray-50 p-2 rounded">
          ⚠️ Showing current conditions as reference. Actual forecast not available for this date.
        </div>
      )}
    </div>
  );
};

export default ForecastWeatherDisplay;
