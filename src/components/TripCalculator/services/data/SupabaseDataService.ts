
import { supabase } from '@/integrations/supabase/client';
import { TripStop } from '../../types/TripStop';

export class SupabaseDataService {
  /**
   * Fetch all Route 66 stops from multiple Supabase tables
   */
  static async fetchAllStops(): Promise<TripStop[]> {
    console.log('📊 SupabaseDataService: Fetching all Route 66 stops from Supabase');
    
    try {
      // Fetch from multiple tables in parallel
      const [attractionsResult, destinationCitiesResult, waypointsResult] = await Promise.all([
        supabase.from('attractions').select('*'),
        supabase.from('destination_cities').select('*'),
        supabase.from('route66_waypoints').select('*')
      ]);

      const allStops: TripStop[] = [];

      // Process attractions
      if (attractionsResult.data) {
        const attractionStops = attractionsResult.data.map(attraction => ({
          id: attraction.id,
          name: attraction.name,
          description: attraction.description || '',
          category: attraction.category || 'attraction',
          city_name: attraction.city_name,
          city: attraction.city_name, // Map city_name to city for compatibility
          state: attraction.state,
          latitude: parseFloat(attraction.latitude?.toString() || '0'),
          longitude: parseFloat(attraction.longitude?.toString() || '0')
        }));
        allStops.push(...attractionStops);
      }

      // Process destination cities
      if (destinationCitiesResult.data) {
        const cityStops = destinationCitiesResult.data.map(city => ({
          id: city.id,
          name: city.name,
          description: city.description || '',
          category: 'destination_city',
          city_name: city.name,
          city: city.name,
          state: city.state,
          latitude: parseFloat(city.latitude?.toString() || '0'),
          longitude: parseFloat(city.longitude?.toString() || '0')
        }));
        allStops.push(...cityStops);
      }

      // Process waypoints
      if (waypointsResult.data) {
        const waypointStops = waypointsResult.data.map(waypoint => ({
          id: waypoint.id,
          name: waypoint.name,
          description: waypoint.description || '',
          category: waypoint.is_major_stop ? 'major_waypoint' : 'waypoint',
          city_name: waypoint.name,
          city: waypoint.name,
          state: waypoint.state,
          latitude: parseFloat(waypoint.latitude?.toString() || '0'),
          longitude: parseFloat(waypoint.longitude?.toString() || '0')
        }));
        allStops.push(...waypointStops);
      }

      console.log(`✅ Successfully fetched ${allStops.length} stops from Supabase:`, {
        attractions: attractionsResult.data?.length || 0,
        cities: destinationCitiesResult.data?.length || 0,
        waypoints: waypointsResult.data?.length || 0
      });

      return allStops;

    } catch (error) {
      console.error('❌ Failed to fetch stops from Supabase:', error);
      throw new Error('Failed to load Route 66 stops from database');
    }
  }

  /**
   * Get stops by category
   */
  static async getStopsByCategory(category: string): Promise<TripStop[]> {
    const allStops = await this.fetchAllStops();
    return allStops.filter(stop => stop.category === category);
  }

  /**
   * Find stop by name
   */
  static async findStopByName(name: string): Promise<TripStop | null> {
    console.log(`🔍 SupabaseDataService: Finding stop by name: ${name}`);
    
    try {
      const allStops = await this.fetchAllStops();
      const normalizedSearchName = name.toLowerCase().trim();
      
      // Try exact match first
      const exactMatch = allStops.find(stop => 
        stop.name.toLowerCase().trim() === normalizedSearchName
      );
      
      if (exactMatch) {
        console.log(`✅ Found exact match: ${exactMatch.name}`);
        return exactMatch;
      }
      
      // Try partial match
      const partialMatch = allStops.find(stop => 
        stop.name.toLowerCase().includes(normalizedSearchName) ||
        normalizedSearchName.includes(stop.name.toLowerCase())
      );
      
      if (partialMatch) {
        console.log(`✅ Found partial match: ${partialMatch.name}`);
        return partialMatch;
      }
      
      console.log(`❌ No stop found with name: ${name}`);
      return null;
      
    } catch (error) {
      console.error('❌ Failed to find stop by name:', error);
      return null;
    }
  }

  /**
   * Find best matching stop by location name
   */
  static findBestMatchingStop(locationName: string, allStops: TripStop[]): TripStop | null {
    console.log(`🔍 [SPRINGFIELD DEBUG] Finding best matching stop for: "${locationName}"`);
    
    const normalizedSearch = locationName.toLowerCase().trim();
    console.log(`🔍 [SPRINGFIELD DEBUG] normalizedSearch: "${normalizedSearch}"`);
    
    // Debug: Show all Springfield stops available
    const springfieldStops = allStops.filter(stop => 
      stop.name.toLowerCase().includes('springfield') ||
      (stop as any).city_name?.toLowerCase().includes('springfield')
    );
    console.log(`🔍 [SPRINGFIELD DEBUG] Available Springfield stops:`, springfieldStops.map(s => `${s.name || (s as any).city_name}, ${s.state}`));
    
    // FIXED: Handle "City, State" format first
    if (normalizedSearch.includes(',')) {
      const [cityPart, statePart] = normalizedSearch.split(',').map(s => s.trim());
      console.log(`🔍 [SPRINGFIELD DEBUG] Parsed city: "${cityPart}", state: "${statePart}"`);
      
      // Try exact city + state match
      let match = allStops.find(stop => 
        stop.name.toLowerCase().trim() === cityPart && 
        stop.state.toLowerCase().trim() === statePart
      );
      
      if (match) {
        console.log(`✅ [SPRINGFIELD DEBUG] Found exact city + state match: ${match.name}, ${match.state}`);
        return match;
      } else {
        console.log(`❌ [SPRINGFIELD DEBUG] No exact city + state match found for: "${cityPart}", "${statePart}"`);
        // Debug: Show what we're comparing against
        allStops.filter(stop => stop.name.toLowerCase().includes(cityPart)).forEach(stop => {
          console.log(`🔍 [SPRINGFIELD DEBUG] Checking: "${stop.name.toLowerCase().trim()}" === "${cityPart}" && "${stop.state.toLowerCase().trim()}" === "${statePart}"`);
        });
      }
      
      // Try city_name + state match if available
      if (allStops[0] && 'city_name' in allStops[0]) {
        match = allStops.find(stop => 
          (stop as any).city_name?.toLowerCase().trim() === cityPart && 
          stop.state.toLowerCase().trim() === statePart
        );
        
        if (match) {
          console.log(`✅ Found city_name + state match: ${(match as any).city_name}, ${match.state}`);
          return match;
        }
      }
    }
    
    // Try exact name match
    let match = allStops.find(stop => 
      stop.name.toLowerCase().trim() === normalizedSearch
    );
    
    if (match) {
      console.log(`✅ Found exact name match: ${match.name}`);
      return match;
    }
    
    // Try city_name match if available
    if (allStops[0] && 'city_name' in allStops[0]) {
      match = allStops.find(stop => 
        (stop as any).city_name?.toLowerCase().trim() === normalizedSearch
      );
      
      if (match) {
        console.log(`✅ Found city_name match: ${(match as any).city_name}`);
        return match;
      }
    }
    
    // Try partial matches (but be more careful with ambiguous cities like Springfield)
    if (!normalizedSearch.includes('springfield')) {
      match = allStops.find(stop => 
        stop.name.toLowerCase().includes(normalizedSearch) ||
        (allStops[0] && 'city_name' in allStops[0] && (stop as any).city_name?.toLowerCase().includes(normalizedSearch)) ||
        normalizedSearch.includes(stop.name.toLowerCase())
      );
      
      if (match) {
        console.log(`✅ Found partial match: ${match.name}`);
        return match;
      }
    }
    
    console.log(`❌ No matching stop found for: ${locationName}`);
    return null;
  }

  /**
   * Get destination cities specifically
   */
  static async getDestinationCities(): Promise<TripStop[]> {
    console.log('🏛️ Fetching destination cities from Supabase');
    
    try {
      const { data, error } = await supabase
        .from('destination_cities')
        .select('*')
        .order('name');

      if (error) {
        console.error('❌ Error fetching destination cities:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn('⚠️ No destination cities found in database');
        return [];
      }

      const destinationStops = data.map(city => ({
        id: city.id,
        name: city.name,
        description: city.description || '',
        category: 'destination_city',
        city_name: city.name,
        city: city.name,
        state: city.state,
        latitude: parseFloat(city.latitude?.toString() || '0'),
        longitude: parseFloat(city.longitude?.toString() || '0')
      }));

      console.log(`✅ Successfully fetched ${destinationStops.length} destination cities`);
      return destinationStops;

    } catch (error) {
      console.error('❌ Failed to fetch destination cities:', error);
      throw new Error('Failed to load destination cities from database');
    }
  }
}
