
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SimpleShareButtonProps {
  title?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const SimpleShareButton: React.FC<SimpleShareButtonProps> = ({
  title = 'Route 66 Trip',
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      const currentUrl = window.location.href;
      
      console.log('🔗 SimpleShareButton: Copying URL:', currentUrl);
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = currentUrl;
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
      variant={variant}
      size={size}
      className={`transition-all duration-300 flex items-center gap-2 ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-600" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          <span>Share Trip</span>
        </>
      )}
    </Button>
  );
};

export default SimpleShareButton;
