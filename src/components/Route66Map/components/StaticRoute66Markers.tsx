
import { useEffect } from 'react';

interface StaticRoute66MarkersProps {
  map: google.maps.Map;
}

// Major Route 66 stops with their coordinates and information
const majorRoute66Stops = [
  { 
    position: { lat: 41.8781, lng: -87.6298 }, 
    name: "Chicago", 
    state: "Illinois",
    description: "Route 66 begins at Grant Park",
    isStart: true
  },
  { 
    position: { lat: 41.5250, lng: -88.0817 }, 
    name: "Joliet", 
    state: "Illinois",
    description: "Historic prison and Route 66 heritage"
  },
  { 
    position: { lat: 39.8003, lng: -89.6437 }, 
    name: "Springfield", 
    state: "Illinois",
    description: "Lincoln's hometown"
  },
  { 
    position: { lat: 38.7067, lng: -90.3990 }, 
    name: "St. Louis", 
    state: "Missouri",
    description: "Gateway Arch and historic downtown"
  },
  { 
    position: { lat: 37.2090, lng: -93.2923 }, 
    name: "Springfield", 
    state: "Missouri",
    description: "Birthplace of Route 66"
  },
  { 
    position: { lat: 37.0842, lng: -94.5133 }, 
    name: "Joplin", 
    state: "Missouri",
    description: "Route 66 Mural Park"
  },
  { 
    position: { lat: 36.1540, lng: -95.9928 }, 
    name: "Tulsa", 
    state: "Oklahoma",
    description: "Blue Dome District"
  },
  { 
    position: { lat: 35.4676, lng: -97.5164 }, 
    name: "Oklahoma City", 
    state: "Oklahoma",
    description: "National Route 66 Museum"
  },
  { 
    position: { lat: 35.2220, lng: -101.8313 }, 
    name: "Amarillo", 
    state: "Texas",
    description: "Famous Cadillac Ranch"
  },
  { 
    position: { lat: 35.1245, lng: -103.7207 }, 
    name: "Tucumcari", 
    state: "New Mexico",
    description: "Blue Swallow Motel"
  },
  { 
    position: { lat: 35.0844, lng: -106.6504 }, 
    name: "Albuquerque", 
    state: "New Mexico",
    description: "Old Town Plaza"
  },
  { 
    position: { lat: 35.0820, lng: -108.7426 }, 
    name: "Gallup", 
    state: "New Mexico",
    description: "Trading post capital"
  },
  { 
    position: { lat: 35.0819, lng: -110.0298 }, 
    name: "Holbrook", 
    state: "Arizona",
    description: "Wigwam Motel"
  },
  { 
    position: { lat: 35.1983, lng: -111.6513 }, 
    name: "Flagstaff", 
    state: "Arizona",
    description: "Historic downtown"
  },
  { 
    position: { lat: 35.2262, lng: -112.8871 }, 
    name: "Seligman", 
    state: "Arizona",
    description: "Birthplace of Historic Route 66"
  },
  { 
    position: { lat: 35.0222, lng: -114.3716 }, 
    name: "Kingman", 
    state: "Arizona",
    description: "Heart of Historic Route 66"
  },
  { 
    position: { lat: 34.8409, lng: -114.6160 }, 
    name: "Needles", 
    state: "California",
    description: "Desert gateway to California"
  },
  { 
    position: { lat: 34.8987, lng: -117.0178 }, 
    name: "Barstow", 
    state: "California",
    description: "Route 66 Mother Road Museum"
  },
  { 
    position: { lat: 34.1066, lng: -117.5931 }, 
    name: "San Bernardino", 
    state: "California",
    description: "Original McDonald's Museum"
  },
  { 
    position: { lat: 34.0522, lng: -118.2437 }, 
    name: "Los Angeles", 
    state: "California",
    description: "Hollywood and downtown"
  },
  { 
    position: { lat: 34.0195, lng: -118.4912 }, 
    name: "Santa Monica", 
    state: "California",
    description: "Route 66 ends at Santa Monica Pier",
    isEnd: true
  }
];

const StaticRoute66Markers = ({ map }: StaticRoute66MarkersProps) => {
  useEffect(() => {
    if (!map || typeof google === 'undefined') return;
    
    console.log(`🏷️ Adding ${majorRoute66Stops.length} Route 66 major stop markers`);
    
    const markers: google.maps.Marker[] = [];
    const infoWindows: google.maps.InfoWindow[] = [];
    
    majorRoute66Stops.forEach((stop, index) => {
      let iconColor = '#DC2626'; // Default red
      let iconText = (index + 1).toString();
      
      if (stop.isStart) {
        iconColor = '#22C55E'; // Green for start
        iconText = 'START';
      } else if (stop.isEnd) {
        iconColor = '#EF4444'; // Red for end
        iconText = 'END';
      }
      
      const marker = new google.maps.Marker({
        position: stop.position,
        map: map,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="14" fill="${iconColor}" stroke="#FFFFFF" stroke-width="2"/>
              <text x="16" y="${stop.isStart || stop.isEnd ? '12' : '20'}" text-anchor="middle" fill="white" font-family="Arial" font-size="${stop.isStart || stop.isEnd ? '6' : '10'}" font-weight="bold">${iconText}</text>
              ${stop.isStart || stop.isEnd ? `<text x="16" y="22" text-anchor="middle" fill="white" font-family="Arial" font-size="6" font-weight="bold">${stop.isStart ? 'START' : 'END'}</text>` : ''}
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16)
        },
        title: `${stop.name}, ${stop.state}`,
        zIndex: stop.isStart || stop.isEnd ? 30000 : 20000
      });

      // Create info window for each marker
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; max-width: 250px; font-family: Arial, sans-serif;">
            <h3 style="margin: 0 0 8px 0; color: ${iconColor}; font-size: 16px; font-weight: bold;">
              ${stop.name}, ${stop.state}
            </h3>
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #333;">
              ${stop.description}
            </p>
            <p style="margin: 0; font-size: 11px; color: #666;">
              ${stop.isStart ? 'Mile marker 0 - The journey begins!' : 
                stop.isEnd ? 'Mile marker 2,448 - Journey\'s end at the Pacific!' : 
                `Stop ${index + 1} of ${majorRoute66Stops.length}`}
            </p>
          </div>
        `
      });

      // Add click listener to show info window
      marker.addListener('click', () => {
        // Close all other info windows
        infoWindows.forEach(iw => iw.close());
        infoWindow.open(map, marker);
      });

      markers.push(marker);
      infoWindows.push(infoWindow);
    });
    
    console.log(`✅ Static Route 66 markers added (${markers.length} total)`);
    
    return () => {
      markers.forEach(marker => marker.setMap(null));
      infoWindows.forEach(infoWindow => infoWindow.close());
    };
  }, [map]);

  return null;
};

export default StaticRoute66Markers;
