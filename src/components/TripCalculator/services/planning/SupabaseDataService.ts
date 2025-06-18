
import { TripStop } from '../../types/TripStop';

export class SupabaseDataService {
  static async getAllStops(): Promise<TripStop[]> {
    // This is a stub - in real implementation this would fetch from Supabase
    console.log('📊 SupabaseDataService: getAllStops stub called');
    return [];
  }

  static async getStopsByCategory(category: string): Promise<TripStop[]> {
    const allStops = await this.getAllStops();
    return allStops.filter(stop => stop.category === category);
  }
}
