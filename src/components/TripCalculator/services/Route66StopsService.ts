
import { supabase } from '@/integrations/supabase/client';
import { TripStop } from '../types/TripStop';

export class Route66StopsService {
  /**
   * Get all stops with proper categorization for destination cities vs attractions
   */
  static async getAllStops(): Promise<TripStop[]> {
    try {
      console.log('🔍 STRICT: Fetching all stops with destination city categorization');
      
      // Fetch destination cities (major overnight stops)
      const { data: cities, error: citiesError } = await supabase
        .from('destination_cities')
        .select('*');
      
      if (citiesError) {
        console.error('❌ Error fetching destination cities:', citiesError);
      }

      // Fetch attractions (points of interest, not overnight destinations)
      const { data: attractions, error: attractionsError } = await supabase
        .from('attractions')
        .select('*');
      
      if (attractionsError) {
        console.error('❌ Error fetching attractions:', attractionsError);
      }

      const allStops: TripStop[] = [];

      // Process destination cities - these are the main overnight stops
      if (cities) {
        console.log(`🏛️ STRICT: Processing ${cities.length} destination cities`);
        cities.forEach(city => {
          allStops.push({
            id: city.id,
            name: city.name,
            category: 'destination_city', // CRITICAL: Mark as destination city
            latitude: parseFloat(city.latitude?.toString() || '0'),
            longitude: parseFloat(city.longitude?.toString() || '0'),
            state: city.state,
            city: city.name,
            city_name: city.name,
            description: city.description || `Major Route 66 destination city in ${city.state}`,
            is_major_stop: true,
            is_official_destination: true
          });
        });
      }

      // Process attractions - these are NOT destination cities (points of interest only)
      if (attractions) {
        console.log(`🎯 STRICT: Processing ${attractions.length} attractions (NOT destination cities)`);
        attractions.forEach(attraction => {
          allStops.push({
            id: attraction.id,
            name: attraction.name,
            category: 'attraction', // CRITICAL: Mark as attraction, NOT destination city
            latitude: parseFloat(attraction.latitude?.toString() || '0'),
            longitude: parseFloat(attraction.longitude?.toString() || '0'),
            state: attraction.state,
            city: attraction.city_name,
            city_name: attraction.city_name,
            description: attraction.description || 'Route 66 attraction',
            is_major_stop: false,
            is_official_destination: false
          });
        });
      }

      console.log(`✅ STRICT: Loaded ${allStops.length} total stops:`, {
        destinationCities: allStops.filter(s => s.category === 'destination_city').length,
        attractions: allStops.filter(s => s.category === 'attraction').length
      });

      return allStops;
      
    } catch (error) {
      console.error('❌ STRICT: Error fetching stops:', error);
      throw error;
    }
  }

  /**
   * Get only destination cities for trip planning
   */
  static async getDestinationCitiesOnly(): Promise<TripStop[]> {
    try {
      const allStops = await this.getAllStops();
      const destinationCities = allStops.filter(stop => stop.category === 'destination_city');
      
      console.log(`🏛️ STRICT: Retrieved ${destinationCities.length} destination cities only`);
      return destinationCities;
    } catch (error) {
      console.error('❌ Error getting destination cities:', error);
      return [];
    }
  }

  /**
   * Get attractions near a destination city (for day trip activities)
   */
  static async getAttractionsNearCity(cityName: string, radiusMiles: number = 50): Promise<TripStop[]> {
    try {
      const allStops = await this.getAllStops();
      const attractions = allStops.filter(stop => 
        stop.category === 'attraction' && 
        (stop.city_name?.toLowerCase().includes(cityName.toLowerCase()) ||
         stop.city?.toLowerCase().includes(cityName.toLowerCase()))
      );
      
      console.log(`🎯 Found ${attractions.length} attractions near ${cityName}`);
      return attractions;
    } catch (error) {
      console.error('❌ Error getting attractions near city:', error);
      return [];
    }
  }
}
