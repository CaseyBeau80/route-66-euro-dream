
import { ExternalLinkOptions } from './externalLinkUtils';

export interface MobileAwareLinkOptions extends ExternalLinkOptions {
  forceNewTab?: boolean;
  showLoadingState?: boolean;
}

export const isMobileDevice = (): boolean => {
  // Check for touch capability and screen size
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768;
  const isMobileUserAgent = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Consider it mobile if it has touch AND (small screen OR mobile user agent)
  return hasTouch && (isSmallScreen || isMobileUserAgent);
};

export const openMobileAwareLink = (
  url: string,
  siteName: string,
  options: MobileAwareLinkOptions = {}
): void => {
  try {
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    const isMobile = isMobileDevice();
    
    console.log(`🔗 Opening mobile-aware link: ${siteName} - ${formattedUrl}`, {
      isMobile,
      forceNewTab: options.forceNewTab
    });
    
    // Store return information in session storage for mobile navigation
    if (options.returnUrl) {
      sessionStorage.setItem('ramble66_return_url', options.returnUrl);
      sessionStorage.setItem('ramble66_return_source', options.linkSource || 'map');
      sessionStorage.setItem('ramble66_original_site', siteName);
    }
    
    // Add return URL as a parameter if requested
    let finalUrl = formattedUrl;
    if (options.showReturnButton && options.returnUrl) {
      const separator = formattedUrl.includes('?') ? '&' : '?';
      finalUrl = `${formattedUrl}${separator}utm_source=ramble66&return_url=${encodeURIComponent(options.returnUrl)}`;
    }
    
    // Mobile navigation strategy: same tab unless explicitly forced to new tab
    if (isMobile && !options.forceNewTab) {
      console.log(`📱 Mobile navigation: same tab for ${siteName}`);
      
      // Show loading state if requested
      if (options.showLoadingState) {
        showMobileLoadingState(siteName);
      }
      
      // Navigate in same tab for mobile
      window.location.href = finalUrl;
    } else {
      console.log(`🖥️ Desktop navigation: new tab for ${siteName}`);
      // Desktop behavior: open in new tab
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
    }
  } catch (error) {
    console.error('Error opening mobile-aware link:', error);
    // Fallback to window.open for any errors
    window.open(url.startsWith('http') ? url : `https://${url}`, '_blank', 'noopener,noreferrer');
  }
};

const showMobileLoadingState = (siteName: string): void => {
  // Create a simple loading overlay for mobile
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'mobile-navigation-loading';
  loadingDiv.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      color: white;
      font-family: system-ui, -apple-system, sans-serif;
    ">
      <div style="text-align: center;">
        <div style="
          width: 40px;
          height: 40px;
          border: 3px solid #ffffff33;
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        "></div>
        <div>Opening ${siteName}...</div>
      </div>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  
  document.body.appendChild(loadingDiv);
  
  // Remove loading state after a short delay (in case navigation is slow)
  setTimeout(() => {
    const element = document.getElementById('mobile-navigation-loading');
    if (element) {
      element.remove();
    }
  }, 1000);
};

export const createMobileAwareReturnUrl = (): string => {
  return `${window.location.origin}${window.location.pathname}`;
};

export const shouldUseMobileNavigation = (forceNewTab?: boolean): boolean => {
  return isMobileDevice() && !forceNewTab;
};
