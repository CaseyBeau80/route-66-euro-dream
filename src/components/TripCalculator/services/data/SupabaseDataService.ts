
import { TripStop } from '../../types/TripStop';

// Mock Route 66 stops data for trip planning
const ROUTE_66_STOPS: TripStop[] = [
  {
    id: '1',
    name: 'Chicago, IL',
    city: 'Chicago',
    state: 'IL',
    latitude: 41.8781,
    longitude: -87.6298,
    category: 'destination_city',
    heritage_value: 'high',
    description: 'The official start of Route 66'
  },
  {
    id: '2',
    name: 'Joliet, IL',
    city: 'Joliet',
    state: 'IL',
    latitude: 41.5250,
    longitude: -88.0817,
    category: 'destination_city',
    heritage_value: 'medium',
    description: 'Historic Route 66 city in Illinois'
  },
  {
    id: '3',
    name: 'Springfield, IL',
    city: 'Springfield',
    state: 'IL',
    latitude: 39.7817,
    longitude: -89.6501,
    category: 'destination_city',
    heritage_value: 'high',
    description: 'Capital of Illinois with Route 66 attractions'
  },
  {
    id: '4',
    name: 'St. Louis, MO',
    city: 'St. Louis',
    state: 'MO',
    latitude: 38.6270,
    longitude: -90.1994,
    category: 'destination_city',
    heritage_value: 'high',
    description: 'Gateway to the West'
  },
  {
    id: '5',
    name: 'Joplin, MO',
    city: 'Joplin',
    state: 'MO',
    latitude: 37.0842,
    longitude: -94.5133,
    category: 'destination_city',
    heritage_value: 'medium',
    description: 'Historic mining town on Route 66'
  },
  {
    id: '6',
    name: 'Tulsa, OK',
    city: 'Tulsa',
    state: 'OK',
    latitude: 36.1539,
    longitude: -95.9928,
    category: 'destination_city',
    heritage_value: 'high',
    description: 'Oil capital with Route 66 heritage'
  },
  {
    id: '7',
    name: 'Oklahoma City, OK',
    city: 'Oklahoma City',
    state: 'OK',
    latitude: 35.4676,
    longitude: -97.5164,
    category: 'destination_city',
    heritage_value: 'high',
    description: 'State capital with Route 66 museums'
  },
  {
    id: '8',
    name: 'Amarillo, TX',
    city: 'Amarillo',
    state: 'TX',
    latitude: 35.2220,
    longitude: -101.8313,
    category: 'destination_city',
    heritage_value: 'high',
    description: 'Home of the Big Texan and Cadillac Ranch'
  },
  {
    id: '9',
    name: 'Santa Fe, NM',
    city: 'Santa Fe',
    state: 'NM',
    latitude: 35.6870,
    longitude: -105.9378,
    category: 'destination_city',
    heritage_value: 'high',
    description: 'Historic capital with southwestern culture'
  },
  {
    id: '10',
    name: 'Albuquerque, NM',
    city: 'Albuquerque',
    state: 'NM',
    latitude: 35.0844,
    longitude: -106.6504,
    category: 'destination_city',
    heritage_value: 'high',
    description: 'Largest city in New Mexico on Route 66'
  },
  {
    id: '11',
    name: 'Flagstaff, AZ',
    city: 'Flagstaff',
    state: 'AZ',
    latitude: 35.1983,
    longitude: -111.6513,
    category: 'destination_city',
    heritage_value: 'high',
    description: 'Mountain town near Grand Canyon'
  },
  {
    id: '12',
    name: 'Kingman, AZ',
    city: 'Kingman',
    state: 'AZ',
    latitude: 35.1894,
    longitude: -114.0530,
    category: 'destination_city',
    heritage_value: 'medium',
    description: 'Historic Route 66 town in Arizona desert'
  },
  {
    id: '13',
    name: 'Barstow, CA',
    city: 'Barstow',
    state: 'CA',
    latitude: 34.8958,
    longitude: -117.0228,
    category: 'destination_city',
    heritage_value: 'medium',
    description: 'Desert stop on the way to California'
  },
  {
    id: '14',
    name: 'San Bernardino, CA',
    city: 'San Bernardino',
    state: 'CA',
    latitude: 34.1083,
    longitude: -117.2898,
    category: 'destination_city',
    heritage_value: 'medium',
    description: 'Gateway to Southern California'
  },
  {
    id: '15',
    name: 'Los Angeles, CA',
    city: 'Los Angeles',
    state: 'CA',
    latitude: 34.0522,
    longitude: -118.2437,
    category: 'destination_city',
    heritage_value: 'high',
    description: 'The end of Route 66 at Santa Monica Pier'
  }
];

export class SupabaseDataService {
  /**
   * Fetch all Route 66 stops
   */
  static async fetchAllStops(): Promise<TripStop[]> {
    console.log(`📊 SupabaseDataService: Returning ${ROUTE_66_STOPS.length} Route 66 stops`);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return ROUTE_66_STOPS;
  }

  /**
   * Get stops by category
   */
  static async getStopsByCategory(category: string): Promise<TripStop[]> {
    const allStops = await this.fetchAllStops();
    return allStops.filter(stop => stop.category === category);
  }

  /**
   * Find stop by name or city
   */
  static async findStopByName(name: string): Promise<TripStop | null> {
    const allStops = await this.fetchAllStops();
    return allStops.find(stop => 
      stop.name.toLowerCase().includes(name.toLowerCase()) ||
      stop.city?.toLowerCase().includes(name.toLowerCase())
    ) || null;
  }

  /**
   * Get destination cities only
   */
  static async getDestinationCities(): Promise<TripStop[]> {
    return this.getStopsByCategory('destination_city');
  }
}
