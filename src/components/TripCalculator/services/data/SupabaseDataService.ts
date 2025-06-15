
import { supabase } from '@/integrations/supabase/client';
import { TripStop, convertToTripStop } from '../../types/TripStop';

export class SupabaseDataService {
  /**
   * Fetch all stops from Supabase with comprehensive error handling and logging
   */
  static async fetchAllStops(): Promise<TripStop[]> {
    console.log('🔍 [SUPABASE-SERVICE] Starting fetchAllStops...');
    
    try {
      const { data, error } = await supabase
        .from('route_66_stops')
        .select('*')
        .order('name');

      if (error) {
        console.error('❌ [SUPABASE-SERVICE] Database error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        console.warn('⚠️ [SUPABASE-SERVICE] No data returned from database');
        return [];
      }

      console.log(`✅ [SUPABASE-SERVICE] Raw data fetched:`, {
        totalRecords: data.length,
        sampleRecord: data[0] ? {
          id: data[0].id,
          name: data[0].name,
          city: data[0].city_name || data[0].city,
          state: data[0].state,
          category: data[0].category,
          hasDescription: !!data[0].description,
          hasImage: !!(data[0].image_url || data[0].thumbnail_url),
          featured: data[0].featured
        } : null
      });

      // Convert and validate each stop
      const convertedStops: TripStop[] = [];
      let conversionErrors = 0;

      for (const rawStop of data) {
        try {
          const convertedStop = convertToTripStop(rawStop);
          convertedStops.push(convertedStop);
        } catch (conversionError) {
          conversionErrors++;
          console.error(`❌ [SUPABASE-SERVICE] Failed to convert stop:`, {
            stopId: rawStop.id,
            stopName: rawStop.name,
            error: conversionError
          });
        }
      }

      console.log(`✅ [SUPABASE-SERVICE] Conversion complete:`, {
        originalCount: data.length,
        convertedCount: convertedStops.length,
        conversionErrors,
        categoriesFound: [...new Set(convertedStops.map(s => s.category))],
        statesFound: [...new Set(convertedStops.map(s => s.state))],
        featuredCount: convertedStops.filter(s => s.featured).length
      });

      return convertedStops;

    } catch (error) {
      console.error('❌ [SUPABASE-SERVICE] Critical error in fetchAllStops:', error);
      
      // Return empty array instead of throwing to prevent complete failure
      return [];
    }
  }
}
