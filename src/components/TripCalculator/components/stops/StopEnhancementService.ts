
import { ErrorHandlingService } from '../../services/error/ErrorHandlingService';
import { SupabaseDataService } from '../../services/data/SupabaseDataService';
import { EnhancedStopSelectionService } from '../../services/planning/EnhancedStopSelectionService';
import { TripStop, convertToTripStop } from '../../types/TripStop';

export class StopEnhancementService {
  static async enhanceStopsForSegment(
    startCity: string,
    endCity: string,
    segmentDay: number,
    maxStops: number
  ): Promise<TripStop[]> {
    try {
      console.log(`🚀 TRIGGERING ENHANCED SELECTION (Destination Cities Only) for ${startCity} → ${endCity}`);
      
      // Create mock start/end stops
      const startStop: TripStop = convertToTripStop({
        id: `temp-start-${segmentDay}`,
        name: startCity,
        description: 'Start location',
        city_name: startCity,
        state: 'Unknown',
        latitude: 0,
        longitude: 0,
        category: 'destination_city'
      });
      
      const endStop: TripStop = convertToTripStop({
        id: `temp-end-${segmentDay}`,
        name: endCity,
        description: 'End location',
        city_name: endCity,
        state: 'Unknown',
        latitude: 0,
        longitude: 0,
        category: 'destination_city'
      });
      
      // Fetch only destination cities
      const allStops = await ErrorHandlingService.handleAsyncError(
        () => SupabaseDataService.fetchAllStops(),
        'StopEnhancementService.fetchAllStops',
        []
      );
      
      if (!allStops || allStops.length === 0) {
        console.warn('⚠️ No destination cities data available for enhanced selection');
        return [];
      }
      
      // Verify all stops are destination cities
      const destinationCitiesOnly = allStops.filter(stop => stop.category === 'destination_city');
      console.log(`🏛️ Using ${destinationCitiesOnly.length} destination cities out of ${allStops.length} total stops`);
      
      const enhanced = await ErrorHandlingService.handleAsyncError(
        () => EnhancedStopSelectionService.selectStopsForSegment(
          startStop, endStop, destinationCitiesOnly, maxStops
        ),
        'StopEnhancementService.selectStopsForSegment',
        []
      );
      
      if (enhanced && enhanced.length > 0) {
        console.log(`✅ Enhanced selection found ${enhanced.length} destination cities`);
        return enhanced.map(stop => convertToTripStop(stop));
      }
      
      return [];
    } catch (error) {
      ErrorHandlingService.logError(error as Error, 'StopEnhancementService.enhanceStopsForSegment');
      throw error;
    }
  }
}
