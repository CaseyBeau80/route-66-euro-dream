
import React from 'react';
import { WeatherTypeDetector } from '../utils/WeatherTypeDetector';

interface WeatherFooterProps {
  weather: {
    source?: string;
    isActualForecast?: boolean;
  };
  temperatures?: {
    current: number;
    high: number;
    low: number;
  };
  isSharedView?: boolean;
}

const WeatherFooter: React.FC<WeatherFooterProps> = ({
  weather,
  temperatures,
  isSharedView = false
}) => {
  const footerMessage = React.useMemo(() => 
    WeatherTypeDetector.getFooterMessage(weather), 
    [weather.source, weather.isActualForecast]
  );

  return (
    <div className="space-y-3">
      <div className="text-xs text-blue-500 text-center">
        {footerMessage}
      </div>

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && temperatures && (
        <div className="text-xs text-gray-500 text-center border-t pt-2">
          <div>Debug: temp={weather.source}, isLive={weather.isActualForecast}</div>
          <div>Extracted: current={temperatures.current}, high={temperatures.high}, low={temperatures.low}</div>
          <div>isSharedView={isSharedView}</div>
        </div>
      )}
    </div>
  );
};

export default WeatherFooter;
