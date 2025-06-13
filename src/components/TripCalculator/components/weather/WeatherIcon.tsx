
import React from 'react';

interface WeatherIconProps {
  iconCode: string;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ iconCode, className = "w-6 h-6" }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  
  return (
    <img 
      src={iconUrl} 
      alt="Weather icon" 
      className={className}
      onError={(e) => {
        // Fallback to a default weather emoji if the icon fails to load
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        target.nextElementSibling?.classList.remove('hidden');
      }}
    />
  );
};

export default WeatherIcon;
