// Map configuration constants

// Styling for the Google Map
export const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.75rem',
};

// Center the map on a point along Route 66 (near Oklahoma)
export const center = {
  lat: 37.0,
  lng: -97.0,
};

// Define map bounds to strictly show Route 66 corridor
// These coordinates form a tight corridor around the 8 Route 66 states
export const mapBounds = {
  north: 42.5, // Northern boundary (covering Illinois)
  south: 32.0, // Southern boundary (covering southern parts of Route 66)
  east: -87.0, // Eastern boundary (covering Illinois)
  west: -124.5, // Western boundary (covering California)
};

// Map restrictions to keep users within Route 66 corridor
export const mapRestrictions = {
  latLngBounds: mapBounds,
  strictBounds: true, // Enforce strict bounds to prevent panning outside
};

// Route 66 states to highlight - including the 8 route states
export const route66StateIds = ['il', 'mo', 'ks', 'ok', 'tx', 'nm', 'az', 'ca'];

// Custom styling with nostalgic Americana feel
export const mapOptions = {
  disableDefaultUI: false,
  zoomControl: false, // Disable default zoom controls, we'll use custom ones
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  restriction: mapRestrictions,
  minZoom: 4, // Maintain minimum zoom level
  maxZoom: 15, // Keep maximum zoom level
  gestureHandling: 'greedy', // Enable aggressive touch gestures for mobile
  styles: [
    {
      // De-emphasize non-Route 66 states
      featureType: 'administrative.province',
      elementType: 'geometry',
      stylers: [{ visibility: 'on' }]
    },
    {
      // Styling for state labels - more vintage look
      featureType: 'administrative.province',
      elementType: 'labels',
      stylers: [{ visibility: 'on' }, { color: '#8E9196' }]
    },
    {
      // De-emphasize all countries except US
      featureType: 'administrative.country',
      elementType: 'geometry',
      stylers: [{ visibility: 'on' }, { color: '#8E9196' }]
    },
    {
      // Style highways to look more vintage (sepia tone)
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#f8c967' }]
    },
    {
      // Highway text styling
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#14532d' }]
    },
    {
      // Land styling - slight sepia tint for vintage feel
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#f5f2ea' }]
    },
    {
      // Water styling - vintage map blue
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#b6d0e2' }]
    }
  ]
};

// Route 66 polyline options - thicker, more visible styling
export const polylineOptions = {
  strokeColor: '#c2410c',
  strokeOpacity: 0.8,
  strokeWeight: 5,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  zIndex: 1,
};

// Google Maps API key
export const googleMapsApiKey = 'AIzaSyCj2hJjT8wA0G3gBmUaK7qmhKX8Uv3mDH8';

// Define nostalgic Americana icon positions
export const nostalgicIcons = [
  // Diners
  { latLng: [35.2271, -101.8312], type: 'diner', title: "Route 66 Diner" },
  { latLng: [38.6243, -90.1949], type: 'diner', title: "Ted Drewes Frozen Custard" },
  
  // Motels
  { latLng: [35.0746, -106.5504], type: 'motel', title: "Blue Swallow Motel" },
  { latLng: [35.2257, -97.4388], type: 'motel', title: "Wigwam Motel" },
  
  // Classic Cars
  { latLng: [35.1983, -101.9698], type: 'car', title: "Cadillac Ranch" },
  { latLng: [34.7402, -112.1153], type: 'car', title: "Classic Car Exhibit" },
  
  // Cowboys
  { latLng: [35.5095, -105.8812], type: 'cowboy', title: "Old West Trading Post" },
  
  // Native American
  { latLng: [35.0527, -110.6615], type: 'native', title: "Painted Desert" },
  
  // Landmarks
  { latLng: [35.0502, -110.7025], type: 'landmark', title: "Petrified Forest" },
  { latLng: [36.0544, -112.2583], type: 'landmark', title: "Grand Canyon" },
  
  // Music
  { latLng: [36.1622, -86.7744], type: 'music', title: "Route 66 Roadhouse" },
  
  // Roadside attractions
  { latLng: [35.0019, -110.6756], type: 'roadside', title: "Giant Jack Rabbit" },
  { latLng: [35.0817, -106.6505], type: 'roadside', title: "Tumbleweed" }
];
