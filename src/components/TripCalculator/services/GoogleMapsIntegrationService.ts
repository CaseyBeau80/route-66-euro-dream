
export interface EnhancedDistanceResult {
  distance: number;
  duration: number;
  isGoogleData: boolean;
  accuracy: string;
}

export class GoogleMapsIntegrationService {
  private static readonly STORAGE_KEY = 'google_maps_api_key';
  private static cachedApiKey: string | null = null;

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
    // This is now a simple check - the async loading is handled in the hook
    return true; // Always return true, let the hook handle the actual availability
  }

  static async getApiKey(): Promise<string | null> {
    console.log('🔑 GoogleMapsIntegrationService: Getting Google Maps API key from Supabase...');
    
    // Return cached key if available
    if (this.cachedApiKey) {
      console.log('✅ GoogleMapsIntegrationService: Using cached API key');
      return this.cachedApiKey;
    }
    
    try {
      console.log('🌐 GoogleMapsIntegrationService: Fetching from edge function...');
      // Fetch API key from Supabase Edge Function (now public, no auth needed)
      const response = await fetch('https://xbwaphzntaxmdfzfsmvt.supabase.co/functions/v1/get-google-maps-key', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 GoogleMapsIntegrationService: Edge function response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch API key: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log('📦 GoogleMapsIntegrationService: Edge function data:', {
        hasApiKey: !!data.apiKey,
        hasError: !!data.error,
        success: data.success,
        timestamp: data.timestamp
      });
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.apiKey) {
        this.cachedApiKey = data.apiKey;
        // Store in localStorage for hook access
        try {
          localStorage.setItem(this.STORAGE_KEY, data.apiKey);
          console.log('💾 GoogleMapsIntegrationService: API key stored in localStorage');
        } catch (error) {
          console.warn('⚠️ GoogleMapsIntegrationService: Failed to store API key in localStorage:', error);
        }
        console.log('✅ GoogleMapsIntegrationService: Successfully retrieved Google Maps API key from Supabase');
        return data.apiKey;
      }

      throw new Error('No API key returned from server');
    } catch (error) {
      console.error('❌ GoogleMapsIntegrationService: Failed to get Google Maps API key:', error);
      
      // Fallback to localStorage for backward compatibility
      try {
        const storedKey = localStorage.getItem(this.STORAGE_KEY);
        if (storedKey && storedKey.trim().length > 0) {
          console.log('⚠️ GoogleMapsIntegrationService: Using fallback API key from localStorage');
          return storedKey.trim();
        }
        console.log('🔍 GoogleMapsIntegrationService: No fallback API key in localStorage');
      } catch (storageError) {
        console.warn('⚠️ GoogleMapsIntegrationService: Failed to access localStorage:', storageError);
      }
      
      console.log('💥 GoogleMapsIntegrationService: Returning null - no API key available');
      return null;
    }
  }

  static setApiKey(apiKey: string): void {
    try {
      if (!apiKey || apiKey.trim().length === 0) {
        throw new Error('Invalid API key provided');
      }
      localStorage.setItem(this.STORAGE_KEY, apiKey.trim());
      this.cachedApiKey = apiKey.trim(); // Update cache
      console.log('✅ Google Maps API key set successfully');
    } catch (error) {
      console.error('Failed to set Google Maps API key:', error);
      throw error;
    }
  }

  static clearApiKey(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      this.cachedApiKey = null; // Clear cache
      console.log('🗑️ Google Maps API key cleared');
    } catch (error) {
      console.warn('Failed to clear Google Maps API key:', error);
    }
  }
}
