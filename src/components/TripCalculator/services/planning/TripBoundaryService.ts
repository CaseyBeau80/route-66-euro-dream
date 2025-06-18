
import { TripStop } from '../../types/TripStop';

export class TripBoundaryService {
  static findStartBoundary(startLocation: string, allStops: TripStop[]): TripStop | null {
    return allStops.find(stop => 
      stop.name.toLowerCase().includes(startLocation.toLowerCase()) ||
      stop.city?.toLowerCase().includes(startLocation.toLowerCase())
    ) || null;
  }

  static findEndBoundary(endLocation: string, allStops: TripStop[]): TripStop | null {
    return allStops.find(stop => 
      stop.name.toLowerCase().includes(endLocation.toLowerCase()) ||
      stop.city?.toLowerCase().includes(endLocation.toLowerCase())
    ) || null;
  }

  static validateBoundaries(startBoundary: TripStop | null, endBoundary: TripStop | null): boolean {
    return startBoundary !== null && endBoundary !== null;
  }

  static findBoundaryStops(startLocation: string, endLocation: string, allStops: TripStop[]) {
    const startStop = this.findStartBoundary(startLocation, allStops);
    const endStop = this.findEndBoundary(endLocation, allStops);
    
    if (!startStop || !endStop) {
      throw new Error('Could not find start or end location');
    }

    // Filter route stops between start and end
    const routeStops = allStops.filter(stop => 
      stop.category === 'destination_city' || stop.category === 'major_city'
    );

    return {
      startStop,
      endStop,
      routeStops: [startStop, ...routeStops, endStop]
    };
  }

  static findExactBoundaryStops(startLocation: string, endLocation: string, allStops: TripStop[]) {
    const startStop = allStops.find(stop => 
      stop.name.toLowerCase() === startLocation.toLowerCase() ||
      stop.city?.toLowerCase() === startLocation.toLowerCase()
    );
    
    const endStop = allStops.find(stop => 
      stop.name.toLowerCase() === endLocation.toLowerCase() ||
      stop.city?.toLowerCase() === endLocation.toLowerCase()
    );

    if (!startStop || !endStop) {
      throw new Error('Could not find exact start or end location');
    }

    return { startStop, endStop };
  }
}
