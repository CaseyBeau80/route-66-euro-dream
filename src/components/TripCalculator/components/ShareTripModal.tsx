
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Settings, X } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { useShareTripOptions } from '../hooks/useShareTripOptions';
import { useShareTripModal } from './hooks/useShareTripModal';
import { useTripAutoSaveBeforeShare } from '../hooks/useTripAutoSaveBeforeShare';
import ShareTripModalContent from './share/ShareTripModalContent';
import { toast } from '@/hooks/use-toast';

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
  const { saveBeforeShare, isAutoSaving } = useTripAutoSaveBeforeShare();
  
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

  const handleGenerateLink = async (): Promise<string | null> => {
    if (!isTripComplete) return null;
    
    try {
      // Use the updated handleGenerateAndShare which integrates with TripService
      await handleGenerateAndShare();
      return currentShareUrl;
    } catch (error) {
      console.error('❌ Error generating link:', error);
      return null;
    }
  };

  const handleCopyLink = async () => {
    if (!currentShareUrl) return;
    
    try {
      await navigator.clipboard.writeText(currentShareUrl);
      toast({
        title: "Link Copied!",
        description: "Trip link has been copied to your clipboard.",
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Copy Failed",
        description: "Could not copy link to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleShareViaEmail = async () => {
    if (!currentShareUrl) {
      // Generate link first if it doesn't exist
      await handleGenerateLink();
      return;
    }

    const tripTitle = `${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Trip`;
    const emailSubject = encodeURIComponent(`Check out my Route 66 trip plan: ${tripTitle}`);
    const emailBody = encodeURIComponent(
      `Hi!\n\nI've planned an amazing Route 66 trip and wanted to share it with you!\n\n` +
      `Trip: ${tripTitle}\n` +
      `${tripPlan.totalDays} days, ${Math.round(tripPlan.totalDistance)} miles\n\n` +
      `View the complete itinerary here: ${currentShareUrl}\n\n` +
      `Planned with Ramble 66 - The ultimate Route 66 trip planner\n` +
      `Visit ramble66.com to plan your own adventure!`
    );
    
    window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] w-full max-w-6xl bg-white shadow-2xl rounded-xl max-h-[95vh] p-0 overflow-hidden"
        role="dialog"
        aria-labelledby="share-trip-title"
      >
        <DialogHeader className="sr-only">
          <DialogTitle id="share-trip-title">
            Share Your Route 66 Adventure
          </DialogTitle>
        </DialogHeader>

        {/* Fixed Header with Close Button */}
        <div className="relative flex items-center justify-between p-4 border-b bg-route66-primary text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-2">
              <Settings className="w-5 h-5 text-route66-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-route66">Share Your Route 66 Adventure</h2>
              <p className="text-sm text-route66-cream font-travel">
                Share your personalized Route 66 itinerary with friends and family
              </p>
            </div>
          </div>
          
          {/* Close Button - Absolutely positioned within header */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-route66-cream text-xl font-bold transition-colors duration-200 bg-route66-primary-dark hover:bg-route66-rust rounded-full p-2 shadow-lg"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <ShareTripModalContent
            tripPlan={tripPlan}
            tripStartDate={tripStartDate}
            currentShareUrl={currentShareUrl}
            isGeneratingLink={isGeneratingLink || isAutoSaving}
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
