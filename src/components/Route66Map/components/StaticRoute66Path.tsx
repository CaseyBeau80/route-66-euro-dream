
import { useEffect } from 'react';

interface StaticRoute66PathProps {
  map: google.maps.Map;
}

// Detailed Route 66 path following actual highways
const route66HighwayPath = [
  // Illinois - I-55 South
  { lat: 41.8781, lng: -87.6298 }, // Chicago start
  { lat: 41.7370, lng: -87.7844 }, // Southwest Chicago
  { lat: 41.5250, lng: -88.0817 }, // Joliet
  { lat: 41.3014, lng: -88.2834 }, // Morris
  { lat: 41.1306, lng: -88.8290 }, // Pontiac
  { lat: 40.8417, lng: -89.0081 }, // Lexington
  { lat: 40.4842, lng: -89.1234 }, // Bloomington
  { lat: 40.1164, lng: -89.4089 }, // Lincoln
  { lat: 39.8003, lng: -89.6437 }, // Springfield
  { lat: 39.4489, lng: -89.8687 }, // Chatham
  { lat: 39.1611, lng: -90.1581 }, // Carlinville
  
  // Missouri - Continue on I-55 then I-44
  { lat: 38.7067, lng: -90.3990 }, // St. Louis
  { lat: 38.5767, lng: -90.7779 }, // Eureka
  { lat: 38.4517, lng: -91.0112 }, // Pacific
  { lat: 38.3606, lng: -91.2829 }, // Gray Summit
  { lat: 38.2500, lng: -91.8000 }, // Rolla
  { lat: 38.0542, lng: -92.1735 }, // Doolittle
  { lat: 37.7506, lng: -92.6087 }, // Marshfield
  { lat: 37.2090, lng: -93.2923 }, // Springfield, MO
  { lat: 37.1542, lng: -93.7306 }, // Mount Vernon
  { lat: 37.0842, lng: -94.5133 }, // Joplin
  
  // Oklahoma - I-44 to Turner Turnpike to I-35 to I-40
  { lat: 36.9342, lng: -94.8358 }, // Miami, OK
  { lat: 36.7542, lng: -95.3654 }, // Vinita
  { lat: 36.3742, lng: -95.7969 }, // Claremore
  { lat: 36.1540, lng: -95.9928 }, // Tulsa
  { lat: 35.9906, lng: -96.6917 }, // Sapulpa
  { lat: 35.6870, lng: -97.3984 }, // Oklahoma City area
  { lat: 35.4676, lng: -97.5164 }, // Oklahoma City
  { lat: 35.3947, lng: -97.8364 }, // Yukon
  { lat: 35.2717, lng: -98.2120 }, // El Reno
  { lat: 35.0417, lng: -98.6120 }, // Hydro
  { lat: 35.5089, lng: -98.9680 }, // Elk City
  
  // Texas - I-40 West
  { lat: 35.4406, lng: -100.0204 }, // Shamrock, TX
  { lat: 35.3742, lng: -100.9954 }, // McLean
  { lat: 35.2220, lng: -101.8313 }, // Amarillo
  { lat: 35.1906, lng: -102.5521 }, // Vega
  { lat: 35.1842, lng: -103.1935 }, // Adrian
  
  // New Mexico - I-40 West
  { lat: 35.1677, lng: -103.7044 }, // Tucumcari
  { lat: 35.1406, lng: -104.5244 }, // Santa Rosa
  { lat: 35.1081, lng: -105.2067 }, // Clines Corners
  { lat: 35.0844, lng: -106.6504 }, // Albuquerque
  { lat: 35.0767, lng: -107.6350 }, // Grants
  { lat: 35.0820, lng: -108.7426 }, // Gallup
  
  // Arizona - I-40 West
  { lat: 35.0819, lng: -110.0298 }, // Holbrook
  { lat: 35.0281, lng: -110.2929 }, // Joseph City
  { lat: 35.0606, lng: -110.6322 }, // Winslow
  { lat: 35.0842, lng: -111.0951 }, // Winona
  { lat: 35.1983, lng: -111.6513 }, // Flagstaff
  { lat: 35.1542, lng: -112.1390 }, // Williams
  { lat: 35.0281, lng: -112.8167 }, // Ash Fork
  { lat: 35.2677, lng: -113.7558 }, // Seligman
  { lat: 35.3556, lng: -113.9389 }, // Peach Springs
  { lat: 35.1894, lng: -114.0530 }, // Kingman
  { lat: 35.0742, lng: -114.5667 }, // Oatman area
  
  // California - I-40 to I-15 to local roads
  { lat: 34.8409, lng: -114.6160 }, // Needles
  { lat: 34.8667, lng: -115.4667 }, // Essex
  { lat: 34.8987, lng: -117.0178 }, // Barstow
  { lat: 34.7444, lng: -117.2483 }, // Victorville
  { lat: 34.4208, lng: -117.4103 }, // Cajon Pass
  { lat: 34.1066, lng: -117.5931 }, // San Bernardino
  { lat: 34.0522, lng: -118.2437 }, // Los Angeles
  { lat: 34.0195, lng: -118.4912 } // Santa Monica - End
];

const StaticRoute66Path = ({ map }: StaticRoute66PathProps) => {
  useEffect(() => {
    if (!map || typeof google === 'undefined') return;
    
    console.log("Creating static Route 66 highway path");
    
    // Create the main route polyline following highways
    const routePath = new google.maps.Polyline({
      path: route66HighwayPath,
      geodesic: false, // Don't curve, follow exact highway path
      strokeColor: '#DC2626',
      strokeOpacity: 1.0,
      strokeWeight: 6,
      zIndex: 100,
      map: map
    });
    
    // Add highway labels at key points
    const highwayLabels = [
      { position: { lat: 41.5, lng: -88.5 }, text: "I-55", state: "Illinois" },
      { position: { lat: 38.7, lng: -90.4 }, text: "I-55 → I-44", state: "Missouri" },
      { position: { lat: 37.8, lng: -92.5 }, text: "I-44", state: "Missouri" },
      { position: { lat: 36.2, lng: -95.8 }, text: "I-44 → I-40", state: "Oklahoma" },
      { position: { lat: 35.2, lng: -101.8 }, text: "I-40", state: "Texas" },
      { position: { lat: 35.1, lng: -106.7 }, text: "I-40", state: "New Mexico" },
      { position: { lat: 35.2, lng: -111.7 }, text: "I-40", state: "Arizona" },
      { position: { lat: 34.9, lng: -117.0 }, text: "I-40 → I-15", state: "California" }
    ];
    
    // Create highway labels
    highwayLabels.forEach(label => {
      new google.maps.Marker({
        position: label.position,
        map: map,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="20" viewBox="0 0 60 20">
              <rect width="60" height="20" rx="10" fill="#1976D2" stroke="#fff" stroke-width="1"/>
              <text x="30" y="14" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">${label.text}</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(60, 20),
          anchor: new google.maps.Point(30, 10)
        },
        title: `${label.text} - ${label.state}`,
        zIndex: 200
      });
    });
    
    console.log("Static Route 66 highway path created successfully");
    
    return () => {
      routePath.setMap(null);
    };
  }, [map]);

  return null;
};

export default StaticRoute66Path;
