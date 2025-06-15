
import { TripStop } from '../data/SupabaseDataService';

export class AttractionService {
  static async getAttractionsForStop(stop: TripStop): Promise<TripStop[]> {
    // Simple implementation - in a real app this would fetch from database
    console.log(`🎯 Getting attractions for ${stop.name}`);
    return [];
  }
}
