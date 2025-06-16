
export interface GoogleDistanceResult {
  distance: number; // in miles
  duration: number; // in hours
  status: string;
}

export interface GoogleDistanceResponse {
  results: GoogleDistanceResult[][];
  status: string;
}

export class GoogleDistanceMatrixService {
  private static apiKey: string | null = null;
  private static cache = new Map<string, GoogleDistanceResult>();

  static setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('google_maps_api_key', key);
  }

  static getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('google_maps_api_key');
    }
    return this.apiKey;
  }

  static isAvailable(): boolean {
    return !!this.getApiKey();
  }

  private static getCacheKey(origin: string, destination: string): string {
    return `${origin}-${destination}`;
  }

  static async calculateDistance(
    originCity: string,
    destinationCity: string
  ): Promise<GoogleDistanceResult> {
    const cacheKey = this.getCacheKey(originCity, destinationCity);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      console.log(`📊 Using cached distance for ${originCity} → ${destinationCity}`);
      return this.cache.get(cacheKey)!;
    }

    const apiKey = this.getApiKey();
    if (!apiKey) {
      console.warn('⚠️ Google Maps API key not available, using fallback calculation');
      return this.getFallbackDistance(originCity, destinationCity);
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?` +
        `origins=${encodeURIComponent(originCity)}&` +
        `destinations=${encodeURIComponent(destinationCity)}&` +
        `units=imperial&` +
        `mode=driving&` +
        `key=${apiKey}`;

      console.log(`🗺️ Fetching distance: ${originCity} → ${destinationCity}`);
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK') {
        console.warn(`⚠️ Distance Matrix API status: ${data.status}, using fallback`);
        return this.getFallbackDistance(originCity, destinationCity);
      }

      const element = data.rows[0].elements[0];
      
      if (element.status !== 'OK') {
        console.warn(`⚠️ Route calculation failed: ${element.status}, using fallback`);
        return this.getFallbackDistance(originCity, destinationCity);
      }

      const result: GoogleDistanceResult = {
        distance: Math.round(element.distance.value * 0.000621371), // Convert meters to miles
        duration: element.duration.value / 3600, // Convert seconds to hours
        status: 'OK'
      };

      // Cache the result
      this.cache.set(cacheKey, result);
      
      console.log(`✅ Route segment: ${originCity} → ${destinationCity} = ${result.distance} miles, ${this.formatDuration(result.duration)} drive time`);
      
      return result;
    } catch (error) {
      console.error(`❌ Error calculating distance ${originCity} → ${destinationCity}:`, error);
      return this.getFallbackDistance(originCity, destinationCity);
    }
  }

  private static getFallbackDistance(originCity: string, destinationCity: string): GoogleDistanceResult {
    // Fallback calculation using approximate Route 66 segment distances
    const estimatedMiles = 250; // Average Route 66 daily segment
    const estimatedHours = estimatedMiles / 60; // 60 mph average speed
    
    console.log(`🔄 Using fallback calculation: ${originCity} → ${destinationCity} = ${estimatedMiles} miles, ${this.formatDuration(estimatedHours)}`);
    
    return {
      distance: estimatedMiles,
      duration: estimatedHours,
      status: 'FALLBACK'
    };
  }

  static async calculateRouteSegments(segments: Array<{startCity: string, endCity: string}>): Promise<{
    totalDistance: number;
    totalDuration: number;
    segmentResults: GoogleDistanceResult[];
  }> {
    console.log(`🛣️ Calculating Route 66 distances for ${segments.length} segments`);

    const segmentResults: GoogleDistanceResult[] = [];
    let totalDistance = 0;
    let totalDuration = 0;

    // Calculate distance for each segment
    for (let i = 0; i < segments.length; i++) {
      try {
        const segment = segments[i];
        const result = await this.calculateDistance(segment.startCity, segment.endCity);
        segmentResults.push(result);
        totalDistance += result.distance;
        totalDuration += result.duration;
        
        // Small delay to respect API rate limits
        if (i < segments.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`❌ Failed to calculate segment ${segments[i].startCity} → ${segments[i].endCity}:`, error);
        // Use fallback for failed segments
        const fallback = this.getFallbackDistance(segments[i].startCity, segments[i].endCity);
        segmentResults.push(fallback);
        totalDistance += fallback.distance;
        totalDuration += fallback.duration;
      }
    }

    console.log(`🏁 Total Route 66 journey: ${totalDistance} miles, ${this.formatDuration(totalDuration)} drive time`);

    return {
      totalDistance,
      totalDuration,
      segmentResults
    };
  }

  static formatDuration(hours: number): string {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (wholeHours === 0) {
      return `${minutes}m`;
    }
    
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  }

  static clearCache() {
    this.cache.clear();
    console.log('🗑️ Distance Matrix cache cleared');
  }
}
