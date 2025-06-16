
import { useState } from 'react';

export interface ShareTripOptions {
  title?: string;
  includeWeather: boolean;
  includeStops: boolean;
  allowPublicAccess: boolean;
  userNote?: string;
}

export const useShareTripOptions = (tripPlan?: any) => {
  const [shareOptions, setShareOptions] = useState<ShareTripOptions>({
    includeWeather: true,
    includeStops: true,
    allowPublicAccess: true,
    title: tripPlan ? `${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Trip` : undefined,
    userNote: undefined
  });

  const updateShareOptions = (updates: Partial<ShareTripOptions>) => {
    setShareOptions(prev => ({
      ...prev,
      ...updates
    }));
  };

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
      title: tripPlan ? `${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Trip` : undefined,
      userNote: undefined
    });
  };

  return {
    shareOptions,
    updateShareOptions,
    updateShareOption,
    resetToDefaults,
    setShareOptions
  };
};
