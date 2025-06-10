
import React from 'react';

interface WeatherIconProps {
  iconCode?: string;
  description?: string;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  iconCode, 
  description, 
  className = "h-8 w-8" 
}) => {
  // Map weather icon codes to emojis
  const getWeatherEmoji = (code?: string): string => {
    if (!code) return '🌤️';
    
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', // clear sky day
      '01n': '🌙', // clear sky night
      '02d': '⛅', // few clouds day
      '02n': '☁️', // few clouds night
      '03d': '☁️', // scattered clouds
      '03n': '☁️',
      '04d': '☁️', // broken clouds
      '04n': '☁️',
      '09d': '🌧️', // shower rain
      '09n': '🌧️',
      '10d': '🌦️', // rain day
      '10n': '🌧️', // rain night
      '11d': '⛈️', // thunderstorm
      '11n': '⛈️',
      '13d': '🌨️', // snow
      '13n': '🌨️',
      '50d': '🌫️', // mist
      '50n': '🌫️'
    };
    
    return iconMap[code] || '🌤️';
  };

  const emoji = getWeatherEmoji(iconCode);

  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      title={description || 'Weather'}
    >
      <span className="text-2xl">{emoji}</span>
    </div>
  );
};

export default WeatherIcon;
