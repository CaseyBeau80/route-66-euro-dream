
export const BoundsService = {
  fitMapToRoute: (map: google.maps.Map, routePath: google.maps.LatLngLiteral[]) => {
    console.log('🗺️ BoundsService: Setting map bounds to show full route');
    
    const bounds = new google.maps.LatLngBounds();
    routePath.forEach(point => bounds.extend(point));
    
    map.fitBounds(bounds, {
      top: 60,
      right: 60,
      bottom: 60,
      left: 60
    });
    
    console.log('🗺️ BoundsService: Map bounds fitted to show full route');
  }
};
