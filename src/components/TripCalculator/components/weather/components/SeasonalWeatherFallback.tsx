
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
  const month = segmentDate.getMonth();
  const seasonalTemp = SeasonalWeatherGenerator.getSeasonalTemperature(month);
  const seasonalDescription = SeasonalWeatherGenerator.getSeasonalDescription(month);
  const seasonalIcon = SeasonalWeatherGenerator.getSeasonalIcon(month);
  const seasonalHumidity = SeasonalWeatherGenerator.getSeasonalHumidity(month);
  const seasonalPrecipitation = SeasonalWeatherGenerator.getSeasonalPrecipitation(month);

  // FIXED: Dynamic condition thumbnails based on weather
  const getConditionThumbnail = (temp: number, description: string) => {
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes('rain') || lowerDesc.includes('shower')) {
      return '🌧️';
    } else if (lowerDesc.includes('snow')) {
      return '❄️';
    } else if (lowerDesc.includes('cloud')) {
      return '☁️';
    } else if (temp >= 85) {
      return '🔥'; // Hot
    } else if (temp >= 75) {
      return '☀️'; // Warm
    } else if (temp >= 60) {
      return '🌤️'; // Mild
    } else {
      return '🧥'; // Cool
    }
  };

  const conditionThumbnail = getConditionThumbnail(seasonalTemp, seasonalDescription);
  const conditionLabel = seasonalTemp >= 85 ? 'Hot' 
                        : seasonalTemp >= 75 ? 'Warm'
                        : seasonalTemp >= 60 ? 'Mild' 
                        : 'Cool';

  if (compact) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded p-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">
              🌤️ Weather for {cityName}
            </h4>
            <p className="text-sm text-gray-600 mb-2">{seasonalDescription}</p>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-orange-600">
                {seasonalTemp}°F
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Source: Historical Average
            </p>
          </div>
          <div className="text-right flex flex-col items-center">
            <div className="text-4xl mb-1">{conditionThumbnail}</div>
            <div className="text-xs font-medium text-gray-600">{conditionLabel}</div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-600">
          <div>💧 {seasonalHumidity}% humidity</div>
          <div>💨 8 mph wind</div>
          <div>☔ {seasonalPrecipitation}% rain</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Weather for {cityName}
          </h3>
          <p className="text-sm text-gray-600">{seasonalDescription}</p>
        </div>
        <div className="text-right flex flex-col items-center">
          <div className="text-5xl mb-2">{conditionThumbnail}</div>
          <div className="text-sm font-medium text-gray-600">{conditionLabel}</div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-2xl font-bold text-orange-600">
          {seasonalTemp}°F
        </div>
        <p className="text-xs text-gray-500">Historical Average for {segmentDate.toLocaleDateString('en-US', { month: 'long' })}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
        <div className="text-center">
          <div className="text-lg">💧</div>
          <div>{seasonalHumidity}%</div>
          <div className="text-xs">Humidity</div>
        </div>
        <div className="text-center">
          <div className="text-lg">💨</div>
          <div>8 mph</div>
          <div className="text-xs">Wind</div>
        </div>
        <div className="text-center">
          <div className="text-lg">☔</div>
          <div>{seasonalPrecipitation}%</div>
          <div className="text-xs">Rain</div>
        </div>
      </div>
    </div>
  );
};

export default SeasonalWeatherFallback;
