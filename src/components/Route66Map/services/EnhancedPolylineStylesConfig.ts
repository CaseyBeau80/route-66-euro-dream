
export class EnhancedPolylineStylesConfig {
  // Enhanced main Route 66 asphalt road styling for flowing curves
  static getFlowingRouteOptions(): google.maps.PolylineOptions {
    return {
      geodesic: true,
      strokeColor: '#2C1810', // Dark asphalt color
      strokeOpacity: 0.95,
      strokeWeight: 12, // Slightly thicker for better visibility on curves
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      zIndex: 50
    };
  }

  // Enhanced dashed yellow center line with improved visibility
  static getEnhancedCenterLineOptions(): google.maps.PolylineOptions {
    return {
      geodesic: true,
      strokeColor: '#FFD700', // Bright gold yellow
      strokeOpacity: 1.0,
      strokeWeight: 4, // Thicker for better visibility
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      zIndex: 100,
      // Enhanced dashed pattern with better spacing
      icons: [{
        icon: {
          path: 'M 0,-2 0,2',
          strokeOpacity: 1,
          strokeColor: '#FFD700',
          strokeWeight: 4,
          scale: 6
        },
        offset: '0',
        repeat: '30px' // Better spacing for dashed appearance
      }]
    };
  }

  // Alternative solid center line option
  static getSolidCenterLineOptions(): google.maps.PolylineOptions {
    return {
      geodesic: true,
      strokeColor: '#FFFF00', // Bright yellow
      strokeOpacity: 0.9,
      strokeWeight: 3,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      zIndex: 100
    };
  }

  // Double yellow center line option
  static getDoubleYellowCenterLineOptions(): google.maps.PolylineOptions[] {
    const baseOptions = {
      geodesic: true,
      strokeColor: '#FFD700',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      zIndex: 100
    };

    return [
      {
        ...baseOptions,
        // Left line offset would need custom implementation
      },
      {
        ...baseOptions,
        // Right line offset would need custom implementation
      }
    ];
  }
}
