
import React from 'react';
import EnhancedWeatherApiKeyInput from '@/components/Route66Map/components/weather/EnhancedWeatherApiKeyInput';

interface WeatherApiKeyInputProps {
  segmentEndCity: string;
  onApiKeySet: () => void;
}

const WeatherApiKeyInput: React.FC<WeatherApiKeyInputProps> = ({
  segmentEndCity,
  onApiKeySet
}) => {
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="mb-3 text-sm text-blue-800">
        <p className="font-semibold">Weather API Key Required</p>
        <p>Enter your OpenWeatherMap API key to see weather information for {segmentEndCity}</p>
      </div>
      <EnhancedWeatherApiKeyInput 
        onApiKeySet={onApiKeySet}
        cityName={segmentEndCity}
      />
    </div>
  );
};

export default WeatherApiKeyInput;
