
import { supabase } from '@/lib/supabase';
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
        (supabase as any).from('attractions').select('id,name,title,slug,description,city_name,state,latitude,longitude,image_url,thumbnail_url,website,category,category_canonical,tags,featured,founded_year,year_opened,admission_fee,hours_of_operation'),
        (supabase as any).from('destination_cities').select('id,name,state,latitude,longitude,description,image_url,thumbnail_url,website,population,elevation_ft,founded_year,featured,status'),
        (supabase as any).from('route66_waypoints').select('id,name,state,latitude,longitude,description,image_url,thumbnail_url,sequence_order,is_major_stop,highway_designation')
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
   * Find best matching stop by location name - BULLETPROOF EXACT MATCHING
   */
  static findBestMatchingStop(locationName: string, allStops: TripStop[]): TripStop | null {
    console.log(`🔍 [BULLETPROOF] Finding stop for: "${locationName}"`);
    
    if (!locationName || !allStops || allStops.length === 0) {
      console.log(`❌ [BULLETPROOF] Invalid input`);
      return null;
    }
    
    const normalizedSearch = locationName.toLowerCase().trim();
    
    // BULLETPROOF: If it contains a comma, it MUST be exact city+state match
    if (normalizedSearch.includes(',')) {
      const [cityPart, statePart] = normalizedSearch.split(',').map(s => s.trim());
      console.log(`🔍 [BULLETPROOF] Exact matching for: "${cityPart}, ${statePart}"`);
      
      // Find EXACT match with ALL possible field combinations
      const exactMatch = allStops.find(stop => {
        const stopName = (stop.name || '').toLowerCase().trim();
        const stopCityName = ((stop as any).city_name || '').toLowerCase().trim();
        const stopCity = (stop.city || '').toLowerCase().trim();
        const stopState = (stop.state || '').toLowerCase().trim();
        
        const cityMatches = stopName === cityPart || stopCityName === cityPart || stopCity === cityPart;
        const stateMatches = stopState === statePart;
        
        return cityMatches && stateMatches;
      });
      
      if (exactMatch) {
        console.log(`✅ [BULLETPROOF] EXACT MATCH FOUND:`, exactMatch);
        return exactMatch;
      } else {
        console.log(`❌ [BULLETPROOF] NO EXACT MATCH - This should not happen if data exists`);
        // Log all Springfield entries for debugging
        const springfieldEntries = allStops.filter(stop => 
          stop.name?.toLowerCase().includes('springfield') ||
          (stop as any).city_name?.toLowerCase().includes('springfield') ||
          stop.city?.toLowerCase().includes('springfield')
        );
        console.log(`🔍 [BULLETPROOF] All Springfield entries:`, springfieldEntries);
        return null;
      }
    }
    
    // For non-comma input, try exact name match
    const exactNameMatch = allStops.find(stop => 
      stop.name.toLowerCase().trim() === normalizedSearch
    );
    
    if (exactNameMatch) {
      console.log(`✅ [BULLETPROOF] Found exact name match:`, exactNameMatch);
      return exactNameMatch;
    }
    
    console.log(`❌ [BULLETPROOF] No match found for: ${locationName}`);
    return null;
  }

  /**
   * Get destination cities specifically
   */
  static async getDestinationCities(): Promise<TripStop[]> {
    console.log('🏛️ [SPRINGFIELD DEBUG] Fetching destination cities from Supabase');
    
    try {
      const { data, error } = await (supabase as any)
        .from('destination_cities')
        .select('id,name,state,latitude,longitude,description,image_url,thumbnail_url,website,population,elevation_ft,founded_year,featured,status')
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
