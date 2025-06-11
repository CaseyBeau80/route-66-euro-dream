// Import any required dependencies
import { TripStop as UnifiedTripStop } from "../../types/TripStop";

// Re-export the TripStop type from the unified interface
export type { UnifiedTripStop as TripStop };

export class SupabaseDataService {
  /**
   * Fetch all stops from database or mock data
   */
  static async fetchAllStops(): Promise<UnifiedTripStop[]> {
    console.log('🔍 Fetching all Route 66 stops...');
    
    // In a real implementation, this would fetch from Supabase
    // For now, return mock data that matches our unified TripStop interface
    return mockStopsData.map(stop => ({
      id: stop.id || `stop-${Math.random()}`,
      name: stop.name || 'Unknown Stop',
      description: stop.description || `Discover ${stop.name || 'this location'} along your Route 66 journey`,
      category: stop.category || 'attraction',
      city_name: stop.city_name || 'Unknown',
      city: stop.city || stop.city_name || 'Unknown City',
      state: stop.state || 'Unknown',
      latitude: stop.latitude || 0,
      longitude: stop.longitude || 0,
      image_url: stop.image_url,
      is_major_stop: stop.is_major_stop,
      is_official_destination: stop.is_official_destination
    }));
  }
  
  static async fetchStopsByCategory(category: string): Promise<UnifiedTripStop[]> {
    const allStops = await this.fetchAllStops();
    return allStops.filter(stop => stop.category === category);
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
    const allStops = await this.fetchAllStops();
    return allStops.filter(stop => stop.is_major_stop === true);
  }
  
  static async fetchOfficialDestinations(): Promise<UnifiedTripStop[]> {
    const allStops = await this.fetchAllStops();
    return allStops.filter(stop => stop.is_official_destination === true);
  }
}

// Mock data for development and testing - EXPANDED with MISSING CITIES ADDED
const mockStopsData: Partial<UnifiedTripStop>[] = [
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
    id: "bloomington-il",
    name: "Bloomington",
    description: "Twin city with Normal, important Route 66 stop",
    category: "destination_city",
    city_name: "Bloomington",
    city: "Bloomington",
    state: "IL",
    latitude: 40.4842,
    longitude: -88.9934,
    is_major_stop: true
  },
  {
    id: "litchfield-il",
    name: "Litchfield",
    description: "Classic Route 66 town in Illinois",
    category: "destination_city",
    city_name: "Litchfield",
    city: "Litchfield",
    state: "IL",
    latitude: 39.1753,
    longitude: -89.6542
  },
  
  // ADDED: MISSING MISSOURI CITIES
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
    id: "carthage-mo",
    name: "Carthage",
    description: "Historic Route 66 town known for its Victorian architecture",
    category: "destination_city",
    city_name: "Carthage",
    city: "Carthage",
    state: "MO",
    latitude: 37.1765,
    longitude: -94.3100
  },
  {
    id: "webb-city-mo",
    name: "Webb City",
    description: "Small Route 66 town in Missouri",
    category: "destination_city",
    city_name: "Webb City",
    city: "Webb City",
    state: "MO",
    latitude: 37.1467,
    longitude: -94.4663
  },
  {
    id: "lou-mitchells",
    name: "Lou Mitchell's",
    description: "Famous breakfast spot at the start of Route 66",
    category: "restaurant",
    city_name: "Chicago",
    city: "Chicago",
    state: "IL",
    latitude: 41.8786,
    longitude: -87.6393
  },
  {
    id: "gemini-giant",
    name: "Gemini Giant",
    description: "Iconic Route 66 roadside attraction",
    category: "attraction",
    city_name: "Wilmington",
    city: "Wilmington",
    state: "IL",
    latitude: 41.3081,
    longitude: -88.1487
  },
  {
    id: "chain-of-rocks-bridge",
    name: "Chain of Rocks Bridge",
    description: "Historic Route 66 bridge over the Mississippi River",
    category: "historic_site",
    city_name: "St. Louis",
    city: "St. Louis",
    state: "MO",
    latitude: 38.7584,
    longitude: -90.1780
  },
  {
    id: "gateway-arch",
    name: "Gateway Arch",
    description: "Iconic St. Louis landmark near Route 66",
    category: "attraction",
    city_name: "St. Louis",
    city: "St. Louis",
    state: "MO",
    latitude: 38.6247,
    longitude: -90.1848,
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
    id: "meramec-caverns",
    name: "Meramec Caverns",
    description: "Famous cave system and Route 66 attraction",
    category: "attraction",
    city_name: "Stanton",
    city: "Stanton",
    state: "MO",
    latitude: 38.2342,
    longitude: -91.1137
  },

  // ADDED: MISSOURI ATTRACTIONS
  {
    id: "fantastic-caverns",
    name: "Fantastic Caverns",
    description: "America's only ride-through cave attraction in Springfield, MO",
    category: "attraction",
    city_name: "Springfield",
    city: "Springfield",
    state: "MO",
    latitude: 37.2745,
    longitude: -93.3376
  },
  {
    id: "wilson-park",
    name: "Wilson's Creek National Battlefield",
    description: "Civil War battlefield near Springfield, MO",
    category: "historic_site",
    city_name: "Springfield",
    city: "Springfield", 
    state: "MO",
    latitude: 37.1011,
    longitude: -93.4074
  },
  {
    id: "blue-whale-catoosa",
    name: "Blue Whale of Catoosa",
    description: "Beloved Route 66 roadside attraction",
    category: "attraction",
    city_name: "Catoosa",
    city: "Catoosa",
    state: "OK",
    latitude: 36.1895,
    longitude: -95.7313
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
    id: "cadillac-ranch",
    name: "Cadillac Ranch",
    description: "Famous art installation of half-buried Cadillacs",
    category: "attraction",
    city_name: "Amarillo",
    city: "Amarillo",
    state: "TX",
    latitude: 35.1872,
    longitude: -101.9871,
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
    id: "midpoint-cafe",
    name: "Midpoint Cafe",
    description: "Restaurant marking the midpoint of Route 66",
    category: "restaurant",
    city_name: "Adrian",
    city: "Adrian",
    state: "TX",
    latitude: 35.2742,
    longitude: -102.6769
  },
  {
    id: "blue-swallow-motel",
    name: "Blue Swallow Motel",
    description: "Historic Route 66 motel with vintage neon sign",
    category: "lodging",
    city_name: "Tucumcari",
    city: "Tucumcari",
    state: "NM",
    latitude: 35.1719,
    longitude: -103.7249
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
    id: "petrified-forest",
    name: "Petrified Forest National Park",
    description: "National park featuring petrified wood and the Painted Desert",
    category: "attraction",
    city_name: "Holbrook",
    city: "Holbrook",
    state: "AZ",
    latitude: 34.9099,
    longitude: -109.8068,
    is_major_stop: true
  },
  {
    id: "wigwam-motel",
    name: "Wigwam Motel",
    description: "Iconic motel with teepee-shaped rooms",
    category: "lodging",
    city_name: "Holbrook",
    city: "Holbrook",
    state: "AZ",
    latitude: 34.9011,
    longitude: -110.1662
  },
  {
    id: "flagstaff-az",
    name: "Flagstaff",
    description: "Mountain city and gateway to Grand Canyon",
    category: "destination_city",
    city_name: "Flagstaff",
    city: "Flagstaff",
    state: "AZ",
    latitude: 35.1983,
    longitude: -111.6513,
    is_major_stop: true
  },
  {
    id: "grand-canyon",
    name: "Grand Canyon",
    description: "Natural wonder near Route 66",
    category: "attraction",
    city_name: "Williams",
    city: "Williams",
    state: "AZ",
    latitude: 36.0544,
    longitude: -112.1401,
    is_major_stop: true
  },
  {
    id: "roy's-motel-cafe",
    name: "Roy's Motel & Cafe",
    description: "Iconic Route 66 motel and cafe",
    category: "lodging",
    city_name: "Amboy",
    city: "Amboy",
    state: "CA",
    latitude: 34.5583,
    longitude: -115.7458
  },
  {
    id: "santa-monica-pier",
    name: "Santa Monica Pier",
    description: "The official end point of Route 66",
    category: "destination_city",
    city_name: "Santa Monica",
    city: "Santa Monica",
    state: "CA",
    latitude: 34.0089,
    longitude: -118.4973,
    is_major_stop: true,
    is_official_destination: true
  },
  {
    id: "los-angeles-ca",
    name: "Los Angeles",
    description: "The City of Angels - Western terminus of Route 66",
    category: "destination_city",
    city_name: "Los Angeles",
    city: "Los Angeles",
    state: "CA",
    latitude: 34.0522,
    longitude: -118.2437,
    is_major_stop: true,
    is_official_destination: true
  }
];
