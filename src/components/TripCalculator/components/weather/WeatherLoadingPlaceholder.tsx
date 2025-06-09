
import React from 'react';

interface WeatherLoadingPlaceholderProps {
  segmentEndCity: string;
  onTimeout: () => void;
  isPDFExport?: boolean;
}

const WeatherLoadingPlaceholder: React.FC<WeatherLoadingPlaceholderProps> = ({
  segmentEndCity,
  onTimeout,
  isPDFExport = false
}) => {
  // Set up timeout for loading state
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onTimeout();
    }, 10000); // 10 second timeout

    return () => clearTimeout(timer);
  }, [onTimeout]);

  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="animate-pulse text-gray-500 text-sm">
        {isPDFExport 
          ? `Processing weather for export...` 
          : `Loading weather information for ${segmentEndCity}...`
        }
      </div>
    </div>
  );
};

export default WeatherLoadingPlaceholder;
