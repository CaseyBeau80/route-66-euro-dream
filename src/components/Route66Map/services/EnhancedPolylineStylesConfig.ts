
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

  // FIXED: Enhanced dashed yellow center line with much more visible dashing
  static getEnhancedCenterLineOptions(): google.maps.PolylineOptions {
    return {
      geodesic: true,
      strokeColor: '#FFD700', // Bright gold yellow
      strokeOpacity: 0, // Make the main stroke invisible
      strokeWeight: 1,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      zIndex: 100,
      // ENHANCED dashed pattern with much larger dashes and gaps
      icons: [{
        icon: {
          path: 'M 0,-3 0,3', // Taller dash line
          strokeOpacity: 1.0,
          strokeColor: '#FFD700',
          strokeWeight: 4,
          scale: 8 // Larger scale for more prominent dashes
        },
        offset: '0',
        repeat: '40px' // Larger spacing between dashes for clear road stripe effect
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
