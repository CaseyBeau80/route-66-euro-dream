
/**
 * Centralized logo configuration for the Ramble 66 application
 * This ensures consistent logo usage across all components
 */

export const RAMBLE_LOGO_CONFIG = {
  // Primary logo URL - the official Ramble 66 logo
  PRIMARY_LOGO_URL: "https://xbwaphzntaxmdfzfsmvt.supabase.co/storage/v1/object/public/route66-assets/Logo_1_Ramble_66.png",
  
  // Alt text - standardized to "Ramble 66 Logo"
  ALT_TEXT: "Ramble 66 Logo",
  
  // Standard size classes for consistent sizing
  SIZES: {
    sm: "w-5 h-5",
    md: "w-8 h-8", 
    lg: "w-10 h-10",
    xl: "w-12 h-12"
  }
} as const;

/**
 * Get the primary logo URL - use this throughout the application
 */
export const getRambleLogoUrl = () => {
  const url = RAMBLE_LOGO_CONFIG.PRIMARY_LOGO_URL;
  console.log('🎯 getRambleLogoUrl: Loading Ramble 66 logo', {
    url,
    caller: new Error().stack?.split('\n')[2]?.trim() || 'unknown'
  });
  return url;
};

/**
 * Get standardized alt text for logo
 */
export const getRambleLogoAlt = () => {
  const altText = RAMBLE_LOGO_CONFIG.ALT_TEXT;
  console.log('🎯 getRambleLogoAlt: Getting alt text', { altText });
  return altText;
};

/**
 * Get size classes for logo
 */
export const getRambleLogoSize = (size: keyof typeof RAMBLE_LOGO_CONFIG.SIZES) => {
  const sizeClasses = RAMBLE_LOGO_CONFIG.SIZES[size];
  console.log('🎯 getRambleLogoSize: Getting size classes', { size, sizeClasses });
  return sizeClasses;
};

/**
 * Test if the logo URL is accessible
 */
export const testLogoUrl = async (url: string): Promise<boolean> => {
  try {
    console.log('🧪 testLogoUrl: Testing logo URL accessibility', { url });
    const response = await fetch(url, { method: 'HEAD' });
    const isAccessible = response.ok;
    console.log('🧪 testLogoUrl: Test result', { url, isAccessible, status: response.status });
    return isAccessible;
  } catch (error) {
    console.error('❌ testLogoUrl: Logo URL test failed', { url, error });
    return false;
  }
};

/**
 * Get the best available logo URL (with fallback logic)
 */
export const getBestLogoUrl = async (): Promise<string> => {
  const primaryUrl = getRambleLogoUrl();
  console.log('🔍 getBestLogoUrl: Using primary logo URL', { primaryUrl });
  return primaryUrl;
};
