
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { useShareTripModal } from './hooks/useShareTripModal';
import ShareTripModalContent from './share/ShareTripModalContent';

interface ShareTripModalProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string;
  isOpen: boolean;
  onClose: () => void;
  onShareUrlGenerated?: (shareCode: string, shareUrl: string) => void;
}

const ShareTripModal: React.FC<ShareTripModalProps> = ({
  tripPlan,
  tripStartDate,
  shareUrl,
  isOpen,
  onClose,
  onShareUrlGenerated
}) => {
  const {
    isGeneratingLink,
    currentShareUrl,
    handleGenerateLink,
    handleCopyLink,
    handleShareViaEmail
  } = useShareTripModal({
    tripPlan,
    shareUrl,
    onShareUrlGenerated,
    onClose
  });

  // Check if trip is complete
  const isTripComplete = tripPlan && tripPlan.segments && tripPlan.segments.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] w-full max-w-2xl px-6 py-5 bg-white shadow-2xl rounded-xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="share-trip-title"
      >
        <DialogHeader>
          <DialogTitle id="share-trip-title" className="flex items-center gap-2 text-blue-700 font-semibold text-lg">
            Share Your Route 66 Adventure
          </DialogTitle>
        </DialogHeader>

        {/* Custom Close Button */}
        <DialogClose className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold transition-colors duration-200">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <ShareTripModalContent
          tripPlan={tripPlan}
          tripStartDate={tripStartDate}
          currentShareUrl={currentShareUrl}
          isGeneratingLink={isGeneratingLink}
          isTripComplete={isTripComplete}
          onGenerateLink={handleGenerateLink}
          onCopyLink={handleCopyLink}
          onShareViaEmail={handleShareViaEmail}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ShareTripModal;
