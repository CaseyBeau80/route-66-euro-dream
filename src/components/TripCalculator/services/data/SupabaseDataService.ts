
import { supabase } from '@/integrations/supabase/client';
import { TripStop, convertToTripStop } from '../../types/TripStop';

export class SupabaseDataService {
  static async fetchAllStops(): Promise<TripStop[]> {
    console.log('🔍 [SUPABASE] SupabaseDataService.fetchAllStops starting...');
    
    try {
      // Query all relevant tables for stops data
      const [attractionsResult, destinationCitiesResult, driveInsResult, hiddenGemsResult, waypointsResult] = await Promise.all([
        supabase.from('attractions').select('*'),
        supabase.from('destination_cities').select('*'),
        supabase.from('drive_ins').select('*'),
        supabase.from('hidden_gems').select('*'),
        supabase.from('route66_waypoints').select('*')
      ]);

      console.log('🔍 [SUPABASE] Raw query results:', {
        attractions: { count: attractionsResult.data?.length || 0, error: attractionsResult.error },
        destinationCities: { count: destinationCitiesResult.data?.length || 0, error: destinationCitiesResult.error },
        driveIns: { count: driveInsResult.data?.length || 0, error: driveInsResult.error },
        hiddenGems: { count: hiddenGemsResult.data?.length || 0, error: hiddenGemsResult.error },
        waypoints: { count: waypointsResult.data?.length || 0, error: waypointsResult.error }
      });

      // Check for errors
      const errors = [attractionsResult.error, destinationCitiesResult.error, driveInsResult.error, hiddenGemsResult.error, waypointsResult.error].filter(Boolean);
      if (errors.length > 0) {
        console.error('❌ [SUPABASE] Database query errors:', errors);
        throw new Error(`Database errors: ${errors.map(e => e.message).join(', ')}`);
      }

      const allStops: TripStop[] = [];

      // Process attractions
      if (attractionsResult.data) {
        const attractionStops = attractionsResult.data.map(attraction => convertToTripStop({
          id: attraction.id,
          name: attraction.name,
          description: attraction.description || `Visit ${attraction.name} in ${attraction.city_name}`,
          category: attraction.category || 'attraction',
          city_name: attraction.city_name,
          city: attraction.city_name,
          state: attraction.state,
          latitude: Number(attraction.latitude),
          longitude: Number(attraction.longitude),
          image_url: attraction.image_url,
          thumbnail_url: attraction.thumbnail_url,
          website: attraction.website,
          featured: attraction.featured || false
        }));
        allStops.push(...attractionStops);
        console.log(`✅ [SUPABASE] Added ${attractionStops.length} attractions`);
      }

      // Process destination cities
      if (destinationCitiesResult.data) {
        const cityStops = destinationCitiesResult.data.map(city => convertToTripStop({
          id: city.id,
          name: city.name,
          description: city.description || `Explore ${city.name}, a historic Route 66 destination`,
          category: 'destination_city',
          city_name: city.name,
          city: city.name,
          state: city.state,
          latitude: Number(city.latitude),
          longitude: Number(city.longitude),
          image_url: city.image_url,
          thumbnail_url: city.thumbnail_url,
          website: city.website,
          featured: city.featured || false,
          is_official_destination: true
        }));
        allStops.push(...cityStops);
        console.log(`✅ [SUPABASE] Added ${cityStops.length} destination cities`);
      }

      // Process drive-ins
      if (driveInsResult.data) {
        const driveInStops = driveInsResult.data.map(driveIn => convertToTripStop({
          id: driveIn.id,
          name: driveIn.name,
          description: driveIn.description || `Historic drive-in theater in ${driveIn.city_name}`,
          category: 'drive_in',
          city_name: driveIn.city_name,
          city: driveIn.city_name,
          state: driveIn.state,
          latitude: Number(driveIn.latitude),
          longitude: Number(driveIn.longitude),
          image_url: driveIn.image_url,
          thumbnail_url: driveIn.thumbnail_url,
          website: driveIn.website,
          featured: driveIn.featured || false
        }));
        allStops.push(...driveInStops);
        console.log(`✅ [SUPABASE] Added ${driveInStops.length} drive-ins`);
      }

      // Process hidden gems
      if (hiddenGemsResult.data) {
        const gemStops = hiddenGemsResult.data.map(gem => convertToTripStop({
          id: gem.id,
          name: gem.title, // Note: hidden_gems uses 'title' instead of 'name'
          description: gem.description || `Hidden gem in ${gem.city_name}`,
          category: 'hidden_gem',
          city_name: gem.city_name,
          city: gem.city_name,
          state: 'Unknown', // hidden_gems table doesn't have state
          latitude: Number(gem.latitude),
          longitude: Number(gem.longitude),
          image_url: gem.image_url,
          thumbnail_url: gem.thumbnail_url,
          website: gem.website,
          featured: false
        }));
        allStops.push(...gemStops);
        console.log(`✅ [SUPABASE] Added ${gemStops.length} hidden gems`);
      }

      // Process Route 66 waypoints
      if (waypointsResult.data) {
        const waypointStops = waypointsResult.data.map(waypoint => convertToTripStop({
          id: waypoint.id,
          name: waypoint.name,
          description: waypoint.description || `Historic Route 66 waypoint: ${waypoint.name}`,
          category: 'route66_waypoint',
          city_name: waypoint.name, // Use waypoint name as city for waypoints
          city: waypoint.name,
          state: waypoint.state,
          latitude: Number(waypoint.latitude),
          longitude: Number(waypoint.longitude),
          image_url: waypoint.image_url,
          thumbnail_url: waypoint.thumbnail_url,
          featured: false,
          is_major_stop: waypoint.is_major_stop || false
        }));
        allStops.push(...waypointStops);
        console.log(`✅ [SUPABASE] Added ${waypointStops.length} waypoints`);
      }

      console.log('✅ [SUPABASE] Final stops summary:', {
        totalStops: allStops.length,
        stopsWithDescriptions: allStops.filter(s => s.description && s.description.length > 20).length,
        stopsWithImages: allStops.filter(s => s.image_url || s.thumbnail_url).length,
        featuredStops: allStops.filter(s => s.featured).length,
        categoryBreakdown: allStops.reduce((acc, stop) => {
          acc[stop.category] = (acc[stop.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        sampleStops: allStops.slice(0, 5).map(s => ({
          name: s.name,
          city: s.city_name,
          category: s.category,
          hasDescription: !!s.description,
          hasImage: !!(s.image_url || s.thumbnail_url)
        }))
      });

      return allStops;
    } catch (error) {
      console.error('❌ [SUPABASE] Error fetching stops:', error);
      throw error;
    }
  }
}
