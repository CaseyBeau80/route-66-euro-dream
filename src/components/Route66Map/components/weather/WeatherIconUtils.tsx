
import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudDrizzle, 
  CloudLightning 
} from 'lucide-react';

// Map OpenWeatherMap icon codes to Lucide React icons
const iconMap: { [key: string]: React.ComponentType<any> } = {
  // Clear sky
  '01d': Sun,
  '01n': Sun,
  
  // Few clouds
  '02d': Cloud,
  '02n': Cloud,
  
  // Scattered clouds
  '03d': Cloud,
  '03n': Cloud,
  
  // Broken clouds
  '04d': Cloud,
  '04n': Cloud,
  
  // Shower rain
  '09d': CloudDrizzle,
  '09n': CloudDrizzle,
  
  // Rain
  '10d': CloudRain,
  '10n': CloudRain,
  
  // Thunderstorm
  '11d': CloudLightning,
  '11n': CloudLightning,
  
  // Snow
  '13d': CloudSnow,
  '13n': CloudSnow,
  
  // Mist/fog
  '50d': Cloud,
  '50n': Cloud,
};

export const getFallbackIcon = (iconCode: string): React.ComponentType<any> => {
  return iconMap[iconCode] || Cloud; // Default to Cloud if icon not found
};

interface WeatherIconProps {
  iconCode: string;
  description: string;
  size?: number;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  iconCode, 
  description, 
  size = 40,
  className = ""
}) => {
  const weatherIconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  console.log(`🌤️ WeatherIcon: Using OpenWeatherMap icon for code ${iconCode}`);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={weatherIconUrl}
        alt={description}
        width={size}
        height={size}
        className="object-contain"
      />
    </div>
  );
};
