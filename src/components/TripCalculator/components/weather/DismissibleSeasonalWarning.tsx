
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

  const bgColor = type === 'seasonal' ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200';
  const textColor = type === 'seasonal' ? 'text-blue-800' : 'text-orange-800';
  const icon = type === 'seasonal' ? '📊' : '⚠️';

  return (
    <div className={`p-2 ${bgColor} border rounded text-xs ${textColor} relative`}>
      <div className="flex items-start gap-2">
        <span className="text-sm">{icon}</span>
        <div className="flex-1">
          <strong>{type === 'seasonal' ? 'Seasonal Estimate:' : 'Weather Service Unavailable:'}</strong>{' '}
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
