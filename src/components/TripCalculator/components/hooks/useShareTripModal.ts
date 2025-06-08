
import { useState, useEffect } from 'react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import { TripService } from '../../services/TripService';
import { toast } from '@/hooks/use-toast';

interface UseShareTripModalProps {
  tripPlan: TripPlan;
  shareUrl?: string;
  onShareUrlGenerated?: (shareCode: string, shareUrl: string) => void;
  onClose: () => void;
}

export const useShareTripModal = ({
  tripPlan,
  shareUrl,
  onShareUrlGenerated,
  onClose
}: UseShareTripModalProps) => {
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [currentShareUrl, setCurrentShareUrl] = useState<string | null>(shareUrl || null);

  useEffect(() => {
    setCurrentShareUrl(shareUrl || null);
  }, [shareUrl]);

  const handleGenerateLink = async () => {
    if (currentShareUrl) {
      return currentShareUrl;
    }

    if (!tripPlan) {
      toast({
        title: "No Trip to Share",
        description: "Please create a trip plan first.",
        variant: "destructive"
      });
      return null;
    }

    setIsGeneratingLink(true);
    
    try {
      console.log('💾 Generating share link for trip...');
      
      const shareCode = await TripService.saveTrip(
        tripPlan,
        tripPlan.title,
        `Route 66 trip from ${tripPlan.segments?.[0]?.startCity || 'Start'} to ${tripPlan.segments?.[tripPlan.segments.length - 1]?.endCity || 'End'}`
      );

      const newShareUrl = TripService.getShareUrl(shareCode);
      setCurrentShareUrl(newShareUrl);

      // Notify parent component about the new share URL
      if (onShareUrlGenerated) {
        onShareUrlGenerated(shareCode, newShareUrl);
      }

      toast({
        title: "Trip Saved Successfully!",
        description: "Your shareable link has been generated and is ready to use.",
        variant: "default"
      });

      console.log('✅ Share link generated:', newShareUrl);
      return newShareUrl;
    } catch (error) {
      console.error('❌ Failed to generate share link:', error);
      
      toast({
        title: "Save Failed",
        description: "Could not save your trip. Please try again.",
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopyLink = async () => {
    const url = currentShareUrl || await handleGenerateLink();
    if (!url) return;
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for non-secure contexts or older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      toast({
        title: "Link Copied Successfully!",
        description: "Your shareable trip link is now in your clipboard and ready to share.",
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Copy Failed",
        description: "Could not copy link to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleShareViaEmail = async () => {
    const url = currentShareUrl || await handleGenerateLink();
    if (!url) return;

    const subject = encodeURIComponent(`Check out my Route 66 trip plan: ${tripPlan.title}`);
    const body = encodeURIComponent(
      `I've planned an amazing Route 66 road trip with Ramble 66 and wanted to share it with you!\n\n` +
      `Trip: ${tripPlan.title}\n` +
      `View the full plan here: ${url}\n\n` +
      `Ramble 66 makes it easy to plan your perfect Route 66 adventure. Start planning your own trip at ${window.location.origin}\n\n` +
      `Happy travels!\n` +
      `Planned with ❤️ using Ramble 66 - Your Route 66 Adventure Starts Here`
    );
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    onClose();
  };

  return {
    isGeneratingLink,
    currentShareUrl,
    handleGenerateLink,
    handleCopyLink,
    handleShareViaEmail
  };
};
