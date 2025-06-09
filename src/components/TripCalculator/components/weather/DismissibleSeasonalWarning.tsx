
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface DismissibleSeasonalWarningProps {
  message: string;
  type: 'seasonal' | 'forecast-unavailable';
  isSharedView?: boolean;
}

const DismissibleSeasonalWarning: React.FC<DismissibleSeasonalWarningProps> = ({
  message,
  type,
  isSharedView = false
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  // Determine styling and content based on message content and type
  const isLiveForecast = message.toLowerCase().includes('live forecast') || 
                        message.toLowerCase().includes('openweathermap');
  const isServiceUnavailable = message.toLowerCase().includes('unavailable') || 
                               message.toLowerCase().includes('temporarily') ||
                               message.toLowerCase().includes('error');

  let bgColor, textColor, icon, title;

  if (isLiveForecast) {
    // Green styling for successful live forecasts
    bgColor = 'bg-green-50 border-green-200';
    textColor = 'text-green-800';
    icon = '🔮';
    title = 'Live Forecast:';
  } else if (type === 'seasonal') {
    // Blue styling for seasonal estimates
    bgColor = 'bg-blue-50 border-blue-200';
    textColor = 'text-blue-800';
    icon = '📊';
    title = 'Seasonal Estimate:';
  } else if (isServiceUnavailable) {
    // Red/orange styling for service unavailable
    bgColor = 'bg-red-50 border-red-200';
    textColor = 'text-red-800';
    icon = '❌';
    title = 'Service Unavailable:';
  } else {
    // Orange styling for other forecast unavailable cases
    bgColor = 'bg-orange-50 border-orange-200';
    textColor = 'text-orange-800';
    icon = '⚠️';
    title = 'Weather Service Unavailable:';
  }

  return (
    <div className={`p-2 ${bgColor} border rounded text-xs ${textColor} relative`}>
      <div className="flex items-start gap-2">
        <span className="text-sm">{icon}</span>
        <div className="flex-1">
          <strong>{title}</strong>{' '}
          {message}
        </div>
        {!isSharedView && (
          <button
            onClick={() => setIsDismissed(true)}
            className="ml-2 hover:opacity-70 transition-opacity"
            aria-label="Dismiss warning"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default DismissibleSeasonalWarning;
