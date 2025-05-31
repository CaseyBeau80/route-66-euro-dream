
import type { Route66Waypoint } from '../../types/supabaseTypes';
import { IconCreator } from './IconCreator';
import { InfoWindowCreator } from './InfoWindowCreator';
import type { MarkerRefs } from './types';

export class MarkerManager {
  static createDestinationMarkers(
    destinationCities: Route66Waypoint[], 
    map: google.maps.Map, 
    markerRefs: MarkerRefs
  ): void {
    destinationCities.forEach((waypoint) => {
      const cityName = waypoint.name.split(',')[0].split(' - ')[0].trim();
      
      const marker = new google.maps.Marker({
        position: { lat: waypoint.latitude, lng: waypoint.longitude },
        map: map,
        icon: IconCreator.createDestinationCityIcon(cityName),
        title: `${waypoint.name} - ${waypoint.state} (Destination)`,
        zIndex: 30000 // Higher zIndex for destinations
      });

      const infoWindow = InfoWindowCreator.createDestinationInfoWindow(waypoint);

      marker.addListener('click', () => {
        // Close any other open info windows
        markerRefs.markersRef.current.forEach(m => {
          const infoWin = markerRefs.infoWindowsRef.current.get(m);
          if (infoWin) {
            infoWin.close();
          }
        });
        infoWindow.open(map, marker);
      });

      markerRefs.infoWindowsRef.current.set(marker, infoWindow);
      markerRefs.markersRef.current.push(marker);
    });
  }

  static createRegularStopMarkers(
    regularStops: Route66Waypoint[], 
    map: google.maps.Map, 
    markerRefs: MarkerRefs
  ): void {
    regularStops.forEach((waypoint) => {
      const marker = new google.maps.Marker({
        position: { lat: waypoint.latitude, lng: waypoint.longitude },
        map: map,
        icon: IconCreator.createRegularStopIcon(),
        title: `${waypoint.name} - ${waypoint.state}`,
        zIndex: 20000 // Lower zIndex for regular stops
      });

      const infoWindow = InfoWindowCreator.createRegularStopInfoWindow(waypoint);

      marker.addListener('click', () => {
        // Close any other open info windows
        markerRefs.markersRef.current.forEach(m => {
          const infoWin = markerRefs.infoWindowsRef.current.get(m);
          if (infoWin) {
            infoWin.close();
          }
        });
        infoWindow.open(map, marker);
      });

      markerRefs.infoWindowsRef.current.set(marker, infoWindow);
      markerRefs.markersRef.current.push(marker);
    });
  }

  static cleanupMarkers(markerRefs: MarkerRefs): void {
    markerRefs.markersRef.current.forEach(marker => {
      const infoWindow = markerRefs.infoWindowsRef.current.get(marker);
      if (infoWindow) {
        infoWindow.close();
      }
      marker.setMap(null);
    });
    markerRefs.markersRef.current = [];
    markerRefs.infoWindowsRef.current = new WeakMap();
  }
}
