
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check, Copy } from 'lucide-react';
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
  const [currentUrl, setCurrentUrl] = useState<string>('');

  // Debug: Log component mount
  useEffect(() => {
    console.log('🔗 ShareTripButton: Component mounted with props:', {
      shareUrl,
      tripTitle,
      variant,
      size,
      showText,
      timestamp: new Date().toISOString()
    });
  }, []);

  // Set current URL on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = shareUrl || window.location.href;
      setCurrentUrl(url);
      console.log('🔗 ShareTripButton: URL set to:', url);
    }
  }, [shareUrl]);

  const handleShare = async () => {
    try {
      const urlToShare = currentUrl || (typeof window !== 'undefined' ? window.location.href : '');
      
      console.log('🔗 ShareTripButton: Attempting to copy URL:', urlToShare);
      
      if (!urlToShare) {
        console.error('❌ ShareTripButton: No URL available to share');
        toast({
          title: "Share Failed",
          description: "Unable to get URL. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(urlToShare);
        console.log('✅ ShareTripButton: Modern clipboard API successful');
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = urlToShare;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        console.log('✅ ShareTripButton: Fallback clipboard method successful');
      }

      setCopied(true);
      
      toast({
        title: "Link Copied!",
        description: "Trip link has been copied to your clipboard.",
        variant: "default"
      });
      
      // Reset copied state after 3 seconds
      setTimeout(() => {
        setCopied(false);
        console.log('🔗 ShareTripButton: Copied state reset');
      }, 3000);
      
    } catch (error) {
      console.error('❌ ShareTripButton: Share failed:', error);
      
      toast({
        title: "Share Failed",
        description: "Could not copy link. Please copy the URL manually from your browser.",
        variant: "destructive"
      });
    }
  };

  // Debug: Log render
  console.log('🔗 ShareTripButton: Rendering with state:', {
    copied,
    currentUrl,
    hasWindow: typeof window !== 'undefined',
    timestamp: new Date().toISOString()
  });

  return (
    <Button
      onClick={handleShare}
      variant={variant}
      size={size}
      className={`transition-all duration-300 hover:shadow-md flex items-center gap-2 ${className}`}
      type="button"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-600" />
          {showText && <span className="text-green-600 font-medium">Copied!</span>}
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
