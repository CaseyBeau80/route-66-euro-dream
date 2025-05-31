
export const createVintageRoute66Icon = () => {
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="38" viewBox="0 0 32 38">
        <!-- Shield Background -->
        <path d="M16 2 L28 6 L28 18 C28 24 22 30 16 36 C10 30 4 24 4 18 L4 6 Z" 
              fill="#F5F2EA" 
              stroke="#2C5F41" 
              stroke-width="2"/>
        
        <!-- Route Banner -->
        <rect x="6" y="10" width="20" height="6" rx="1" 
              fill="#1E3A5F" 
              stroke="#1E3A5F" 
              stroke-width="1"/>
        
        <!-- Route Text -->
        <text x="16" y="14" text-anchor="middle" 
              fill="#F5F2EA" 
              font-family="Arial, sans-serif" 
              font-size="6" 
              font-weight="bold">ROUTE</text>
        
        <!-- 66 Number -->
        <text x="16" y="26" text-anchor="middle" 
              fill="#D92121" 
              font-family="Arial, sans-serif" 
              font-size="10" 
              font-weight="900" 
              stroke="#1E3A5F" 
              stroke-width="0.3">66</text>
        
        <!-- Star indicator -->
        <circle cx="24" cy="8" r="3" fill="#D92121" stroke="#F5F2EA" stroke-width="1"/>
        <text x="24" y="10" text-anchor="middle" 
              fill="#F5F2EA" 
              font-family="Arial, sans-serif" 
              font-size="4" 
              font-weight="bold">★</text>
      </svg>
    `)}`,
    scaledSize: new google.maps.Size(32, 38),
    anchor: new google.maps.Point(16, 38)
  };
};
