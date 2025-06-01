
export class PolylineStylesConfig {
  // Main Route 66 asphalt road styling
  static getMainPolylineOptions(): google.maps.PolylineOptions {
    return {
      geodesic: true,
      strokeColor: '#2C1810', // Dark asphalt color
      strokeOpacity: 0.9,
      strokeWeight: 8,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      zIndex: 50
    };
  }

  // Bright yellow center line for authentic Route 66 look
  static getCenterLineOptions(): google.maps.PolylineOptions {
    return {
      geodesic: true,
      strokeColor: '#FFD700', // Bright yellow
      strokeOpacity: 1.0,
      strokeWeight: 2,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      zIndex: 100
    };
  }

  // Fallback styling for segments where Directions API fails
  static getFallbackPolylineOptions(): google.maps.PolylineOptions {
    return {
      geodesic: true,
      strokeColor: '#DC2626', // Red fallback color
      strokeOpacity: 0.7,
      strokeWeight: 4,
      strokePattern: [
        { icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 4 }, offset: '0', repeat: '20px' }
      ],
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      zIndex: 25
    };
  }

  // Highway-specific styling based on route type
  static getHighwaySpecificOptions(highway: string): google.maps.PolylineOptions {
    const baseOptions = this.getMainPolylineOptions();
    
    switch (highway) {
      case 'I-55':
        return { ...baseOptions, strokeColor: '#1E40AF' }; // Blue for I-55
      case 'I-44':
        return { ...baseOptions, strokeColor: '#059669' }; // Green for I-44
      case 'I-40':
        return { ...baseOptions, strokeColor: '#DC2626' }; // Red for I-40
      case 'Historic US-66':
        return { ...baseOptions, strokeColor: '#D97706', strokeWeight: 6 }; // Orange for historic sections
      default:
        return baseOptions;
    }
  }
}
