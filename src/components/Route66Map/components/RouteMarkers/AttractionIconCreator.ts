
export class AttractionIconCreator {
  static createAttractionIcon(isCloseZoom: boolean = false) {
    const baseSize = isCloseZoom ? 42 : 32;
    const pinHeight = Math.round(baseSize * 1.2);
    
    console.log(`🎯 Creating attraction pin icon - Size: ${baseSize}x${pinHeight}, Close zoom: ${isCloseZoom}`);
    
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${baseSize}" height="${pinHeight}" viewBox="0 0 ${baseSize} ${pinHeight}">
          <defs>
            <radialGradient id="pinGradient" cx="50%" cy="30%" r="70%">
              <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
              <stop offset="70%" style="stop-color:#e74c3c;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#c0392b;stop-opacity:1" />
            </radialGradient>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="2" dy="3" stdDeviation="2" flood-color="rgba(0,0,0,0.4)"/>
            </filter>
          </defs>
          
          <!-- Pin body -->
          <circle cx="${baseSize/2}" cy="${baseSize * 0.4}" r="${baseSize * 0.35}" 
                  fill="url(#pinGradient)" 
                  stroke="#fff" 
                  stroke-width="2" 
                  filter="url(#shadow)"/>
          
          <!-- Pin point -->
          <path d="M${baseSize/2} ${baseSize * 0.75} L${baseSize/2 - 4} ${baseSize * 0.6} L${baseSize/2 + 4} ${baseSize * 0.6} Z" 
                fill="url(#pinGradient)" 
                stroke="#fff" 
                stroke-width="1"/>
          
          <!-- Pin icon (📍 symbol) -->
          <text x="${baseSize/2}" y="${baseSize * 0.48}" 
                text-anchor="middle" 
                fill="white" 
                font-family="Arial" 
                font-size="${baseSize * 0.4}" 
                font-weight="bold">📍</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(baseSize, pinHeight),
      // Offset attractions to the top-right
      anchor: new google.maps.Point(baseSize/2 - 15, pinHeight/2 + 15)
    };
  }

  static createAttractionTitle(attractionName: string): string {
    return `🎯 Attraction: ${attractionName}`;
  }

  static getAttractionZIndex(): number {
    return 25000;
  }
}
