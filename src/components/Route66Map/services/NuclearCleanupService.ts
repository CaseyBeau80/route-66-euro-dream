
import { RouteCleanupService } from './RouteCleanupService';
import { RouteGlobalState } from './RouteGlobalState';
import { GlobalPolylineCleaner } from './GlobalPolylineCleaner';

export class NuclearCleanupService {
  static async performNuclearCleanupWithCacheClearing(map: google.maps.Map): Promise<void> {
    try {
      console.log('🧹 NUCLEAR cleanup with cache clearing starting');
      
      // Perform global cleanup with extended wait
      await RouteCleanupService.performAggressiveCleanup(map);
      
      // Additional cache clearing delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Reset global state
      RouteGlobalState.setRouteCreated(false);
      
      console.log('✅ NUCLEAR cleanup with cache clearing completed');
      
    } catch (error) {
      console.error('❌ Error during nuclear cleanup with cache clearing:', error);
    }
  }
}
