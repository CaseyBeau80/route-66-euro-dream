
import { RouteGlobalState } from './RouteGlobalState';
import { GlobalPolylineCleaner } from './GlobalPolylineCleaner';

export class RouteCleanupService {
  static async performAggressiveCleanup(map: google.maps.Map): Promise<void> {
    console.log('🧹 AGGRESSIVE cleanup of existing polylines starting');
    
    try {
      // Nuclear cleanup of all polylines
      await GlobalPolylineCleaner.cleanupAllPolylines(map);
      
      // Clear global state
      RouteGlobalState.clearAll();
      
      // Additional delay to ensure cleanup completes
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('✅ AGGRESSIVE cleanup completed');
      
    } catch (error) {
      console.error('❌ Error during aggressive cleanup:', error);
    }
  }
}
