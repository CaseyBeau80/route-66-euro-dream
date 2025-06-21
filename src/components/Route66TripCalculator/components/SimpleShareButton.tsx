
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check } from 'lucide-react';
import { TripPlan } from '../../TripCalculator/services/planning/TripPlanTypes';

interface SimpleShareButtonProps {
  tripPlan: TripPlan;
  tripStartDate: Date;
}

const SimpleShareButton: React.FC<SimpleShareButtonProps> = ({
  tripPlan,
  tripStartDate
}) => {
  const [copied, setCopied] = useState(false);

  const generateShareUrl = () => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      startLocation: tripPlan.startCity || tripPlan.segments?.[0]?.startCity || 'Chicago',
      endLocation: tripPlan.endCity || tripPlan.segments?.[tripPlan.segments.length - 1]?.endCity || 'Santa Monica',
      travelDays: String(tripPlan.segments?.length || 7),
      tripStartDate: tripStartDate.toISOString()
    });
    
    return `${baseUrl}/trip-calculator?${params.toString()}`;
  };

  const handleShare = async () => {
    try {
      const shareUrl = generateShareUrl();
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy share URL:', error);
    }
  };

  return (
    <Button
      onClick={handleShare}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4 mr-2" />
          Share Trip
        </>
      )}
    </Button>
  );
};

export default SimpleShareButton;
