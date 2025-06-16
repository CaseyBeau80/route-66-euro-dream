
import React from 'react';

interface WeatherDebugInfoProps {
  weather: any;
  cityName: string;
  segmentDate: Date;
}

const WeatherDebugInfo: React.FC<WeatherDebugInfoProps> = ({
  weather,
  cityName,
  segmentDate
}) => {
  const debugInfo = {
    cityName,
    segmentDate: segmentDate.toISOString(),
    weatherExists: !!weather,
    weatherSource: weather?.source,
    isActualForecast: weather?.isActualForecast,
    temperature: weather?.temperature,
    highTemp: weather?.highTemp,
    lowTemp: weather?.lowTemp,
    humidity: weather?.humidity,
    windSpeed: weather?.windSpeed,
    precipitationChance: weather?.precipitationChance,
    description: weather?.description,
    icon: weather?.icon,
    forecast: weather?.forecast?.length || 0,
    dateMatchInfo: weather?.dateMatchInfo
  };

  console.log('🐛 WEATHER DEBUG INFO:', debugInfo);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <details className="mt-2 p-2 bg-gray-100 rounded text-xs">
      <summary className="cursor-pointer font-mono">Debug Info</summary>
      <pre className="mt-2 overflow-auto text-xs">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </details>
  );
};

export default WeatherDebugInfo;
