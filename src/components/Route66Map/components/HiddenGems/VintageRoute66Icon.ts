

export const createVintageRoute66Icon = () => {
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
        </defs>
        
        <!-- Traditional US Highway Shield Shape with curved sides -->
        <path d="M18 2 
                 L5 2 
                 C3 2 2 3 2 5
                 L2 20 
                 C2 26 4 32 8 36
                 C12 40 16 42 18 42
                 C20 42 24 40 28 36
                 C32 32 34 26 34 20
                 L34 5
                 C34 3 33 2 31 2
                 L18 2 Z" 
              fill="#F5F2EA" 
              stroke="#1B3B5C" 
              stroke-width="2.5"
              filter="url(#shadow)"/>
        
        <!-- Inner border -->
        <path d="M18 4 
                 L6 4 
                 C5 4 4.5 4.5 4.5 5.5
                 L4.5 19 
                 C4.5 24 6 29 9.5 32.5
                 C13 36 16 38 18 38
                 C20 38 23 36 26.5 32.5
                 C30 29 31.5 24 31.5 19
                 L31.5 5.5
                 C31.5 4.5 31 4 30 4
                 L18 4 Z" 
              fill="none" 
              stroke="#1B3B5C" 
              stroke-width="1"/>
        
        <!-- Top dividing line -->
        <line x1="6" y1="15" x2="30" y2="15" 
              stroke="#1B3B5C" 
              stroke-width="1.5"/>
        
        <!-- Bottom dividing line -->
        <line x1="6" y1="24" x2="30" y2="24" 
              stroke="#1B3B5C" 
              stroke-width="1.5"/>
        
        <!-- TULSA text at top -->
        <text x="18" y="12" text-anchor="middle" 
              fill="#1B3B5C" 
              font-family="Arial, sans-serif" 
              font-size="7" 
              font-weight="bold">TULSA</text>
        
        <!-- ROUTE text in middle -->
        <text x="18" y="21" text-anchor="middle" 
              fill="#1B3B5C" 
              font-family="Arial, sans-serif" 
              font-size="6" 
              font-weight="bold">ROUTE</text>
        
        <!-- Large 66 number at bottom -->
        <text x="18" y="35" text-anchor="middle" 
              fill="#1B3B5C" 
              font-family="Arial, sans-serif" 
              font-size="14" 
              font-weight="900">66</text>
      </svg>
    `)}`,
    scaledSize: new google.maps.Size(36, 44),
    anchor: new google.maps.Point(18, 44)
  };
};

