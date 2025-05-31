
export const createVintageRoute66Icon = () => {
  // Enhanced vintage Route 66 shield icon with better visibility
  const iconSize = 28;
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconSize} ${iconSize}">
      <!-- Outer vintage border -->
      <circle cx="14" cy="14" r="13" 
              fill="#8B4513" 
              stroke="#D4AF37" 
              stroke-width="2"/>
      
      <!-- Inner shield background -->
      <circle cx="14" cy="14" r="10" 
              fill="#2C1810" 
              stroke="#D4AF37" 
              stroke-width="1"/>
      
      <!-- Route 66 shield shape -->
      <path d="M8 10 Q8 8 10 8 L18 8 Q20 8 20 10 L20 16 Q20 18 18 18 L10 18 Q8 18 8 16 Z" 
            fill="#F5F5DC" 
            stroke="#8B4513" 
            stroke-width="0.5"/>
      
      <!-- Route 66 text -->
      <text x="14" y="12" text-anchor="middle" 
            fill="#8B4513" 
            font-family="serif" 
            font-size="4" 
            font-weight="bold">66</text>
      
      <!-- Small vintage decorative elements -->
      <circle cx="10" cy="11" r="0.5" fill="#D4AF37"/>
      <circle cx="18" cy="11" r="0.5" fill="#D4AF37"/>
      <circle cx="10" cy="17" r="0.5" fill="#D4AF37"/>
      <circle cx="18" cy="17" r="0.5" fill="#D4AF37"/>
      
      <!-- Vintage shine effect -->
      <ellipse cx="11" cy="10" rx="1.5" ry="0.8" 
               fill="#F5F5DC" 
               opacity="0.6"/>
    </svg>
  `;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`,
    scaledSize: new google.maps.Size(iconSize, iconSize),
    anchor: new google.maps.Point(iconSize/2, iconSize/2)
  };
};

// Enhanced drive-in specific icon for theaters
export const createDriveInIcon = () => {
  const iconSize = 32;
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconSize} ${iconSize}">
      <!-- Enhanced vintage background -->
      <circle cx="16" cy="16" r="15" 
              fill="#2c1810" 
              stroke="#d4af37" 
              stroke-width="2"/>
      
      <!-- Inner vintage border -->
      <circle cx="16" cy="16" r="12" 
              fill="none" 
              stroke="#8b4513" 
              stroke-width="1"/>
      
      <!-- Drive-in screen -->
      <rect x="8" y="10" width="16" height="10" 
            fill="#1a1a1a" 
            stroke="#d4af37" 
            stroke-width="1.5" 
            rx="1"/>
      
      <!-- Screen glow effect -->
      <rect x="9" y="11" width="14" height="8" 
            fill="#87ceeb" 
            opacity="0.4" 
            rx="0.5"/>
      
      <!-- Vintage car silhouettes -->
      <rect x="5" y="21" width="4" height="2" 
            fill="#8b4513" 
            rx="1"/>
      <rect x="11" y="21" width="4" height="2" 
            fill="#8b4513" 
            rx="1"/>
      <rect x="17" y="21" width="4" height="2" 
            fill="#8b4513" 
            rx="1"/>
      <rect x="23" y="21" width="4" height="2" 
            fill="#8b4513" 
            rx="1"/>
      
      <!-- Speaker posts -->
      <line x1="6" y1="20" x2="6" y2="17" 
            stroke="#d4af37" 
            stroke-width="1"/>
      <line x1="26" y1="20" x2="26" y2="17" 
            stroke="#d4af37" 
            stroke-width="1"/>
      
      <!-- Movie reel symbol -->
      <circle cx="16" cy="14" r="3" 
              fill="none" 
              stroke="#d4af37" 
              stroke-width="1"/>
      <circle cx="16" cy="14" r="1" 
              fill="#d4af37"/>
      
      <!-- Film reel details */
      <circle cx="13.5" cy="11.5" r="0.8" 
              fill="none" 
              stroke="#d4af37" 
              stroke-width="0.5"/>
      <circle cx="18.5" cy="11.5" r="0.8" 
              fill="none" 
              stroke="#d4af37" 
              stroke-width="0.5"/>
      <circle cx="13.5" cy="16.5" r="0.8" 
              fill="none" 
              stroke="#d4af37" 
              stroke-width="0.5"/>
      <circle cx="18.5" cy="16.5" r="0.8" 
              fill="none" 
              stroke="#d4af37" 
              stroke-width="0.5"/>
      
      <!-- Enhanced vintage shine -->
      <ellipse cx="12" cy="12" rx="2" ry="1.5" 
               fill="#f5f5dc" 
               opacity="0.3"/>
    </svg>
  `;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`,
    scaledSize: new google.maps.Size(iconSize, iconSize),
    anchor: new google.maps.Point(iconSize/2, iconSize/2)
  };
};
