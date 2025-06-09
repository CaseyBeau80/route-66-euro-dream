
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanBuilder';

interface ShareActionsProps {
  shareUrl: string | null;
  onShareTrip: (tripPlan: TripPlan) => Promise<void>;
  tripPlan: TripPlan;
  copiedStates: {
    shareUrl: boolean;
  };
  onCopyToClipboard: (text: string, type: 'shareUrl') => void;
  isSharing: boolean;
}

const ShareActions: React.FC<ShareActionsProps> = ({
  shareUrl,
  onShareTrip,
  tripPlan,
  copiedStates,
  onCopyToClipboard,
  isSharing
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-route66-text-primary">
        <Share2 className="h-4 w-4" />
        Share Your Trip
      </div>
      
      {!shareUrl ? (
        <Button
          onClick={() => onShareTrip(tripPlan)}
          disabled={isSharing}
          className="w-full bg-route66-primary hover:bg-route66-rust text-white"
        >
          <Share2 className="h-4 w-4 mr-2" />
          {isSharing ? 'Creating Share Link...' : 'Create Share Link'}
        </Button>
      ) : (
        <div className="space-y-2">
          <div className="p-3 bg-route66-background-alt rounded border border-route66-border">
            <div className="text-xs text-route66-text-secondary mb-1">Share Link:</div>
            <div className="text-sm text-route66-text-primary break-all font-mono">
              {shareUrl}
            </div>
          </div>
          
          <Button
            onClick={() => onCopyToClipboard(shareUrl, 'shareUrl')}
            variant="outline"
            className="w-full"
          >
            {copiedStates.shareUrl ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Share Link
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ShareActions;
