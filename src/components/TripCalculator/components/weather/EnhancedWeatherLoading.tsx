
import React, { useState, useEffect } from 'react';
import { Cloud, AlertTriangle } from 'lucide-react';

interface EnhancedWeatherLoadingProps {
  onTimeout?: () => void;
  timeoutMs?: number;
}

const EnhancedWeatherLoading: React.FC<EnhancedWeatherLoadingProps> = ({ 
  onTimeout, 
  timeoutMs = 15000 
}) => {
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);

  useEffect(() => {
    const warningTimer = setTimeout(() => {
      setShowTimeoutWarning(true);
    }, timeoutMs * 0.7); // Show warning at 70% of timeout

    const timeoutTimer = setTimeout(() => {
      if (onTimeout) {
        onTimeout();
      }
    }, timeoutMs);

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(timeoutTimer);
    };
  }, [onTimeout, timeoutMs]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-gray-500 p-2">
        <Cloud className="w-4 h-4 animate-pulse" />
        <span>Loading current weather...</span>
      </div>
      
      {showTimeoutWarning && (
        <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs">Weather service taking longer than expected...</span>
        </div>
      )}
    </div>
  );
};

export default EnhancedWeatherLoading;
