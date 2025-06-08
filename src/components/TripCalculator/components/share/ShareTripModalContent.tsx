
import React from 'react';
import { Button } from '@/components/ui/button';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import ShareTripPreview from './ShareTripPreview';
import ShareTripOptions from './ShareTripOptions';
import ShareTripStats from './ShareTripStats';

interface ShareTripModalContentProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  currentShareUrl: string | null;
  isGeneratingLink: boolean;
  isTripComplete: boolean;
  onGenerateLink: () => Promise<string | null>;
  onCopyLink: () => Promise<void>;
  onShareViaEmail: () => Promise<void>;
}

const ShareTripModalContent: React.FC<ShareTripModalContentProps> = ({
  tripPlan,
  tripStartDate,
  currentShareUrl,
  isGeneratingLink,
  isTripComplete,
  onGenerateLink,
  onCopyLink,
  onShareViaEmail
}) => {
  if (!isTripComplete) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <p className="text-lg font-medium">Trip Not Complete</p>
          <p className="text-sm mt-2">Please create a trip plan first before sharing.</p>
        </div>
        <Button disabled className="opacity-50 cursor-not-allowed">
          Share Trip
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trip Preview Section */}
      <ShareTripPreview 
        tripPlan={tripPlan} 
        tripStartDate={tripStartDate}
        currentShareUrl={currentShareUrl}
      />

      {/* Trip Statistics */}
      <ShareTripStats tripPlan={tripPlan} />

      {/* Sharing Options */}
      <ShareTripOptions
        tripPlan={tripPlan}
        currentShareUrl={currentShareUrl}
        isGeneratingLink={isGeneratingLink}
        onGenerateLink={onGenerateLink}
        onCopyLink={onCopyLink}
        onShareViaEmail={onShareViaEmail}
      />
    </div>
  );
};

export default ShareTripModalContent;
