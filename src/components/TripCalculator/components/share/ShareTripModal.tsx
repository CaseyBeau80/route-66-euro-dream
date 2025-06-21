
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { TripPlan } from '../../services/planning/TripPlanTypes';
import { useShareTripOptions } from '../../hooks/useShareTripOptions';
import { useShareTripModal } from '../hooks/useShareTripModal';
import ShareTripModalContent from './ShareTripModalContent';

interface ShareTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string;
  onShareUrlGenerated?: (shareCode: string, shareUrl: string) => void;
}

const ShareTripModal: React.FC<ShareTripModalProps> = ({
  isOpen,
  onClose,
  tripPlan,
  tripStartDate,
  shareUrl,
  onShareUrlGenerated
}) => {
  const { shareOptions } = useShareTripOptions(tripPlan);
  const [copiedLink, setCopiedLink] = useState(false);

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

  const handleCopyLink = async () => {
    if (!currentShareUrl) return;
    
    try {
      await navigator.clipboard.writeText(currentShareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleShareViaEmail = async () => {
    if (!currentShareUrl) return;
    
    const subject = encodeURIComponent(`Check out my Route 66 trip plan: ${tripPlan.title}`);
    const body = encodeURIComponent(`I planned an amazing Route 66 adventure and wanted to share it with you!\n\nView my trip: ${currentShareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  // Fix: Create a wrapper function that returns the share URL
  const handleGenerateLink = async (): Promise<string | null> => {
    await handleGenerateAndShare();
    return currentShareUrl;
  };

  const isTripComplete = tripPlan && tripPlan.segments && tripPlan.segments.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Share Your Route 66 Adventure
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

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
