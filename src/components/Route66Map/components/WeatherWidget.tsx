
import React, { useEffect, useState } from 'react';
import { WeatherService } from '../services/WeatherService';
import { Cloud, Thermometer, Droplets, Wind } from 'lucide-react';

interface WeatherWidgetProps {
  lat: number;
  lng: number;
  cityName: string;
  compact?: boolean;
}

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  cityName: string;
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
      const weatherService = WeatherService.getInstance();
      
      if (!weatherService.hasApiKey()) {
        setError('Weather API key not configured');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const weatherData = await weatherService.getWeatherData(lat, lng, cityName);
        
        if (weatherData) {
          setWeather(weatherData);
          setError(null);
        } else {
          setError('Unable to fetch weather data');
        }
      } catch (err) {
        setError('Weather service error');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lng, cityName]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Cloud className="w-4 h-4 animate-pulse" />
        <span>Loading weather...</span>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="text-xs text-gray-400">
        Weather unavailable
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <img 
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
          className="w-6 h-6"
        />
        <span className="font-medium">{weather.temperature}°F</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-3 min-w-[200px]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-800">{weather.cityName}</h4>
        <img 
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
          className="w-8 h-8"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-red-500" />
          <span className="text-lg font-bold">{weather.temperature}°F</span>
        </div>
        
        <p className="text-sm text-gray-600 capitalize">{weather.description}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Droplets className="w-3 h-3" />
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="w-3 h-3" />
            <span>{weather.windSpeed} mph</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
