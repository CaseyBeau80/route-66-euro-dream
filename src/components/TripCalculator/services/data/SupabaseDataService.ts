import { TripStop, convertToTripStop } from '../../types/TripStop';
import { CoordinateAccessSafety } from '../planning/CoordinateAccessSafety';

export class SupabaseDataService {
  /**
   * Fetch all stops with comprehensive validation and coordinate safety
   */
  static async fetchAllStops(): Promise<TripStop[]> {
    console.log('📊 SUPABASE: Fetching all stops with coordinate validation');
    
    try {
      // This is a stub - in real implementation this would fetch from Supabase
      // For now, return mock data with proper validation
      const mockStops = await this.getMockStops();
      
      console.log(`📊 SUPABASE: Raw data retrieved: ${mockStops.length} stops`);
      
      // PHASE 3: Validate and filter stops with valid coordinates
      const validatedStops = this.validateAndFilterStops(mockStops);
      
      console.log(`📊 SUPABASE: Validated stops: ${validatedStops.length} stops with valid coordinates`);
      
      return validatedStops;
      
    } catch (error) {
      console.error('❌ SUPABASE: Error fetching stops:', error);
      throw new Error(`Failed to fetch Route 66 stops: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Find stop by name
   */
  static async findStopByName(name: string): Promise<TripStop | null> {
    console.log(`🔍 SUPABASE: Finding stop by name: ${name}`);
    
    try {
      const allStops = await this.fetchAllStops();
      const foundStop = allStops.find(stop => 
        stop.name.toLowerCase().includes(name.toLowerCase()) ||
        stop.city?.toLowerCase().includes(name.toLowerCase())
      );
      
      console.log(`🔍 SUPABASE: Found stop: ${foundStop ? foundStop.name : 'None'}`);
      return foundStop || null;
      
    } catch (error) {
      console.error('❌ SUPABASE: Error finding stop by name:', error);
      return null;
    }
  }

  /**
   * Get destination cities only
   */
  static async getDestinationCities(): Promise<TripStop[]> {
    console.log('🏙️ SUPABASE: Fetching destination cities');
    
    try {
      const allStops = await this.fetchAllStops();
      const destinationCities = allStops.filter(stop => stop.category === 'destination_city');
      
      console.log(`🏙️ SUPABASE: Found ${destinationCities.length} destination cities`);
      return destinationCities;
      
    } catch (error) {
      console.error('❌ SUPABASE: Error fetching destination cities:', error);
      return [];
    }
  }

  /**
   * Validate and filter stops to ensure coordinate safety
   */
  private static validateAndFilterStops(rawStops: any[]): TripStop[] {
    console.log(`🔍 VALIDATION: Processing ${rawStops.length} raw stops`);
    
    const validStops: TripStop[] = [];
    let invalidCount = 0;
    
    for (let i = 0; i < rawStops.length; i++) {
      const rawStop = rawStops[i];
      
      try {
        // Convert to TripStop first
        const tripStop = convertToTripStop(rawStop);
        
        // Validate coordinates using our safety service
        const isValid = CoordinateAccessSafety.canSafelyAccessCoordinates(tripStop, `validation-stop-${i}`);
        
        if (isValid) {
          validStops.push(tripStop);
          console.log(`✅ VALIDATION: Stop ${i} (${tripStop.name}) passed validation`);
        } else {
          invalidCount++;
          console.warn(`⚠️ VALIDATION: Stop ${i} (${tripStop.name || 'unnamed'}) failed coordinate validation`);
        }
        
      } catch (error) {
        invalidCount++;
        console.error(`❌ VALIDATION: Stop ${i} conversion failed:`, {
          error: error instanceof Error ? error.message : 'Unknown error',
          rawStop
        });
      }
    }
    
    console.log(`📊 VALIDATION SUMMARY: ${validStops.length} valid, ${invalidCount} invalid stops`);
    
    if (validStops.length === 0) {
      console.error('❌ CRITICAL: No valid stops found after validation');
      throw new Error('No valid Route 66 stops available - all stops failed coordinate validation');
    }
    
    return validStops;
  }

  /**
   * Get enhanced mock stops with more Route 66 cities - replace with real Supabase query
   */
  private static async getMockStops(): Promise<any[]> {
    // Enhanced mock data with more Route 66 cities including common starting points
    return [
      {
        id: 'joliet-il',
        name: 'Joliet',
        description: 'Historic Route 66 starting point near Chicago',
        category: 'destination_city',
        city_name: 'Joliet',
        city: 'Joliet',
        state: 'Illinois',
        latitude: 41.5250,
        longitude: -88.0817,
        heritage_value: 'high'
      },
      {
        id: 'chicago-start',
        name: 'Chicago',
        description: 'The beginning of Route 66',
        category: 'destination_city',
        city_name: 'Chicago',
        city: 'Chicago',
        state: 'Illinois',
        latitude: 41.8781,
        longitude: -87.6298,
        heritage_value: 'high'
      },
      {
        id: 'springfield-il',
        name: 'Springfield',
        description: 'Illinois capital and Route 66 heritage city',
        category: 'destination_city',
        city_name: 'Springfield',
        city: 'Springfield',
        state: 'Illinois',
        latitude: 39.7817,
        longitude: -89.6501,
        heritage_value: 'high'
      },
      {
        id: 'st-louis',
        name: 'St. Louis',
        description: 'Gateway to the West',
        category: 'destination_city',
        city_name: 'St. Louis',
        city: 'St. Louis',
        state: 'Missouri',
        latitude: 38.6270,
        longitude: -90.1994,
        heritage_value: 'high'
      },
      {
        id: 'springfield-mo',
        name: 'Springfield',
        description: 'Missouri Route 66 heritage city',
        category: 'destination_city',
        city_name: 'Springfield',
        city: 'Springfield',
        state: 'Missouri',
        latitude: 37.2153,
        longitude: -93.2982,
        heritage_value: 'medium'
      },
      {
        id: 'joplin-mo',
        name: 'Joplin',
        description: 'Missouri Route 66 city',
        category: 'destination_city',
        city_name: 'Joplin',
        city: 'Joplin',
        state: 'Missouri',
        latitude: 37.0842,
        longitude: -94.5133,
        heritage_value: 'medium'
      },
      {
        id: 'tulsa-ok',
        name: 'Tulsa',
        description: 'Oklahoma Route 66 heritage city',
        category: 'destination_city',
        city_name: 'Tulsa',
        city: 'Tulsa',
        state: 'Oklahoma',
        latitude: 36.1540,
        longitude: -95.9928,
        heritage_value: 'high'
      },
      {
        id: 'oklahoma-city',
        name: 'Oklahoma City',
        description: 'Heart of Route 66',
        category: 'destination_city',
        city_name: 'Oklahoma City',
        city: 'Oklahoma City',
        state: 'Oklahoma',
        latitude: 35.4676,
        longitude: -97.5164,
        heritage_value: 'high'
      },
      {
        id: 'amarillo',
        name: 'Amarillo',
        description: 'Home of the Big Texan',
        category: 'destination_city',
        city_name: 'Amarillo',
        city: 'Amarillo',
        state: 'Texas',
        latitude: 35.2220,
        longitude: -101.8313,
        heritage_value: 'medium'
      },
      {
        id: 'tucumcari-nm',
        name: 'Tucumcari',
        description: 'New Mexico Route 66 town',
        category: 'destination_city',
        city_name: 'Tucumcari',
        city: 'Tucumcari',
        state: 'New Mexico',
        latitude: 35.1717,
        longitude: -103.7250,
        heritage_value: 'medium'
      },
      {
        id: 'albuquerque',
        name: 'Albuquerque',
        description: 'Southwest charm on Route 66',
        category: 'destination_city',
        city_name: 'Albuquerque',
        city: 'Albuquerque',
        state: 'New Mexico',
        latitude: 35.0844,
        longitude: -106.6504,
        heritage_value: 'high'
      },
      {
        id: 'gallup-nm',
        name: 'Gallup',
        description: 'New Mexico Route 66 city',
        category: 'destination_city',
        city_name: 'Gallup',
        city: 'Gallup',
        state: 'New Mexico',
        latitude: 35.5281,
        longitude: -108.7426,
        heritage_value: 'medium'
      },
      {
        id: 'flagstaff',
        name: 'Flagstaff',
        description: 'Mountain town on the Mother Road',
        category: 'destination_city',
        city_name: 'Flagstaff',
        city: 'Flagstaff',
        state: 'Arizona',
        latitude: 35.1983,
        longitude: -111.6513,
        heritage_value: 'medium'
      },
      {
        id: 'kingman-az',
        name: 'Kingman',
        description: 'Historic Arizona Route 66 city',
        category: 'destination_city',
        city_name: 'Kingman',
        city: 'Kingman',
        state: 'Arizona',
        latitude: 35.1894,
        longitude: -114.0530,
        heritage_value: 'high'
      },
      {
        id: 'barstow-ca',
        name: 'Barstow',
        description: 'California Route 66 desert city',
        category: 'destination_city',
        city_name: 'Barstow',
        city: 'Barstow',
        state: 'California',
        latitude: 34.8958,
        longitude: -117.0228,
        heritage_value: 'medium'
      },
      {
        id: 'los-angeles',
        name: 'Los Angeles',
        description: 'The end of Route 66',
        category: 'destination_city',
        city_name: 'Los Angeles',
        city: 'Los Angeles',
        state: 'California',
        latitude: 34.0522,
        longitude: -118.2437,
        heritage_value: 'high'
      }
    ];
  }

  /**
   * Get stops by category with coordinate validation
   */
  static async getStopsByCategory(category: string): Promise<TripStop[]> {
    const allStops = await this.fetchAllStops();
    return allStops.filter(stop => stop.category === category);
  }

  /**
   * Validate data integrity for debugging
   */
  static async validateDataIntegrity(): Promise<{
    totalStops: number;
    validStops: number;
    invalidStops: number;
    coordinateIssues: string[];
  }> {
    console.log('🔍 DATA INTEGRITY: Validating Supabase data');
    
    try {
      const mockStops = await this.getMockStops();
      const issues: string[] = [];
      let validCount = 0;
      
      for (let i = 0; i < mockStops.length; i++) {
        const stop = mockStops[i];
        const stopId = stop.id || `stop-${i}`;
        
        try {
          const tripStop = convertToTripStop(stop);
          const isValid = CoordinateAccessSafety.canSafelyAccessCoordinates(tripStop, `integrity-${stopId}`);
          
          if (isValid) {
            validCount++;
          } else {
            issues.push(`${stopId}: Invalid coordinates`);
          }
        } catch (error) {
          issues.push(`${stopId}: Conversion failed - ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      
      const result = {
        totalStops: mockStops.length,
        validStops: validCount,
        invalidStops: mockStops.length - validCount,
        coordinateIssues: issues
      };
      
      console.log('📊 DATA INTEGRITY REPORT:', result);
      return result;
      
    } catch (error) {
      console.error('❌ DATA INTEGRITY: Validation failed:', error);
      throw error;
    }
  }
}
