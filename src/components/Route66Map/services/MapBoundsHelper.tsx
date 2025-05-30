
export const MapBoundsHelper = {
  fitMapToRoute: (map: google.maps.Map, routePath: google.maps.LatLngLiteral[]) => {
    console.log('🗺️ MapBoundsHelper: Setting map bounds to show full route');
    
    // Set up map bounds to show the entire route
    const bounds = new google.maps.LatLngBounds();
    routePath.forEach(point => bounds.extend(point));
    
    map.fitBounds(bounds, {
      top: 80,
      right: 80,
      bottom: 80,
      left: 80
    });
  }
};
