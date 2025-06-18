
import { TripStop } from '../../types/TripStop';

export class SupabaseDataService {
  static async fetchAllStops(): Promise<TripStop[]> {
    // This is a stub - in real implementation this would fetch from Supabase
    console.log('📊 SupabaseDataService: fetchAllStops stub called');
    return [];
  }

  static async getStopsByCategory(category: string): Promise<TripStop[]> {
    const allStops = await this.fetchAllStops();
    return allStops.filter(stop => stop.category === category);
  }
}
