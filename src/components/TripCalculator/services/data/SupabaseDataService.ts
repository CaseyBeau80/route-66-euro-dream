
import { supabase } from '@/integrations/supabase/client';
import { TripStop, convertToTripStop } from '../../types/TripStop';

// Export TripStop for other services to use
export type { TripStop } from '../../types/TripStop';

export class SupabaseDataService {
  /**
   * Fetch all stops from Supabase (attractions, hidden gems, destination cities)
   */
  static async fetchAllStops(): Promise<TripStop[]> {
    console.log('🔍 SupabaseDataService: Starting to fetch all stops...');
    
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

      // Fetch destination cities
      const { data: destinationCities, error: destinationCitiesError } = await supabase
        .from('destination_cities')
        .select('*');

      if (destinationCitiesError) {
        console.error('❌ Error fetching destination cities:', destinationCitiesError);
        throw new Error(`Failed to fetch destination cities: ${destinationCitiesError.message}`);
      }

      console.log('✅ SupabaseDataService: Raw data fetched:', {
        attractions: attractions?.length || 0,
        hiddenGems: hiddenGems?.length || 0,
        destinationCities: destinationCities?.length || 0
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

      // Add hidden gems - CRITICAL: Map 'title' to 'name'
      if (hiddenGems) {
        hiddenGems.forEach(gem => {
          try {
            const stop = convertToTripStop({
              ...gem,
              name: gem.title, // Map title to name for hidden gems
              category: 'hidden_gem',
              city: gem.city_name || 'Unknown'
            });
            allStops.push(stop);
            console.log(`✅ Added hidden gem: ${stop.name} in ${stop.city_name}`);
          } catch (err) {
            console.warn('⚠️ Failed to convert hidden gem:', gem.id, err);
          }
        });
      }

      // Add destination cities (marked as destination_city category)
      if (destinationCities) {
        destinationCities.forEach(city => {
          try {
            const stop = convertToTripStop({
              ...city,
              category: 'destination_city',
              city_name: city.name,
              city: city.name
            });
            allStops.push(stop);
          } catch (err) {
            console.warn('⚠️ Failed to convert destination city:', city.id, err);
          }
        });
      }

      console.log('✅ SupabaseDataService: All stops converted:', {
        totalStops: allStops.length,
        byCategory: allStops.reduce((acc, stop) => {
          acc[stop.category] = (acc[stop.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        attractionNames: allStops.filter(s => s.category === 'attraction').slice(0, 3).map(s => s.name),
        hiddenGemNames: allStops.filter(s => s.category === 'hidden_gem').slice(0, 3).map(s => s.name)
      });

      return allStops;
    } catch (error) {
      console.error('❌ SupabaseDataService: Failed to fetch stops:', error);
      throw error;
    }
  }
}
