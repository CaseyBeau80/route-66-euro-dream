
// Global state management for Route 66 rendering
// Ensures single route instance across the application

let GLOBAL_SMOOTH_POLYLINE: google.maps.Polyline | null = null;
let GLOBAL_CENTER_LINE: google.maps.Polyline | null = null;
let GLOBAL_ROUTE_MARKERS: google.maps.Marker[] = [];
let IS_SMOOTH_ROUTE_CREATED = false;

export const RouteGlobalState = {
  getSmoothPolyline: () => GLOBAL_SMOOTH_POLYLINE,
  setSmoothPolyline: (polyline: google.maps.Polyline | null) => {
    GLOBAL_SMOOTH_POLYLINE = polyline;
  },

  getCenterLine: () => GLOBAL_CENTER_LINE,
  setCenterLine: (polyline: google.maps.Polyline | null) => {
    GLOBAL_CENTER_LINE = polyline;
  },

  getRouteMarkers: () => GLOBAL_ROUTE_MARKERS,
  addRouteMarker: (marker: google.maps.Marker) => {
    GLOBAL_ROUTE_MARKERS.push(marker);
  },
  clearRouteMarkers: () => {
    GLOBAL_ROUTE_MARKERS = [];
  },

  isRouteCreated: () => IS_SMOOTH_ROUTE_CREATED,
  setRouteCreated: (created: boolean) => {
    IS_SMOOTH_ROUTE_CREATED = created;
  },

  resetState: () => {
    GLOBAL_SMOOTH_POLYLINE = null;
    GLOBAL_CENTER_LINE = null;
    GLOBAL_ROUTE_MARKERS = [];
    IS_SMOOTH_ROUTE_CREATED = false;
  }
};
