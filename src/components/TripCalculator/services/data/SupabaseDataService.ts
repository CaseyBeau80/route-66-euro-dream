
import { supabase } from '@/integrations/supabase/client';
import { TripStop, convertToTripStop } from '../../types/TripStop';

// Export TripStop for other services to use
export type { TripStop } from '../../types/TripStop';

export class SupabaseDataService {
  /**
   * Extract state from city_name field (format: "City, ST" or "City, State")
   */
  private static extractStateFromCityName(cityName: string): string {
    if (!cityName || !cityName.includes(',')) {
      return 'Unknown';
    }
    
    const parts = cityName.split(',');
    if (parts.length < 2) {
      return 'Unknown';
    }
    
    return parts[1].trim();
  }

  /**
   * CRITICAL FIX: Fetch and validate only attractions, hidden gems, and drive-ins
   */
  static async fetchAllStops(): Promise<TripStop[]> {
    console.log('🔍 [FIXED] SupabaseDataService: Fetching VALIDATED attractions, hidden gems, and drive-ins...');
    
    try {
      // Fetch attractions with validation
      const { data: attractions, error: attractionsError } = await supabase
        .from('attractions')
        .select('*')
        .not('name', 'is', null)
        .neq('name', '');

      if (attractionsError) {
        console.error('❌ [FIXED] Error fetching attractions:', attractionsError);
        throw new Error(`Failed to fetch attractions: ${attractionsError.message}`);
      }

      // Fetch hidden gems with validation  
      const { data: hiddenGems, error: hiddenGemsError } = await supabase
        .from('hidden_gems')
        .select('*')
        .not('title', 'is', null)
        .neq('title', '');

      if (hiddenGemsError) {
        console.error('❌ [FIXED] Error fetching hidden gems:', hiddenGemsError);
        throw new Error(`Failed to fetch hidden gems: ${hiddenGemsError.message}`);
      }

      // Fetch drive-ins with validation
      const { data: driveIns, error: driveInsError } = await supabase
        .from('drive_ins')
        .select('*')
        .not('name', 'is', null)
        .neq('name', '');

      if (driveInsError) {
        console.error('❌ [FIXED] Error fetching drive-ins:', driveInsError);
        throw new Error(`Failed to fetch drive-ins: ${driveInsError.message}`);
      }

      console.log('✅ [FIXED] SupabaseDataService: Raw data fetched and validated:', {
        attractions: attractions?.length || 0,
        hiddenGems: hiddenGems?.length || 0,
        driveIns: driveIns?.length || 0,
        sampleAttractionNames: attractions?.slice(0, 3).map(a => a.name) || [],
        sampleHiddenGemNames: hiddenGems?.slice(0, 3).map(g => g.title) || []
      });

      // Convert all data to TripStop format with enhanced validation
      const allStops: TripStop[] = [];

      // Add attractions
      if (attractions && attractions.length > 0) {
        attractions.forEach(attraction => {
          try {
            // CRITICAL FIX: Validate attraction data before conversion
            if (!attraction.name || !attraction.city_name || !attraction.latitude || !attraction.longitude) {
              console.warn(`⚠️ [FIXED] Skipping invalid attraction: ${attraction.id} - missing required fields`);
              return;
            }

            const stop = convertToTripStop({
              ...attraction,
              category: 'attraction',
              city: attraction.city_name || 'Unknown'
            });
            allStops.push(stop);
            console.log(`✅ [FIXED] Added attraction: ${stop.name} in ${stop.city_name}, ${stop.state}`);
          } catch (err) {
            console.warn('⚠️ [FIXED] Failed to convert attraction:', attraction.id, err);
          }
        });
      }

      // Add hidden gems with enhanced validation
      if (hiddenGems && hiddenGems.length > 0) {
        hiddenGems.forEach(gem => {
          try {
            // CRITICAL FIX: Validate hidden gem data before conversion
            if (!gem.title || !gem.city_name || !gem.latitude || !gem.longitude) {
              console.warn(`⚠️ [FIXED] Skipping invalid hidden gem: ${gem.id} - missing required fields`);
              return;
            }

            // Extract state from city_name since hidden_gems table doesn't have state column
            const extractedState = this.extractStateFromCityName(gem.city_name || '');
            
            const stop = convertToTripStop({
              ...gem,
              name: gem.title, // Map title to name for hidden gems
              category: 'hidden_gem',
              city: gem.city_name || 'Unknown',
              state: extractedState // Use extracted state
            });
            allStops.push(stop);
            console.log(`✅ [FIXED] Added hidden gem: ${stop.name} in ${stop.city_name}, ${stop.state}`);
          } catch (err) {
            console.warn('⚠️ [FIXED] Failed to convert hidden gem:', gem.id, err);
          }
        });
      }

      // Add drive-ins with validation
      if (driveIns && driveIns.length > 0) {
        driveIns.forEach(driveIn => {
          try {
            // CRITICAL FIX: Validate drive-in data before conversion
            if (!driveIn.name || !driveIn.city_name || !driveIn.latitude || !driveIn.longitude) {
              console.warn(`⚠️ [FIXED] Skipping invalid drive-in: ${driveIn.id} - missing required fields`);
              return;
            }

            const stop = convertToTripStop({
              ...driveIn,
              category: 'drive_in',
              city: driveIn.city_name || 'Unknown'
            });
            allStops.push(stop);
            console.log(`✅ [FIXED] Added drive-in: ${stop.name} in ${stop.city_name}, ${stop.state}`);
          } catch (err) {
            console.warn('⚠️ [FIXED] Failed to convert drive-in:', driveIn.id, err);
          }
        });
      }

      // CRITICAL FIX: Final validation of results
      const validStops = allStops.filter(stop => {
        const isValid = stop && 
          stop.name && 
          stop.name.trim().length > 0 && 
          stop.category &&
          stop.city_name &&
          stop.latitude &&
          stop.longitude;
        
        if (!isValid) {
          console.warn(`⚠️ [FIXED] Filtering out invalid stop:`, stop);
        }
        
        return isValid;
      });

      console.log('✅ [FIXED] SupabaseDataService: FINAL VALIDATED stops:', {
        totalValidStops: validStops.length,
        originalCount: allStops.length,
        filtered: allStops.length - validStops.length,
        byCategory: validStops.reduce((acc, stop) => {
          acc[stop.category] = (acc[stop.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        sampleValidAttractions: validStops.filter(s => s.category === 'attraction').slice(0, 3).map(s => s.name),
        sampleValidHiddenGems: validStops.filter(s => s.category === 'hidden_gem').slice(0, 3).map(s => s.name),
        sampleValidDriveIns: validStops.filter(s => s.category === 'drive_in').slice(0, 3).map(s => s.name)
      });

      return validStops;
    } catch (error) {
      console.error('❌ [FIXED] SupabaseDataService: Failed to fetch stops:', error);
      throw error;
    }
  }
}
