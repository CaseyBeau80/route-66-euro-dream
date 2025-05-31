
export class RegularStopIconCreator {
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
