
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

  const weatherType = weather.isActualForecast ? 'forecast' : 'current';
  const isCurrentAsReference = !weather.isActualForecast && segmentDate;

  return (
    <div className="space-y-3">
      <WeatherStatusBadge 
        type={weatherType} 
        daysFromNow={daysFromNow || undefined}
      />
      
      <div className="flex items-center gap-3">
        <WeatherIcon iconCode={weather.icon} description={weather.description} />
        <div>
          <div className="font-semibold text-gray-800 capitalize">{weather.description}</div>
          <div className="text-sm text-gray-600">
            {segmentDate?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      <TemperatureDisplay 
        type="current"
        currentTemp={weather.temperature}
      />

      <WeatherStats 
        humidity={weather.humidity}
        windSpeed={weather.windSpeed}
      />

      {!weather.isActualForecast && (
        <div className="text-xs text-gray-500 italic bg-gray-50 p-2 rounded">
          ⚠️ Showing current conditions as reference. Actual forecast not available for this date.
        </div>
      )}

      {isCurrentAsReference && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <SeasonalReferenceCard 
            segmentDate={segmentDate}
            cityName={weather.cityName}
          />
        </div>
      )}
    </div>
  );
};

export default ForecastWeatherDisplay;
