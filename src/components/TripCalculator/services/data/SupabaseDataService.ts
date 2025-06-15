
import { supabase } from '@/integrations/supabase/client';
import { TripStop, convertToTripStop } from '../../types/TripStop';

export class SupabaseDataService {
  /**
   * Fetch all stops from multiple Supabase tables with comprehensive error handling and logging
   */
  static async fetchAllStops(): Promise<TripStop[]> {
    console.log('🔍 [SUPABASE-SERVICE] Starting fetchAllStops from multiple tables...');
    
    try {
      // Query all relevant tables in parallel
      const [attractionsResult, destinationCitiesResult, route66WaypointsResult] = await Promise.allSettled([
        supabase.from('attractions').select('*').order('name'),
        supabase.from('destination_cities').select('*').order('name'),
        supabase.from('route66_waypoints').select('*').order('name')
      ]);

      const allStops: TripStop[] = [];
      let totalRecords = 0;
      let conversionErrors = 0;

      // Process attractions
      if (attractionsResult.status === 'fulfilled' && !attractionsResult.value.error && attractionsResult.value.data) {
        const attractionsData = attractionsResult.value.data;
        totalRecords += attractionsData.length;
        console.log(`✅ [SUPABASE-SERVICE] Attractions fetched: ${attractionsData.length} records`);

        for (const attraction of attractionsData) {
          try {
            const converted = convertToTripStop({
              id: attraction.id,
              name: attraction.name,
              description: attraction.description || `Discover ${attraction.name} along your Route 66 journey`,
              category: attraction.category || 'attraction',
              city_name: attraction.city_name,
              city: attraction.city_name,
              state: attraction.state,
              latitude: attraction.latitude,
              longitude: attraction.longitude,
              image_url: attraction.image_url,
              thumbnail_url: attraction.thumbnail_url,
              website: attraction.website,
              featured: attraction.featured || false,
              is_major_stop: false,
              is_official_destination: false
            });
            allStops.push(converted);
          } catch (error) {
            conversionErrors++;
            console.error(`❌ [SUPABASE-SERVICE] Failed to convert attraction:`, { id: attraction.id, name: attraction.name, error });
          }
        }
      } else {
        console.warn('⚠️ [SUPABASE-SERVICE] Failed to fetch attractions:', attractionsResult.status === 'fulfilled' ? attractionsResult.value.error : 'Promise rejected');
      }

      // Process destination cities
      if (destinationCitiesResult.status === 'fulfilled' && !destinationCitiesResult.value.error && destinationCitiesResult.value.data) {
        const citiesData = destinationCitiesResult.value.data;
        totalRecords += citiesData.length;
        console.log(`✅ [SUPABASE-SERVICE] Destination cities fetched: ${citiesData.length} records`);

        for (const city of citiesData) {
          try {
            const converted = convertToTripStop({
              id: city.id,
              name: city.name,
              description: city.description || `Explore ${city.name}, a historic Route 66 destination`,
              category: 'destination_city',
              city_name: city.name,
              city: city.name,
              state: city.state,
              latitude: city.latitude,
              longitude: city.longitude,
              image_url: city.image_url,
              thumbnail_url: city.thumbnail_url,
              website: city.website,
              featured: city.featured || false,
              is_major_stop: true,
              is_official_destination: true
            });
            allStops.push(converted);
          } catch (error) {
            conversionErrors++;
            console.error(`❌ [SUPABASE-SERVICE] Failed to convert destination city:`, { id: city.id, name: city.name, error });
          }
        }
      } else {
        console.warn('⚠️ [SUPABASE-SERVICE] Failed to fetch destination cities:', destinationCitiesResult.status === 'fulfilled' ? destinationCitiesResult.value.error : 'Promise rejected');
      }

      // Process route66 waypoints
      if (route66WaypointsResult.status === 'fulfilled' && !route66WaypointsResult.value.error && route66WaypointsResult.value.data) {
        const waypointsData = route66WaypointsResult.value.data;
        totalRecords += waypointsData.length;
        console.log(`✅ [SUPABASE-SERVICE] Route 66 waypoints fetched: ${waypointsData.length} records`);

        for (const waypoint of waypointsData) {
          try {
            const converted = convertToTripStop({
              id: waypoint.id,
              name: waypoint.name,
              description: waypoint.description || `Visit ${waypoint.name}, a historic Route 66 waypoint`,
              category: 'route66_waypoint',
              city_name: waypoint.name,
              city: waypoint.name,
              state: waypoint.state,
              latitude: waypoint.latitude,
              longitude: waypoint.longitude,
              image_url: waypoint.image_url,
              thumbnail_url: waypoint.thumbnail_url,
              website: undefined,
              featured: false,
              is_major_stop: waypoint.is_major_stop || false,
              is_official_destination: false
            });
            allStops.push(converted);
          } catch (error) {
            conversionErrors++;
            console.error(`❌ [SUPABASE-SERVICE] Failed to convert waypoint:`, { id: waypoint.id, name: waypoint.name, error });
          }
        }
      } else {
        console.warn('⚠️ [SUPABASE-SERVICE] Failed to fetch waypoints:', route66WaypointsResult.status === 'fulfilled' ? route66WaypointsResult.value.error : 'Promise rejected');
      }

      console.log(`✅ [SUPABASE-SERVICE] Data aggregation complete:`, {
        totalOriginalRecords: totalRecords,
        convertedStops: allStops.length,
        conversionErrors,
        categoriesFound: [...new Set(allStops.map(s => s.category))],
        statesFound: [...new Set(allStops.map(s => s.state))],
        featuredCount: allStops.filter(s => s.featured).length,
        majorStopsCount: allStops.filter(s => s.is_major_stop).length,
        destinationCitiesCount: allStops.filter(s => s.is_official_destination).length
      });

      return allStops;

    } catch (error) {
      console.error('❌ [SUPABASE-SERVICE] Critical error in fetchAllStops:', error);
      
      // Return empty array instead of throwing to prevent complete failure
      return [];
    }
  }
}
