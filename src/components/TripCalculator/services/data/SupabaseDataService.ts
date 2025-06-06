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
  
  // Rest of the class implementation
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

// Mock data for development and testing
const mockStopsData: Partial<UnifiedTripStop>[] = [
  {
    id: "chicago-start",
    name: "Chicago",
    description: "The official starting point of Route 66",
    category: "destination_city",
    city_name: "Chicago",
    city: "Chicago", // Add city field to match the interface
    state: "IL",
    latitude: 41.8781,
    longitude: -87.6298,
    is_major_stop: true,
    is_official_destination: true
  },
  {
    id: "lou-mitchells",
    name: "Lou Mitchell's",
    description: "Famous breakfast spot at the start of Route 66",
    category: "restaurant",
    city_name: "Chicago",
    city: "Chicago", // Add city field to match the interface
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
  }
];
