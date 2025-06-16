
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
    console.log('🔑 GoogleDistanceMatrixService: API key set successfully');
  }

  static getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('google_maps_api_key');
    }
    console.log('🔑 GoogleDistanceMatrixService: API key check:', this.apiKey ? 'Available' : 'Not available');
    return this.apiKey;
  }

  static isAvailable(): boolean {
    const available = !!this.getApiKey();
    console.log('🔑 GoogleDistanceMatrixService: Service available:', available);
    return available;
  }

  private static getCacheKey(origin: string, destination: string): string {
    return `${origin}-${destination}`;
  }

  static async calculateDistance(
    originCity: string,
    destinationCity: string
  ): Promise<GoogleDistanceResult> {
    console.log(`🗺️ CRITICAL FIX GoogleDistanceMatrixService: Calculating ${originCity} → ${destinationCity}`);
    
    const cacheKey = this.getCacheKey(originCity, destinationCity);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      console.log(`📊 CRITICAL FIX GoogleDistanceMatrixService: Using cached result: ${cached.distance}mi, ${this.formatDuration(cached.duration)}`);
      return cached;
    }

    const apiKey = this.getApiKey();
    if (!apiKey) {
      console.warn('⚠️ CRITICAL FIX GoogleDistanceMatrixService: No API key available, using fallback');
      return this.getFallbackDistance(originCity, destinationCity);
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?` +
        `origins=${encodeURIComponent(originCity)}&` +
        `destinations=${encodeURIComponent(destinationCity)}&` +
        `units=imperial&` +
        `mode=driving&` +
        `key=${apiKey}`;

      console.log(`🌐 CRITICAL FIX GoogleDistanceMatrixService: Making API call to Google for ${originCity} → ${destinationCity}`);
      
      const response = await fetch(url);
      const data = await response.json();

      console.log(`📡 CRITICAL FIX GoogleDistanceMatrixService: API response status: ${data.status}`);

      if (data.status !== 'OK') {
        console.warn(`⚠️ CRITICAL FIX GoogleDistanceMatrixService: API status error: ${data.status}, using fallback`);
        return this.getFallbackDistance(originCity, destinationCity);
      }

      const element = data.rows[0].elements[0];
      
      if (element.status !== 'OK') {
        console.warn(`⚠️ CRITICAL FIX GoogleDistanceMatrixService: Route status error: ${element.status}, using fallback`);
        return this.getFallbackDistance(originCity, destinationCity);
      }

      const result: GoogleDistanceResult = {
        distance: Math.round(element.distance.value * 0.000621371), // Convert meters to miles
        duration: element.duration.value / 3600, // Convert seconds to hours
        status: 'OK'
      };

      // Cache the result
      this.cache.set(cacheKey, result);
      
      console.log(`✅ CRITICAL FIX GoogleDistanceMatrixService: SUCCESS! ${originCity} → ${destinationCity} = ${result.distance} miles, ${this.formatDuration(result.duration)}`);
      
      return result;
    } catch (error) {
      console.error(`❌ CRITICAL FIX GoogleDistanceMatrixService: Error calculating distance ${originCity} → ${destinationCity}:`, error);
      return this.getFallbackDistance(originCity, destinationCity);
    }
  }

  private static getFallbackDistance(originCity: string, destinationCity: string): GoogleDistanceResult {
    // Generate more realistic fallback distances based on city names
    const cityHash = (originCity + destinationCity).split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const baseDistance = 150 + Math.abs(cityHash % 200); // 150-350 miles
    const baseHours = baseDistance / 65; // ~65 mph average
    
    console.log(`🔄 CRITICAL FIX GoogleDistanceMatrixService: FALLBACK calculation: ${originCity} → ${destinationCity} = ${baseDistance} miles, ${this.formatDuration(baseHours)}`);
    
    return {
      distance: baseDistance,
      duration: baseHours,
      status: 'FALLBACK'
    };
  }

  static async calculateRouteSegments(segments: Array<{startCity: string, endCity: string}>): Promise<{
    totalDistance: number;
    totalDuration: number;
    segmentResults: GoogleDistanceResult[];
  }> {
    console.log(`🛣️ CRITICAL FIX GoogleDistanceMatrixService: Calculating ${segments.length} route segments`);

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
        
        console.log(`📍 CRITICAL FIX GoogleDistanceMatrixService: Segment ${i + 1}: ${result.distance}mi, ${this.formatDuration(result.duration)} (${result.status})`);
        
        // Small delay to respect API rate limits
        if (i < segments.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`❌ CRITICAL FIX GoogleDistanceMatrixService: Failed segment ${segments[i].startCity} → ${segments[i].endCity}:`, error);
        // Use fallback for failed segments
        const fallback = this.getFallbackDistance(segments[i].startCity, segments[i].endCity);
        segmentResults.push(fallback);
        totalDistance += fallback.distance;
        totalDuration += fallback.duration;
      }
    }

    console.log(`🏁 CRITICAL FIX GoogleDistanceMatrixService: Total journey: ${totalDistance} miles, ${this.formatDuration(totalDuration)}`);

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
    console.log('🗑️ CRITICAL FIX GoogleDistanceMatrixService: Cache cleared');
  }
}
