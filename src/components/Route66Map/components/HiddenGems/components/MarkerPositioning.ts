
export const getMarkerScreenPosition = (map: google.maps.Map, marker: google.maps.Marker | null) => {
  if (!map || !marker) return null;

  const position = marker.getPosition();
  if (!position) return null;

  const mapDiv = map.getDiv();
  const mapRect = mapDiv.getBoundingClientRect();

  const bounds = map.getBounds();
  if (!bounds) return null;

  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();

  const lat = position.lat();
  const lng = position.lng();

  const x = ((lng - sw.lng()) / (ne.lng() - sw.lng())) * mapRect.width;
  const y = ((ne.lat() - lat) / (ne.lat() - sw.lat())) * mapRect.height;

  const viewportX = mapRect.left + x;
  const viewportY = mapRect.top + y;

  return { x: viewportX, y: viewportY };
};
