
export const fitMapToRoute = (map: google.maps.Map, routePath: google.maps.LatLngLiteral[]) => {
  const bounds = new google.maps.LatLngBounds();
  routePath.forEach(point => {
    bounds.extend(new google.maps.LatLng(point.lat, point.lng));
  });

  // Fit the map to show the entire route with padding
  map.fitBounds(bounds, {
    top: 100,
    right: 100,
    bottom: 100,
    left: 100
  });

  console.log("✅ Map bounds adjusted to show Route 66");
};
