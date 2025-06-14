
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { UrlTripPlanBuilder } from '../services/planning/UrlTripPlanBuilder';

interface TripShareButtonProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  useLiveWeather?: boolean;
  className?: string;
}

const TripShareButton: React.FC<TripShareButtonProps> = ({
  tripPlan,
  tripStartDate,
  useLiveWeather = true,
  className = ""
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      const shareUrl = UrlTripPlanBuilder.generateShareUrl(
        tripPlan,
        tripStartDate,
        useLiveWeather
      );

      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      
      toast({
        title: "Share Link Copied!",
        description: "Anyone with this link can view your trip plan with live weather forecasts.",
        variant: "default"
      });

      // Reset copy state after 2 seconds
      setTimeout(() => setCopied(false), 2000);

    } catch (error) {
      console.error('Failed to copy share URL:', error);
      
      toast({
        title: "Failed to Copy Link",
        description: "Please try again or copy the URL manually from your browser.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      size="sm"
      className={`gap-2 ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-600" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          Share Trip
        </>
      )}
    </Button>
  );
};

export default TripShareButton;
