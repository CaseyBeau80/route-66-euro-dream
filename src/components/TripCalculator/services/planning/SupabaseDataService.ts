
import { SupabaseDataService as CoreSupabaseDataService } from '../data/SupabaseDataService';
import { TripStop } from '../../types/TripStop';

/**
 * Legacy wrapper for compatibility - delegates to the core SupabaseDataService
 */
export class SupabaseDataService {
  static async getAllStops(): Promise<TripStop[]> {
    console.log('📊 Legacy SupabaseDataService: Delegating to core service');
    return await CoreSupabaseDataService.fetchAllStops();
  }

  static async getStopsByCategory(category: string): Promise<TripStop[]> {
    console.log(`📊 Legacy SupabaseDataService: Getting stops by category: ${category}`);
    return await CoreSupabaseDataService.getStopsByCategory(category);
  }
}
