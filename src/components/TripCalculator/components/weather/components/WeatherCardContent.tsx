
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import SimpleWeatherDisplay from '../SimpleWeatherDisplay';
import { NoWeatherFallback } from './WeatherCardStates';

interface WeatherCardContentProps {
  weather: ForecastWeatherData | null;
  segmentDate: Date;
  cityName: string;
}

const WeatherCardContent: React.FC<WeatherCardContentProps> = ({
  weather,
  segmentDate,
  cityName
}) => {
  console.log(`🎯 [WEATHER DEBUG] WeatherCardContent for ${cityName}:`, {
    component: 'WeatherCardContent',
    hasWeather: !!weather,
    segmentDate: segmentDate.toISOString()
  });

  return (
    <div className="p-4">
      {weather ? (
        <>
          {(() => {
            console.log(`🎯 [WEATHER DEBUG] WeatherCardContent displaying weather for ${cityName}:`, {
              component: 'WeatherCardContent -> SimpleWeatherDisplay',
              weatherData: {
                temperature: weather.temperature,
                description: weather.description,
                isActualForecast: weather.isActualForecast
              }
            });
            return null;
          })()}
          <SimpleWeatherDisplay
            weather={weather}
            segmentDate={segmentDate}
            cityName={cityName}
          />
        </>
      ) : (
        <>
          {(() => {
            console.log(`🎯 [WEATHER DEBUG] WeatherCardContent showing no weather for ${cityName}:`, {
              component: 'WeatherCardContent -> no-weather-fallback'
            });
            return null;
          })()}
          <NoWeatherFallback />
        </>
      )}
    </div>
  );
};

export default WeatherCardContent;
