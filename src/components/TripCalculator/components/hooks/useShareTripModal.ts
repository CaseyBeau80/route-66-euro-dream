

import { useState, useCallback } from 'react';
import { TripPlan } from '../../services/planning/TripPlanTypes';
import { ShareTripOptions } from '../../hooks/useShareTripOptions';
import { TripService } from '../../services/TripService';
import { toast } from '@/hooks/use-toast';

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

  const handleGenerateAndShare = useCallback(async () => {
    if (isGeneratingLink) return;

    try {
      setIsGeneratingLink(true);
      
      console.log('🔗 Generating shareable link via TripService...');
      
      // Generate trip title based on share options or default
      const tripTitle = shareOptions.title || `${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Trip`;
      const tripDescription = shareOptions.userNote || `Route 66 journey from ${tripPlan.startCity} to ${tripPlan.endCity}`;
      
      // Save trip using TripService and get share code
      const shareCode = await TripService.saveTrip(tripPlan, tripTitle, tripDescription);
      
      // Generate the correct share URL using TripService
      const generatedShareUrl = TripService.getShareUrl(shareCode);
      
      setCurrentShareUrl(generatedShareUrl);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(generatedShareUrl);
      
      // Show success toast
      toast({
        title: "Trip Saved & Link Copied!",
        description: "Your trip has been saved and the link copied to clipboard.",
        variant: "default"
      });
      
      // Notify parent component
      if (onShareUrlGenerated) {
        onShareUrlGenerated(shareCode, generatedShareUrl);
      }
      
      console.log('✅ Trip shared successfully:', {
        shareCode,
        shareUrl: generatedShareUrl
      });

    } catch (error) {
      console.error('❌ Failed to generate share link:', error);
      toast({
        title: "Share Failed",
        description: "Could not save and share your trip. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingLink(false);
    }
  }, [isGeneratingLink, tripPlan, shareOptions, onShareUrlGenerated]);

  return {
    isGeneratingLink,
    currentShareUrl,
    handleGenerateAndShare
  };
};
