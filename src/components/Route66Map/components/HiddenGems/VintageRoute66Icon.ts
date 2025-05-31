


export const createVintageRoute66Icon = () => {
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
        </defs>
        
        <!-- Classic Route 66 Shield Shape -->
        <path d="M18 2
                 C12 2 6 2 4 2
                 C2 2 2 4 2 6
                 C2 8 2 12 2 16
                 C2 20 4 24 8 28
                 C12 32 16 34 18 34
                 C20 34 24 32 28 28
                 C32 24 34 20 34 16
                 C34 12 34 8 34 6
                 C34 4 34 2 32 2
                 C30 2 24 2 18 2 Z" 
              fill="#F5F2EA" 
              stroke="#1B3B5C" 
              stroke-width="2.5"
              filter="url(#shadow)"/>
        
        <!-- Inner border -->
        <path d="M18 4
                 C13 4 8 4 6 4
                 C5 4 4 5 4 6
                 C4 7 4 11 4 15
                 C4 18.5 5.5 22 8.5 25
                 C11.5 28 15 30 18 30
                 C21 30 24.5 28 27.5 25
                 C30.5 22 32 18.5 32 15
                 C32 11 32 7 32 6
                 C32 5 31 4 30 4
                 C28 4 23 4 18 4 Z" 
              fill="none" 
              stroke="#1B3B5C" 
              stroke-width="1"/>
        
        <!-- Horizontal dividing line -->
        <line x1="6" y1="16" x2="30" y2="16" 
              stroke="#1B3B5C" 
              stroke-width="1.5"/>
        
        <!-- ROUTE text at top -->
        <text x="18" y="13" text-anchor="middle" 
              fill="#1B3B5C" 
              font-family="Arial, sans-serif" 
              font-size="8" 
              font-weight="bold">ROUTE</text>
        
        <!-- Large 66 number at bottom -->
        <text x="18" y="27" text-anchor="middle" 
              fill="#1B3B5C" 
              font-family="Arial, sans-serif" 
              font-size="14" 
              font-weight="900">66</text>
      </svg>
    `)}`,
    scaledSize: new google.maps.Size(36, 36),
    anchor: new google.maps.Point(18, 36)
  };
};


