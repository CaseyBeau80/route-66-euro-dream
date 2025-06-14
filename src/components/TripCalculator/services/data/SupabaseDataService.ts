// Import any required dependencies
import { TripStop as UnifiedTripStop } from "../../types/TripStop";

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
    const stops = mockDestinationCitiesData.map(stop => ({
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
      is_official_destination: stop.is_official_destination || false
    }));
    
    console.log('🔍 SupabaseDataService: Available cities:', stops.map(stop => `${stop.city_name}, ${stop.state}`).sort());
    
    return stops;
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
}

// Enhanced mock data with Los Angeles and all major Route 66 destinations
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
    image_url: undefined
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
    image_url: undefined
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
    image_url: undefined
  },
  {
    id: 'springfield-mo',
    name: 'Springfield, MO',
    city_name: 'Springfield',
    state: 'Missouri',
    description: 'Birthplace of Route 66 and Missouri\'s Queen City of the Ozarks.',
    latitude: 37.2153,
    longitude: -93.2982,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined
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
    image_url: undefined
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
    image_url: undefined
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
    image_url: undefined
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
    image_url: undefined
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
    image_url: undefined
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
    image_url: undefined
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
    image_url: undefined
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
    image_url: undefined
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
    image_url: undefined
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
    image_url: undefined
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
    image_url: undefined
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
    image_url: undefined
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
    image_url: undefined
  },
  {
    id: 'seligman-az',
    name: 'Seligman, AZ',
    city_name: 'Seligman',
    state: 'Arizona',
    description: 'Birthplace of Historic Route 66 movement.',
    latitude: 35.3258,
    longitude: -112.8738,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined
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
    image_url: undefined
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
    image_url: undefined
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
    image_url: undefined
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
    image_url: undefined
  },
  {
    id: 'los-angeles-ca',
    name: 'Los Angeles, CA',
    city_name: 'Los Angeles',
    state: 'California',
    description: 'The City of Angels and major Route 66 destination with Hollywood, beaches, and endless attractions.',
    latitude: 34.0522,
    longitude: -118.2437,
    is_major_stop: true,
    is_official_destination: true,
    image_url: undefined
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
    image_url: undefined
  }
];
