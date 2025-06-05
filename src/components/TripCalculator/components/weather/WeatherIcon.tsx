
import React from 'react';
import { Cloud, Sun, CloudRain, CloudSnow } from 'lucide-react';

interface WeatherIconProps {
  iconCode?: string;
  description?: string;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ iconCode, description, className = "h-12 w-12" }) => {
  if (iconCode) {
    return (
      <img 
        src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
        alt={description || 'Weather'}
        className={className}
      />
    );
  }
  
  // Fallback to our icon logic if no API icon
  const lowerCondition = (description || '').toLowerCase();
  if (lowerCondition.includes('rain') || lowerCondition.includes('storm')) {
    return <CloudRain className={`${className} text-blue-500`} />;
  }
  if (lowerCondition.includes('snow') || lowerCondition.includes('blizzard')) {
    return <CloudSnow className={`${className} text-blue-300`} />;
  }
  if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
    return <Cloud className={`${className} text-gray-500`} />;
  }
  return <Sun className={`${className} text-yellow-500`} />;
};

export default WeatherIcon;
