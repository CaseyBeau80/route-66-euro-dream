
export class DestinationCityIconCreator {
  static createDestinationCityIcon(cityName: string) {
    const iconWidth = 50;  
    const iconHeight = 60; 
    
    console.log(`🎨 Creating authentic Route 66 shield icon for ${cityName}`);
    
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${iconWidth}" height="${iconHeight}" viewBox="0 0 ${iconWidth} ${iconHeight}">
        <!-- Wooden post (vertical pole) -->
        <rect x="21" y="25" width="8" height="35" 
              fill="url(#shared-woodGrain)" 
              stroke="#654321" 
              stroke-width="0.5"
              filter="url(#shared-postShadow)"/>
        
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
        
        <!-- Authentic Route 66 Shield mounted on post - matching vintage image -->
        <path d="M25 4
                 L8 4
                 L8 16
                 C8 20 10 24 14 27
                 C18 29 21 30 25 30
                 C29 30 32 29 36 27
                 C40 24 42 20 42 16
                 L42 4
                 L25 4 Z" 
              fill="#F5F5DC" 
              stroke="#000000" 
              stroke-width="2"
              filter="url(#postShadow)"/>
        
        <!-- Inner shield border for depth -->
        <path d="M25 6
                 L11 6
                 L11 15
                 C11 18 12 21 15 24
                 C18 26 21 27 25 27
                 C29 27 32 26 35 24
                 C38 21 39 18 39 15
                 L39 6
                 L25 6 Z" 
              fill="none" 
              stroke="#000000" 
              stroke-width="1"/>
        
        <!-- ROUTE text at top -->
        <text x="25" y="11" text-anchor="middle" 
              fill="#000000" 
              font-family="Arial, sans-serif" 
              font-size="4" 
              font-weight="bold"
              letter-spacing="0.5px">ROUTE</text>
        
        <!-- Large 66 numbers - matching vintage style -->
        <text x="25" y="23" text-anchor="middle" 
              fill="#000000" 
              font-family="Arial Black, Arial, sans-serif" 
              font-size="12" 
              font-weight="900">66</text>
        
        <!-- City name below shield -->
        <text x="25" y="34" text-anchor="middle" 
              fill="#654321" 
              font-family="Arial, sans-serif" 
              font-size="3" 
              font-weight="bold">${cityName.length > 10 ? cityName.substring(0, 8).toUpperCase() : cityName.toUpperCase()}</text>
      </svg>
    `;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`,
      scaledSize: new google.maps.Size(iconWidth, iconHeight),
      anchor: new google.maps.Point(iconWidth/2, iconHeight - 5)
    };
  }
}
