
import React from 'react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import ShareTripOptions from './ShareTripOptions';
import SharedTripContentRenderer from './SharedTripContentRenderer';

interface ShareTripModalContentProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  currentShareUrl: string | null;
  isGeneratingLink: boolean;
  isTripComplete: boolean;
  onGenerateLink: () => Promise<string | null>;
  onCopyLink: () => Promise<void>;
  onShareViaEmail: () => Promise<void>;
  isSharedView?: boolean;
}

const ShareTripModalContent: React.FC<ShareTripModalContentProps> = ({
  tripPlan,
  tripStartDate,
  currentShareUrl,
  isGeneratingLink,
  isTripComplete,
  onGenerateLink,
  onCopyLink,
  onShareViaEmail,
  isSharedView = false
}) => {
  console.log('📤 ShareTripModalContent: Rendering with PDF-style content using SharedTripContentRenderer');

  if (!isTripComplete) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <p className="text-lg font-medium">Trip Not Complete</p>
          <p className="text-sm mt-2">Please create a trip plan first before sharing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black font-sans">
      {/* Rich PDF-Style Content using SharedTripContentRenderer */}
      <SharedTripContentRenderer
        tripPlan={tripPlan}
        tripStartDate={tripStartDate}
        shareUrl={currentShareUrl || undefined}
        isSharedView={isSharedView}
      />

      {/* Sharing Options - Only show in modal, not in shared view */}
      {!isSharedView && (
        <div className="mt-8 pt-6 border-t-2 border-route66-primary bg-white">
          <ShareTripOptions
            tripPlan={tripPlan}
            currentShareUrl={currentShareUrl}
            isGeneratingLink={isGeneratingLink}
            onGenerateLink={onGenerateLink}
            onCopyLink={onCopyLink}
            onShareViaEmail={onShareViaEmail}
          />
        </div>
      )}
    </div>
  );
};

export default ShareTripModalContent;
