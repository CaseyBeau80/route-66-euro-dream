
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
   * Find best matching stop by location name - COMPLETELY REWRITTEN FOR ACCURACY
   */
  static findBestMatchingStop(locationName: string, allStops: TripStop[]): TripStop | null {
    console.log(`🔍 [SPRINGFIELD FIX] Finding best matching stop for: "${locationName}"`);
    console.log(`🔍 [SPRINGFIELD FIX] Total stops available: ${allStops.length}`);
    
    const normalizedSearch = locationName.toLowerCase().trim();
    console.log(`🔍 [SPRINGFIELD FIX] normalizedSearch: "${normalizedSearch}"`);
    
    // Debug: Show all Springfield stops available with detailed info
    const springfieldStops = allStops.filter(stop => 
      stop.name.toLowerCase().includes('springfield') ||
      (stop as any).city_name?.toLowerCase().includes('springfield')
    );
    console.log(`🔍 [SPRINGFIELD FIX] Available Springfield stops:`, springfieldStops.map(s => ({
      id: s.id,
      name: s.name,
      city_name: (s as any).city_name,
      city: s.city,
      state: s.state,
      category: s.category
    })));
    
    // CRITICAL FIX: Handle "Springfield, MO" format with exact matching
    if (normalizedSearch.includes(',')) {
      const [cityPart, statePart] = normalizedSearch.split(',').map(s => s.trim());
      console.log(`🔍 [SPRINGFIELD FIX] Parsed - City: "${cityPart}", State: "${statePart}"`);
      
      // COMPREHENSIVE MATCHING STRATEGY
      for (const stop of allStops) {
        const stopName = (stop.name || '').toLowerCase().trim();
        const stopCityName = ((stop as any).city_name || '').toLowerCase().trim();
        const stopCity = (stop.city || '').toLowerCase().trim();
        const stopState = (stop.state || '').toLowerCase().trim();
        
        // Try all possible combinations for city matching
        const cityMatches = stopName === cityPart || stopCityName === cityPart || stopCity === cityPart;
        const stateMatches = stopState === statePart;
        
        if (cityMatches && stateMatches) {
          console.log(`✅ [SPRINGFIELD FIX] PERFECT MATCH FOUND!`);
          console.log(`✅ [SPRINGFIELD FIX] Match details:`, {
            id: stop.id,
            name: stop.name,
            city_name: (stop as any).city_name,
            city: stop.city,
            state: stop.state,
            category: stop.category,
            searchedFor: locationName
          });
          return stop;
        }
        
        // Debug Springfield matches specifically
        if (cityPart === 'springfield') {
          console.log(`🔍 [SPRINGFIELD FIX] Testing stop:`, {
            stopName,
            stopCityName,
            stopCity,
            stopState,
            cityMatches,
            stateMatches,
            fullStop: {
              id: stop.id,
              name: stop.name,
              city_name: (stop as any).city_name,
              city: stop.city,
              state: stop.state
            }
          });
        }
      }
      
      console.log(`❌ [SPRINGFIELD FIX] NO EXACT MATCH FOUND for: "${cityPart}, ${statePart}"`);
      console.log(`❌ [SPRINGFIELD FIX] This means the data doesn't contain this city-state combination`);
      return null;
    }
    
    // For non-comma separated searches, try simple matching
    console.log(`🔍 [SPRINGFIELD FIX] Using simple search for: "${normalizedSearch}"`);
    
    // Try exact name match
    let match = allStops.find(stop => 
      stop.name.toLowerCase().trim() === normalizedSearch
    );
    
    if (match) {
      console.log(`✅ [SPRINGFIELD FIX] Found exact name match: ${match.name}, ${match.state}`);
      return match;
    }
    
    // Try city_name match
    match = allStops.find(stop => 
      (stop as any).city_name?.toLowerCase().trim() === normalizedSearch
    );
    
    if (match) {
      console.log(`✅ [SPRINGFIELD FIX] Found city_name match: ${(match as any).city_name}, ${match.state}`);
      return match;
    }
    
    // Try city match
    match = allStops.find(stop => 
      stop.city?.toLowerCase().trim() === normalizedSearch
    );
    
    if (match) {
      console.log(`✅ [SPRINGFIELD FIX] Found city match: ${match.city}, ${match.state}`);
      return match;
    }
    
    // Try partial matches (exclude Springfield to avoid ambiguity)
    if (!normalizedSearch.includes('springfield')) {
      match = allStops.find(stop => 
        stop.name.toLowerCase().includes(normalizedSearch) ||
        (stop as any).city_name?.toLowerCase().includes(normalizedSearch) ||
        stop.city?.toLowerCase().includes(normalizedSearch) ||
        normalizedSearch.includes(stop.name.toLowerCase())
      );
      
      if (match) {
        console.log(`✅ [SPRINGFIELD FIX] Found partial match: ${match.name}, ${match.state}`);
        return match;
      }
    }
    
    console.log(`❌ [SPRINGFIELD FIX] No matching stop found for: ${locationName}`);
    return null;
  }

  /**
   * Get destination cities specifically
   */
  static async getDestinationCities(): Promise<TripStop[]> {
    console.log('🏛️ [SPRINGFIELD DEBUG] Fetching destination cities from Supabase');
    
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

      // Enhanced debugging for Springfield entries
      console.log('🔍 [SPRINGFIELD DEBUG] Raw data from destination_cities table:', data);
      
      const springfieldEntries = data.filter(city => 
        city.name?.toLowerCase().includes('springfield')
      );
      console.log('🔍 [SPRINGFIELD DEBUG] Springfield entries found in database:', springfieldEntries);

      const destinationStops = data.map(city => {
        const stop = {
          id: city.id,
          name: city.name,
          description: city.description || '',
          category: 'destination_city',
          city_name: city.name,
          city: city.name,
          state: city.state,
          latitude: parseFloat(city.latitude?.toString() || '0'),
          longitude: parseFloat(city.longitude?.toString() || '0')
        };
        
        // Debug Springfield specifically
        if (city.name?.toLowerCase().includes('springfield')) {
          console.log('🔍 [SPRINGFIELD DEBUG] Mapped Springfield stop:', stop);
        }
        
        return stop;
      });

      console.log(`✅ Successfully fetched ${destinationStops.length} destination cities`);
      
      // Final debug of Springfield in the result
      const springfieldStops = destinationStops.filter(stop => 
        stop.name.toLowerCase().includes('springfield')
      );
      console.log('🔍 [SPRINGFIELD DEBUG] Springfield stops in final result:', springfieldStops);
      
      return destinationStops;

    } catch (error) {
      console.error('❌ Failed to fetch destination cities:', error);
      throw new Error('Failed to load destination cities from database');
    }
  }
}
