// Import any required dependencies
import { TripStop as UnifiedTripStop } from "../../types/TripStop";
import { supabase } from "../../../../lib/supabase";

// Re-export the TripStop type from the unified interface
export type { UnifiedTripStop as TripStop };

export class SupabaseDataService {
  /**
   * Fetch only destination cities from database or mock data
   */
  static async fetchAllStops(): Promise<UnifiedTripStop[]> {
    console.log('🔍 Fetching Route 66 destination cities only...');
    
    // In a real implementation, this would fetch only from destination_cities table
    // For now, return mock data that only includes destination cities
    return mockDestinationCitiesData.map(stop => ({
      id: stop.id || `stop-${Math.random()}`,
      name: stop.name || 'Unknown Stop',
      description: stop.description || `Discover ${stop.name || 'this location'} along your Route 66 journey`,
      category: 'destination_city', // Always destination_city
      city_name: stop.city_name || 'Unknown',
      city: stop.city_name || 'Unknown City', // Use city_name for city property
      state: stop.state || 'Unknown',
      latitude: stop.latitude || 0,
      longitude: stop.longitude || 0,
      image_url: stop.image_url, // This property now exists in mock data
      is_major_stop: stop.is_major_stop || true, // All destination cities are major stops
      is_official_destination: stop.is_official_destination || false,
      sequence_order: stop.sequence_order // Include sequence_order from mock data
    }));
  }
  
  static async fetchStopsByCategory(category: string): Promise<UnifiedTripStop[]> {
    // Only return destination cities regardless of requested category
    if (category === 'destination_city') {
      return this.fetchAllStops();
    }
    console.log(`🚫 Filtering category '${category}' - only destination cities allowed`);
    return [];
  }
  
  static async fetchStopById(id: string): Promise<UnifiedTripStop | null> {
    const allStops = await this.fetchAllStops();
    return allStops.find(stop => stop.id === id) || null;
  }
  
  static async fetchStopsByIds(ids: string[]): Promise<UnifiedTripStop[]> {
    const allStops = await this.fetchAllStops();
    return allStops.filter(stop => ids.includes(stop.id));
  }
  
  static async fetchStopsByState(state: string): Promise<UnifiedTripStop[]> {
    const allStops = await this.fetchAllStops();
    return allStops.filter(stop => stop.state.toLowerCase() === state.toLowerCase());
  }
  
  static async fetchMajorStops(): Promise<UnifiedTripStop[]> {
    // All destination cities are major stops
    return this.fetchAllStops();
  }
  
  static async fetchOfficialDestinations(): Promise<UnifiedTripStop[]> {
    const allStops = await this.fetchAllStops();
    return allStops.filter(stop => stop.is_official_destination === true);
  }

  /**
   * Fetch destination cities with population data
   */
  static async fetchDestinationCitiesWithPopulation(): Promise<UnifiedTripStop[]> {
    try {
      console.log('🏙️ Fetching destination cities with population data...');
      
      const { data, error } = await supabase
        .from('destination_cities')
        .select(`
          id,
          name,
          description,
          category,
          city_name,
          state,
          latitude,
          longitude,
          image_url,
          is_major_stop,
          is_official_destination,
          sequence_order,
          population
        `)
        .order('sequence_order', { ascending: true });

      if (error) {
        console.error('❌ Error fetching destination cities with population:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn('⚠️ No destination cities found with population data');
        return [];
      }

      // Convert and validate data with population fallbacks
      const processedStops = data.map(stop => ({
        ...stop,
        city: stop.city_name || stop.name || 'Unknown',
        population: this.validatePopulation(stop.population, stop.name)
      })) as UnifiedTripStop[];

      console.log(`✅ Fetched ${processedStops.length} destination cities with population data`);
      
      // Log population statistics
      this.logPopulationStatistics(processedStops);
      
      return processedStops;
    } catch (error) {
      console.error('❌ Failed to fetch destination cities with population:', error);
      return [];
    }
  }

  /**
   * Fetch all stops with population data where available
   */
  static async fetchAllStopsWithPopulation(): Promise<UnifiedTripStop[]> {
    try {
      console.log('📍 Fetching all stops with population data...');
      
      // Fetch destination cities with population
      const destinationCities = await this.fetchDestinationCitiesWithPopulation();
      
      // Fetch other stops (they may not have population data)
      const { data: otherStops, error } = await supabase
        .from('route66_waypoints')
        .select(`
          id,
          name,
          description,
          category,
          city_name,
          state,
          latitude,
          longitude,
          image_url,
          is_major_stop,
          sequence_order
        `)
        .order('sequence_order', { ascending: true });

      if (error) {
        console.error('❌ Error fetching other stops:', error);
        // Continue with just destination cities
        return destinationCities;
      }

      // Convert other stops (without population data)
      const processedOtherStops = (otherStops || []).map(stop => ({
        ...stop,
        city: stop.city_name || stop.name || 'Unknown',
        is_official_destination: false,
        population: undefined // No population data for waypoints
      })) as UnifiedTripStop[];

      const allStops = [...destinationCities, ...processedOtherStops];
      
      console.log(`✅ Fetched ${allStops.length} total stops (${destinationCities.length} with population data)`);
      
      return allStops;
    } catch (error) {
      console.error('❌ Failed to fetch all stops with population:', error);
      return [];
    }
  }

  /**
   * Validate and provide fallback population values
   */
  private static validatePopulation(population: number | null | undefined, cityName: string): number | undefined {
    if (population && population > 0) {
      return population;
    }
    
    // Provide fallback estimates for known Route 66 cities
    const fallbackPopulations = this.getFallbackPopulations();
    const normalizedName = cityName.toLowerCase().replace(/[^a-z]/g, '');
    
    for (const [key, value] of Object.entries(fallbackPopulations)) {
      if (normalizedName.includes(key.toLowerCase().replace(/[^a-z]/g, ''))) {
        console.log(`📊 Using fallback population for ${cityName}: ${value.toLocaleString()}`);
        return value;
      }
    }
    
    return undefined; // No population data available
  }

  /**
   * Get fallback population estimates for major Route 66 cities
   */
  private static getFallbackPopulations(): Record<string, number> {
    return {
      'Chicago': 2700000,
      'Los Angeles': 4000000,
      'Santa Monica': 93000,
      'St. Louis': 300000,
      'Oklahoma City': 700000,
      'Tulsa': 415000,
      'Amarillo': 200000,
      'Albuquerque': 560000,
      'Flagstaff': 76000,
      'Las Vegas': 650000,
      'Barstow': 25000,
      'Needles': 5000,
      'Kingman': 31000,
      'Winslow': 9000,
      'Gallup': 22000,
      'Tucumcari': 5000,
      'Santa Fe': 85000,
      'Clinton': 9000,
      'Elk City': 12000,
      'Weatherford': 12000,
      'El Reno': 19000,
      'Yukon': 23000,
      'Bethany': 20000,
      'Joplin': 51000,
      'Springfield': 170000,
      'Lebanon': 14000,
      'Rolla': 20000,
      'Cuba': 3400,
      'Sullivan': 7000,
      'Eureka': 10000,
      'Fenton': 4000,
      'Kirkwood': 28000,
      'Webster Groves': 23000,
      'Shrewsbury': 6000,
      'Maplewood': 8000,
      'Richmond Heights': 9000,
      'Clayton': 16000,
      'University City': 35000,
      'Olivette': 8000,
      'Creve Coeur': 18000,
      'Maryland Heights': 27000,
      'Bridgeton': 11000,
      'Hazelwood': 25000,
      'Florissant': 52000,
      'Ferguson': 21000,
      'Berkeley': 9000,
      'Kinloch': 300,
      'Edmundson': 800,
      'Woodson Terrace': 4000,
      'Bel-Ridge': 3000,
      'Pagedale': 3000,
      'Wellston': 2000,
      'Pine Lawn': 3000,
      'Normandy': 5000,
      'Hanley Hills': 2000,
      'Pasadena Hills': 1000,
      'Bellerive': 300,
      'Charlack': 1500,
      'Northwoods': 4000,
      'Country Club Hills': 1200,
      'Riverview': 3000,
      'St. John': 6500,
      'Vinita Park': 2000,
      'Cool Valley': 1200,
      'Dellwood': 5000,
      'Calverton Park': 1300,
      'Bellefontaine Neighbors': 11000,
      'Spanish Lake': 2000,
      'Glasgow Village': 5000,
      'Jennings': 14000,
      'Beverly Hills': 600,
      'Velda City': 1500,
      'Uplands Park': 400,
      'Velda Village Hills': 1000,
      'Hillsdale': 1500,
      'Greendale': 600,
      'San Bernardino': 220000,
      'Holbrook': 5000,
      'Williams': 3000,
      'Seligman': 456,
      'Shamrock': 1900
    };
  }

  /**
   * Log population statistics for debugging
   */
  private static logPopulationStatistics(stops: UnifiedTripStop[]): void {
    const withPopulation = stops.filter(stop => stop.population !== undefined);
    const withoutPopulation = stops.filter(stop => stop.population === undefined);
    
    console.log(`📊 Population Data Statistics:`);
    console.log(`   • Cities with population data: ${withPopulation.length}`);
    console.log(`   • Cities without population data: ${withoutPopulation.length}`);
    
    if (withPopulation.length > 0) {
      const populations = withPopulation.map(stop => stop.population!);
      const total = populations.reduce((sum, pop) => sum + pop, 0);
      const average = total / populations.length;
      const max = Math.max(...populations);
      const min = Math.min(...populations);
      
      console.log(`   • Average population: ${Math.round(average).toLocaleString()}`);
      console.log(`   • Population range: ${min.toLocaleString()} - ${max.toLocaleString()}`);
    }
    
    if (withoutPopulation.length > 0) {
      console.log(`   • Cities without population data:`, withoutPopulation.slice(0, 5).map(s => s.name));
    }
  }
}

// Enhanced mock data with all major Route 66 cities including missing ones like Joliet
const mockDestinationCitiesData = [
  {
    id: 'chicago-il',
    name: 'Chicago, IL',
    city_name: 'Chicago',
    state: 'Illinois',
    description: 'The eastern terminus of Route 66, the Mother Road begins here at Grant Park.',
    latitude: 41.8781,
    longitude: -87.6298,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 1
  },
  {
    id: 'joliet-il',
    name: 'Joliet, IL',
    city_name: 'Joliet',
    state: 'Illinois',
    description: 'Historic Route 66 city southwest of Chicago, known for its limestone heritage.',
    latitude: 41.5250,
    longitude: -88.0817,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 2
  },
  {
    id: 'pontiac-il',
    name: 'Pontiac, IL',
    city_name: 'Pontiac',
    state: 'Illinois',
    description: 'Home to the Route 66 Hall of Fame and Museum.',
    latitude: 40.8808,
    longitude: -88.6298,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 3
  },
  {
    id: 'bloomington-il',
    name: 'Bloomington, IL',
    city_name: 'Bloomington',
    state: 'Illinois',
    description: 'Twin city with Normal, featuring historic Route 66 attractions.',
    latitude: 40.4842,
    longitude: -88.9937,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 4
  },
  {
    id: 'springfield-il',
    name: 'Springfield, IL',
    city_name: 'Springfield',
    state: 'Illinois',
    description: 'Illinois state capital with rich Route 66 history and Abraham Lincoln heritage.',
    latitude: 39.7817,
    longitude: -89.6501,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 5
  },
  {
    id: 'litchfield-il',
    name: 'Litchfield, IL',
    city_name: 'Litchfield',
    state: 'Illinois',
    description: 'Historic Route 66 town with classic roadside attractions.',
    latitude: 39.1753,
    longitude: -89.6542,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 6
  },
  {
    id: 'st-louis-mo',
    name: 'St. Louis, MO',
    city_name: 'St. Louis',
    state: 'Missouri',
    description: 'Gateway to the West with the iconic Gateway Arch and Route 66 State Park.',
    latitude: 38.6270,
    longitude: -90.1994,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 7
  },
  {
    id: 'rolla-mo',
    name: 'Rolla, MO',
    city_name: 'Rolla',
    state: 'Missouri',
    description: 'Home to Missouri University of Science and Technology and Route 66 heritage.',
    latitude: 37.9514,
    longitude: -91.7732,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 8
  },
  {
    id: 'lebanon-mo',
    name: 'Lebanon, MO',
    city_name: 'Lebanon',
    state: 'Missouri',
    description: 'Known as the Route 66 Birthplace and classic American town.',
    latitude: 37.6806,
    longitude: -92.6635,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 9
  },
  {
    id: 'springfield-mo',
    name: 'Springfield, MO',
    city_name: 'Springfield',
    state: 'Missouri',
    description: 'Birthplace of Route 66 with excellent museums and attractions.',
    latitude: 37.2153,
    longitude: -93.2982,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 10
  },
  {
    id: 'joplin-mo',
    name: 'Joplin, MO',
    city_name: 'Joplin',
    state: 'Missouri',
    description: 'Historic mining town and important Route 66 crossroads.',
    latitude: 37.0842,
    longitude: -94.5133,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 11
  },
  {
    id: 'tulsa-ok',
    name: 'Tulsa, OK',
    city_name: 'Tulsa',
    state: 'Oklahoma',
    description: 'Oil capital with excellent Route 66 museums and attractions.',
    latitude: 36.1540,
    longitude: -95.9928,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 12
  },
  {
    id: 'oklahoma-city-ok',
    name: 'Oklahoma City, OK',
    city_name: 'Oklahoma City',
    state: 'Oklahoma',
    description: 'State capital and major Route 66 destination with vibrant downtown.',
    latitude: 35.4676,
    longitude: -97.5164,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 13
  },
  {
    id: 'elk-city-ok',
    name: 'Elk City, OK',
    city_name: 'Elk City',
    state: 'Oklahoma',
    description: 'Historic Route 66 town with the National Route 66 & Transportation Museum.',
    latitude: 35.4112,
    longitude: -99.4043,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 14
  },
  {
    id: 'shamrock-tx',
    name: 'Shamrock, TX',
    city_name: 'Shamrock',
    state: 'Texas',
    description: 'Historic Texas Route 66 town known for its Irish heritage and water tower.',
    latitude: 35.2070,
    longitude: -100.2437,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 15
  },
  {
    id: 'amarillo-tx',
    name: 'Amarillo, TX',
    city_name: 'Amarillo',
    state: 'Texas',
    description: 'Home to the famous Cadillac Ranch and Big Texan Steak Ranch.',
    latitude: 35.2220,
    longitude: -101.8313,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 16
  },
  {
    id: 'tucumcari-nm',
    name: 'Tucumcari, NM',
    city_name: 'Tucumcari',
    state: 'New Mexico',
    description: 'Famous Route 66 town with vintage neon signs and classic motels.',
    latitude: 35.1717,
    longitude: -103.7250,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 17
  },
  {
    id: 'santa-rosa-nm',
    name: 'Santa Rosa, NM',
    city_name: 'Santa Rosa',
    state: 'New Mexico',
    description: 'The City of Natural Lakes along historic Route 66.',
    latitude: 34.9398,
    longitude: -104.6825,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 18
  },
  {
    id: 'santa-fe-nm',
    name: 'Santa Fe, NM',
    city_name: 'Santa Fe',
    state: 'New Mexico',
    description: 'Historic state capital with distinctive southwestern architecture.',
    latitude: 35.6870,
    longitude: -105.9378,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 19
  },
  {
    id: 'albuquerque-nm',
    name: 'Albuquerque, NM',
    city_name: 'Albuquerque',
    state: 'New Mexico',
    description: 'Largest city in New Mexico with rich Native American and Route 66 culture.',
    latitude: 35.0844,
    longitude: -106.6504,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 20
  },
  {
    id: 'gallup-nm',
    name: 'Gallup, NM',
    city_name: 'Gallup',
    state: 'New Mexico',
    description: 'Trading post town and gateway to Native American country.',
    latitude: 35.5281,
    longitude: -108.7426,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 21
  },
  {
    id: 'holbrook-az',
    name: 'Holbrook, AZ',
    city_name: 'Holbrook',
    state: 'Arizona',
    description: 'Home to the famous Wigwam Motel and Petrified Forest National Park.',
    latitude: 34.9025,
    longitude: -110.1618,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 22
  },
  {
    id: 'winslow-az',
    name: 'Winslow, AZ',
    city_name: 'Winslow',
    state: 'Arizona',
    description: 'Famous for the Eagles song "Take It Easy" and historic downtown.',
    latitude: 35.0242,
    longitude: -110.6974,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 23
  },
  {
    id: 'flagstaff-az',
    name: 'Flagstaff, AZ',
    city_name: 'Flagstaff',
    state: 'Arizona',
    description: 'Mountain town gateway to Grand Canyon and Route 66 hub.',
    latitude: 35.1983,
    longitude: -111.6513,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 24
  },
  {
    id: 'williams-az',
    name: 'Williams, AZ',
    city_name: 'Williams',
    state: 'Arizona',
    description: 'Gateway to Grand Canyon and last Route 66 town to be bypassed.',
    latitude: 35.2494,
    longitude: -112.1901,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 25
  },
  {
    id: 'seligman-az',
    name: 'Seligman, AZ',
    city_name: 'Seligman',
    state: 'Arizona',
    description: 'Birthplace of Historic Route 66 with classic roadside attractions.',
    latitude: 35.3258,
    longitude: -112.8738,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 26
  },
  {
    id: 'kingman-az',
    name: 'Kingman, AZ',
    city_name: 'Kingman',
    state: 'Arizona',
    description: 'Heart of Route 66 in Arizona with excellent museums.',
    latitude: 35.1895,
    longitude: -114.0530,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 27
  },
  {
    id: 'needles-ca',
    name: 'Needles, CA',
    city_name: 'Needles',
    state: 'California',
    description: 'Desert gateway to California on historic Route 66.',
    latitude: 34.8481,
    longitude: -114.6142,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 28
  },
  {
    id: 'barstow-ca',
    name: 'Barstow, CA',
    city_name: 'Barstow',
    state: 'California',
    description: 'Historic railroad town and Route 66 crossroads in the Mojave Desert.',
    latitude: 34.8958,
    longitude: -117.0228,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 29
  },
  {
    id: 'victorville-ca',
    name: 'Victorville, CA',
    city_name: 'Victorville',
    state: 'California',
    description: 'High Desert city along the historic Route 66 corridor.',
    latitude: 34.5362,
    longitude: -117.2911,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 30
  },
  {
    id: 'san-bernardino-ca',
    name: 'San Bernardino, CA',
    city_name: 'San Bernardino',
    state: 'California',
    description: 'Historic Route 66 city at the foot of the San Bernardino Mountains.',
    latitude: 34.1083,
    longitude: -117.2898,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 31
  },
  {
    id: 'pasadena-ca',
    name: 'Pasadena, CA',
    city_name: 'Pasadena',
    state: 'California',
    description: 'City of Roses and historic Route 66 destination near Los Angeles.',
    latitude: 34.1478,
    longitude: -118.1445,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 32
  },
  {
    id: 'los-angeles-ca',
    name: 'Los Angeles, CA',
    city_name: 'Los Angeles',
    state: 'California',
    description: 'The City of Angels and major Route 66 destination.',
    latitude: 34.0522,
    longitude: -118.2437,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 33
  },
  {
    id: 'santa-monica-ca',
    name: 'Santa Monica, CA',
    city_name: 'Santa Monica',
    state: 'California',
    description: 'Western terminus of Route 66 at the famous Santa Monica Pier.',
    latitude: 34.0195,
    longitude: -118.4912,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined,
    sequence_order: 34
  }
];
