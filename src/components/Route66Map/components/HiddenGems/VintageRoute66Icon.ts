


export const createVintageRoute66Icon = () => {
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
        </defs>
        
        <!-- Classic US Route Shield Shape - matching reference image -->
        <path d="M20 4
                 L8 4
                 C6 4 4 6 4 8
                 L4 20
                 C4 24 6 28 10 32
                 C14 35 17 37 20 38
                 C23 37 26 35 30 32
                 C34 28 36 24 36 20
                 L36 8
                 C36 6 34 4 32 4
                 L20 4 Z" 
              fill="#FFFFFF" 
              stroke="#000000" 
              stroke-width="2.5"
              filter="url(#shadow)"/>
        
        <!-- Inner shield border for authentic look -->
        <path d="M20 6
                 L10 6
                 C8.5 6 7 7.5 7 9
                 L7 19
                 C7 22.5 8.5 26 11.5 29
                 C14.5 31.5 17 33 20 33.5
                 C23 33 25.5 31.5 28.5 29
                 C31.5 26 33 22.5 33 19
                 L33 9
                 C33 7.5 31.5 6 30 6
                 L20 6 Z" 
              fill="none" 
              stroke="#000000" 
              stroke-width="1"/>
        
        <!-- ROUTE text at top -->
        <text x="20" y="15" text-anchor="middle" 
              fill="#000000" 
              font-family="Arial, sans-serif" 
              font-size="7" 
              font-weight="bold"
              letter-spacing="0.5px">ROUTE</text>
        
        <!-- Horizontal dividing line -->
        <line x1="9" y1="18" x2="31" y2="18" 
              stroke="#000000" 
              stroke-width="1.5"/>
        
        <!-- Large 66 numbers -->
        <text x="20" y="31" text-anchor="middle" 
              fill="#000000" 
              font-family="Arial, sans-serif" 
              font-size="15" 
              font-weight="900">66</text>
      </svg>
    `)}`,
    scaledSize: new google.maps.Size(40, 40),
    anchor: new google.maps.Point(20, 40)
  };
};




