
export interface EnhancedDistanceResult {
  distance: number;
  duration: number;
  isGoogleData: boolean;
  accuracy: string;
}

export class GoogleMapsIntegrationService {
  private static readonly STORAGE_KEY = 'google_maps_api_key';

  static async validateRoute(startLocation: string, endLocation: string): Promise<boolean> {
    // Stub implementation
    console.log('🗺️ GoogleMapsIntegrationService: validateRoute stub called');
    return true;
  }

  static async calculateDistance(start: any, end: any): Promise<EnhancedDistanceResult> {
    // Stub implementation
    console.log('🗺️ GoogleMapsIntegrationService: calculateDistance stub called');
    return {
      distance: 250, // Mock distance
      duration: 14400, // Mock duration in seconds (4 hours)
      isGoogleData: false,
      accuracy: 'estimated'
    };
  }

  static isAvailable(): boolean {
    const apiKey = this.getApiKey();
    return !!apiKey && apiKey.trim().length > 0;
  }

  static getApiKey(): string | null {
    // Priority: Environment Variable > localStorage > hardcoded fallback
    
    // 1. Check environment variable first
    const envKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '';
    if (envKey && envKey.trim() !== '' && envKey !== 'your_google_maps_api_key_here') {
      console.log('🔑 GoogleMapsIntegration using API key from environment variable');
      return envKey.trim();
    }
    
    // 2. Check localStorage as fallback
    try {
      const storedKey = localStorage.getItem(this.STORAGE_KEY);
      if (storedKey && storedKey.trim() !== '') {
        console.log('🔑 GoogleMapsIntegration using API key from localStorage');
        return storedKey.trim();
      }
    } catch (error) {
      console.warn('Failed to retrieve Google Maps API key from localStorage:', error);
    }
    
    // 3. Use hardcoded key as last resort
    const hardcodedApiKey = 'AIzaSyCj2hJjT8wA0G3gBmUaK7qmhKX8Uv3mDH8';
    if (hardcodedApiKey && hardcodedApiKey.trim() !== '') {
      console.log('🔑 GoogleMapsIntegration using hardcoded API key fallback');
      return hardcodedApiKey.trim();
    }
    
    console.warn('❌ GoogleMapsIntegration: No API key available');
    return null;
  }

  static setApiKey(apiKey: string): void {
    try {
      if (!apiKey || apiKey.trim().length === 0) {
        throw new Error('Invalid API key provided');
      }
      localStorage.setItem(this.STORAGE_KEY, apiKey.trim());
      console.log('✅ Google Maps API key set successfully');
    } catch (error) {
      console.error('Failed to set Google Maps API key:', error);
      throw error;
    }
  }

  static clearApiKey(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('🗑️ Google Maps API key cleared');
    } catch (error) {
      console.warn('Failed to clear Google Maps API key:', error);
    }
  }
}
