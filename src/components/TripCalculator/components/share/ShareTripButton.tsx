
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ShareTripButtonProps {
  title?: string;
  tripTitle?: string; // Added to support tripTitle prop
  shareUrl?: string; // Added to support shareUrl prop
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  showText?: boolean;
}

const ShareTripButton: React.FC<ShareTripButtonProps> = ({
  title,
  tripTitle, // New prop
  shareUrl, // New prop
  variant = 'default',
  size = 'default',
  className = '',
  showText = true
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      // Use shareUrl if provided, otherwise fall back to current URL
      const urlToShare = shareUrl || window.location.href;
      // Use tripTitle or title for the toast message
      const displayTitle = tripTitle || title || 'Route 66 Trip';
      
      console.log('🔗 ShareTripButton: Copying URL:', urlToShare);
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(urlToShare);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = urlToShare;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopied(true);
      
      toast({
        title: "Trip Link Copied!",
        description: `Your ${displayTitle} link has been copied to the clipboard. Share it with friends and family!`,
        variant: "default"
      });
      
      setTimeout(() => setCopied(false), 3000);
      
    } catch (error) {
      console.error('❌ Share failed:', error);
      
      toast({
        title: "Share Failed",
        description: "Could not copy link. Please copy the URL manually from your browser.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant={variant}
      size={size}
      className={`transition-all duration-300 flex items-center gap-2 ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-600" />
          {showText && <span>Copied!</span>}
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          {showText && <span>Share Trip</span>}
        </>
      )}
    </Button>
  );
};

export default ShareTripButton;
