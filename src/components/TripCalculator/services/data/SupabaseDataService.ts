
import { supabase } from '@/integrations/supabase/client';
import { TripStop } from '../../types/TripStop';

export interface TripStop {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  city_name: string;
  city?: string;
  state: string;
  category?: string;
  featured?: boolean;
  is_major_stop?: boolean;
}

export class SupabaseDataService {
  /**
   * Fetch all stops from multiple tables with comprehensive debugging
   */
  static async fetchAllStops(): Promise<TripStop[]> {
    console.log('🚨 [CRITICAL-DATA] Starting comprehensive stops fetch from all tables...');
    
    try {
      // Fetch from all relevant tables
      const [attractionsResult, destinationCitiesResult, hiddenGemsResult, driveInsResult, waypointsResult] = await Promise.all([
        supabase.from('attractions').select('*'),
        supabase.from('destination_cities').select('*'),
        supabase.from('hidden_gems').select('*'),
        supabase.from('drive_ins').select('*'),
        supabase.from('route66_waypoints').select('*')
      ]);

      console.log('🚨 [CRITICAL-DATA] Raw table fetch results:', {
        attractions: { count: attractionsResult.data?.length || 0, error: attractionsResult.error },
        destinationCities: { count: destinationCitiesResult.data?.length || 0, error: destinationCitiesResult.error },
        hiddenGems: { count: hiddenGemsResult.data?.length || 0, error: hiddenGemsResult.error },
        driveIns: { count: driveInsResult.data?.length || 0, error: driveInsResult.error },
        waypoints: { count: waypointsResult.data?.length || 0, error: waypointsResult.error }
      });

      // Check for errors
      if (attractionsResult.error) console.error('❌ [CRITICAL-DATA] Attractions fetch error:', attractionsResult.error);
      if (destinationCitiesResult.error) console.error('❌ [CRITICAL-DATA] Destination cities fetch error:', destinationCitiesResult.error);
      if (hiddenGemsResult.error) console.error('❌ [CRITICAL-DATA] Hidden gems fetch error:', hiddenGemsResult.error);
      if (driveInsResult.error) console.error('❌ [CRITICAL-DATA] Drive-ins fetch error:', driveInsResult.error);
      if (waypointsResult.error) console.error('❌ [CRITICAL-DATA] Waypoints fetch error:', waypointsResult.error);

      const allStops: TripStop[] = [];

      // Process attractions
      if (attractionsResult.data) {
        const attractions = attractionsResult.data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
          city_name: item.city_name,
          city: item.city_name,
          state: item.state,
          category: 'attraction',
          featured: item.featured
        }));
        allStops.push(...attractions);
        console.log(`🎯 [CRITICAL-DATA] Processed ${attractions.length} attractions`);
      }

      // Process destination cities
      if (destinationCitiesResult.data) {
        const cities = destinationCitiesResult.data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
          city_name: item.name,
          city: item.name,
          state: item.state,
          category: 'destination_city',
          featured: item.featured
        }));
        allStops.push(...cities);
        console.log(`🏙️ [CRITICAL-DATA] Processed ${cities.length} destination cities`);
      }

      // Process hidden gems
      if (hiddenGemsResult.data) {
        const gems = hiddenGemsResult.data.map(item => ({
          id: item.id,
          name: item.title,
          description: item.description,
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
          city_name: item.city_name,
          city: item.city_name,
          state: 'Unknown', // Hidden gems table doesn't have state
          category: 'hidden_gem'
        }));
        allStops.push(...gems);
        console.log(`💎 [CRITICAL-DATA] Processed ${gems.length} hidden gems`);
      }

      // Process drive-ins
      if (driveInsResult.data) {
        const driveIns = driveInsResult.data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
          city_name: item.city_name,
          city: item.city_name,
          state: item.state,
          category: 'drive_in',
          featured: item.featured
        }));
        allStops.push(...driveIns);
        console.log(`🎬 [CRITICAL-DATA] Processed ${driveIns.length} drive-ins`);
      }

      // Process waypoints
      if (waypointsResult.data) {
        const waypoints = waypointsResult.data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
          city_name: item.name,
          city: item.name,
          state: item.state,
          category: 'route66_waypoint',
          is_major_stop: item.is_major_stop
        }));
        allStops.push(...waypoints);
        console.log(`🛣️ [CRITICAL-DATA] Processed ${waypoints.length} waypoints`);
      }

      console.log('✅ [CRITICAL-DATA] Final stops compilation:', {
        totalStops: allStops.length,
        byCategory: allStops.reduce((acc, stop) => {
          const cat = stop.category || 'unknown';
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        sampleStops: allStops.slice(0, 5).map(s => ({
          id: s.id,
          name: s.name,
          category: s.category,
          city: s.city_name,
          state: s.state
        }))
      });

      return allStops;

    } catch (error) {
      console.error('❌ [CRITICAL-DATA] Critical error in fetchAllStops:', error);
      throw error;
    }
  }
}
