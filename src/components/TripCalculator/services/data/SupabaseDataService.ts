
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
