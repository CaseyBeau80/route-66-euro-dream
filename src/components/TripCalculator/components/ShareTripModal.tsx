
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Settings, X } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { useShareTripOptions } from '../hooks/useShareTripOptions';
import { useShareTripModal } from './hooks/useShareTripModal';
import ShareTripOptionsForm from './share/ShareTripOptionsForm';

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
  const { shareOptions, updateShareOption } = useShareTripOptions();
  
  const {
    isGeneratingLink,
    currentShareUrl,
    handleGenerateAndShare
  } = useShareTripModal({
    tripPlan,
    tripStartDate,
    shareUrl,
    shareOptions,
    onShareUrlGenerated,
    onClose
  });

  // Check if trip is complete
  const isTripComplete = tripPlan && tripPlan.segments && tripPlan.segments.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] w-full max-w-lg px-6 py-5 bg-white shadow-2xl rounded-xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="share-trip-title"
      >
        <DialogHeader>
          <DialogTitle id="share-trip-title" className="flex items-center gap-2 text-blue-700 font-semibold text-base sm:text-lg">
            <Settings className="w-5 h-5" />
            Share Trip Options
          </DialogTitle>
        </DialogHeader>

        {/* Custom Close Button */}
        <DialogClose className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold transition-colors duration-200">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        {!isTripComplete ? (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              <p className="text-lg font-medium">Trip Not Complete</p>
              <p className="text-sm mt-2">Please create a trip plan first before sharing.</p>
            </div>
          </div>
        ) : (
          <>
            <ShareTripOptionsForm
              shareOptions={shareOptions}
              updateShareOption={updateShareOption}
              isGeneratingLink={isGeneratingLink}
            />

            {/* Generate & Share Button */}
            <Button
              onClick={handleGenerateAndShare}
              disabled={isGeneratingLink || !isTripComplete}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 text-sm sm:text-base"
            >
              {isGeneratingLink ? 'Generating Shareable Link...' : 'Generate Shareable Link & Copy'}
            </Button>

            {/* Show current share URL if exists */}
            {currentShareUrl && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium mb-2">✅ Shareable link ready!</p>
                <p className="text-xs text-green-700 font-mono break-all">
                  {currentShareUrl}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Link copied to clipboard! Share this with friends and family.
                </p>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareTripModal;
