
import React from 'react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import ShareAndExportDropdown from './ShareAndExportDropdown';

interface ShareTripButtonProps {
  tripPlan: TripPlan;
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
  console.log('🔄 ShareTripButton rendering with:', {
    hasTripPlan: !!tripPlan,
    shareUrl,
    tripStartDate,
    variant,
    size,
    segmentsCount: tripPlan?.segments?.length || 0
  });

  const tripTitle = tripPlan.title || `${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Adventure`;

  return (
    <ShareAndExportDropdown
      shareUrl={shareUrl}
      tripTitle={tripTitle}
      tripPlan={tripPlan}
      tripStartDate={tripStartDate}
      variant={variant}
      size={size}
      className={className}
    />
  );
};

export default ShareTripButton;
