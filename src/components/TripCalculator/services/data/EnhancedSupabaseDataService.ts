
import { SupabaseConnectionService } from './SupabaseConnectionService';
import { TripStop as UnifiedTripStop } from "../../types/TripStop";

export interface DataSourceInfo {
  isUsingSupabase: boolean;
  fallbackReason?: string;
  connectionStatus?: string;
  citiesAvailable: number;
  lastUpdated: Date;
}

export class EnhancedSupabaseDataService {
  private static dataSourceInfo: DataSourceInfo | null = null;

  /**
   * Get all stops - alias for fetchAllStops for compatibility
   */
  static async getAllStops(): Promise<UnifiedTripStop[]> {
    console.log('🔍 Enhanced: getAllStops called - delegating to fetchAllStops');
    return this.fetchAllStops();
  }

  /**
   * Fetch ONLY destination cities - NO waypoints allowed
   */
  static async fetchAllStops(): Promise<UnifiedTripStop[]> {
    console.log('🏛️ ENHANCED: Fetching ONLY destination cities (NO waypoints, NO route66_waypoints)...');
    
    // Check Supabase connection first
    const connectionStatus = await SupabaseConnectionService.getConnectionStatus();
    
    if (connectionStatus.isConnected) {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        
        // ONLY fetch from destination_cities table - NO other tables
        const { data: destinationCities, error } = await (supabase as any)
          .from('destination_cities')
          .select('*')
          .order('name');

        if (error) {
          throw new Error(`Supabase query failed: ${error.message}`);
        }

        // Convert Supabase data to unified format
        const allStops: UnifiedTripStop[] = (destinationCities || []).map(city => ({
          id: city.id,
          name: city.name,
          description: city.description || `Discover ${city.name} along your Route 66 journey`,
          category: 'destination_city' as const, // ALWAYS destination_city
          city_name: city.name,
          city: city.name,
          state: city.state,
          latitude: Number(city.latitude),
          longitude: Number(city.longitude),
          image_url: city.image_url,
          is_major_stop: true, // All destination cities are major stops
          is_official_destination: city.featured || false
        }));

        // Double-check: filter out any non-destination cities
        const validDestinationCities = allStops.filter(stop => {
          const isValid = stop.category === 'destination_city';
          if (!isValid) {
            console.error(`🚨 INVALID STOP DETECTED: ${stop.name} (${stop.category}) - REMOVING`);
          }
          return isValid;
        });

        // Track successful Supabase usage
        this.dataSourceInfo = {
          isUsingSupabase: true,
          citiesAvailable: validDestinationCities.length,
          lastUpdated: new Date()
        };

        console.log(`✅ ENHANCED: Loaded ${validDestinationCities.length} destination cities ONLY (NO waypoints)`);
        
        // Log specific cities for debugging
        const destinationCityNames = validDestinationCities
          .map(stop => `${stop.name}, ${stop.state}`)
          .sort();
        
        console.log('🏛️ ENHANCED: Available destination cities ONLY:', destinationCityNames);
        
        return validDestinationCities;
        
      } catch (error) {
        console.error('❌ ENHANCED: Supabase fetch failed, falling back to static destination cities:', error);
        
        // Track fallback with reason
        this.dataSourceInfo = {
          isUsingSupabase: false,
          fallbackReason: `Supabase query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          connectionStatus: 'Query Error',
          citiesAvailable: this.getStaticDestinationCitiesOnly().length,
          lastUpdated: new Date()
        };
        
        return this.getStaticDestinationCitiesOnly();
      }
    } else {
      console.warn('⚠️ ENHANCED: Supabase not available, using static destination cities only');
      
      // Track fallback with connection reason
      this.dataSourceInfo = {
        isUsingSupabase: false,
        fallbackReason: connectionStatus.error || 'Connection unavailable',
        connectionStatus: 'Disconnected',
        citiesAvailable: this.getStaticDestinationCitiesOnly().length,
        lastUpdated: new Date()
      };
      
      return this.getStaticDestinationCitiesOnly();
    }
  }

  /**
   * Get static fallback data with ONLY destination cities (NO waypoints)
   */
  private static getStaticDestinationCitiesOnly(): UnifiedTripStop[] {
    console.log('📋 ENHANCED: Using static fallback data with ONLY destination cities (NO waypoints)');
    
    return [
      {
        id: "chicago-start",
        name: "Chicago",
        description: "The official starting point of Route 66",
        category: "destination_city",
        city_name: "Chicago",
        city: "Chicago",
        state: "IL",
        latitude: 41.8781,
        longitude: -87.6298,
        is_major_stop: true,
        is_official_destination: true
      },
      {
        id: "joliet-il",
        name: "Joliet",
        description: "Historic Route 66 city in Illinois",
        category: "destination_city",
        city_name: "Joliet", 
        city: "Joliet",
        state: "IL",
        latitude: 41.5250,
        longitude: -88.0817,
        is_major_stop: true
      },
      {
        id: "pontiac-il",
        name: "Pontiac",
        description: "Historic Route 66 town in Illinois",
        category: "destination_city",
        city_name: "Pontiac",
        city: "Pontiac", 
        state: "IL",
        latitude: 40.8808,
        longitude: -88.6298,
        is_major_stop: true
      },
      {
        id: "springfield-il",
        name: "Springfield",
        description: "Illinois state capital and major Route 66 destination",
        category: "destination_city",
        city_name: "Springfield",
        city: "Springfield",
        state: "IL", 
        latitude: 39.7817,
        longitude: -89.6501,
        is_major_stop: true
      },
      {
        id: "st-louis-mo",
        name: "St. Louis", 
        description: "Gateway to the West with historic Route 66 landmarks",
        category: "destination_city",
        city_name: "St. Louis",
        city: "St. Louis",
        state: "MO",
        latitude: 38.6270,
        longitude: -90.1994,
        is_major_stop: true
      },
      {
        id: "springfield-mo", 
        name: "Springfield",
        description: "Birthplace of Route 66 and Missouri's Queen City of the Ozarks",
        category: "destination_city",
        city_name: "Springfield",
        city: "Springfield",
        state: "MO", 
        latitude: 37.2153,
        longitude: -93.2982,
        is_major_stop: true,
        is_official_destination: true
      },
      {
        id: "joplin-mo",
        name: "Joplin", 
        description: "Historic Route 66 mining town on Missouri-Kansas border",
        category: "destination_city",
        city_name: "Joplin",
        city: "Joplin",
        state: "MO",
        latitude: 37.0842,
        longitude: -94.5133,
        is_major_stop: true
      },
      {
        id: "tulsa-ok",
        name: "Tulsa",
        description: "Oil capital with rich Route 66 history", 
        category: "destination_city",
        city_name: "Tulsa",
        city: "Tulsa",
        state: "OK",
        latitude: 36.1540,
        longitude: -95.9928,
        is_major_stop: true
      },
      {
        id: "oklahoma-city-ok", 
        name: "Oklahoma City",
        description: "Capital city of Oklahoma with Route 66 heritage",
        category: "destination_city",
        city_name: "Oklahoma City",
        city: "Oklahoma City",
        state: "OK",
        latitude: 35.4676,
        longitude: -97.5164,
        is_major_stop: true
      },
      {
        id: "elk-city-ok",
        name: "Elk City",
        description: "Historic Route 66 town in western Oklahoma",
        category: "destination_city",
        city_name: "Elk City",
        city: "Elk City", 
        state: "OK",
        latitude: 35.4112,
        longitude: -99.4043,
        is_major_stop: true
      },
      {
        id: "shamrock-tx",
        name: "Shamrock",
        description: "First major Route 66 stop in Texas",
        category: "destination_city",
        city_name: "Shamrock",
        city: "Shamrock",
        state: "TX",
        latitude: 35.2197,
        longitude: -100.2462,
        is_major_stop: true
      },
      {
        id: "amarillo-tx",
        name: "Amarillo",
        description: "Texas Panhandle city famous for Cadillac Ranch", 
        category: "destination_city",
        city_name: "Amarillo",
        city: "Amarillo",
        state: "TX",
        latitude: 35.2220,
        longitude: -101.8313,
        is_major_stop: true
      },
      {
        id: "tucumcari-nm",
        name: "Tucumcari",
        description: "Historic Route 66 town with vintage neon signs",
        category: "destination_city", 
        city_name: "Tucumcari",
        city: "Tucumcari",
        state: "NM",
        latitude: 35.1719,
        longitude: -103.7249,
        is_major_stop: true
      },
      {
        id: "santa-rosa-nm",
        name: "Santa Rosa",
        description: "The City of Natural Lakes on Route 66",
        category: "destination_city",
        city_name: "Santa Rosa", 
        city: "Santa Rosa",
        state: "NM", 
        latitude: 34.9394,
        longitude: -104.6819,
        is_major_stop: true
      },
      {
        id: "santa-fe-nm",
        name: "Santa Fe", 
        description: "Historic capital city and famous Route 66 branch destination",
        category: "destination_city",
        city_name: "Santa Fe",
        city: "Santa Fe",
        state: "NM",
        latitude: 35.6870,
        longitude: -105.9378,
        is_major_stop: true,
        is_official_destination: true
      },
      {
        id: "albuquerque-nm",
        name: "Albuquerque",
        description: "High desert city with vibrant Route 66 culture",
        category: "destination_city",
        city_name: "Albuquerque",
        city: "Albuquerque", 
        state: "NM",
        latitude: 35.0844,
        longitude: -106.6504,
        is_major_stop: true
      },
      {
        id: "gallup-nm", 
        name: "Gallup",
        description: "Trading center and gateway to the Southwest",
        category: "destination_city",
        city_name: "Gallup",
        city: "Gallup",
        state: "NM",
        latitude: 35.5281,
        longitude: -108.7426,
        is_major_stop: true
      },
      {
        id: "holbrook-az",
        name: "Holbrook", 
        description: "Home to the famous Wigwam Motel",
        category: "destination_city",
        city_name: "Holbrook",
        city: "Holbrook",
        state: "AZ",
        latitude: 34.9025,
        longitude: -110.1665,
        is_major_stop: true
      },
      {
        id: "winslow-az",
        name: "Winslow",
        description: "Take it easy in this famous Route 66 town",
        category: "destination_city", 
        city_name: "Winslow",
        city: "Winslow",
        state: "AZ",
        latitude: 35.0242,
        longitude: -110.6973,
        is_major_stop: true
      },
      {
        id: "flagstaff-az",
        name: "Flagstaff",
        description: "Mountain town and Route 66 hub in northern Arizona",
        category: "destination_city",
        city_name: "Flagstaff",
        city: "Flagstaff", 
        state: "AZ",
        latitude: 35.1983,
        longitude: -111.6513,
        is_major_stop: true
      },
      {
        id: "williams-az",
        name: "Williams",
        description: "Gateway to the Grand Canyon and last Route 66 town to be bypassed",
        category: "destination_city",
        city_name: "Williams",
        city: "Williams",
        state: "AZ", 
        latitude: 35.2494,
        longitude: -112.1901,
        is_major_stop: true
      },
      {
        id: "seligman-az",
        name: "Seligman", 
        description: "Birthplace of the Historic Route 66 movement",
        category: "destination_city",
        city_name: "Seligman",
        city: "Seligman",
        state: "AZ",
        latitude: 35.3258,
        longitude: -112.8738,
        is_major_stop: true
      },
      {
        id: "kingman-az",
        name: "Kingman",
        description: "Heart of Historic Route 66 in Arizona",
        category: "destination_city", 
        city_name: "Kingman",
        city: "Kingman",
        state: "AZ", 
        latitude: 35.1894,
        longitude: -114.0530,
        is_major_stop: true
      },
      {
        id: "needles-ca",
        name: "Needles",
        description: "Desert town on the California-Arizona border",
        category: "destination_city",
        city_name: "Needles",
        city: "Needles", 
        state: "CA",
        latitude: 34.8483,
        longitude: -114.6144,
        is_major_stop: true
      },
      {
        id: "barstow-ca",
        name: "Barstow",
        description: "Major Route 66 stop in the Mojave Desert",
        category: "destination_city",
        city_name: "Barstow",
        city: "Barstow",
        state: "CA", 
        latitude: 34.8958,
        longitude: -117.0228,
        is_major_stop: true
      },
      {
        id: "san-bernardino-ca",
        name: "San Bernardino",
        description: "Historic Route 66 city in Southern California",
        category: "destination_city",
        city_name: "San Bernardino",
        city: "San Bernardino",
        state: "CA",
        latitude: 34.1083,
        longitude: -117.2898,
        is_major_stop: true
      },
      {
        id: "los-angeles-ca", 
        name: "Los Angeles",
        description: "The City of Angels and Route 66's western terminus region",
        category: "destination_city",
        city_name: "Los Angeles",
        city: "Los Angeles",
        state: "CA",
        latitude: 34.0522,
        longitude: -118.2437,
        is_major_stop: true
      },
      {
        id: "santa-monica-ca",
        name: "Santa Monica",
        description: "The official western terminus of Route 66 at the Pacific Ocean",
        category: "destination_city",
        city_name: "Santa Monica",
        city: "Santa Monica", 
        state: "CA",
        latitude: 34.0195,
        longitude: -118.4912,
        is_major_stop: true,
        is_official_destination: true
      }
    ];
  }

  /**
   * Get current data source information
   */
  static getDataSourceInfo(): DataSourceInfo | null {
    return this.dataSourceInfo;
  }

  /**
   * Check if we're currently using fallback data
   */
  static isUsingFallback(): boolean {
    return this.dataSourceInfo ? !this.dataSourceInfo.isUsingSupabase : false;
  }

  /**
   * Get user-friendly message about data source
   */
  static getDataSourceMessage(): string {
    if (!this.dataSourceInfo) {
      return "Data source not initialized";
    }

    if (this.dataSourceInfo.isUsingSupabase) {
      return `✅ Connected to live Route 66 database (${this.dataSourceInfo.citiesAvailable} cities available)`;
    } else {
      return `⚠️ Using offline data (${this.dataSourceInfo.citiesAvailable} cities). ${this.dataSourceInfo.fallbackReason || 'Database temporarily unavailable'}`;
    }
  }
}
