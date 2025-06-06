
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Share2 } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import ShareTripDropdown from './ShareTripDropdown';

interface ShareTripButtonProps {
  tripPlan?: TripPlan;
  shareUrl?: string | null;
  tripStartDate?: Date;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

const ShareTripButton: React.FC<ShareTripButtonProps> = ({
  tripPlan,
  shareUrl,
  tripStartDate,
  variant = 'primary',
  size = 'default',
  className
}) => {
  // Check if trip is fully planned
  const isTripComplete = tripPlan && tripPlan.segments && tripPlan.segments.length > 0;
  
  // Generate trip title
  const tripTitle = tripPlan?.title || (tripPlan ? `${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Trip` : 'Route 66 Trip');

  // If trip is not complete, show disabled state with tooltip
  if (!isTripComplete) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={className}>
              <Button
                disabled
                variant="outline"
                size={size}
                className="opacity-50 cursor-not-allowed"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Trip
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Complete your trip planning to share</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Return the active ShareTripDropdown
  return (
    <div className={className}>
      <ShareTripDropdown
        shareUrl={shareUrl}
        tripTitle={tripTitle}
        tripPlan={tripPlan}
        tripStartDate={tripStartDate}
      />
    </div>
  );
};

export default ShareTripButton;
