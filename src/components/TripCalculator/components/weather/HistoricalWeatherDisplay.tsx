
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import WeatherStatusBadge from './WeatherStatusBadge';
import SeasonalReferenceCard from './SeasonalReferenceCard';
import { useUnits } from '@/contexts/UnitContext';

interface HistoricalWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate: Date;
  daysFromNow: number | null;
}

const HistoricalWeatherDisplay: React.FC<HistoricalWeatherDisplayProps> = ({
  weather,
  segmentDate,
  daysFromNow
}) => {
  const { formatSpeed } = useUnits();

  const displayDateString = segmentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'UTC'
  });

  return (
    <div className="space-y-3">
      <WeatherStatusBadge 
        type="historical"
        daysFromNow={daysFromNow}
      />
      
      <div className="text-center mb-4">
        <div className="font-semibold text-gray-800 capitalize text-sm">{weather.description}</div>
        <div className="text-xs text-gray-600">
          📊 Historical Avg for {displayDateString}
        </div>
      </div>

      {/* Historical Temperature Layout */}
      {weather.lowTemp !== undefined && weather.highTemp !== undefined ? (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-center gap-3 md:gap-4">
            {/* Humidity */}
            {weather.humidity !== undefined && weather.humidity > 0 && (
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">💧</span>
                <div className="text-xs font-medium text-blue-600">{weather.humidity}%</div>
              </div>
            )}
            
            {/* Low Temperature */}
            <div className="flex flex-col items-center gap-1">
              <div className="text-lg font-bold text-blue-600">{weather.lowTemp}°</div>
              <div className="text-xs text-gray-500">Low</div>
            </div>
            
            {/* Thermometer Icon */}
            <div className="flex flex-col items-center gap-1">
              <div className="text-2xl">🌡️</div>
              <div className="text-xs text-gray-500">Avg</div>
            </div>
            
            {/* High Temperature */}
            <div className="flex flex-col items-center gap-1">
              <div className="text-lg font-bold text-red-600">{weather.highTemp}°</div>
              <div className="text-xs text-gray-500">High</div>
            </div>
            
            {/* Wind Speed */}
            {weather.windSpeed !== undefined && weather.windSpeed > 0 && (
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">💨</span>
                <div className="text-xs font-medium text-gray-600">
                  {formatSpeed ? formatSpeed(weather.windSpeed) : `${weather.windSpeed} mph`}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center p-4 bg-gray-50 rounded">
          <div className="text-gray-600">Historical data not available</div>
        </div>
      )}

      <div className="text-xs text-blue-700 italic bg-blue-50 p-2 rounded">
        📊 Historical average temperatures for this date in {weather.cityName}. Check live weather closer to your trip.
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <SeasonalReferenceCard 
          segmentDate={segmentDate}
          cityName={weather.cityName}
        />
      </div>
    </div>
  );
};

export default HistoricalWeatherDisplay;
