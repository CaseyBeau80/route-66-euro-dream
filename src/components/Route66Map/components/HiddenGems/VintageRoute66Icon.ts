


export const createVintageRoute66Icon = () => {
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
        </defs>
        
        <!-- US Highway Shield Shape - accurate to reference image -->
        <path d="M20 2
                 L6 2
                 C4 2 2 4 2 6
                 L2 16
                 C2 20 4 24 8 28
                 C12 32 16 36 20 38
                 C24 36 28 32 32 28
                 C36 24 38 20 38 16
                 L38 6
                 C38 4 36 2 34 2
                 L20 2 Z" 
              fill="white" 
              stroke="#000000" 
              stroke-width="2"
              filter="url(#shadow)"/>
        
        <!-- Red banner at top for "ROUTE" -->
        <rect x="2" y="2" width="36" height="8" 
              fill="#D91E18" 
              stroke="#000000" 
              stroke-width="1"/>
        
        <!-- Black dividing line -->
        <line x1="2" y1="10" x2="38" y2="10" 
              stroke="#000000" 
              stroke-width="1"/>
        
        <!-- ROUTE text in red banner -->
        <text x="20" y="7.5" text-anchor="middle" 
              fill="white" 
              font-family="Arial, sans-serif" 
              font-size="5" 
              font-weight="bold">ROUTE</text>
        
        <!-- US text in middle -->
        <text x="20" y="18" text-anchor="middle" 
              fill="black" 
              font-family="Arial, sans-serif" 
              font-size="7" 
              font-weight="bold">US</text>
        
        <!-- Large 66 number -->
        <text x="20" y="32" text-anchor="middle" 
              fill="black" 
              font-family="Arial, sans-serif" 
              font-size="16" 
              font-weight="900">66</text>
      </svg>
    `)}`,
    scaledSize: new google.maps.Size(40, 40),
    anchor: new google.maps.Point(20, 40)
  };
};


