import React from 'react';
import { ExternalLink, ArrowLeft, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openMobileAwareLink, createMobileAwareReturnUrl, isMobileDevice } from '@/utils/mobileAwareLinkUtils';

interface ExternalLinkButtonProps {
  url: string;
  children: React.ReactNode;
  siteName: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showReturnOption?: boolean;
  linkSource?: string;
  forceNewTab?: boolean;
}

export const ExternalLinkButton: React.FC<ExternalLinkButtonProps> = ({
  url,
  children,
  siteName,
  className = '',
  variant = 'default',
  size = 'default',
  showReturnOption = true,
  linkSource = 'map',
  forceNewTab = false
}) => {
  const isMobile = isMobileDevice();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    openMobileAwareLink(url, siteName, {
      returnUrl: createMobileAwareReturnUrl(),
      linkSource,
      showReturnButton: showReturnOption,
      forceNewTab,
      showLoadingState: true
    });
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
      title={isMobile && !forceNewTab ? 'Opens in same tab (mobile)' : 'Opens in new tab'}
    >
      {children}
      <div className="flex items-center gap-1">
        <ExternalLink className="h-4 w-4 opacity-70" />
        {/* Show navigation hint icon */}
        {isMobile && !forceNewTab ? (
          <Smartphone className="h-3 w-3 opacity-50" />
        ) : (
          <Monitor className="h-3 w-3 opacity-50" />
        )}
      </div>
    </Button>
  );
};

interface ReturnToMapButtonProps {
  className?: string;
  onReturn?: () => void;
}

export const ReturnToMapButton: React.FC<ReturnToMapButtonProps> = ({
  className = '',
  onReturn
}) => {
  const handleReturn = () => {
    const returnUrl = sessionStorage.getItem('ramble66_return_url');
    if (returnUrl) {
      window.location.href = returnUrl;
    } else {
      window.location.href = '/';
    }
    onReturn?.();
  };

  return (
    <Button
      onClick={handleReturn}
      variant="outline"
      size="sm"
      className={`flex items-center gap-2 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      Return to Route 66 Map
    </Button>
  );
};
