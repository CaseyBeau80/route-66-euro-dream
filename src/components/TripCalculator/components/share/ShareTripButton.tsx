
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check, Link } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ShareTripButtonProps {
  shareUrl?: string;
  tripTitle?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  showText?: boolean;
}

const ShareTripButton: React.FC<ShareTripButtonProps> = ({
  shareUrl,
  tripTitle = 'Route 66 Trip',
  variant = 'outline',
  size = 'sm',
  className = '',
  showText = true
}) => {
  const [copied, setCopied] = useState(false);
  
  // Use current URL if no shareUrl provided
  const urlToShare = shareUrl || window.location.href;

  const handleShare = async () => {
    try {
      // Try native share API first (mobile devices)
      if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        await navigator.share({
          title: tripTitle,
          text: `Check out my Route 66 trip plan: ${tripTitle}`,
          url: urlToShare,
        });
        return;
      }
      
      // Fallback to clipboard
      await navigator.clipboard.writeText(urlToShare);
      setCopied(true);
      
      toast({
        title: "Link Copied!",
        description: "Trip link has been copied to your clipboard.",
        variant: "default"
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
      
    } catch (error) {
      console.error('Share failed:', error);
      
      // Manual fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = urlToShare;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        setCopied(true);
        toast({
          title: "Link Copied!",
          description: "Trip link has been copied to your clipboard.",
          variant: "default"
        });
        
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        toast({
          title: "Share Failed",
          description: "Could not copy link. Please copy the URL manually from your browser.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant={variant}
      size={size}
      className={`transition-all duration-300 hover:shadow-md ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-600" />
          {showText && <span className="ml-2">Copied!</span>}
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          {showText && <span className="ml-2">Share</span>}
        </>
      )}
    </Button>
  );
};

export default ShareTripButton;
