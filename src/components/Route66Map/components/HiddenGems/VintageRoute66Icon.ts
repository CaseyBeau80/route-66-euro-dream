
export const createVintageRoute66Icon = () => {
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
        </defs>
        
        <!-- Traditional US Highway Shield Shape -->
        <path d="M16 2 
                 L4 2 
                 L4 18 
                 C4 22 6 26 9 30
                 C12 34 14 36 16 38
                 C18 36 20 34 23 30
                 C26 26 28 22 28 18
                 L28 2 
                 L16 2 Z" 
              fill="#FFFFFF" 
              stroke="#000000" 
              stroke-width="2"
              filter="url(#shadow)"/>
        
        <!-- Black border line inside shield -->
        <path d="M16 4 
                 L6 4 
                 L6 17 
                 C6 20 7.5 23 10 26
                 C12.5 29 14.5 31 16 33
                 C17.5 31 19.5 29 22 26
                 C24.5 23 26 20 26 17
                 L26 4 
                 L16 4 Z" 
              fill="none" 
              stroke="#000000" 
              stroke-width="1"/>
        
        <!-- ROUTE text at top -->
        <text x="16" y="12" text-anchor="middle" 
              fill="#000000" 
              font-family="Arial, sans-serif" 
              font-size="6" 
              font-weight="bold">ROUTE</text>
        
        <!-- US text in middle -->
        <text x="16" y="19" text-anchor="middle" 
              fill="#000000" 
              font-family="Arial, sans-serif" 
              font-size="5" 
              font-weight="bold">US</text>
        
        <!-- Large 66 number -->
        <text x="16" y="29" text-anchor="middle" 
              fill="#000000" 
              font-family="Arial, sans-serif" 
              font-size="12" 
              font-weight="900">66</text>
      </svg>
    `)}`,
    scaledSize: new google.maps.Size(32, 40),
    anchor: new google.maps.Point(16, 40)
  };
};
