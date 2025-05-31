
import { RouteGlobalState } from './RouteGlobalState';
import { RouteRenderingService } from './RouteRenderingService';
import { FallbackRouteCreator } from './FallbackRouteCreator';
import type { Route66Waypoint } from '../types/supabaseTypes';

export class RouteRendererEffectHandler {
  private hasRendered: boolean = false;
  private renderAttempts: number = 0;
  private routeRenderingService: RouteRenderingService;
  private fallbackCreator: FallbackRouteCreator;

  constructor(private map: google.maps.Map) {
    this.routeRenderingService = new RouteRenderingService(map);
    this.fallbackCreator = new FallbackRouteCreator(map);
  }

  shouldRender(
    isMapReady: boolean,
    isLoading: boolean,
    error: any,
    waypoints: Route66Waypoint[]
  ): boolean {
    console.log('🚀 RouteRendererEffectHandler: Checking render conditions', {
      hasMap: !!this.map,
      isMapReady,
      isLoading,
      hasError: !!error,
      waypointsCount: waypoints.length,
      hasRendered: this.hasRendered,
      routeExists: RouteGlobalState.isRouteCreated(),
      renderAttempts: this.renderAttempts
    });

    if (!this.map || !isMapReady || isLoading || error || waypoints.length === 0) {
      console.log('🚀 RouteRendererEffectHandler: Conditions not met, skipping render');
      return false;
    }

    if (this.renderAttempts > 5) {
      console.warn('⚠️ RouteRendererEffectHandler: Too many render attempts, stopping');
      return false;
    }

    return true;
  }

  async handleRender(waypoints: Route66Waypoint[]): Promise<void> {
    // FORCE recreation to apply new YELLOW stripe colors
    console.log('🎨 FORCING Route 66 recreation with NEW BRIGHT YELLOW CENTER STRIPES');

    // Reset flags to force recreation
    this.hasRendered = false;
    RouteGlobalState.setRouteCreated(false);

    // Increment render attempts
    this.renderAttempts++;
    
    console.log(`🚀 RouteRendererEffectHandler: Creating ASPHALT Route 66 with YELLOW stripes (attempt ${this.renderAttempts})`);
    
    try {
      await this.routeRenderingService.renderRoute(waypoints);
      this.hasRendered = true;
    } catch (error) {
      console.error('❌ Error in main route rendering, attempting fallback:', error);
      
      // Fallback: Create simple straight-line route with asphalt colors
      console.log('🔄 Attempting asphalt fallback route creation...');
      const majorStops = waypoints.filter(wp => wp.is_major_stop === true);
      const sortedMajorStops = majorStops.sort((a, b) => a.sequence_order - b.sequence_order);
      
      this.fallbackCreator.createAsphaltFallbackRoute(sortedMajorStops);
      this.hasRendered = true;
      RouteGlobalState.setRouteCreated(true);
    }
  }

  reset(): void {
    this.hasRendered = false;
    this.renderAttempts = 0;
    RouteGlobalState.setRouteCreated(false);
  }

  getCleanupFunction(): () => void {
    return () => {
      console.log('🧹 RouteRendererEffectHandler: Component unmounting');
    };
  }
}
