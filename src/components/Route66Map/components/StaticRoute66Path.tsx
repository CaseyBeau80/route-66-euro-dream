
import { useEffect } from 'react';

interface StaticRoute66PathProps {
  map: google.maps.Map;
  enhanced?: boolean;
}

// Enhanced highway markers positioned along actual highway corridors
const enhancedHighwayMarkers = [
  // Illinois - I-55 corridor (Historic US-66)
  { position: { lat: 41.2, lng: -88.6 }, text: "I-55", state: "Illinois", description: "Historic US-66 Corridor", bgColor: "#1565C0" },
  { position: { lat: 40.0, lng: -89.5 }, text: "US-66", state: "Illinois", description: "Historic Route Marker", bgColor: "#2E7D32" },
  
  // Missouri - I-44 (Historic US-66 Superslab)
  { position: { lat: 38.7, lng: -90.4 }, text: "I-44", state: "Missouri", description: "Route 66 Superslab", bgColor: "#1565C0" },
  { position: { lat: 37.6, lng: -92.5 }, text: "I-44", state: "Missouri", description: "Historic US-66", bgColor: "#1565C0" },
  
  // Oklahoma - I-44 then I-40 (Will Rogers Highway)
  { position: { lat: 36.3, lng: -95.5 }, text: "I-44", state: "Oklahoma", description: "Will Rogers Highway", bgColor: "#1565C0" },
  { position: { lat: 35.5, lng: -97.8 }, text: "I-40", state: "Oklahoma", description: "Will Rogers Highway", bgColor: "#1565C0" },
  
  // Texas - I-40
  { position: { lat: 35.2, lng: -101.0 }, text: "I-40", state: "Texas", description: "Route 66 Corridor", bgColor: "#1565C0" },
  
  // New Mexico - I-40
  { position: { lat: 35.1, lng: -105.0 }, text: "I-40", state: "New Mexico", description: "Historic Route 66", bgColor: "#1565C0" },
  { position: { lat: 35.08, lng: -107.5 }, text: "I-40", state: "New Mexico", description: "Historic Route 66", bgColor: "#1565C0" },
  
  // Arizona - I-40 and Historic US-66
  { position: { lat: 35.15, lng: -110.5 }, text: "I-40", state: "Arizona", description: "Route 66 Historic", bgColor: "#1565C0" },
  { position: { lat: 35.1, lng: -113.5 }, text: "US-66", state: "Arizona", description: "Historic Route 66", bgColor: "#2E7D32" },
  
  // California - I-40, I-15, and local roads
  { position: { lat: 34.85, lng: -116.0 }, text: "I-40", state: "California", description: "Mojave Desert Route", bgColor: "#1565C0" },
  { position: { lat: 34.3, lng: -117.5 }, text: "I-15", state: "California", description: "San Bernardino Freeway", bgColor: "#1565C0" },
  { position: { lat: 34.05, lng: -118.3 }, text: "Local", state: "California", description: "Santa Monica Blvd", bgColor: "#F57F17" }
];

// Major stop markers with enhanced information
const enhancedMajorStops = [
  { position: { lat: 41.8781, lng: -87.6298 }, name: "Chicago", description: "Route 66 Begins - Grant Park", icon: "🏁" },
  { position: { lat: 38.7067, lng: -90.3990 }, name: "St. Louis", description: "Gateway Arch City", icon: "🌉" },
  { position: { lat: 35.4676, lng: -97.5164 }, name: "Oklahoma City", description: "Route 66 Museum", icon: "🏛️" },
  { position: { lat: 35.2220, lng: -101.8313 }, name: "Amarillo", description: "Cadillac Ranch", icon: "🚗" },
  { position: { lat: 35.0844, lng: -106.6504 }, name: "Albuquerque", description: "Old Town Plaza", icon: "🏜️" },
  { position: { lat: 35.1983, lng: -111.6513 }, name: "Flagstaff", description: "Mountain Town", icon: "🏔️" },
  { position: { lat: 34.0195, lng: -118.4912 }, name: "Santa Monica", description: "Route 66 Ends - Pier", icon: "🏖️" }
];

const StaticRoute66Path = ({ map, enhanced = false }: StaticRoute66PathProps) => {
  useEffect(() => {
    if (!map || typeof google === 'undefined') return;
    
    console.log(`🏷️ Adding ${enhanced ? 'enhanced' : 'basic'} Route 66 highway markers and stops`);
    
    const markers: google.maps.Marker[] = [];
    
    if (enhanced) {
      // Create enhanced highway markers with better positioning
      enhancedHighwayMarkers.forEach(marker => {
        const mapMarker = new google.maps.Marker({
          position: marker.position,
          map: map,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="90" height="32" viewBox="0 0 90 32">
                <rect width="90" height="32" rx="16" fill="${marker.bgColor}" stroke="#fff" stroke-width="2"/>
                <text x="45" y="14" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">${marker.text}</text>
                <text x="45" y="24" text-anchor="middle" fill="white" font-family="Arial" font-size="7">${marker.state}</text>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(90, 32),
            anchor: new google.maps.Point(45, 16)
          },
          title: `${marker.text} - ${marker.description}`,
          zIndex: 200
        });
        markers.push(mapMarker);
      });

      // Create enhanced major stop markers
      enhancedMajorStops.forEach(stop => {
        const stopMarker = new google.maps.Marker({
          position: stop.position,
          map: map,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
                <circle cx="14" cy="14" r="12" fill="#DC2626" stroke="#fff" stroke-width="2"/>
                <circle cx="14" cy="14" r="6" fill="#fff"/>
                <text x="14" y="17" text-anchor="middle" fill="#DC2626" font-family="Arial" font-size="10">${stop.icon}</text>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(28, 28),
            anchor: new google.maps.Point(14, 14)
          },
          title: `${stop.name} - ${stop.description}`,
          zIndex: 300
        });

        // Add click listener for info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; max-width: 200px; font-family: Arial, sans-serif;">
              <h3 style="margin: 0 0 8px 0; color: #DC2626; font-size: 16px; font-weight: bold;">
                ${stop.icon} ${stop.name}
              </h3>
              <p style="margin: 0; font-size: 13px; color: #333;">
                ${stop.description}
              </p>
            </div>
          `
        });

        stopMarker.addListener('click', () => {
          infoWindow.open(map, stopMarker);
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
    
    console.log(`✅ ${enhanced ? 'Enhanced' : 'Basic'} Route 66 markers added (${markers.length} total)`);
    
    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, [map, enhanced]);

  return null;
};

export default StaticRoute66Path;
