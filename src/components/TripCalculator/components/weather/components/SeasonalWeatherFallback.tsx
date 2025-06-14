
import React from 'react';
import { SeasonalWeatherGenerator } from '../SeasonalWeatherGenerator';

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
  console.log('🚨 PHASE 2 FIX: SeasonalWeatherFallback rendering', {
    cityName,
    segmentDate: segmentDate.toISOString(),
    compact,
    month: segmentDate.getMonth(),
    phase: 'Phase 2 - Seasonal Fallback Fix'
  });

  const month = segmentDate.getMonth();
  const seasonalTemp = SeasonalWeatherGenerator.getSeasonalTemperature(month);
  const tempVariation = 15;
  const highTemp = seasonalTemp + tempVariation/2;
  const lowTemp = seasonalTemp - tempVariation/2;
  const description = SeasonalWeatherGenerator.getSeasonalDescription(month);
  const humidity = SeasonalWeatherGenerator.getSeasonalHumidity(month);
  const precipitation = SeasonalWeatherGenerator.getSeasonalPrecipitation(month);

  if (compact) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">
              🌤️ Weather for {cityName}
            </h4>
            <p className="text-sm text-gray-600 mb-2">{description}</p>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(highTemp)}° / {Math.round(lowTemp)}°
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Source: Historical Average
            </p>
          </div>
          <div className="text-4xl">
            {SeasonalWeatherGenerator.getSeasonalIcon(month)}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-600">
          <div>💧 {humidity}% humidity</div>
          <div>💨 8 mph wind</div>
          <div>☔ {precipitation}% rain</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <h4 className="font-semibold text-gray-800 mb-2">
        🌤️ Historical Weather for {cityName}
      </h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Temperature Range</p>
          <p className="text-xl font-bold text-blue-600">
            {Math.round(highTemp)}° / {Math.round(lowTemp)}°
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Conditions</p>
          <p className="text-sm text-gray-800">{description}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-600">
        <div>💧 {humidity}% humidity</div>
        <div>💨 8 mph wind</div>
        <div>☔ {precipitation}% rain</div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        * Historical average for this time of year
      </p>
    </div>
  );
};

export default SeasonalWeatherFallback;
