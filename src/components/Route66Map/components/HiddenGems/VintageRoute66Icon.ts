
export const createVintageRoute66Icon = () => {
  // Larger black and white Route 66 shield icon with authentic US Highway shield shape
  const iconSize = 36; // Increased from 24 to 36
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconSize} ${iconSize}">
      <!-- Authentic US Highway shield shape -->
      <path d="M18,2 
               L8,2 
               C6,2 4,4 4,6
               L4,16 
               C4,20 6,24 10,27
               C14,30 16,32 18,34
               C20,32 22,30 26,27
               C30,24 32,20 32,16
               L32,6
               C32,4 30,2 28,2
               L18,2 Z" 
            fill="#FFFFFF" 
            stroke="#000000" 
            stroke-width="2"/>
      
      <!-- Route 66 text -->
      <text x="18" y="12" text-anchor="middle" 
            fill="#000000" 
            font-family="Arial, sans-serif" 
            font-size="5" 
            font-weight="bold">ROUTE</text>
      <text x="18" y="22" text-anchor="middle" 
            fill="#000000" 
            font-family="Arial, sans-serif" 
            font-size="8" 
            font-weight="bold">66</text>
    </svg>
  `;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`,
    scaledSize: new google.maps.Size(iconSize, iconSize),
    anchor: new google.maps.Point(iconSize/2, iconSize/2)
  };
};

// Vintage drive-in theater sign icon based on the provided image
export const createDriveInIcon = () => {
  const iconSize = 32;
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconSize} ${iconSize}">
      <!-- Main sign background (red/orange gradient) -->
      <rect x="4" y="6" width="24" height="20" 
            fill="#D2691E" 
            stroke="#8B4513" 
            stroke-width="1" 
            rx="2"/>
      
      <!-- Sign border -->
      <rect x="5" y="7" width="22" height="18" 
            fill="none" 
            stroke="#FFFFFF" 
            stroke-width="1" 
            rx="1"/>
      
      <!-- DRIVE-IN text -->
      <text x="16" y="13" text-anchor="middle" 
            fill="#FFFFFF" 
            font-family="Arial, sans-serif" 
            font-size="4" 
            font-weight="bold">DRIVE-IN</text>
      
      <!-- THEATER text -->
      <text x="16" y="18" text-anchor="middle" 
            fill="#FFFFFF" 
            font-family="Arial, sans-serif" 
            font-size="3.5" 
            font-weight="bold">THEATER</text>
      
      <!-- Sign post -->
      <rect x="15" y="26" width="2" height="6" 
            fill="#8B4513"/>
      
      <!-- Decorative elements (small lights/bulbs) -->
      <circle cx="7" cy="9" r="0.8" fill="#FFFF00" opacity="0.8"/>
      <circle cx="25" cy="9" r="0.8" fill="#FFFF00" opacity="0.8"/>
      <circle cx="7" cy="23" r="0.8" fill="#FFFF00" opacity="0.8"/>
      <circle cx="25" cy="23" r="0.8" fill="#FFFF00" opacity="0.8"/>
      
      <!-- Arrow pointing down -->
      <path d="M13 20 L16 23 L19 20" 
            stroke="#FFFF00" 
            stroke-width="1.5" 
            fill="none" 
            stroke-linecap="round" 
            stroke-linejoin="round"/>
    </svg>
  `;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`,
    scaledSize: new google.maps.Size(iconSize, iconSize),
    anchor: new google.maps.Point(iconSize/2, iconSize)
  };
};
