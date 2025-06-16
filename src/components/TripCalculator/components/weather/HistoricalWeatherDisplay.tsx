
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';
import { UnifiedDateService } from '../../services/UnifiedDateService';

interface HistoricalWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate?: Date | null;
  daysFromNow?: number | null;
}

const HistoricalWeatherDisplay: React.FC<HistoricalWeatherDisplayProps> = ({ 
  weather, 
  segmentDate
}) => {
  console.log('📊 HistoricalWeatherDisplay render:', {
    cityName: weather.cityName,
    segmentDate: segmentDate?.toISOString(),
    hasValidTemps: !!(weather.highTemp && weather.lowTemp)
  });

  // CRITICAL FIX: Always use segmentDate for the forecast label
  const forecastLabel = segmentDate 
    ? `Historical data for ${format(segmentDate, 'EEEE, MMM d')}`
    : 'Historical Weather Data';

  // Validate date alignment
  React.useEffect(() => {
    if (segmentDate && weather.dateMatchInfo) {
      const expectedDateString = UnifiedDateService.formatForApi(segmentDate);
      const { requestedDate, matchedDate } = weather.dateMatchInfo;
      
      if (requestedDate !== expectedDateString) {
        console.error(`❌ CRITICAL: Historical weather date mismatch for ${weather.cityName}`, {
          segmentDate: expectedDateString,
          requestedDate,
          matchedDate,
          forecastLabel
        });
      } else {
        console.log(`✅ Historical weather properly aligned for ${weather.cityName} on ${expectedDateString}`);
      }
    }
  }, [segmentDate, weather.dateMatchInfo, weather.cityName, forecastLabel]);

  return (
    <div className="bg-yellow-50 rounded border border-yellow-200 p-3">
      <div className="flex items-center justify-between mb-3">
        <h5 className="font-semibold text-yellow-800">{weather.cityName}</h5>
        <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
          {forecastLabel}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="text-center">
          <div className="text-lg font-bold text-yellow-700">
            {Math.round((weather.highTemp || weather.temperature || 0))}°F
          </div>
          <div className="text-xs text-yellow-600">Avg High</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-yellow-700">
            {Math.round((weather.lowTemp || weather.temperature || 0))}°F
          </div>
          <div className="text-xs text-yellow-600">Avg Low</div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-yellow-200">
        <div className="text-sm text-yellow-700 mb-2 capitalize">
          {weather.description}
        </div>
        <div className="flex justify-between text-xs text-yellow-600">
          <span>💧 {weather.precipitationChance || 0}%</span>
          <span>💨 {Math.round(weather.windSpeed || 0)} mph</span>
          <span>💦 {weather.humidity || 0}%</span>
        </div>
      </div>

      <div className="mt-2 text-xs text-yellow-600 bg-yellow-100 rounded p-2">
        📊 {forecastLabel}
      </div>
    </div>
  );
};

export default HistoricalWeatherDisplay;
