
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import WeatherIcon from './WeatherIcon';
import WeatherStatusBadge from './WeatherStatusBadge';
import SeasonalReferenceCard from './SeasonalReferenceCard';
import { getHistoricalWeatherData } from './SeasonalWeatherService';
import { DateNormalizationService } from './DateNormalizationService';
import { useUnits } from '@/contexts/UnitContext';

interface ForecastWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate?: Date | null;
}

const ForecastWeatherDisplay: React.FC<ForecastWeatherDisplayProps> = ({ 
  weather, 
  segmentDate 
}) => {
  const { formatSpeed } = useUnits();
  
  // CRITICAL: Always use the exact segmentDate passed in
  const normalizedSegmentDate = segmentDate ? DateNormalizationService.normalizeSegmentDate(segmentDate) : null;
  
  // Calculate days from now for display purposes only - no offset calculations
  const daysFromNow = normalizedSegmentDate 
    ? Math.ceil((normalizedSegmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    : null;

  // Simplified date alignment logging
  if (process.env.NODE_ENV === 'development' && normalizedSegmentDate) {
    console.log(`🗓️ ForecastWeatherDisplay for ${weather.cityName}:`, {
      segmentDate: DateNormalizationService.toDateString(normalizedSegmentDate),
      daysFromNow,
      isActualForecast: weather.isActualForecast
    });
  }

  // Simplified weather data logging
  console.log('🌤️ ForecastWeatherDisplay render:', {
    cityName: weather.cityName,
    isActualForecast: weather.isActualForecast,
    hasValidTemps: !!(weather.highTemp && weather.lowTemp),
    daysFromNow
  });

  // Check if we should show historical data - simplified logic
  const shouldShowHistorical = !weather.isActualForecast || 
                              (daysFromNow && daysFromNow > 5) || 
                              weather.description === 'Forecast not available';

  // Get historical data if needed - use exact normalized segment date
  let displayData = weather;
  if (shouldShowHistorical && normalizedSegmentDate) {
    console.log(`📊 Using historical data for ${weather.cityName}`);
    
    // Check if we need fresh historical data
    if (!weather.lowTemp || !weather.highTemp || weather.lowTemp === weather.highTemp) {
      const historicalData = getHistoricalWeatherData(weather.cityName, normalizedSegmentDate);
      displayData = {
        ...weather,
        lowTemp: historicalData.low,
        highTemp: historicalData.high,
        description: historicalData.condition,
        humidity: historicalData.humidity,
        windSpeed: historicalData.windSpeed,
        precipitationChance: historicalData.precipitationChance
      };
    }
  }

  if (shouldShowHistorical && normalizedSegmentDate) {
    // Generate display date string from exact normalized segment date
    const displayDateString = normalizedSegmentDate.toLocaleDateString('en-US', { 
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
          <div className="font-semibold text-gray-800 capitalize text-sm">{displayData.description}</div>
          <div className="text-xs text-gray-600">
            📊 Historical Avg for {displayDateString}
          </div>
        </div>

        {/* Historical Temperature Layout */}
        {displayData.lowTemp !== undefined && displayData.highTemp !== undefined ? (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-center gap-3 md:gap-4">
              {/* Humidity */}
              {displayData.humidity !== undefined && displayData.humidity > 0 && (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg">💧</span>
                  <div className="text-xs font-medium text-blue-600">{displayData.humidity}%</div>
                </div>
              )}
              
              {/* Low Temperature */}
              <div className="flex flex-col items-center gap-1">
                <div className="text-lg font-bold text-blue-600">{displayData.lowTemp}°</div>
                <div className="text-xs text-gray-500">Low</div>
              </div>
              
              {/* Thermometer Icon */}
              <div className="flex flex-col items-center gap-1">
                <div className="text-2xl">🌡️</div>
                <div className="text-xs text-gray-500">Avg</div>
              </div>
              
              {/* High Temperature */}
              <div className="flex flex-col items-center gap-1">
                <div className="text-lg font-bold text-red-600">{displayData.highTemp}°</div>
                <div className="text-xs text-gray-500">High</div>
              </div>
              
              {/* Wind Speed */}
              {displayData.windSpeed !== undefined && displayData.windSpeed > 0 && (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg">💨</span>
                  <div className="text-xs font-medium text-gray-600">
                    {formatSpeed ? formatSpeed(displayData.windSpeed) : `${displayData.windSpeed} mph`}
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

        {normalizedSegmentDate && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <SeasonalReferenceCard 
              segmentDate={normalizedSegmentDate}
              cityName={weather.cityName}
            />
          </div>
        )}
      </div>
    );
  }

  // For actual forecasts or current weather within 5 days
  const weatherType = weather.isActualForecast ? 'forecast' : 'current';
  
  // Generate display date string from exact normalized segment date
  const displayDateString = normalizedSegmentDate ? normalizedSegmentDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    timeZone: 'UTC'
  }) : '';

  return (
    <div className="space-y-3">
      <WeatherStatusBadge 
        type={weatherType} 
        daysFromNow={daysFromNow || undefined}
      />
      
      {/* Weather Description and Date */}
      <div className="text-center mb-4">
        <div className="font-semibold text-gray-800 capitalize text-sm">{weather.description}</div>
        <div className="text-xs text-gray-600">
          🔹 Forecast for {displayDateString}
        </div>
      </div>

      {/* Enhanced Temperature Layout */}
      {weather.isActualForecast && weather.highTemp !== undefined && weather.lowTemp !== undefined ? (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-center gap-3 md:gap-4">
            {/* Humidity */}
            {(weather.humidity !== undefined && weather.humidity > 0) || (weather.precipitationChance !== undefined && weather.precipitationChance > 0) ? (
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">💧</span>
                <div className="text-xs font-medium text-blue-600">
                  {weather.precipitationChance !== undefined && weather.precipitationChance > 0 
                    ? `${weather.precipitationChance}%` 
                    : `${weather.humidity}%`}
                </div>
              </div>
            ) : null}
            
            {/* Low Temperature */}
            <div className="flex flex-col items-center gap-1">
              <div className="text-lg font-bold text-blue-600">{weather.lowTemp}°</div>
              <div className="text-xs text-gray-500">Low</div>
            </div>
            
            {/* Weather Icon */}
            <div className="flex flex-col items-center gap-1">
              <WeatherIcon iconCode={weather.icon} description={weather.description} className="h-8 w-8 text-2xl" />
              <div className="text-xs text-gray-500">Now</div>
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
        // Fallback for current temperature
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-center gap-4 mb-3">
            <WeatherIcon iconCode={weather.icon} description={weather.description} className="h-12 w-12" />
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{weather.temperature}°</div>
              <div className="text-xs text-gray-500">Current</div>
            </div>
          </div>
          
          {/* Inline Weather Details */}
          {(weather.humidity || weather.windSpeed || weather.precipitationChance) && (
            <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
              {weather.precipitationChance !== undefined && weather.precipitationChance > 0 && (
                <div className="flex items-center gap-1">
                  <span>💧</span>
                  <span>{weather.precipitationChance}%</span>
                </div>
              )}
              {!weather.precipitationChance && weather.humidity !== undefined && weather.humidity > 0 && (
                <div className="flex items-center gap-1">
                  <span>💧</span>
                  <span>{weather.humidity}%</span>
                </div>
              )}
              {weather.windSpeed !== undefined && weather.windSpeed > 0 && (
                <div className="flex items-center gap-1">
                  <span>💨</span>
                  <span>{formatSpeed ? formatSpeed(weather.windSpeed) : `${weather.windSpeed} mph`}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!weather.isActualForecast && daysFromNow && daysFromNow <= 5 && (
        <div className="text-xs text-gray-500 italic bg-gray-50 p-2 rounded">
          ⚠️ Showing current conditions as reference. Actual forecast not available for this date.
        </div>
      )}
    </div>
  );
};

export default ForecastWeatherDisplay;
