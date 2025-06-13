
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
   * Fetch all stops with enhanced error handling and fallback tracking
   */
  static async fetchAllStops(): Promise<UnifiedTripStop[]> {
    console.log('🔍 Enhanced: Fetching all Route 66 stops with connection validation...');
    
    // Check Supabase connection first
    const connectionStatus = await SupabaseConnectionService.getConnectionStatus();
    
    if (connectionStatus.isConnected) {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        
        // Fetch from multiple Supabase tables for comprehensive coverage
        const [destinationCities, waypoints, attractions] = await Promise.all([
          supabase.from('destination_cities').select('*'),
          supabase.from('route66_waypoints').select('*'),
          supabase.from('attractions').select('*').limit(50) // Limit attractions for performance
        ]);

        if (destinationCities.error || waypoints.error || attractions.error) {
          throw new Error(`Supabase query failed: ${destinationCities.error?.message || waypoints.error?.message || attractions.error?.message}`);
        }

        // Convert Supabase data to unified format
        const allStops: UnifiedTripStop[] = [
          // Destination cities (highest priority)
          ...(destinationCities.data || []).map(city => ({
            id: city.id,
            name: city.name,
            description: city.description || `Discover ${city.name} along your Route 66 journey`,
            category: 'destination_city' as const,
            city_name: city.name,
            city: city.name,
            state: city.state,
            latitude: Number(city.latitude),
            longitude: Number(city.longitude),
            image_url: city.image_url,
            is_major_stop: city.featured || true,
            is_official_destination: city.featured || true
          })),
          
          // Route 66 waypoints
          ...(waypoints.data || []).map(waypoint => ({
            id: waypoint.id,
            name: waypoint.name,
            description: waypoint.description || `Historic Route 66 waypoint in ${waypoint.state}`,
            category: waypoint.is_major_stop ? 'destination_city' as const : 'waypoint' as const,
            city_name: waypoint.name,
            city: waypoint.name,
            state: waypoint.state,
            latitude: Number(waypoint.latitude),
            longitude: Number(waypoint.longitude),
            image_url: waypoint.image_url,
            is_major_stop: waypoint.is_major_stop || false,
            is_official_destination: waypoint.is_major_stop || false
          })),
          
          // Selected attractions
          ...(attractions.data || []).slice(0, 20).map(attraction => ({
            id: attraction.id,
            name: attraction.name,
            description: attraction.description || `Visit ${attraction.name} in ${attraction.city_name}`,
            category: 'attraction' as const,
            city_name: attraction.city_name,
            city: attraction.city_name,
            state: attraction.state,
            latitude: Number(attraction.latitude),
            longitude: Number(attraction.longitude),
            image_url: attraction.image_url,
            is_major_stop: attraction.featured || false,
            is_official_destination: false
          }))
        ];

        // Track successful Supabase usage
        this.dataSourceInfo = {
          isUsingSupabase: true,
          citiesAvailable: allStops.filter(stop => stop.category === 'destination_city').length,
          lastUpdated: new Date()
        };

        console.log(`✅ Enhanced: Loaded ${allStops.length} stops from Supabase (${this.dataSourceInfo.citiesAvailable} destination cities)`);
        
        // Log specific cities for debugging
        const destinationCityNames = allStops
          .filter(stop => stop.category === 'destination_city')
          .map(stop => `${stop.name}, ${stop.state}`)
          .sort();
        
        console.log('🏛️ Enhanced: Available destination cities:', destinationCityNames);
        
        // Check for Santa Fe specifically
        const santaFe = allStops.find(stop => 
          stop.name.toLowerCase().includes('santa fe') && 
          stop.state.toLowerCase().includes('nm')
        );
        
        if (santaFe) {
          console.log('🎯 Enhanced: SANTA FE FOUND in Supabase data:', {
            name: santaFe.name,
            state: santaFe.state,
            category: santaFe.category
          });
        } else {
          console.warn('⚠️ Enhanced: SANTA FE NOT FOUND in Supabase data');
        }

        return allStops;
        
      } catch (error) {
        console.error('❌ Enhanced: Supabase fetch failed, falling back to static data:', error);
        
        // Track fallback with reason
        this.dataSourceInfo = {
          isUsingSupabase: false,
          fallbackReason: `Supabase query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          connectionStatus: 'Query Error',
          citiesAvailable: this.getStaticFallbackStops().filter(stop => stop.category === 'destination_city').length,
          lastUpdated: new Date()
        };
        
        return this.getStaticFallbackStops();
      }
    } else {
      console.warn('⚠️ Enhanced: Supabase not available, using static fallback data');
      
      // Track fallback with connection reason
      this.dataSourceInfo = {
        isUsingSupabase: false,
        fallbackReason: connectionStatus.error || 'Connection unavailable',
        connectionStatus: 'Disconnected',
        citiesAvailable: this.getStaticFallbackStops().filter(stop => stop.category === 'destination_city').length,
        lastUpdated: new Date()
      };
      
      return this.getStaticFallbackStops();
    }
  }

  /**
   * Get comprehensive static fallback data including Santa Fe
   */
  private static getStaticFallbackStops(): UnifiedTripStop[] {
    console.log('📋 Enhanced: Using comprehensive static fallback data (includes Santa Fe)');
    
    return [
      // CHICAGO TO ST. LOUIS
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

      // MISSOURI SECTION - Enhanced with all missing cities
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

      // OKLAHOMA SECTION
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

      // TEXAS SECTION  
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

      // NEW MEXICO SECTION - Enhanced with complete Santa Fe branch
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
      
      // *** SANTA FE - THE MISSING CITY ***
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

      // ARIZONA SECTION
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

      // CALIFORNIA SECTION
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
