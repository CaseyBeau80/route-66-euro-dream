
import { useState, useCallback } from 'react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import { ShareTripOptions } from '../../hooks/useShareTripOptions';

interface UseShareTripModalProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string;
  shareOptions: ShareTripOptions;
  onShareUrlGenerated?: (shareCode: string, shareUrl: string) => void;
  onClose: () => void;
}

export const useShareTripModal = ({
  tripPlan,
  tripStartDate,
  shareUrl,
  shareOptions,
  onShareUrlGenerated,
  onClose
}: UseShareTripModalProps) => {
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [currentShareUrl, setCurrentShareUrl] = useState<string | null>(shareUrl || null);

  const generateShareData = useCallback(() => {
    const tripTitle = shareOptions.title || `${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Trip`;
    
    return {
      tripPlan,
      tripStartDate,
      title: tripTitle,
      includeWeather: shareOptions.includeWeather,
      includeStops: shareOptions.includeStops,
      allowPublicAccess: shareOptions.allowPublicAccess,
      userNote: shareOptions.userNote,
      generatedAt: new Date().toISOString()
    };
  }, [tripPlan, tripStartDate, shareOptions]);

  const handleGenerateAndShare = useCallback(async () => {
    if (isGeneratingLink) return;

    try {
      setIsGeneratingLink(true);
      
      // Generate share data
      const shareData = generateShareData();
      
      // Generate a unique share code
      const shareCode = `trip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create shareable URL (in a real app, this would save to backend)
      const baseUrl = window.location.origin;
      const generatedShareUrl = `${baseUrl}/shared-trip/${shareCode}`;
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store the trip data in localStorage (in a real app, this would be saved to backend)
      localStorage.setItem(`shared-trip-${shareCode}`, JSON.stringify(shareData));
      
      setCurrentShareUrl(generatedShareUrl);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(generatedShareUrl);
      
      // Notify parent component
      if (onShareUrlGenerated) {
        onShareUrlGenerated(shareCode, generatedShareUrl);
      }
      
      console.log('✅ Trip shared successfully:', {
        shareCode,
        shareUrl: generatedShareUrl,
        shareData
      });

    } catch (error) {
      console.error('❌ Failed to generate share link:', error);
      // In a real app, show error toast/notification
    } finally {
      setIsGeneratingLink(false);
    }
  }, [isGeneratingLink, generateShareData, onShareUrlGenerated]);

  return {
    isGeneratingLink,
    currentShareUrl,
    handleGenerateAndShare
  };
};
