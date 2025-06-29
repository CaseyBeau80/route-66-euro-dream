
export class DestinationCityIconCreator {
  static createDestinationCityIcon(cityName: string) {
    console.log(`🏛️ Creating wooden post destination icon for: ${cityName}`);
    
    const iconSize = 60;
    const iconHeight = 70;
    
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconHeight}" viewBox="0 0 ${iconSize} ${iconHeight}">
          <!-- Wooden post base -->
          <rect x="25" y="45" width="10" height="25" fill="#8B4513" stroke="#654321" stroke-width="1"/>
          
          <!-- Route 66 shield -->
          <path d="M5 15 L5 30 Q5 35 10 35 L50 35 Q55 35 55 30 L55 15 Q55 10 50 10 L10 10 Q5 10 5 15 Z" 
                fill="#F5F5DC" stroke="#000000" stroke-width="3"/>
          
          <!-- Route 66 text -->
          <text x="30" y="20" text-anchor="middle" fill="#000" font-family="Arial Black" font-size="6" font-weight="bold">ROUTE</text>
          <text x="30" y="30" text-anchor="middle" fill="#000" font-family="Arial Black" font-size="10" font-weight="bold">66</text>
          
          <!-- City name background -->
          <rect x="2" y="38" width="56" height="8" fill="#000000" rx="2"/>
          
          <!-- City name text -->
          <text x="30" y="44" text-anchor="middle" fill="#F5F5DC" font-family="Arial" font-size="6" font-weight="bold">${cityName.toUpperCase()}</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(iconSize, iconHeight),
      // Offset destination cities to the top-left
      anchor: new google.maps.Point(iconSize/2 + 15, iconHeight/2 + 15)
    };
  }
}
