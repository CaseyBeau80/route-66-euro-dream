
export class PolylineStylesConfig {
  // Main Route 66 asphalt road styling - enhanced for destination cities route
  static getMainPolylineOptions(): google.maps.PolylineOptions {
    return {
      geodesic: true,
      strokeColor: '#2C1810', // Dark asphalt color
      strokeOpacity: 0.95,
      strokeWeight: 10, // Slightly thicker for better visibility
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      zIndex: 50
    };
  }

  // FIXED: Dashed yellow center line for authentic Route 66 look
  static getCenterLineOptions(): google.maps.PolylineOptions {
    return {
      geodesic: true,
      strokeColor: '#FFD700', // Bright yellow
      strokeOpacity: 1.0,
      strokeWeight: 3, // Slightly thicker center line
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      zIndex: 100,
      // DASHED PATTERN for authentic road stripe
      icons: [{
        icon: {
          path: 'M 0,-1 0,1',
          strokeOpacity: 1,
          strokeColor: '#FFD700',
          strokeWeight: 3,
          scale: 4
        },
        offset: '0',
        repeat: '20px'
      }]
    };
  }

  // Enhanced fallback styling for segments where needed
  static getFallbackPolylineOptions(): google.maps.PolylineOptions {
    return {
      geodesic: true,
      strokeColor: '#DC2626', // Red fallback color
      strokeOpacity: 0.7,
      strokeWeight: 4,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      zIndex: 25
    };
  }

  // Highway-specific styling based on route type (kept for compatibility)
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
        return { ...baseOptions, strokeColor: '#D97706', strokeWeight: 8 }; // Orange for historic sections
      default:
        return baseOptions;
    }
  }

  // ENHANCED: Maximum visibility destination cities route styling
  static getIdealizedRouteOptions(): google.maps.PolylineOptions {
    return {
      geodesic: true,
      strokeColor: '#1a1a1a', // Very dark for maximum contrast
      strokeOpacity: 1.0, // Full opacity
      strokeWeight: 14, // Thicker for better visibility
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      zIndex: 50
    };
  }

  // ENHANCED: Dashed center line with solid stroke for maximum visibility
  static getIdealizedCenterLineOptions(): google.maps.PolylineOptions {
    return {
      geodesic: true,
      strokeColor: '#FFD700', // Bright gold yellow
      strokeOpacity: 1.0, // Full opacity
      strokeWeight: 4, // Thicker for visibility
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      zIndex: 100,
      // DASHED PATTERN for authentic road appearance
      icons: [{
        icon: {
          path: 'M 0,-1 0,1',
          strokeOpacity: 1,
          strokeColor: '#FFD700',
          strokeWeight: 4,
          scale: 5
        },
        offset: '0',
        repeat: '25px'
      }]
    };
  }
}
