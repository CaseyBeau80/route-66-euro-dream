
import React from 'react';

interface WeatherStatusBadgeProps {
  type: 'current' | 'forecast' | 'historical' | 'seasonal';
  daysFromNow?: number;
}

const WeatherStatusBadge: React.FC<WeatherStatusBadgeProps> = ({
  type,
  daysFromNow
}) => {
  const getBadgeConfig = () => {
    switch (type) {
      case 'current':
        return {
          text: 'Current Weather',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          icon: '🔴'
        };
      case 'forecast':
        return {
          text: daysFromNow !== undefined && daysFromNow > 0 
            ? `${daysFromNow} Day${daysFromNow > 1 ? 's' : ''} Ahead` 
            : 'Live Forecast',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          icon: '🔮'
        };
      case 'historical':
        return {
          text: 'Historical Average',
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
          icon: '📊'
        };
      case 'seasonal':
        return {
          text: 'Seasonal Average',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
          icon: '📅'
        };
      default:
        return {
          text: 'Weather Info',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          icon: '🌤️'
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      <span>{config.icon}</span>
      <span>{config.text}</span>
    </div>
  );
};

export default WeatherStatusBadge;
