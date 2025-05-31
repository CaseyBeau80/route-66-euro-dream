
export class IconCreator {
  static createDestinationCityIcon(cityName: string) {
    const iconWidth = 45;  // Slightly larger for better visibility
    const iconHeight = 45;
    
    console.log(`🎨 Creating destination icon for ${cityName}`);
    
    const svgContent = `
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
        <path d="M22.5 4
                 L9 4
                 C6.5 4 4.5 6 4.5 8.5
                 L4.5 22
                 C4.5 26.5 6.5 30.5 10 34
                 C15 37.5 19 39.5 22.5 40.5
                 C26 39.5 30 37.5 35 34
                 C38.5 30.5 40.5 26.5 40.5 22
                 L40.5 8.5
                 C40.5 6 38.5 4 36 4
                 L22.5 4 Z" 
              fill="url(#asphaltGradient)" 
              stroke="#000000" 
              stroke-width="2"
              filter="url(#shadow)"/>
        
        <!-- Add sun-faded overlay -->
        <path d="M22.5 4
                 L9 4
                 C6.5 4 4.5 6 4.5 8.5
                 L4.5 22
                 C4.5 26.5 6.5 30.5 10 34
                 C15 37.5 19 39.5 22.5 40.5
                 C26 39.5 30 37.5 35 34
                 C38.5 30.5 40.5 26.5 40.5 22
                 L40.5 8.5
                 C40.5 6 38.5 4 36 4
                 L22.5 4 Z" 
              fill="url(#sunFadeGradient)"/>
        
        <!-- Inner shield border for authentic look -->
        <path d="M22.5 6.5
                 L11 6.5
                 C9 6.5 7.5 8 7.5 10
                 L7.5 20.5
                 C7.5 24.5 9 28 12 31
                 C16 33.5 19 35 22.5 35.5
                 C26 35 29 33.5 33 31
                 C36 28 37.5 24.5 37.5 20.5
                 L37.5 10
                 C37.5 8 36 6.5 34 6.5
                 L22.5 6.5 Z" 
              fill="none" 
              stroke="#000000" 
              stroke-width="1"/>
        
        <!-- City name at top (abbreviated if too long) -->
        <text x="22.5" y="16" text-anchor="middle" 
              fill="#000000" 
              font-family="Arial, sans-serif" 
              font-size="6" 
              font-weight="bold"
              letter-spacing="0.3px">${cityName.length > 8 ? cityName.substring(0, 8).toUpperCase() : cityName.toUpperCase()}</text>
        
        <!-- Horizontal dividing line -->
        <line x1="10" y1="19" x2="35" y2="19" 
              stroke="#000000" 
              stroke-width="1.5"/>
        
        <!-- Large 66 numbers -->
        <text x="22.5" y="33" text-anchor="middle" 
              fill="#000000" 
              font-family="Arial, sans-serif" 
              font-size="16" 
              font-weight="900">66</text>
      </svg>
    `;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`,
      scaledSize: new google.maps.Size(iconWidth, iconHeight),
      anchor: new google.maps.Point(iconWidth/2, iconHeight)
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
