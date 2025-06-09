
/**
 * Centralized logo configuration for the Ramble 66 application
 * This ensures consistent logo usage across all components
 */

export const RAMBLE_LOGO_CONFIG = {
  // Primary logo URL - the official Ramble 66 logo
  PRIMARY_LOGO_URL: "https://xbwaphzntaxmdfzfsmvt.supabase.co/storage/v1/object/public/route66-assets/Logo_1_Ramble_66.png",
  
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
export const getRambleLogoUrl = () => RAMBLE_LOGO_CONFIG.PRIMARY_LOGO_URL;

/**
 * Get alt text for logo based on context
 */
export const getRambleLogoAlt = (context: keyof typeof RAMBLE_LOGO_CONFIG.ALT_TEXT = 'default') => 
  RAMBLE_LOGO_CONFIG.ALT_TEXT[context];

/**
 * Get size classes for logo
 */
export const getRambleLogoSize = (size: keyof typeof RAMBLE_LOGO_CONFIG.SIZES) => 
  RAMBLE_LOGO_CONFIG.SIZES[size];
