
export class IconCreator {
  static createDestinationCityIcon(cityName: string) {
    const iconWidth = 40;
    const iconHeight = 40;
    
    console.log(`🎨 Creating destination icon for ${cityName}`);
    
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${iconWidth}" height="${iconHeight}" viewBox="0 0 ${iconWidth} ${iconHeight}">
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
            
            <!-- Sun-faded worn effect -->
            <radialGradient id="sunFadeGradient" cx="50%" cy="30%" r="60%">
              <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.1" />
              <stop offset="40%" style="stop-color:#F8F6F0;stop-opacity:0.05" />
              <stop offset="100%" style="stop-color:#E6E4DE;stop-opacity:0" />
            </radialGradient>
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
                stroke-width="2"
                filter="url(#shadow)"/>
          
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
          
          <!-- City name at top (abbreviated if too long) -->
          <text x="20" y="15" text-anchor="middle" 
                fill="#000000" 
                font-family="Arial, sans-serif" 
                font-size="6" 
                font-weight="bold"
                letter-spacing="0.3px">${cityName.length > 8 ? cityName.substring(0, 8).toUpperCase() : cityName.toUpperCase()}</text>
          
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
      scaledSize: new google.maps.Size(iconWidth, iconHeight),
      anchor: new google.maps.Point(iconWidth/2, iconHeight)
    };
  }

  static createRegularStopIcon(isCloseZoom: boolean = false) {
    if (isCloseZoom) {
      // Detailed icon for close zoom levels
      const iconWidth = 16;
      const iconHeight = 16;
      
      console.log('🎨 Creating detailed regular stop icon');
      
      return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="${iconWidth}" height="${iconHeight}" viewBox="0 0 ${iconWidth} ${iconHeight}">
            <defs>
              <filter id="miniShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0.5" dy="1" stdDeviation="0.8" flood-color="#000000" flood-opacity="0.2"/>
              </filter>
            </defs>
            
            <!-- Outer circle with vintage feel -->
            <circle cx="8" cy="8" r="7" 
                    fill="#FEF3C7" 
                    stroke="#DC2626" 
                    stroke-width="2"
                    filter="url(#miniShadow)"/>
            
            <!-- Inner white circle -->
            <circle cx="8" cy="8" r="4" 
                    fill="#FFFFFF" 
                    opacity="0.95"/>
            
            <!-- Tiny Route 66 shield silhouette -->
            <path d="M8 3.5
                     L5.5 3.5
                     C5 3.5 4.5 4 4.5 4.5
                     L4.5 8.5
                     C4.5 10 5 11.5 6 12.5
                     C7 13 7.5 13.2 8 13.3
                     C8.5 13.2 9 13 10 12.5
                     C11 11.5 11.5 10 11.5 8.5
                     L11.5 4.5
                     C11.5 4 11 3.5 10.5 3.5
                     L8 3.5 Z" 
                  fill="#DC2626" 
                  opacity="0.8"/>
            
            <!-- Tiny "66" text -->
            <text x="8" y="9.5" text-anchor="middle" 
                  fill="#FFFFFF" 
                  font-family="Arial, sans-serif" 
                  font-size="3" 
                  font-weight="bold">66</text>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(iconWidth, iconHeight),
        anchor: new google.maps.Point(iconWidth/2, iconHeight/2)
      };
    } else {
      // Simple dot for far zoom levels - make it more visible
      const iconWidth = 10;
      const iconHeight = 10;
      
      console.log('🎨 Creating simple regular stop icon');
      
      return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="${iconWidth}" height="${iconHeight}" viewBox="0 0 ${iconWidth} ${iconHeight}">
            <circle cx="5" cy="5" r="4" 
                    fill="#FEF3C7" 
                    stroke="#DC2626" 
                    stroke-width="2"/>
            <circle cx="5" cy="5" r="2" 
                    fill="#FFFFFF" 
                    opacity="0.9"/>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(iconWidth, iconHeight),
        anchor: new google.maps.Point(iconWidth/2, iconHeight/2)
      };
    }
  }
}
