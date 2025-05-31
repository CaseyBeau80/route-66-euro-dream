
export const createVintageRoute66Icon = () => {
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
          
          <!-- Asphalt texture gradient -->
          <linearGradient id="asphaltGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#F8F6F0;stop-opacity:1" />
            <stop offset="15%" style="stop-color:#F5F3ED;stop-opacity:1" />
            <stop offset="30%" style="stop-color:#F2F0EA;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#EFEDE7;stop-opacity:1" />
            <stop offset="70%" style="stop-color:#ECEAE4;stop-opacity:1" />
            <stop offset="85%" style="stop-color:#E9E7E1;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#E6E4DE;stop-opacity:1" />
          </linearGradient>
          
          <!-- Subtle crack pattern -->
          <pattern id="crackPattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="transparent"/>
            <!-- Tiny hairline cracks -->
            <path d="M1,2 L3,4 M5,1 L7,3 M2,6 L4,7 M6,5 L8,6" 
                  stroke="#D0CEC8" 
                  stroke-width="0.3" 
                  opacity="0.4"/>
            <path d="M0,5 L2,7 M4,3 L6,5 M7,1 L8,2" 
                  stroke="#CCC9C3" 
                  stroke-width="0.2" 
                  opacity="0.3"/>
          </pattern>
          
          <!-- Sun-faded worn effect -->
          <radialGradient id="sunFadeGradient" cx="50%" cy="30%" r="60%">
            <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.1" />
            <stop offset="40%" style="stop-color:#F8F6F0;stop-opacity:0.05" />
            <stop offset="100%" style="stop-color:#E6E4DE;stop-opacity:0" />
          </radialGradient>
          
          <!-- Weathered edge effect -->
          <linearGradient id="weatheredEdge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#000000;stop-opacity:0.1" />
            <stop offset="50%" style="stop-color:#000000;stop-opacity:0" />
            <stop offset="100%" style="stop-color:#000000;stop-opacity:0.1" />
          </linearGradient>
        </defs>
        
        <!-- Classic US Route Shield Shape with textured background -->
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
              fill="url(#asphaltGradient)" 
              stroke="#000000" 
              stroke-width="2.5"
              filter="url(#shadow)"/>
        
        <!-- Add crack texture overlay -->
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
              fill="url(#crackPattern)"
              opacity="0.6"/>
        
        <!-- Add sun-faded overlay -->
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
              fill="url(#sunFadeGradient)"/>
        
        <!-- Weathered edge effect -->
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
              fill="url(#weatheredEdge)"
              opacity="0.3"/>
        
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
