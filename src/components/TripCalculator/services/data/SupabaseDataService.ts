
import { supabase } from '@/integrations/supabase/client';
import { TripStop } from '../../types/TripStop';

export class SupabaseDataService {
  /**
   * Fetch all stops from multiple tables with enhanced data mapping
   */
  static async fetchAllStops(): Promise<TripStop[]> {
    console.log('🚨 [ENHANCED-DATA] Starting enhanced stops fetch from all tables...');
    
    try {
      // Fetch from all relevant tables
      const [attractionsResult, destinationCitiesResult, hiddenGemsResult, driveInsResult, waypointsResult] = await Promise.all([
        supabase.from('attractions').select('*'),
        supabase.from('destination_cities').select('*'),
        supabase.from('hidden_gems').select('*'),
        supabase.from('drive_ins').select('*'),
        supabase.from('route66_waypoints').select('*')
      ]);

      console.log('🚨 [ENHANCED-DATA] Enhanced table fetch results:', {
        attractions: { count: attractionsResult.data?.length || 0, error: attractionsResult.error },
        destinationCities: { count: destinationCitiesResult.data?.length || 0, error: destinationCitiesResult.error },
        hiddenGems: { count: hiddenGemsResult.data?.length || 0, error: hiddenGemsResult.error },
        driveIns: { count: driveInsResult.data?.length || 0, error: driveInsResult.error },
        waypoints: { count: waypointsResult.data?.length || 0, error: waypointsResult.error }
      });

      // Check for errors
      if (attractionsResult.error) console.error('❌ [ENHANCED-DATA] Attractions fetch error:', attractionsResult.error);
      if (destinationCitiesResult.error) console.error('❌ [ENHANCED-DATA] Destination cities fetch error:', destinationCitiesResult.error);
      if (hiddenGemsResult.error) console.error('❌ [ENHANCED-DATA] Hidden gems fetch error:', hiddenGemsResult.error);
      if (driveInsResult.error) console.error('❌ [ENHANCED-DATA] Drive-ins fetch error:', driveInsResult.error);
      if (waypointsResult.error) console.error('❌ [ENHANCED-DATA] Waypoints fetch error:', waypointsResult.error);

      const allStops: TripStop[] = [];

      // Process attractions with enhanced data mapping
      if (attractionsResult.data) {
        const attractions = attractionsResult.data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || `Discover ${item.name} along your Route 66 journey`,
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
          city_name: item.city_name,
          city: item.city_name,
          state: item.state,
          category: 'attraction',
          featured: item.featured || false,
          image_url: item.image_url,
          thumbnail_url: item.thumbnail_url
        }));
        allStops.push(...attractions);
        console.log(`🎯 [ENHANCED-DATA] Processed ${attractions.length} attractions with rich data`);
      }

      // Process destination cities with enhanced data mapping
      if (destinationCitiesResult.data) {
        const cities = destinationCitiesResult.data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || `Explore ${item.name} on your Route 66 adventure`,
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
          city_name: item.name,
          city: item.name,
          state: item.state,
          category: 'destination_city',
          featured: item.featured || false,
          image_url: item.image_url,
          thumbnail_url: item.thumbnail_url,
          is_official_destination: true,
          is_major_stop: true
        }));
        allStops.push(...cities);
        console.log(`🏙️ [ENHANCED-DATA] Processed ${cities.length} destination cities with rich data`);
      }

      // Process hidden gems with enhanced data mapping
      if (hiddenGemsResult.data) {
        const gems = hiddenGemsResult.data.map(item => ({
          id: item.id,
          name: item.title,
          description: item.description || `Discover this hidden gem: ${item.title}`,
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
          city_name: item.city_name,
          city: item.city_name,
          state: 'Unknown', // Hidden gems table doesn't have state
          category: 'hidden_gem',
          image_url: item.image_url,
          thumbnail_url: item.thumbnail_url,
          featured: false
        }));
        allStops.push(...gems);
        console.log(`💎 [ENHANCED-DATA] Processed ${gems.length} hidden gems with rich data`);
      }

      // Process drive-ins with enhanced data mapping
      if (driveInsResult.data) {
        const driveIns = driveInsResult.data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || `Experience ${item.name} drive-in theater`,
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
          city_name: item.city_name,
          city: item.city_name,
          state: item.state,
          category: 'drive_in',
          featured: item.featured || false,
          image_url: item.image_url,
          thumbnail_url: item.thumbnail_url
        }));
        allStops.push(...driveIns);
        console.log(`🎬 [ENHANCED-DATA] Processed ${driveIns.length} drive-ins with rich data`);
      }

      // Process waypoints with enhanced data mapping
      if (waypointsResult.data) {
        const waypoints = waypointsResult.data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || `Route 66 waypoint: ${item.name}`,
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
          city_name: item.name,
          city: item.name,
          state: item.state,
          category: 'route66_waypoint',
          is_major_stop: item.is_major_stop || false,
          image_url: item.image_url,
          thumbnail_url: item.thumbnail_url,
          featured: false
        }));
        allStops.push(...waypoints);
        console.log(`🛣️ [ENHANCED-DATA] Processed ${waypoints.length} waypoints with rich data`);
      }

      // Enhanced data quality analysis
      const dataQuality = {
        totalStops: allStops.length,
        withDescriptions: allStops.filter(s => s.description && s.description.length > 20).length,
        withImages: allStops.filter(s => s.image_url || s.thumbnail_url).length,
        featured: allStops.filter(s => s.featured).length,
        majorStops: allStops.filter(s => s.is_major_stop).length,
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
          state: s.state,
          featured: s.featured,
          hasDescription: !!s.description,
          hasImage: !!(s.image_url || s.thumbnail_url)
        }))
      };

      console.log('✅ [ENHANCED-DATA] Enhanced stops compilation with data quality analysis:', dataQuality);

      return allStops;

    } catch (error) {
      console.error('❌ [ENHANCED-DATA] Critical error in enhanced fetchAllStops:', error);
      throw error;
    }
  }
}
