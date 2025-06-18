
import { SupabaseDataService } from './data/SupabaseDataService';
import { TripStop } from '../types/TripStop';

export class Route66StopsService {
  /**
   * Get all Route 66 stops from the data service
   */
  static async getAllStops(): Promise<TripStop[]> {
    console.log('📊 Route66StopsService: Fetching all stops');
    return await SupabaseDataService.fetchAllStops();
  }

  /**
   * Get stops by category
   */
  static async getStopsByCategory(category: string): Promise<TripStop[]> {
    return await SupabaseDataService.getStopsByCategory(category);
  }

  /**
   * Find stop by name
   */
  static async findStopByName(name: string): Promise<TripStop | null> {
    return await SupabaseDataService.findStopByName(name);
  }

  /**
   * Get destination cities only
   */
  static async getDestinationCities(): Promise<TripStop[]> {
    return await SupabaseDataService.getDestinationCities();
  }
}
