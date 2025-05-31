


export const createVintageRoute66Icon = () => {
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="3" stdDeviation="2" flood-color="#000000" flood-opacity="0.4"/>
          </filter>
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#F8F6F0;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Traditional US Highway Shield Shape -->
        <path d="M20 3
                 C14 3 8 3 6 3
                 C4 3 3 4 3 6
                 C3 8 3 12 3 18
                 C3 22 4 26 7 30
                 C10 34 15 37 20 37
                 C25 37 30 34 33 30
                 C36 26 37 22 37 18
                 C37 12 37 8 37 6
                 C37 4 36 3 34 3
                 C32 3 26 3 20 3 Z" 
              fill="url(#shieldGradient)" 
              stroke="#1E3A5F" 
              stroke-width="2.5"
              filter="url(#shadow)"/>
        
        <!-- Inner border for depth -->
        <path d="M20 5
                 C15 5 10 5 8 5
                 C7 5 6 6 6 7
                 C6 8 6 11 6 16
                 C6 19.5 7 23 9.5 26
                 C12 29 16 31 20 31
                 C24 31 28 29 30.5 26
                 C33 23 34 19.5 34 16
                 C34 11 34 8 34 7
                 C34 6 33 5 32 5
                 C30 5 25 5 20 5 Z" 
              fill="none" 
              stroke="#1E3A5F" 
              stroke-width="1"/>
        
        <!-- Horizontal dividing line -->
        <line x1="8" y1="18" x2="32" y2="18" 
              stroke="#1E3A5F" 
              stroke-width="1.8"/>
        
        <!-- ROUTE text at top -->
        <text x="20" y="15" text-anchor="middle" 
              fill="#1E3A5F" 
              font-family="Arial Black, Arial, sans-serif" 
              font-size="8.5" 
              font-weight="900"
              letter-spacing="0.5px">ROUTE</text>
        
        <!-- Large 66 number at bottom -->
        <text x="20" y="29" text-anchor="middle" 
              fill="#1E3A5F" 
              font-family="Arial Black, Arial, sans-serif" 
              font-size="16" 
              font-weight="900"
              letter-spacing="-1px">66</text>
              
        <!-- Small decorative elements in corners -->
        <circle cx="9" cy="9" r="1.5" fill="#DC2626" opacity="0.8"/>
        <circle cx="31" cy="9" r="1.5" fill="#DC2626" opacity="0.8"/>
      </svg>
    `)}`,
    scaledSize: new google.maps.Size(40, 40),
    anchor: new google.maps.Point(20, 40)
  };
};


