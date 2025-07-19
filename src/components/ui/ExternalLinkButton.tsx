
import React from 'react';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openExternalLinkWithHistory, createReturnToMapUrl } from '@/utils/externalLinkUtils';

interface ExternalLinkButtonProps {
  url: string;
  children: React.ReactNode;
  siteName: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showReturnOption?: boolean;
  linkSource?: string;
}

export const ExternalLinkButton: React.FC<ExternalLinkButtonProps> = ({
  url,
  children,
  siteName,
  className = '',
  variant = 'default',
  size = 'default',
  showReturnOption = true,
  linkSource = 'map'
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    openExternalLinkWithHistory(url, siteName, {
      returnUrl: createReturnToMapUrl(),
      linkSource,
      showReturnButton: showReturnOption
    });
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
    >
      {children}
      <ExternalLink className="h-4 w-4 opacity-70" />
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
