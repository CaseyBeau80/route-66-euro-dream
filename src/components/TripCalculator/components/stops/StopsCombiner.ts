
import { TripStop } from '../../types/TripStop';
import { ErrorHandlingService } from '../../services/error/ErrorHandlingService';

export class StopsCombiner {
  static combineStops(userRelevantStops: TripStop[], enhancedStops: TripStop[], maxStops: number): TripStop[] {
    const combinedStops = [...userRelevantStops];
    
    try {
      enhancedStops.forEach(enhancedStop => {
        const alreadyExists = combinedStops.some(stop => 
          stop.name.toLowerCase() === enhancedStop.name.toLowerCase()
        );
        
        if (!alreadyExists) {
          combinedStops.push(enhancedStop);
        }
      });
    } catch (error) {
      ErrorHandlingService.logError(error as Error, 'StopsCombiner.combineStops');
      console.error('❌ Error combining stops:', error);
    }
    
    return combinedStops.slice(0, maxStops);
  }
}
