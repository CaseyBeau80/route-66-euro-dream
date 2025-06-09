
/**
 * Centralized logo configuration for the Ramble 66 application
 * This ensures consistent logo usage across all components
 */

export const RAMBLE_LOGO_CONFIG = {
  // Primary logo URL - the official Ramble 66 logo
  PRIMARY_LOGO_URL: "https://xbwaphzntaxmdfzfsmvt.supabase.co/storage/v1/object/public/route66-assets/Logo_1_Ramble_66.png",
  
  // Fallback logo URL in case primary fails
  FALLBACK_LOGO_URL: "https://via.placeholder.com/64x64/1e40af/ffffff?text=R66",
  
  // Alt text variations for different contexts
  ALT_TEXT: {
    default: "Ramble 66 Logo",
    navigation: "Ramble Route 66 logo", 
    branding: "Ramble 66 - Route 66 Trip Planner",
    social: "Ramble 66 - Your Route 66 Adventure Starts Here"
  },
  
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
export const getRambleLogoUrl = (useFallback = false) => {
  const url = useFallback ? RAMBLE_LOGO_CONFIG.FALLBACK_LOGO_URL : RAMBLE_LOGO_CONFIG.PRIMARY_LOGO_URL;
  console.log('🎯 getRambleLogoUrl: Loading Ramble 66 logo', {
    url,
    useFallback,
    caller: new Error().stack?.split('\n')[2]?.trim() || 'unknown'
  });
  return url;
};

/**
 * Get alt text for logo based on context
 */
export const getRambleLogoAlt = (context: keyof typeof RAMBLE_LOGO_CONFIG.ALT_TEXT = 'default') => {
  const altText = RAMBLE_LOGO_CONFIG.ALT_TEXT[context];
  console.log('🎯 getRambleLogoAlt: Getting alt text', { context, altText });
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
  console.log('🔍 getBestLogoUrl: Testing primary logo URL', { primaryUrl });
  
  const isAccessible = await testLogoUrl(primaryUrl);
  
  if (isAccessible) {
    console.log('✅ getBestLogoUrl: Primary logo URL is accessible', { primaryUrl });
    return primaryUrl;
  } else {
    const fallbackUrl = getRambleLogoUrl(true);
    console.warn('⚠️ getBestLogoUrl: Primary logo URL not accessible, using fallback', { 
      primaryUrl, 
      fallbackUrl 
    });
    return fallbackUrl;
  }
};
