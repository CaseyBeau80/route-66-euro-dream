
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ShareTripActionsProps {
  shareUrl?: string | null;
  tripTitle: string;
}

const ShareTripActions: React.FC<ShareTripActionsProps> = ({ shareUrl, tripTitle }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
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

  const handleShare = async () => {
    if (!shareUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: tripTitle,
          text: `Check out my Route 66 trip plan: ${tripTitle}`,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback to copy
      handleCopyLink();
    }
  };

  const handleExportPDF = () => {
    // Simple PDF export using browser print
    window.print();
  };

  if (!shareUrl) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center mt-6 p-4 bg-route66-vintage-beige rounded-lg border border-route66-tan">
      <Button
        onClick={handleShare}
        className="bg-route66-primary hover:bg-route66-rust text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
      >
        <Share2 className="w-4 h-4" />
        Share Trip
      </Button>
      
      <Button
        onClick={handleCopyLink}
        variant="outline"
        className="border-route66-vintage-brown text-route66-vintage-brown hover:bg-route66-vintage-brown hover:text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy Link
          </>
        )}
      </Button>
      
      <Button
        onClick={handleExportPDF}
        variant="outline"
        className="border-route66-vintage-brown text-route66-vintage-brown hover:bg-route66-vintage-brown hover:text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
      >
        <Download className="w-4 h-4" />
        Export PDF
      </Button>
    </div>
  );
};

export default ShareTripActions;
