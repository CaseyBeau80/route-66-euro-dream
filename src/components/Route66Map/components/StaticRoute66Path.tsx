
import { useEffect } from 'react';

interface StaticRoute66PathProps {
  map: google.maps.Map;
  enhanced?: boolean; // Whether to show enhanced static route
}

// Enhanced highway markers with more detail
const enhancedHighwayMarkers = [
  { position: { lat: 41.5, lng: -88.5 }, text: "I-55", state: "Illinois", description: "Historic US-66 Corridor" },
  { position: { lat: 38.7, lng: -90.4 }, text: "I-44", state: "Missouri", description: "Route 66 Superslab" },
  { position: { lat: 35.2, lng: -97.5 }, text: "I-40", state: "Oklahoma", description: "Will Rogers Highway" },
  { position: { lat: 35.2, lng: -101.8 }, text: "I-40", state: "Texas", description: "Route 66 Corridor" },
  { position: { lat: 35.1, lng: -106.7 }, text: "I-40", state: "New Mexico", description: "Historic Route 66" },
  { position: { lat: 35.2, lng: -111.7 }, text: "I-40", state: "Arizona", description: "Route 66 Historic" },
  { position: { lat: 34.1, lng: -117.6 }, text: "Local", state: "California", description: "Santa Monica Blvd" }
];

// Informational markers for major stops
const majorStops = [
  { position: { lat: 41.8781, lng: -87.6298 }, name: "Chicago", description: "Route 66 Begins" },
  { position: { lat: 38.7067, lng: -90.3990 }, name: "St. Louis", description: "Gateway Arch" },
  { position: { lat: 35.4676, lng: -97.5164 }, name: "Oklahoma City", description: "Route 66 Museum" },
  { position: { lat: 35.2220, lng: -101.8313 }, name: "Amarillo", description: "Cadillac Ranch" },
  { position: { lat: 35.0844, lng: -106.6504 }, name: "Albuquerque", description: "Old Town Plaza" },
  { position: { lat: 35.1983, lng: -111.6513 }, name: "Flagstaff", description: "Historic Downtown" },
  { position: { lat: 34.0195, lng: -118.4912 }, name: "Santa Monica", description: "Route 66 Ends" }
];

const StaticRoute66Path = ({ map, enhanced = false }: StaticRoute66PathProps) => {
  useEffect(() => {
    if (!map || typeof google === 'undefined') return;
    
    console.log(`🏷️ Adding ${enhanced ? 'enhanced' : 'basic'} Route 66 reference markers`);
    
    const markers: google.maps.Marker[] = [];
    
    if (enhanced) {
      // Create enhanced highway markers
      enhancedHighwayMarkers.forEach(marker => {
        const mapMarker = new google.maps.Marker({
          position: marker.position,
          map: map,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="30" viewBox="0 0 80 30">
                <rect width="80" height="30" rx="15" fill="#1976D2" stroke="#fff" stroke-width="2"/>
                <text x="40" y="12" text-anchor="middle" fill="white" font-family="Arial" font-size="8" font-weight="bold">${marker.text}</text>
                <text x="40" y="22" text-anchor="middle" fill="white" font-family="Arial" font-size="6">${marker.state}</text>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(80, 30),
            anchor: new google.maps.Point(40, 15)
          },
          title: `${marker.text} - ${marker.description}`,
          zIndex: 200
        });
        markers.push(mapMarker);
      });

      // Create major stop markers
      majorStops.forEach(stop => {
        const stopMarker = new google.maps.Marker({
          position: stop.position,
          map: map,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" fill="#DC2626" stroke="#fff" stroke-width="2"/>
                <circle cx="10" cy="10" r="4" fill="#fff"/>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(20, 20),
            anchor: new google.maps.Point(10, 10)
          },
          title: `${stop.name} - ${stop.description}`,
          zIndex: 300
        });
        markers.push(stopMarker);
      });
    } else {
      // Create basic highway markers (existing functionality)
      const basicMarkers = [
        { position: { lat: 41.5, lng: -88.5 }, text: "I-55", state: "Illinois" },
        { position: { lat: 38.7, lng: -90.4 }, text: "I-44", state: "Missouri" },
        { position: { lat: 35.2, lng: -97.5 }, text: "I-40", state: "Oklahoma" },
        { position: { lat: 35.2, lng: -106.7 }, text: "I-40", state: "New Mexico" },
        { position: { lat: 35.2, lng: -111.7 }, text: "I-40", state: "Arizona" },
        { position: { lat: 34.1, lng: -117.6 }, text: "I-15", state: "California" }
      ];

      basicMarkers.forEach(marker => {
        const mapMarker = new google.maps.Marker({
          position: marker.position,
          map: map,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="20" viewBox="0 0 60 20">
                <rect width="60" height="20" rx="10" fill="#1976D2" stroke="#fff" stroke-width="1"/>
                <text x="30" y="14" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">${marker.text}</text>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(60, 20),
            anchor: new google.maps.Point(30, 10)
          },
          title: `${marker.text} - ${marker.state}`,
          zIndex: 200
        });
        markers.push(mapMarker);
      });
    }
    
    console.log(`✅ ${enhanced ? 'Enhanced' : 'Basic'} highway reference markers added (${markers.length} total)`);
    
    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, [map, enhanced]);

  return null;
};

export default StaticRoute66Path;
