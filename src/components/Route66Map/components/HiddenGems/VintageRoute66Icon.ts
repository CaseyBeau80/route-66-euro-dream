
export const createVintageRoute66Icon = () => {
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="28" viewBox="0 0 24 28">
        <defs>
          <filter id="vintageShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.4"/>
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
        <path d="M12 1 L21 5 L21 15 C21 19 17 23 12 27 C7 23 3 19 3 15 L3 5 Z" 
              fill="url(#shieldGradient)" 
              stroke="#2C5F41" 
              stroke-width="1.5" 
              filter="url(#vintageShadow)"/>
        
        <!-- Route 66 Banner -->
        <rect x="4" y="8" width="16" height="5" rx="1" 
              fill="url(#route66Gradient)" 
              stroke="#1E3A5F" 
              stroke-width="0.8"/>
        
        <!-- Route 66 Text -->
        <text x="12" y="11.5" text-anchor="middle" 
              fill="#F5F2EA" 
              font-family="Arial Black, sans-serif" 
              font-size="4.5" 
              font-weight="900">ROUTE</text>
        
        <!-- Large 66 -->
        <text x="12" y="19" text-anchor="middle" 
              fill="#D92121" 
              font-family="Arial Black, sans-serif" 
              font-size="8" 
              font-weight="900" 
              stroke="#1E3A5F" 
              stroke-width="0.3">66</text>
        
        <!-- Hidden Gem Star -->
        <circle cx="17" cy="6" r="2.5" fill="#D92121" stroke="#F5F2EA" stroke-width="0.8"/>
        <path d="M17,4.5 L17.5,6 L19,6 L17.8,6.8 L18.3,8.3 L17,7.5 L15.7,8.3 L16.2,6.8 L15,6 L16.5,6 Z" 
              fill="#F5F2EA"/>
      </svg>
    `)}`,
    scaledSize: new google.maps.Size(24, 28),
    anchor: new google.maps.Point(12, 28)
  };
};
