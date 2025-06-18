
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
}
