
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { TripPlan } from '../services/planning/TripPlanBuilder';

interface DirectShareButtonProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  className?: string;
}

const DirectShareButton: React.FC<DirectShareButtonProps> = ({
  tripPlan,
  tripStartDate,
  className = ""
}) => {
  const [copied, setCopied] = useState(false);

  const generateDirectShareUrl = (): string => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams();

    // Embed all trip data directly in URL
    params.set('title', tripPlan.title || `${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Trip`);
    params.set('startCity', tripPlan.startCity || tripPlan.segments[0]?.startCity || '');
    params.set('endCity', tripPlan.endCity || tripPlan.segments[tripPlan.segments.length - 1]?.endCity || '');
    params.set('totalDays', tripPlan.totalDays.toString());
    params.set('totalDistance', tripPlan.totalDistance.toString());
    
    if (tripStartDate) {
      params.set('tripStartDate', tripStartDate.toISOString().split('T')[0]);
    }

    // Encode segments data
    const segmentsData = tripPlan.segments.map(segment => ({
      day: segment.day,
      startCity: segment.startCity,
      endCity: segment.endCity,
      distance: segment.distance,
      drivingTime: segment.drivingTime
    }));
    
    params.set('segments', JSON.stringify(segmentsData));
    
    return `${baseUrl}/direct-trip?${params.toString()}`;
  };

  const handleDirectShare = async () => {
    try {
      const shareUrl = generateDirectShareUrl();
      
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      
      toast({
        title: "Share Link Copied!",
        description: "Direct trip link copied to clipboard - live weather guaranteed!",
        variant: "default"
      });

      setTimeout(() => setCopied(false), 2000);

    } catch (error) {
      console.error('Failed to copy share URL:', error);
      
      toast({
        title: "Failed to Copy Link",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      onClick={handleDirectShare}
      variant="default"
      className={`gap-2 bg-green-600 hover:bg-green-700 text-white ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-white" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          Share Trip (New)
        </>
      )}
    </Button>
  );
};

export default DirectShareButton;
