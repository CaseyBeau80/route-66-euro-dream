
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link, Copy, Check, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { UrlTripPlanBuilder } from '../services/planning/UrlTripPlanBuilder';

interface ImprovedUrlShareButtonProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  className?: string;
}

const ImprovedUrlShareButton: React.FC<ImprovedUrlShareButtonProps> = ({
  tripPlan,
  tripStartDate,
  className = ""
}) => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateUrlLink = async () => {
    if (isGenerating) return;

    try {
      setIsGenerating(true);
      
      console.log('🔗 Generating simple URL link with trip parameters...');
      
      // Use the UrlTripPlanBuilder to create a clean URL with parameters
      const shareUrl = UrlTripPlanBuilder.generateShareUrl(
        tripPlan,
        tripStartDate,
        true // useLiveWeather
      );

      console.log('✅ Generated share URL:', shareUrl);

      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      
      toast({
        title: "Trip URL Generated!",
        description: "Your trip link has been copied to clipboard. Anyone can view your trip plan with this link.",
        variant: "default"
      });

      setTimeout(() => setCopied(false), 3000);

    } catch (error) {
      console.error('❌ Failed to generate URL link:', error);
      
      toast({
        title: "Failed to Generate Link",
        description: "Could not create trip URL. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleGenerateUrlLink}
        disabled={isGenerating}
        className={`gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium ${className}`}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            URL Copied!
          </>
        ) : isGenerating ? (
          <>
            <Link className="w-4 h-4 animate-pulse" />
            Generating URL...
          </>
        ) : (
          <>
            <Link className="w-4 h-4" />
            Generate Trip URL
          </>
        )}
      </Button>
      
      {copied && (
        <div className="text-xs text-green-600 flex items-center gap-1">
          <Check className="w-3 h-3" />
          Trip URL copied to clipboard - ready to share!
        </div>
      )}
    </div>
  );
};

export default ImprovedUrlShareButton;
