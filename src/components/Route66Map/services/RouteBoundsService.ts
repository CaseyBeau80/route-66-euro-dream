
export class RouteBoundsService {
  static fitMapToBounds(map: google.maps.Map, routePath: google.maps.LatLngLiteral[]): void {
    if (routePath.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    routePath.forEach(point => {
      bounds.extend(new google.maps.LatLng(point.lat, point.lng));
    });

    // Add padding and fit bounds
    map.fitBounds(bounds, {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
    });

    console.log('🗺️ Map bounds fitted to complete route including Santa Fe branch');
  }
}
