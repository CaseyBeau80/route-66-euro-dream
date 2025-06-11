
import React from 'react';
import ApiKeySetup from './ApiKeySetup';

interface WeatherApiKeyHandlerProps {
  hasApiKey: boolean;
  segmentEndCity: string;
  onApiKeySet: () => void;
  isSharedView?: boolean;
  isPDFExport?: boolean;
  children: React.ReactNode;
}

const WeatherApiKeyHandler: React.FC<WeatherApiKeyHandlerProps> = ({
  hasApiKey,
  segmentEndCity,
  onApiKeySet,
  isSharedView = false,
  isPDFExport = false,
  children
}) => {
  if (!hasApiKey) {
    console.log(`❌ No API key for ${segmentEndCity}`);
    return (
      <ApiKeySetup 
        onApiKeySet={onApiKeySet}
        isSharedView={isSharedView}
        isPDFExport={isPDFExport}
      />
    );
  }

  return <>{children}</>;
};

export default WeatherApiKeyHandler;
