
// Map configuration constants

// Styling for the Google Map
export const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.75rem',
};

// Center the map on a point along Route 66 (roughly Oklahoma)
export const center = {
  lat: 37.0,
  lng: -97.0,
};

// Define map bounds to only show Route 66 corridor
// These coordinates form a tighter corridor that encompasses just the Route 66 states
export const mapBounds = {
  north: 42.5, // Northern boundary (covering Illinois)
  south: 32.5, // Southern boundary (covering southern part of route in Arizona/California)
  east: -87.0, // Eastern boundary (covering Chicago)
  west: -122.0, // Western boundary (covering Los Angeles)
};

// Map restrictions to keep users within bounds
export const mapRestrictions = {
  latLngBounds: mapBounds,
  strictBounds: false, // Use less strict bounds to allow slight panning outside Route 66 corridor
};

// Route 66 states to highlight - including all states the route passes through
export const route66StateIds = ['ca', 'az', 'nm', 'tx', 'ok', 'ks', 'mo', 'il'];

// Custom styling to focus on Route 66 and de-emphasize other areas
export const mapOptions = {
  disableDefaultUI: false,
  zoomControl: false, // We'll use custom zoom controls
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  restriction: mapRestrictions,
  minZoom: 5, // Set minimum zoom level to see the entire Route 66
  maxZoom: 10, // Limit maximum zoom to prevent zooming in too far
  gestureHandling: 'greedy', // Enable aggressive touch gestures for mobile
  styles: [
    {
      // Highlight Route 66 states
      featureType: 'administrative.province',
      elementType: 'geometry',
      stylers: [{ visibility: 'on' }]
    },
    {
      // Make non-Route 66 states appear muted
      featureType: 'administrative.province',
      elementType: 'geometry.fill',
      stylers: [{ saturation: -80 }, { lightness: 20 }]
    },
    {
      // Make highways more prominent, especially Route 66
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#f8c967' }, { weight: 1.5 }]
    },
    {
      // Route 66 states with orange tint
      featureType: 'administrative.province',
      elementType: 'geometry.fill',
      stylers: [{ color: '#f97316' }, { saturation: 50 }]
    },
    {
      // Make highway labels more visible
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#14532d' }]
    },
    {
      // Subtle landscape
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#f5f5f4' }]
    },
    {
      // Water features
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#bfdbfe' }]
    }
  ]
};

// Route 66 polyline options
export const polylineOptions = {
  strokeColor: '#c2410c',
  strokeOpacity: 0.8,
  strokeWeight: 4,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  zIndex: 1,
};

// Google Maps API key
export const googleMapsApiKey = 'AIzaSyCj2hJjT8wA0G3gBmUaK7qmhKX8Uv3mDH8';
