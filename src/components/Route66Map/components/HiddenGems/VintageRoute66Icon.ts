export const createVintageRoute66Icon = () => {
  // Authentic Route 66 shield icon matching the classic US Highway shield design
  const iconSize = 36; // Increased from 24 to 36
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconSize} ${iconSize}">
      <!-- Authentic US Highway shield shape with proper curvature -->
      <path d="M18,3 
               L28,3 
               C30,3 32,5 32,7
               L32,15 
               C32,19 30,23 27,26
               C24,29 21,31 18,33
               C15,31 12,29 9,26
               C6,23 4,19 4,15
               L4,7
               C4,5 6,3 8,3
               L18,3 Z" 
            fill="#FFFFFF" 
            stroke="#000000" 
            stroke-width="1.5"/>
      
      <!-- ROUTE text (no line below) -->
      <text x="18" y="12" text-anchor="middle" 
            fill="#000000" 
            font-family="Arial, sans-serif" 
            font-size="4.5" 
            font-weight="bold">ROUTE</text>
      
      <!-- US text -->
      <text x="18" y="18" text-anchor="middle" 
            fill="#000000" 
            font-family="Arial, sans-serif" 
            font-size="3.5" 
            font-weight="bold">US</text>
      
      <!-- 66 large numbers -->
      <text x="18" y="28" text-anchor="middle" 
            fill="#000000" 
            font-family="Arial, sans-serif" 
            font-size="9" 
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
