
import React, { useEffect } from 'react';
import { Cloud } from 'lucide-react';

interface EnhancedWeatherLoadingProps {
  onTimeout: () => void;
  timeoutMs?: number;
}

const EnhancedWeatherLoading: React.FC<EnhancedWeatherLoadingProps> = ({
  onTimeout,
  timeoutMs = 10000
}) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('⏰ Weather loading timed out');
      onTimeout();
    }, timeoutMs);

    return () => clearTimeout(timeout);
  }, [onTimeout, timeoutMs]);

  return (
    <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-3 text-blue-600">
        <Cloud className="w-5 h-5 animate-pulse" />
        <div className="text-sm">
          <div className="font-medium">Loading weather data...</div>
          <div className="text-xs text-blue-500 mt-1">This may take a few seconds</div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedWeatherLoading;
