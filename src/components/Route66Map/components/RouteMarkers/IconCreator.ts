export class IconCreator {
  static createDestinationCityIcon(cityName: string) {
    const iconWidth = 50;  // Slightly wider for the post design
    const iconHeight = 60; // Taller to accommodate the elevated post
    
    console.log(`🎨 Creating elevated road post icon for ${cityName}`);
    
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${iconWidth}" height="${iconHeight}" viewBox="0 0 ${iconWidth} ${iconHeight}">
        <defs>
          <filter id="postShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="3" stdDeviation="2" flood-color="#000000" flood-opacity="0.4"/>
          </filter>
          
          <!-- Wood grain texture for the post -->
          <linearGradient id="woodGrain" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#8B4513;stop-opacity:1" />
            <stop offset="20%" style="stop-color:#A0522D;stop-opacity:1" />
            <stop offset="40%" style="stop-color:#8B4513;stop-opacity:1" />
            <stop offset="60%" style="stop-color:#654321;stop-opacity:1" />
            <stop offset="80%" style="stop-color:#8B4513;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#A0522D;stop-opacity:1" />
          </linearGradient>
          
          <!-- Metal bracket gradient -->
          <linearGradient id="metalBracket" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#C0C0C0;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#808080;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#606060;stop-opacity:1" />
          </linearGradient>
          
          <!-- Vintage Route 66 shield background -->
          <radialGradient id="vintageBg" cx="50%" cy="40%" r="60%">
            <stop offset="0%" style="stop-color:#FFF8DC;stop-opacity:1" />
            <stop offset="60%" style="stop-color:#F5F5DC;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#DEB887;stop-opacity:1" />
          </radialGradient>
          
          <!-- Rust/weathering effect -->
          <radialGradient id="rustEffect" cx="30%" cy="20%" r="40%">
            <stop offset="0%" style="stop-color:#CD853F;stop-opacity:0.3" />
            <stop offset="70%" style="stop-color:#A0522D;stop-opacity:0.1" />
            <stop offset="100%" style="stop-color:#8B4513;stop-opacity:0" />
          </radialGradient>
        </defs>
        
        <!-- Wooden post (vertical pole) -->
        <rect x="21" y="25" width="8" height="35" 
              fill="url(#woodGrain)" 
              stroke="#654321" 
              stroke-width="0.5"
              filter="url(#postShadow)"/>
        
        <!-- Wood grain lines for texture -->
        <line x1="22" y1="28" x2="28" y2="28" stroke="#654321" stroke-width="0.3" opacity="0.6"/>
        <line x1="22" y1="35" x2="28" y2="35" stroke="#654321" stroke-width="0.3" opacity="0.4"/>
        <line x1="22" y1="42" x2="28" y2="42" stroke="#654321" stroke-width="0.3" opacity="0.5"/>
        <line x1="22" y1="49" x2="28" y2="49" stroke="#654321" stroke-width="0.3" opacity="0.6"/>
        <line x1="22" y1="56" x2="28" y2="56" stroke="#654321" stroke-width="0.3" opacity="0.4"/>
        
        <!-- Metal mounting brackets -->
        <rect x="19" y="22" width="12" height="3" 
              fill="url(#metalBracket)" 
              stroke="#606060" 
              stroke-width="0.5"/>
        <circle cx="21" cy="23.5" r="0.8" fill="#404040"/>
        <circle cx="29" cy="23.5" r="0.8" fill="#404040"/>
        
        <!-- Route 66 Shield mounted on post -->
        <path d="M25 4
                 L12 4
                 C9 4 6.5 6.5 6.5 9.5
                 L6.5 16
                 C6.5 19.5 8.5 22.5 12 24
                 C17 26 21 27 25 27
                 C29 27 33 26 38 24
                 C41.5 22.5 43.5 19.5 43.5 16
                 L43.5 9.5
                 C43.5 6.5 41 4 38 4
                 L25 4 Z" 
              fill="url(#vintageBg)" 
              stroke="#8B4513" 
              stroke-width="2"
              filter="url(#postShadow)"/>
        
        <!-- Weathering/rust overlay on shield -->
        <path d="M25 4
                 L12 4
                 C9 4 6.5 6.5 6.5 9.5
                 L6.5 16
                 C6.5 19.5 8.5 22.5 12 24
                 C17 26 21 27 25 27
                 C29 27 33 26 38 24
                 C41.5 22.5 43.5 19.5 43.5 16
                 L43.5 9.5
                 C43.5 6.5 41 4 38 4
                 L25 4 Z" 
              fill="url(#rustEffect)"/>
        
        <!-- Inner shield border for depth -->
        <path d="M25 6.5
                 L14 6.5
                 C12 6.5 10.5 8 10.5 10
                 L10.5 15
                 C10.5 17.5 12 20 15 21.5
                 C19 23 22 23.5 25 23.5
                 C28 23.5 31 23 35 21.5
                 C38 20 39.5 17.5 39.5 15
                 L39.5 10
                 C39.5 8 38 6.5 36 6.5
                 L25 6.5 Z" 
              fill="none" 
              stroke="#654321" 
              stroke-width="0.8"/>
        
        <!-- City name at top (abbreviated if too long) -->
        <text x="25" y="13" text-anchor="middle" 
              fill="#654321" 
              font-family="Arial, sans-serif" 
              font-size="5" 
              font-weight="bold"
              letter-spacing="0.2px">${cityName.length > 10 ? cityName.substring(0, 8).toUpperCase() : cityName.toUpperCase()}</text>
        
        <!-- Horizontal dividing line -->
        <line x1="12" y1="15.5" x2="38" y2="15.5" 
              stroke="#654321" 
              stroke-width="1"/>
        
        <!-- Large 66 numbers -->
        <text x="25" y="22" text-anchor="middle" 
              fill="#654321" 
              font-family="Arial, sans-serif" 
              font-size="10" 
              font-weight="900">66</text>
        
        <!-- Small weathering spots for authenticity -->
        <circle cx="35" cy="8" r="0.8" fill="#CD853F" opacity="0.4"/>
        <circle cx="15" cy="19" r="0.6" fill="#A0522D" opacity="0.3"/>
        <circle cx="32" cy="21" r="0.5" fill="#8B4513" opacity="0.5"/>
      </svg>
    `;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`,
      scaledSize: new google.maps.Size(iconWidth, iconHeight),
      anchor: new google.maps.Point(iconWidth/2, iconHeight - 5) // Anchor near the bottom of the post
    };
  }

  static createRegularStopIcon(isCloseZoom: boolean = false) {
    if (isCloseZoom) {
      // Detailed icon for close zoom levels
      const iconWidth = 18;  // Slightly larger
      const iconHeight = 18;
      
      console.log('🎨 Creating detailed regular stop icon');
      
      const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${iconWidth}" height="${iconHeight}" viewBox="0 0 ${iconWidth} ${iconHeight}">
          <defs>
            <filter id="miniShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0.5" dy="1" stdDeviation="0.8" flood-color="#000000" flood-opacity="0.2"/>
            </filter>
          </defs>
          
          <!-- Outer circle with vintage feel -->
          <circle cx="9" cy="9" r="8" 
                  fill="#FEF3C7" 
                  stroke="#DC2626" 
                  stroke-width="2"
                  filter="url(#miniShadow)"/>
          
          <!-- Inner white circle -->
          <circle cx="9" cy="9" r="5" 
                  fill="#FFFFFF" 
                  opacity="0.95"/>
          
          <!-- Tiny Route 66 shield silhouette -->
          <path d="M9 4
                   L6 4
                   C5.5 4 5 4.5 5 5
                   L5 9.5
                   C5 11.5 5.5 13 7 14
                   C8 14.5 8.5 14.7 9 14.8
                   C9.5 14.7 10 14.5 11 14
                   C12.5 13 13 11.5 13 9.5
                   L13 5
                   C13 4.5 12.5 4 12 4
                   L9 4 Z" 
                fill="#DC2626" 
                opacity="0.8"/>
          
          <!-- Tiny "66" text -->
          <text x="9" y="11" text-anchor="middle" 
                fill="#FFFFFF" 
                font-family="Arial, sans-serif" 
                font-size="3.5" 
                font-weight="bold">66</text>
        </svg>
      `;
      
      return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`,
        scaledSize: new google.maps.Size(iconWidth, iconHeight),
        anchor: new google.maps.Point(iconWidth/2, iconHeight/2)
      };
    } else {
      // Simple dot for far zoom levels - larger and more visible
      const iconWidth = 14;  // Increased from 10
      const iconHeight = 14;
      
      console.log('🎨 Creating simple regular stop icon');
      
      const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${iconWidth}" height="${iconHeight}" viewBox="0 0 ${iconWidth} ${iconHeight}">
          <circle cx="7" cy="7" r="6" 
                  fill="#FEF3C7" 
                  stroke="#DC2626" 
                  stroke-width="2"/>
          <circle cx="7" cy="7" r="3" 
                  fill="#DC2626" 
                  opacity="0.8"/>
        </svg>
      `;
      
      return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`,
        scaledSize: new google.maps.Size(iconWidth, iconHeight),
        anchor: new google.maps.Point(iconWidth/2, iconHeight/2)
      };
    }
  }
}
