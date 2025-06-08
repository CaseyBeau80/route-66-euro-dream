
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
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[10000] w-full max-w-5xl h-[calc(100vh-2rem)] px-6 py-5 bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col"
        role="dialog"
        aria-labelledby="share-trip-title"
      >
        <DialogHeader className="flex-shrink-0 pb-4 border-b border-gray-200">
          <DialogTitle id="share-trip-title" className="flex items-center gap-2 text-blue-700 font-semibold text-lg">
            Share Your Route 66 Adventure
          </DialogTitle>
        </DialogHeader>

        {/* Custom Close Button */}
        <DialogClose className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold transition-colors duration-200 z-10">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareTripModal;
