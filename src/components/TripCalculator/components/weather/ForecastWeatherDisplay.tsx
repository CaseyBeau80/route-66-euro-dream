
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import WeatherIcon from './WeatherIcon';
import WeatherStatusBadge from './WeatherStatusBadge';
import WeatherStats from './WeatherStats';
import SeasonalReferenceCard from './SeasonalReferenceCard';
import { getHistoricalWeatherData } from './SeasonalWeatherService';

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
    daysFromNow,
    cityName: weather.cityName,
    description: weather.description,
    source: (weather as any).source,
    humidity: weather.humidity,
    windSpeed: weather.windSpeed,
    precipitationChance: weather.precipitationChance
  });

  // Check if we should show historical data based on multiple conditions
  const shouldShowHistorical = !weather.isActualForecast || 
                              (daysFromNow && daysFromNow > 5) || 
                              weather.description === 'Forecast not available' ||
                              (weather as any).source === 'historical';

  // Get historical data if needed
  let displayData = weather;
  if (shouldShowHistorical && segmentDate) {
    console.log(`📊 Preparing historical display for ${weather.cityName} (${daysFromNow} days ahead)`);
    
    // Check if we already have historical temp data, otherwise fetch it
    if (!weather.lowTemp || !weather.highTemp) {
      const historicalData = getHistoricalWeatherData(weather.cityName, segmentDate);
      displayData = {
        ...weather,
        lowTemp: historicalData.low,
        highTemp: historicalData.high,
        description: historicalData.condition,
        humidity: historicalData.humidity,
        windSpeed: historicalData.windSpeed,
        precipitationChance: historicalData.precipitationChance
      };
      console.log('📊 Enhanced weather with historical data:', displayData);
    }
  }

  if (shouldShowHistorical && segmentDate) {
    return (
      <div className="space-y-3">
        <WeatherStatusBadge 
          type="historical"
          daysFromNow={daysFromNow}
        />
        
        <div className="text-center mb-4">
          <div className="font-semibold text-gray-800 capitalize text-sm">{displayData.description}</div>
          <div className="text-xs text-gray-600">
            {segmentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>

        {/* Historical Temperature Layout: Low | Thermometer | High */}
        {displayData.lowTemp !== undefined && displayData.highTemp !== undefined ? (
          <div className="flex items-center justify-center gap-4 p-4 bg-white rounded-lg border border-gray-200 md:gap-6">
            {/* Low Temperature */}
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{displayData.lowTemp}°</div>
              <div className="text-xs text-gray-500">Typical Low</div>
            </div>
            
            {/* Thermometer Icon for Historical */}
            <div className="flex-shrink-0">
              <div className="text-4xl">🌡️</div>
            </div>
            
            {/* High Temperature */}
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{displayData.highTemp}°</div>
              <div className="text-xs text-gray-500">Typical High</div>
            </div>
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-50 rounded">
            <div className="text-gray-600">Historical data not available</div>
          </div>
        )}

        <WeatherStats 
          humidity={displayData.humidity}
          windSpeed={displayData.windSpeed}
          precipitationChance={displayData.precipitationChance}
        />

        <div className="text-xs text-blue-700 italic bg-blue-50 p-2 rounded">
          📊 Historical average temperatures for this date in {weather.cityName}. Check live weather closer to your trip.
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

  // For actual forecasts or current weather within 5 days
  const weatherType = weather.isActualForecast ? 'forecast' : 'current';

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
          {segmentDate?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Enhanced Temperature Layout: Low | Icon | High */}
      {weather.isActualForecast && weather.highTemp !== undefined && weather.lowTemp !== undefined ? (
        <div className="flex items-center justify-center gap-4 p-4 bg-white rounded-lg border border-gray-200 md:gap-6">
          {/* Low Temperature */}
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{weather.lowTemp}°</div>
            <div className="text-xs text-gray-500">Low</div>
          </div>
          
          {/* Weather Icon */}
          <div className="flex-shrink-0">
            <WeatherIcon iconCode={weather.icon} description={weather.description} className="h-12 w-12 md:h-16 md:w-16" />
          </div>
          
          {/* High Temperature */}
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{weather.highTemp}°</div>
            <div className="text-xs text-gray-500">High</div>
          </div>
        </div>
      ) : (
        // Fallback for current temperature
        <div className="flex items-center justify-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
          <WeatherIcon iconCode={weather.icon} description={weather.description} className="h-12 w-12" />
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{weather.temperature}°</div>
            <div className="text-xs text-gray-500">Current</div>
          </div>
        </div>
      )}

      <WeatherStats 
        humidity={weather.humidity}
        windSpeed={weather.windSpeed}
        precipitationChance={weather.precipitationChance}
      />

      {!weather.isActualForecast && daysFromNow && daysFromNow <= 5 && (
        <div className="text-xs text-gray-500 italic bg-gray-50 p-2 rounded">
          ⚠️ Showing current conditions as reference. Actual forecast not available for this date.
        </div>
      )}
    </div>
  );
};

export default ForecastWeatherDisplay;
