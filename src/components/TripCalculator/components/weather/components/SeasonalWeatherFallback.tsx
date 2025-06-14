
import React from 'react';
import { SeasonalWeatherGenerator } from '../SeasonalWeatherGenerator';
import { CityWeatherVariationService } from '../services/CityWeatherVariationService';
import SimpleTemperatureDisplay from '../SimpleTemperatureDisplay';

interface SeasonalWeatherFallbackProps {
  segmentDate: Date;
  cityName: string;
  compact?: boolean;
}

const SeasonalWeatherFallback: React.FC<SeasonalWeatherFallbackProps> = ({
  segmentDate,
  cityName,
  compact = false
}) => {
  const weather = React.useMemo(() => {
    const month = segmentDate.getMonth();
    const seasonalTemp = SeasonalWeatherGenerator.getSeasonalTemperature(month);
    
    const baseWeather = {
      temperature: seasonalTemp,
      highTemp: seasonalTemp + 7,
      lowTemp: seasonalTemp - 7,
      description: SeasonalWeatherGenerator.getSeasonalDescription(month),
      icon: SeasonalWeatherGenerator.getSeasonalIcon(month),
      humidity: SeasonalWeatherGenerator.getSeasonalHumidity(month),
      windSpeed: 8,
      precipitationChance: SeasonalWeatherGenerator.getSeasonalPrecipitation(month),
      cityName,
      forecast: [],
      forecastDate: segmentDate,
      isActualForecast: false,
      source: 'historical_fallback' as const
    };

    // Apply city-specific variations for uniqueness
    return CityWeatherVariationService.applyVariationToWeather(baseWeather, cityName);
  }, [segmentDate, cityName]);

  console.log('🌱 SeasonalWeatherFallback: Rendering unique seasonal data', {
    cityName,
    temperature: weather.temperature,
    description: weather.description,
    icon: weather.icon,
    isUnique: true
  });

  if (compact) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded p-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800 mb-1 text-sm">
              🌤️ {cityName}
            </h4>
            <p className="text-xs text-gray-600 mb-1 capitalize">{weather.description}</p>
            <div className="text-lg font-bold text-gray-800">
              {Math.round(weather.temperature)}°F
            </div>
            <p className="text-xs text-gray-500">Seasonal Average</p>
          </div>
          <div className="text-2xl">
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              className="w-12 h-12"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded p-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-800 mb-1">
            🌤️ Weather for {cityName}
          </h4>
          <p className="text-sm text-gray-600 mb-2 capitalize">{weather.description}</p>
          <SimpleTemperatureDisplay weather={weather} />
          <p className="text-xs text-gray-500 mt-1">
            Source: Seasonal Average
          </p>
        </div>
        <div className="text-4xl">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            className="w-16 h-16"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-600">
        <div>💧 {weather.humidity}% humidity</div>
        <div>💨 {weather.windSpeed} mph wind</div>
        <div>☔ {weather.precipitationChance}% rain</div>
      </div>
    </div>
  );
};

export default SeasonalWeatherFallback;
