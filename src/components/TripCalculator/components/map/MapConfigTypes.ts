
export const mapContainerStyle = {
  width: '100%',
  height: '256px'
};

export const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

export interface MapBounds {
  extend: (latLng: google.maps.LatLng) => void;
}

export interface MapCenter {
  lat: number;
  lng: number;
}
