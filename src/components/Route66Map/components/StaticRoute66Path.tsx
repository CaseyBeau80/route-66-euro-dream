
import { useEffect } from 'react';

interface StaticRoute66PathProps {
  map: google.maps.Map;
}

// Simplified highway markers for reference
const highwayMarkers = [
  { position: { lat: 41.5, lng: -88.5 }, text: "I-55", state: "Illinois" },
  { position: { lat: 38.7, lng: -90.4 }, text: "I-44", state: "Missouri" },
  { position: { lat: 35.2, lng: -97.5 }, text: "I-40", state: "Oklahoma" },
  { position: { lat: 35.1, lng: -106.7 }, text: "I-40", state: "New Mexico" },
  { position: { lat: 35.2, lng: -111.7 }, text: "I-40", state: "Arizona" },
  { position: { lat: 34.1, lng: -117.6 }, text: "I-15", state: "California" }
];

const StaticRoute66Path = ({ map }: StaticRoute66PathProps) => {
  useEffect(() => {
    if (!map || typeof google === 'undefined') return;
    
    console.log("🏷️ Adding Route 66 highway reference markers");
    
    // Create highway reference markers
    const markers = highwayMarkers.map(marker => 
      new google.maps.Marker({
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
      })
    );
    
    console.log("✅ Highway reference markers added");
    
    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, [map]);

  return null;
};

export default StaticRoute66Path;
