
export const createVintageRoute66Icon = () => {
  // Authentic Route 66 shield icon matching the classic US Highway shield design
  const iconSize = 36;
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconSize} ${iconSize}">
      <!-- Authentic US Highway shield shape - matching vintage image -->
      <path d="M18,1 
               L3,1 
               L3,12
               C3,17 5,22 9,27
               C12,30 15,32 18,33
               C21,32 24,30 27,27
               C31,22 33,17 33,12
               L33,1 
               L18,1 Z" 
            fill="#F5F5DC" 
            stroke="#000000" 
            stroke-width="2"/>
      
      <!-- Inner shield border for depth -->
      <path d="M18,3 
               L6,3 
               L6,11
               C6,15 7,19 10,23
               C12,25 15,27 18,28
               C21,27 24,25 26,23
               C29,19 30,15 30,11
               L30,3 
               L18,3 Z" 
            fill="none" 
            stroke="#000000" 
            stroke-width="0.8"/>
      
      <!-- ROUTE text at top - smaller size for icon -->
      <text x="18" y="9" text-anchor="middle" 
            fill="#000000" 
            font-family="Arial, sans-serif" 
            font-size="4" 
            font-weight="bold"
            letter-spacing="0.3px">ROUTE</text>
      
      <!-- Large 66 numbers in black - matching vintage style -->
      <text x="18" y="22" text-anchor="middle" 
            fill="#000000" 
            font-family="Arial Black, Arial, sans-serif" 
            font-size="11" 
            font-weight="900">66</text>
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
