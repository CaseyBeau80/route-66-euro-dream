
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import EnhancedWeatherDisplay from './EnhancedWeatherDisplay';

const TestWeatherComponent: React.FC = () => {
  const [testWeather, setTestWeather] = React.useState<ForecastWeatherData>({
    temperature: 75,
    highTemp: 82,
    lowTemp: 68,
    description: 'Partly Cloudy',
    icon: '02d',
    humidity: 65,
    windSpeed: 8,
    precipitationChance: 20,
    cityName: 'Test City',
    forecast: [],
    forecastDate: new Date(),
    isActualForecast: true,
    source: 'live_forecast' as const
  });

  const toggleWeatherType = () => {
    setTestWeather(prev => ({
      ...prev,
      source: prev.source === 'live_forecast' ? 'historical' : 'live_forecast',
      isActualForecast: prev.source === 'live_forecast' ? false : true
    }));
  };

  const testDate = new Date();

  return (
    <div className="p-4 bg-white border border-gray-200 rounded">
      <h3 className="text-lg font-bold mb-4">Weather Display Test</h3>
      
      <div className="mb-4">
        <button
          onClick={toggleWeatherType}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Toggle: {testWeather.source === 'live_forecast' ? 'Live' : 'Historical'}
        </button>
      </div>

      <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
        <strong>Current State:</strong><br/>
        Source: {testWeather.source}<br/>
        IsActualForecast: {String(testWeather.isActualForecast)}<br/>
        Should show: {testWeather.source === 'live_forecast' && testWeather.isActualForecast ? 'LIVE' : 'HISTORICAL'}
      </div>

      <EnhancedWeatherDisplay
        weather={testWeather}
        segmentDate={testDate}
        cityName="Test City"
        forceKey={Date.now().toString()}
        showDebug={true}
      />
    </div>
  );
};

export default TestWeatherComponent;
