
import type { Route66Waypoint } from '../../types/supabaseTypes';
import { IconCreator } from './IconCreator';
import { InfoWindowCreator } from './InfoWindowCreator';
import type { MarkerRefs } from './types';

export class DestinationMarkerService {
  static createDestinationMarkers(
    destinationCities: Route66Waypoint[], 
    map: google.maps.Map, 
    markerRefs: MarkerRefs
  ): void {
    console.log(`📍 Creating ${destinationCities.length} destination markers`);
    console.log('🗺️ Map object:', map);
    console.log('🎯 Destination cities data:', destinationCities);
    
    if (!map) {
      console.error('❌ Map object is null or undefined');
      return;
    }

    if (!destinationCities || destinationCities.length === 0) {
      console.warn('⚠️ No destination cities provided');
      return;
    }
    
    destinationCities.forEach((waypoint, index) => {
      console.log(`📍 Creating destination marker ${index + 1}:`, {
        name: waypoint.name,
        lat: waypoint.latitude,
        lng: waypoint.longitude,
        state: waypoint.state
      });

      const cityName = waypoint.name.split(',')[0].split(' - ')[0].trim();
      
      try {
        const marker = this.createSingleDestinationMarker(waypoint, cityName, map);
        const infoWindow = InfoWindowCreator.createDestinationInfoWindow(waypoint);

        this.attachMarkerClickListener(marker, waypoint, map, markerRefs, infoWindow);

        markerRefs.infoWindowsRef.current.set(marker, infoWindow);
        markerRefs.markersRef.current.push(marker);
        
        console.log(`✅ Destination marker ${index + 1} added to references`);
      } catch (error) {
        console.error(`❌ Error creating destination marker ${index + 1}:`, error);
      }
    });
    
    console.log(`✅ Created ${destinationCities.length} destination markers successfully`);
    console.log(`📊 Total markers in ref: ${markerRefs.markersRef.current.length}`);
  }

  private static createSingleDestinationMarker(
    waypoint: Route66Waypoint, 
    cityName: string, 
    map: google.maps.Map
  ): google.maps.Marker {
    const marker = new google.maps.Marker({
      position: { lat: waypoint.latitude, lng: waypoint.longitude },
      map: map,
      icon: IconCreator.createDestinationCityIcon(cityName),
      title: `${waypoint.name} - ${waypoint.state} (Destination)`,
      zIndex: 30000,
      visible: true
    });

    console.log(`✅ Destination marker created successfully:`, marker);
    return marker;
  }

  private static attachMarkerClickListener(
    marker: google.maps.Marker,
    waypoint: Route66Waypoint,
    map: google.maps.Map,
    markerRefs: MarkerRefs,
    infoWindow: google.maps.InfoWindow
  ): void {
    marker.addListener('click', () => {
      console.log(`🎯 Destination marker clicked: ${waypoint.name}`);
      // Close any other open info windows
      markerRefs.markersRef.current.forEach(m => {
        const infoWin = markerRefs.infoWindowsRef.current.get(m);
        if (infoWin) {
          infoWin.close();
        }
      });
      infoWindow.open(map, marker);
    });
  }
}
