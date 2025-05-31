
import type { Route66Waypoint } from '../types/supabaseTypes';
import { RouteGlobalState } from './RouteGlobalState';

export class RouteMarkersManager {
  constructor(private map: google.maps.Map) {}

  createRouteMarkers(majorStopsOnly: Route66Waypoint[]): void {
    // VALIDATION: Ensure we're only working with major stops
    const nonMajorStops = majorStopsOnly.filter(wp => wp.is_major_stop !== true);
    if (nonMajorStops.length > 0) {
      console.error('❌ CRITICAL ERROR: Non-major stops detected in Route 66 shield creation:', 
        nonMajorStops.map(s => s.name));
      return;
    }

    console.log(`🛡️ Creating Route 66 shield markers for ${majorStopsOnly.length} major stops only:`);
    
    majorStopsOnly.forEach((waypoint, index) => {
      console.log(`  ${index + 1}. Creating Route 66 shield for: ${waypoint.name} (${waypoint.state})`);
      
      const marker = new google.maps.Marker({
        position: { lat: waypoint.latitude, lng: waypoint.longitude },
        map: this.map,
        title: waypoint.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#FFD700',
          fillOpacity: 1,
          strokeColor: '#2C2C2C',
          strokeWeight: 2
        },
        zIndex: 2000
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: this.createInfoWindowContent(waypoint)
      });

      marker.addListener('click', () => {
        // Close any open info windows
        RouteGlobalState.getRouteMarkers().forEach(m => {
          const iw = (m as any).infoWindow;
          if (iw) iw.close();
        });
        
        infoWindow.open(this.map, marker);
      });

      (marker as any).infoWindow = infoWindow;
      RouteGlobalState.addRouteMarker(marker);
    });

    console.log(`📍 Created ${RouteGlobalState.getRouteMarkers().length} Route 66 shield markers for major stops only`);
  }

  private createInfoWindowContent(waypoint: Route66Waypoint): string {
    return `
      <div style="padding: 8px; max-width: 200px;">
        <h3 style="margin: 0 0 4px 0; color: #2C2C2C; font-size: 14px; font-weight: bold;">
          ${waypoint.name}
        </h3>
        <p style="margin: 0; color: #666; font-size: 12px;">
          ${waypoint.state} • ${waypoint.highway_designation || 'Route 66'}
        </p>
        ${waypoint.description ? `
          <p style="margin: 4px 0 0 0; color: #666; font-size: 11px;">
            ${waypoint.description}
          </p>
        ` : ''}
      </div>
    `;
  }

  cleanupMarkers(): void {
    RouteGlobalState.getRouteMarkers().forEach(marker => {
      marker.setMap(null);
    });
    RouteGlobalState.clearRouteMarkers();
  }
}
