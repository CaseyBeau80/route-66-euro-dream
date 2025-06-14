
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check } from 'lucide-react';

interface ShareTripButtonProps {
  onShare?: () => void;
  shareUrl?: string | null;
  isGenerating?: boolean;
}

const ShareTripButton: React.FC<ShareTripButtonProps> = ({
  onShare,
  shareUrl,
  isGenerating = false
}) => {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    } else if (onShare) {
      onShare();
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isGenerating}
      className="bg-route66-primary hover:bg-route66-primary/90 text-white px-6 py-2"
    >
      {isGenerating ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Generating...
        </>
      ) : copied ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Copied!
        </>
      ) : shareUrl ? (
        <>
          <Copy className="w-4 h-4 mr-2" />
          Copy Link
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4 mr-2" />
          Share Trip
        </>
      )}
    </Button>
  );
};

export default ShareTripButton;
