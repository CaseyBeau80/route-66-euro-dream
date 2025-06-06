
import { supabase } from '@/integrations/supabase/client';

export interface TripStop {
  id: string;
  name: string;
  description: string;
  city_name: string;
  state: string;
  image_url?: string;
  latitude: number;
  longitude: number;
  category: string;
  is_major_stop?: boolean;
  is_official_destination?: boolean;
}

export class SupabaseDataService {
  static async fetchAllStops(): Promise<TripStop[]> {
    const stops: TripStop[] = [];
    console.log('🔄 Starting to fetch all stops from Supabase...');

    try {
      // Fetch destination cities FIRST (highest priority)
      console.log('🏙️ Fetching destination_cities (highest priority)...');
      const { data: cities, error: citiesError } = await supabase
        .from('destination_cities')
        .select('*')
        .order('name');

      if (citiesError) {
        console.error('❌ Error fetching cities:', citiesError);
      } else {
        console.log(`✅ Fetched ${cities?.length || 0} destination cities`);
        if (cities) {
          stops.push(...cities.map(city => ({
            id: city.id,
            name: city.name,
            description: city.description || 'Official Route 66 destination city',
            city_name: city.name,
            state: city.state,
            image_url: city.image_url,
            latitude: city.latitude,
            longitude: city.longitude,
            category: 'destination_city',
            is_official_destination: true
          })));
        }
      }

      // Fetch Route 66 waypoints (major stops)
      console.log('📍 Fetching route66_waypoints...');
      const { data: waypoints, error: waypointsError } = await supabase
        .from('route66_waypoints')
        .select('*')
        .order('sequence_order');

      if (waypointsError) {
        console.error('❌ Error fetching waypoints:', waypointsError);
      } else {
        console.log(`✅ Fetched ${waypoints?.length || 0} waypoints`);
        if (waypoints) {
          stops.push(...waypoints.map(wp => ({
            id: wp.id,
            name: wp.name,
            description: wp.description || 'Historic Route 66 waypoint',
            city_name: wp.name,
            state: wp.state,
            image_url: wp.image_url,
            latitude: wp.latitude,
            longitude: wp.longitude,
            category: 'route66_waypoint',
            is_major_stop: wp.is_major_stop
          })));
        }
      }

      // Fetch attractions
      console.log('🎡 Fetching attractions...');
      const { data: attractions, error: attractionsError } = await supabase
        .from('attractions')
        .select('*')
        .order('name');

      if (attractionsError) {
        console.error('❌ Error fetching attractions:', attractionsError);
      } else {
        console.log(`✅ Fetched ${attractions?.length || 0} attractions`);
        if (attractions) {
          stops.push(...attractions.map(attraction => ({
            id: attraction.id,
            name: attraction.name,
            description: attraction.description || 'Route 66 attraction',
            city_name: attraction.city_name,
            state: attraction.state,
            image_url: attraction.image_url,
            latitude: attraction.latitude,
            longitude: attraction.longitude,
            category: attraction.category || 'attraction'
          })));
        }
      }

      // Fetch hidden gems
      console.log('💎 Fetching hidden_gems...');
      const { data: gems, error: gemsError } = await supabase
        .from('hidden_gems')
        .select('*')
        .order('title');

      if (gemsError) {
        console.error('❌ Error fetching hidden gems:', gemsError);
      } else {
        console.log(`✅ Fetched ${gems?.length || 0} hidden gems`);
        if (gems) {
          stops.push(...gems.map(gem => ({
            id: gem.id,
            name: gem.title,
            description: gem.description || 'Hidden Route 66 gem',
            city_name: gem.city_name,
            state: 'Various',
            image_url: gem.image_url,
            latitude: gem.latitude,
            longitude: gem.longitude,
            category: 'hidden_gem'
          })));
        }
      }

      console.log(`🛣️ Total stops fetched: ${stops.length}`);
      console.log(`📊 Categories: ${this.getCategorySummary(stops)}`);
      return stops;
    } catch (error) {
      console.error('❌ Error in fetchAllStops:', error);
      return [];
    }
  }

  /**
   * Get category summary for debugging
   */
  private static getCategorySummary(stops: TripStop[]): string {
    const categories = stops.reduce((acc, stop) => {
      acc[stop.category] = (acc[stop.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories)
      .map(([category, count]) => `${category}: ${count}`)
      .join(', ');
  }

  /**
   * Get official destination cities specifically
   */
  static getOfficialDestinationCities(stops: TripStop[]): TripStop[] {
    return stops.filter(stop => stop.category === 'destination_city');
  }

  /**
   * Get recommended stops (non-destination cities)
   */
  static getRecommendedStops(stops: TripStop[]): TripStop[] {
    return stops.filter(stop => stop.category !== 'destination_city');
  }
}
