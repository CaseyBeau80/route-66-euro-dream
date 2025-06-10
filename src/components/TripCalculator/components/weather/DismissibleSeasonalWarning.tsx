
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

  if (isDismissed || isSharedView) {
    return null;
  }

  const getWarningConfig = () => {
    switch (type) {
      case 'seasonal':
        return {
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-800',
          icon: '📊'
        };
      case 'forecast-unavailable':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          icon: '🔮'
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          icon: '💡'
        };
    }
  };

  const config = getWarningConfig();

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-3 relative`}>
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        aria-label="Dismiss"
      >
        <X className="h-3 w-3" />
      </button>
      
      <div className="flex items-start gap-2 pr-6">
        <span className="text-sm">{config.icon}</span>
        <p className={`text-xs ${config.textColor}`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default DismissibleSeasonalWarning;
