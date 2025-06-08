
import { useState } from 'react';

export interface ShareTripOptions {
  title?: string;
  includeWeather: boolean;
  includeStops: boolean;
  allowPublicAccess: boolean;
  userNote?: string;
}

export const useShareTripOptions = () => {
  const [shareOptions, setShareOptions] = useState<ShareTripOptions>({
    includeWeather: true,
    includeStops: true,
    allowPublicAccess: true,
    title: undefined,
    userNote: undefined
  });

  const updateShareOption = <K extends keyof ShareTripOptions>(
    key: K,
    value: ShareTripOptions[K]
  ) => {
    setShareOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetToDefaults = () => {
    setShareOptions({
      includeWeather: true,
      includeStops: true,
      allowPublicAccess: true,
      title: undefined,
      userNote: undefined
    });
  };

  return {
    shareOptions,
    updateShareOption,
    resetToDefaults,
    setShareOptions
  };
};
