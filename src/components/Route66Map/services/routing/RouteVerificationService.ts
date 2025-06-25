
export class RouteVerificationService {
  /**
   * Verifies that all polylines are properly attached to the map
   */
  static verifyRouteVisibility(
    polylines: google.maps.Polyline[],
    map: google.maps.Map
  ): boolean {
    const visible = polylines.length > 0 && 
           polylines.every(polyline => polyline.getMap() === map);
    
    console.log('🔍 RouteVerificationService: Route visibility check:', {
      polylineCount: polylines.length,
      allAttached: visible,
      individualStatus: polylines.map((p, i) => ({
        index: i + 1,
        attached: p.getMap() === map
      }))
    });
    
    return visible;
  }

  /**
   * Forces re-attachment of polylines to the map if needed
   */
  static ensurePolylineAttachment(
    polylines: google.maps.Polyline[],
    map: google.maps.Map
  ): void {
    console.log('🔧 RouteVerificationService: Ensuring polyline attachment');
    
    polylines.forEach((polyline, index) => {
      const isAttached = polyline.getMap() === map;
      console.log(`🔍 Polyline ${index + 1} attachment check:`, isAttached);
      
      if (!isAttached) {
        console.log(`🔧 Re-attaching polyline ${index + 1} to map`);
        polyline.setMap(map);
      }
    });
  }

  /**
   * Forces a map refresh to ensure visibility
   */
  static forceMapRefresh(map: google.maps.Map): void {
    console.log('🔄 RouteVerificationService: Forcing map refresh for visibility');
    
    // Trigger a small map movement to force redraw
    const currentCenter = map.getCenter();
    if (currentCenter) {
      const lat = currentCenter.lat();
      const lng = currentCenter.lng();
      map.panTo(new google.maps.LatLng(lat + 0.0001, lng + 0.0001));
      setTimeout(() => {
        map.panTo(new google.maps.LatLng(lat, lng));
      }, 100);
    }
  }
}
