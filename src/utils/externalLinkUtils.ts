
export interface ExternalLinkOptions {
  returnUrl?: string;
  linkSource?: string;
  showReturnButton?: boolean;
}

export const openExternalLinkWithHistory = (
  url: string, 
  siteName: string,
  options: ExternalLinkOptions = {}
): void => {
  try {
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    
    console.log(`🔗 Opening external link: ${siteName} - ${formattedUrl}`);
    
    // Store return information in session storage for potential return navigation
    if (options.returnUrl) {
      sessionStorage.setItem('ramble66_return_url', options.returnUrl);
      sessionStorage.setItem('ramble66_return_source', options.linkSource || 'map');
    }
    
    // Add return URL as a parameter if requested
    let finalUrl = formattedUrl;
    if (options.showReturnButton && options.returnUrl) {
      const separator = formattedUrl.includes('?') ? '&' : '?';
      finalUrl = `${formattedUrl}${separator}utm_source=ramble66&return_url=${encodeURIComponent(options.returnUrl)}`;
    }
    
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.error('Error opening external link:', error);
  }
};

export const createReturnToMapUrl = (): string => {
  return `${window.location.origin}${window.location.pathname}`;
};

export const shouldShowExternalLinkIcon = (url?: string): boolean => {
  if (!url) return false;
  const currentDomain = window.location.hostname;
  try {
    const linkDomain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    return linkDomain !== currentDomain;
  } catch {
    return true; // Assume external if URL parsing fails
  }
};
