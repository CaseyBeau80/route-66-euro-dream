
import { useState, useCallback } from 'react';
import { TripPlan } from '../services/planning/TripPlanBuilder';

export interface TripSharingHook {
  shareUrl: string | null;
  generateShareUrl: (tripPlan: TripPlan) => Promise<void>;
  isGenerating: boolean;
}

export const useTripSharing = (): TripSharingHook => {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateShareUrl = useCallback(async (tripPlan: TripPlan) => {
    if (!tripPlan) return;

    setIsGenerating(true);
    try {
      // Generate a simple share URL based on trip parameters
      const params = new URLSearchParams({
        start: tripPlan.startLocation || '',
        end: tripPlan.endLocation || '',
        days: tripPlan.totalDays.toString(),
        startDate: tripPlan.startDate ? tripPlan.startDate.toISOString() : ''
      });

      const baseUrl = window.location.origin + window.location.pathname;
      const generatedShareUrl = `${baseUrl}?${params.toString()}`;
      
      setShareUrl(generatedShareUrl);
      console.log('🔗 Share URL generated:', generatedShareUrl);
    } catch (error) {
      console.error('❌ Failed to generate share URL:', error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    shareUrl,
    generateShareUrl,
    isGenerating
  };
};
