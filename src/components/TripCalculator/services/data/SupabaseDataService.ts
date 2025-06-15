
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
   * Fetch only attractions and hidden gems from Supabase (NO destination cities)
   */
  static async fetchAllStops(): Promise<TripStop[]> {
    console.log('🔍 SupabaseDataService: Fetching attractions, hidden gems, and drive-ins (NO destination cities)...');
    
    try {
      // Fetch attractions
      const { data: attractions, error: attractionsError } = await supabase
        .from('attractions')
        .select('*');

      if (attractionsError) {
        console.error('❌ Error fetching attractions:', attractionsError);
        throw new Error(`Failed to fetch attractions: ${attractionsError.message}`);
      }

      // Fetch hidden gems
      const { data: hiddenGems, error: hiddenGemsError } = await supabase
        .from('hidden_gems')
        .select('*');

      if (hiddenGemsError) {
        console.error('❌ Error fetching hidden gems:', hiddenGemsError);
        throw new Error(`Failed to fetch hidden gems: ${hiddenGemsError.message}`);
      }

      // Fetch drive-ins
      const { data: driveIns, error: driveInsError } = await supabase
        .from('drive_ins')
        .select('*');

      if (driveInsError) {
        console.error('❌ Error fetching drive-ins:', driveInsError);
        throw new Error(`Failed to fetch drive-ins: ${driveInsError.message}`);
      }

      console.log('✅ SupabaseDataService: Raw data fetched (NO destination cities):', {
        attractions: attractions?.length || 0,
        hiddenGems: hiddenGems?.length || 0,
        driveIns: driveIns?.length || 0
      });

      // Convert all data to TripStop format
      const allStops: TripStop[] = [];

      // Add attractions
      if (attractions) {
        attractions.forEach(attraction => {
          try {
            const stop = convertToTripStop({
              ...attraction,
              category: 'attraction',
              city: attraction.city_name || 'Unknown'
            });
            allStops.push(stop);
          } catch (err) {
            console.warn('⚠️ Failed to convert attraction:', attraction.id, err);
          }
        });
      }

      // Add hidden gems - CRITICAL: Handle missing state field and map 'title' to 'name'
      if (hiddenGems) {
        hiddenGems.forEach(gem => {
          try {
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
            console.log(`✅ Added hidden gem: ${stop.name} in ${stop.city_name}, ${stop.state}`);
          } catch (err) {
            console.warn('⚠️ Failed to convert hidden gem:', gem.id, err);
          }
        });
      }

      // Add drive-ins
      if (driveIns) {
        driveIns.forEach(driveIn => {
          try {
            const stop = convertToTripStop({
              ...driveIn,
              category: 'drive_in',
              city: driveIn.city_name || 'Unknown'
            });
            allStops.push(stop);
            console.log(`✅ Added drive-in: ${stop.name} in ${stop.city_name}, ${stop.state}`);
          } catch (err) {
            console.warn('⚠️ Failed to convert drive-in:', driveIn.id, err);
          }
        });
      }

      console.log('✅ SupabaseDataService: All stops converted (attractions/hidden gems/drive-ins only):', {
        totalStops: allStops.length,
        byCategory: allStops.reduce((acc, stop) => {
          acc[stop.category] = (acc[stop.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        attractionNames: allStops.filter(s => s.category === 'attraction').slice(0, 3).map(s => s.name),
        hiddenGemNames: allStops.filter(s => s.category === 'hidden_gem').slice(0, 3).map(s => s.name),
        driveInNames: allStops.filter(s => s.category === 'drive_in').slice(0, 3).map(s => s.name)
      });

      return allStops;
    } catch (error) {
      console.error('❌ SupabaseDataService: Failed to fetch stops:', error);
      throw error;
    }
  }
}
