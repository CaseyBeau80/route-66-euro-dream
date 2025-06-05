
import { EnhancedPolylineStylesConfig } from './EnhancedPolylineStylesConfig';
import { EnhancedPathInterpolationService } from './EnhancedPathInterpolationService';
import { RouteGlobalState } from './RouteGlobalState';
import { GlobalPolylineCleaner } from './GlobalPolylineCleaner';
import type { DestinationCity } from '../hooks/useDestinationCities';

export class SantaFeBranchService {
  private map: google.maps.Map;

  constructor(map: google.maps.Map) {
    this.map = map;
  }

  async createSantaFeBranch(
    santaFeCity: DestinationCity, 
    albuquerqueCity: DestinationCity | null,
    mainRouteCities: DestinationCity[]
  ): Promise<void> {
    console.log('🌟 SantaFeBranchService: Santa Fe branch now integrated into main route - no separate branch needed');
    console.log('🔧 DEBUG: Santa Fe and Albuquerque are part of the flowing main route');

    // No separate branch creation needed since Santa Fe and Albuquerque are now part of main route
    // The flowing path is handled by RouteCreationService
    console.log('✅ Santa Fe branch integration complete - handled by main route flow');
  }

  getBranchPolylines(): { 
    branchPolyline: google.maps.Polyline | null; 
    branchCenterLine: google.maps.Polyline | null;
  } {
    // No separate branch polylines since everything is part of main route now
    return {
      branchPolyline: null,
      branchCenterLine: null
    };
  }

  cleanup(): void {
    console.log('🧹 SantaFeBranchService: No separate branch cleanup needed - integrated into main route');
    // No cleanup needed since no separate polylines are created
  }
}
