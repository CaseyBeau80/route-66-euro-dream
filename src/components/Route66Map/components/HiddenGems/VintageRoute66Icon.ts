

export const createVintageRoute66Icon = () => {
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="42" viewBox="0 0 36 42">
        <defs>
          <filter id="vintageShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.4"/>
          </filter>
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#F5F2EA;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#E8E2D4;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="route66Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1E3A5F;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#2C5F41;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Shield Background -->
        <path d="M18 2 L32 8 L32 22 C32 28 26 34 18 40 C10 34 4 28 4 22 L4 8 Z" 
              fill="url(#shieldGradient)" 
              stroke="#2C5F41" 
              stroke-width="2" 
              filter="url(#vintageShadow)"/>
        
        <!-- Route 66 Banner -->
        <rect x="6" y="12" width="24" height="8" rx="2" 
              fill="url(#route66Gradient)" 
              stroke="#1E3A5F" 
              stroke-width="1"/>
        
        <!-- Route 66 Text -->
        <text x="18" y="17.5" text-anchor="middle" 
              fill="#F5F2EA" 
              font-family="Arial Black, sans-serif" 
              font-size="7" 
              font-weight="900">ROUTE</text>
        
        <!-- Large 66 -->
        <text x="18" y="30" text-anchor="middle" 
              fill="#D92121" 
              font-family="Arial Black, sans-serif" 
              font-size="12" 
              font-weight="900" 
              stroke="#1E3A5F" 
              stroke-width="0.5">66</text>
        
        <!-- Hidden Gem Star -->
        <circle cx="26" cy="10" r="4" fill="#D92121" stroke="#F5F2EA" stroke-width="1"/>
        <path d="M26,7 L26.8,9.2 L29,9.2 L27.1,10.6 L27.9,12.8 L26,11.4 L24.1,12.8 L24.9,10.6 L23,9.2 L25.2,9.2 Z" 
              fill="#F5F2EA"/>
      </svg>
    `)}`,
    scaledSize: new google.maps.Size(36, 42),
    anchor: new google.maps.Point(18, 42)
  };
};

