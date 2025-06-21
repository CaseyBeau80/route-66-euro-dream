
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SimpleTripShareButtonProps {
  tripTitle?: string;
  className?: string;
}

const SimpleTripShareButton: React.FC<SimpleTripShareButtonProps> = ({
  tripTitle = 'Route 66 Trip',
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      const currentUrl = window.location.href;
      
      console.log('📋 SimpleTripShareButton: Copying URL:', currentUrl);
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = currentUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopied(true);
      
      toast({
        title: "Trip Link Copied!",
        description: "Your trip link has been copied to the clipboard. Share it with friends and family!",
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
      className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-5 h-5 mr-3 text-green-300" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="w-5 h-5 mr-3" />
          Share This Trip
        </>
      )}
    </Button>
  );
};

export default SimpleTripShareButton;
