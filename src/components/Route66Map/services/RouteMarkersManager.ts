
import type { Route66Waypoint } from '../types/supabaseTypes';
import { RouteGlobalState } from './RouteGlobalState';

export class RouteMarkersManager {
  constructor(private map: google.maps.Map) {}

  createRouteMarkers(waypoints: Route66Waypoint[]): void {
    const majorStops = waypoints.filter(wp => wp.is_major_stop);
    
    majorStops.forEach((waypoint) => {
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

    console.log(`📍 Created ${RouteGlobalState.getRouteMarkers().length} route markers for major stops`);
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
