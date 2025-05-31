
export class PolylineStylesConfig {
  static getMainPolylineOptions(): google.maps.PolylineOptions {
    return {
      geodesic: false,
      strokeColor: '#2C2C2C', // Dark charcoal/asphalt color
      strokeOpacity: 0.9, // Slightly weathered appearance
      strokeWeight: 8, // Thick line
      zIndex: 10000, // High z-index to be on top
      clickable: false
    };
  }

  static getCenterLineOptions(): google.maps.PolylineOptions {
    return {
      geodesic: false,
      strokeColor: '#FFD700', // Bright yellow/gold color
      strokeOpacity: 0,
      strokeWeight: 0,
      zIndex: 10001,
      clickable: false,
      icons: [{
        icon: {
          path: 'M 0,-1.5 0,1.5',
          strokeOpacity: 1.0, // Full opacity for bright yellow
          strokeColor: '#FFD700', // Bright yellow/gold color
          strokeWeight: 2,
          scale: 1
        },
        offset: '0%',
        repeat: '40px' // Slightly longer dashes for worn look
      }]
    };
  }
}
