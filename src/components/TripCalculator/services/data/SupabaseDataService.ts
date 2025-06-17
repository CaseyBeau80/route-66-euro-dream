
import { supabase } from '@/integrations/supabase/client';
import { TripStop, convertToTripStop } from '../../types/TripStop';

export interface TripStop {
  id: string;
  name: string;
  description: string;
  category: string;
  city_name: string;
  state: string;
  latitude: number;
  longitude: number;
  image_url?: string;
  is_major_stop?: boolean;
  is_official_destination?: boolean;
  city: string;
}

export class SupabaseDataService {
  /**
   * Fetch ONLY destination cities from Supabase - NO waypoints
   */
  static async fetchAllStops(): Promise<TripStop[]> {
    console.log('🏛️ DESTINATION CITIES ONLY: Fetching from destination_cities table (NO waypoints)');
    
    try {
      // ONLY fetch from destination_cities table
      const { data: destinationCities, error } = await supabase
        .from('destination_cities')
        .select('*')
        .order('name');

      if (error) {
        console.error('❌ Error fetching destination cities:', error);
        return this.getStaticDestinationCities();
      }

      if (!destinationCities || destinationCities.length === 0) {
        console.warn('⚠️ No destination cities found in database, using static data');
        return this.getStaticDestinationCities();
      }

      // Convert to unified TripStop format
      const tripStops = destinationCities.map(city => convertToTripStop({
        id: city.id,
        name: city.name,
        description: city.description || `Experience ${city.name} on your Route 66 journey`,
        category: 'destination_city', // Always destination_city
        city_name: city.name,
        city: city.name,
        state: city.state,
        latitude: Number(city.latitude),
        longitude: Number(city.longitude),
        image_url: city.image_url,
        is_major_stop: true, // All destination cities are major stops
        is_official_destination: city.featured || false
      }));

      console.log(`✅ DESTINATION CITIES ONLY: Loaded ${tripStops.length} destination cities (NO waypoints)`);
      console.log(`🏛️ Cities: ${tripStops.map(s => `${s.name}, ${s.state}`).join(', ')}`);
      
      return tripStops;
      
    } catch (error) {
      console.error('❌ Database error, using static destination cities:', error);
      return this.getStaticDestinationCities();
    }
  }

  /**
   * Static fallback data with ONLY destination cities (NO waypoints)
   */
  private static getStaticDestinationCities(): TripStop[] {
    console.log('📋 DESTINATION CITIES ONLY: Using static fallback data (NO waypoints)');
    
    return [
      // Illinois
      {
        id: "chicago-il",
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
        description: "Route 66 Hall of Fame and Museum location",
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
      
      // Missouri
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
        description: "Birthplace of Route 66 and Missouri's Queen City",
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
        description: "Historic Route 66 mining town",
        category: "destination_city",
        city_name: "Joplin",
        city: "Joplin",
        state: "MO",
        latitude: 37.0842,
        longitude: -94.5133,
        is_major_stop: true
      },
      
      // Oklahoma
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
      
      // Texas
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
      
      // New Mexico
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
        description: "Historic capital city and Route 66 branch destination",
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
      
      // Arizona
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
        description: "Gateway to the Grand Canyon",
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
      
      // California
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
        description: "The official western terminus of Route 66",
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
   * Validate that all stops are destination cities (no waypoints allowed)
   */
  static validateDestinationCitiesOnly(stops: TripStop[]): TripStop[] {
    const validStops = stops.filter(stop => {
      const isDestinationCity = stop.category === 'destination_city';
      
      if (!isDestinationCity) {
        console.warn(`🚫 FILTERED OUT NON-DESTINATION: ${stop.name} (${stop.category})`);
      }
      
      return isDestinationCity;
    });
    
    console.log(`🏛️ DESTINATION CITIES ONLY: ${validStops.length}/${stops.length} stops are valid destination cities`);
    return validStops;
  }
}
