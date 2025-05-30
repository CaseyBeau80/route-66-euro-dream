
import React, { useEffect, useState } from 'react';
import { WeatherService } from '../services/WeatherService';
import { Cloud, Thermometer, Droplets, Wind, AlertCircle, Calendar } from 'lucide-react';

interface WeatherWidgetProps {
  lat: number;
  lng: number;
  cityName: string;
  compact?: boolean;
}

interface ForecastDay {
  date: string;
  temperature: {
    high: number;
    low: number;
  };
  description: string;
  icon: string;
}

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  cityName: string;
  forecast?: ForecastDay[];
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ 
  lat, 
  lng, 
  cityName, 
  compact = false 
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      console.log(`🌤️ WeatherWidget: Starting weather fetch for ${cityName}`);
      const weatherService = WeatherService.getInstance();
      
      if (!weatherService.hasApiKey()) {
        console.warn('❌ WeatherWidget: No API key configured');
        setError('API key not configured');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log(`🌐 WeatherWidget: Requesting weather data for ${cityName}`);
        const weatherData = await weatherService.getWeatherWithForecast(lat, lng, cityName);
        
        if (weatherData) {
          console.log('✅ WeatherWidget: Weather data received successfully');
          setWeather(weatherData);
          setError(null);
        } else {
          console.warn('❌ WeatherWidget: No weather data returned from service');
          setError('Unable to fetch weather data');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Weather service error';
        console.error('❌ WeatherWidget: Weather fetch error:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lng, cityName]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 p-2">
        <Cloud className="w-4 h-4 animate-pulse" />
        <span>Loading weather...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-xs text-red-500 p-2">
        <AlertCircle className="w-4 h-4" />
        <span>Weather: {error}</span>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-400 p-2">
        <Cloud className="w-4 h-4" />
        <span>Weather unavailable</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm bg-blue-50 rounded-md px-2 py-1">
        <img 
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
          className="w-6 h-6"
        />
        <span className="font-semibold text-blue-900">{weather.temperature}°F</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-4 min-w-[320px] border border-blue-200">
      {/* Header with centered city name and weather icon */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 text-center">
          <h4 className="font-bold text-lg text-gray-800">{weather.cityName}</h4>
        </div>
        <div className="flex items-center">
          <img 
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            className="w-12 h-12"
          />
        </div>
      </div>
      
      {/* Main temperature display with interactive thermometer */}
      <div className="text-center mb-3">
        <div className="flex items-center justify-center gap-3 mb-1">
          <div className="group cursor-pointer">
            <Thermometer className="w-6 h-6 text-red-500 transition-all duration-300 group-hover:text-red-600 group-hover:scale-110 group-hover:drop-shadow-md" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-600 font-medium">Currently</span>
            <span className="text-3xl font-bold text-gray-900">{weather.temperature}°F</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 capitalize font-medium">{weather.description}</p>
      </div>
      
      {/* Weather details */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-blue-200 mb-4">
        <div className="flex items-center gap-2 bg-white rounded-md px-2 py-1">
          <Droplets className="w-4 h-4 text-blue-500" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Humidity</span>
            <span className="text-sm font-semibold text-gray-800">{weather.humidity}%</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-md px-2 py-1">
          <Wind className="w-4 h-4 text-green-500" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Wind</span>
            <span className="text-sm font-semibold text-gray-800">{weather.windSpeed} mph</span>
          </div>
        </div>
      </div>

      {/* 3-Day Forecast - Horizontal Layout */}
      {weather.forecast && weather.forecast.length > 0 && (
        <div className="border-t border-blue-200 pt-3">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h5 className="font-semibold text-sm text-gray-800">3-Day Forecast</h5>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {weather.forecast.map((day, index) => (
              <div key={index} className="flex flex-col items-center bg-white rounded-md px-2 py-3">
                <p className="text-xs font-medium text-gray-800 mb-1">{day.date}</p>
                <img 
                  src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                  alt={day.description}
                  className="w-8 h-8 mb-1"
                />
                <p className="text-xs text-gray-500 capitalize text-center mb-2">{day.description}</p>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold text-gray-900">{day.temperature.high}°</span>
                  <span className="text-xs text-gray-500">{day.temperature.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
