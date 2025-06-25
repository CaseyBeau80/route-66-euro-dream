
export class AttractionIconCreator {
  /**
   * Creates an enhanced professional map pin icon for attractions (📍 representation)
   */
  static createAttractionIcon(isCloseZoom: boolean = false): google.maps.Icon {
    const baseSize = isCloseZoom ? 36 : 28;
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${baseSize}" height="${baseSize + 4}" viewBox="0 0 ${baseSize} ${baseSize + 4}">
        <!-- Drop shadow -->
        <ellipse cx="${baseSize/2}" cy="${baseSize + 2}" rx="${baseSize*0.2}" ry="${baseSize*0.08}" 
                 fill="#000000" opacity="0.25"/>
        
        <!-- Pin outer glow -->
        <path d="M${baseSize/2},${baseSize} 
                 C${baseSize*0.15},${baseSize*0.65} 
                 ${baseSize*0.15},${baseSize*0.25} 
                 ${baseSize/2},${baseSize*0.25}
                 C${baseSize*0.85},${baseSize*0.25} 
                 ${baseSize*0.85},${baseSize*0.65} 
                 ${baseSize/2},${baseSize} Z" 
              fill="#ff6b6b" 
              opacity="0.3"
              stroke="none"/>
        
        <!-- Main pin body with gradient -->
        <defs>
          <linearGradient id="pinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#e74c3c;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#c0392b;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#a93226;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="highlightGradient" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.4" />
            <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
          </linearGradient>
        </defs>
        
        <path d="M${baseSize/2},${baseSize - 2} 
                 C${baseSize*0.18},${baseSize*0.63} 
                 ${baseSize*0.18},${baseSize*0.28} 
                 ${baseSize/2},${baseSize*0.28}
                 C${baseSize*0.82},${baseSize*0.28} 
                 ${baseSize*0.82},${baseSize*0.63} 
                 ${baseSize/2},${baseSize - 2} Z" 
              fill="url(#pinGradient)" 
              stroke="#ffffff" 
              stroke-width="2"/>
        
        <!-- Pin highlight for 3D effect -->
        <path d="M${baseSize/2},${baseSize - 2} 
                 C${baseSize*0.18},${baseSize*0.63} 
                 ${baseSize*0.18},${baseSize*0.28} 
                 ${baseSize/2},${baseSize*0.28}
                 C${baseSize*0.82},${baseSize*0.28} 
                 ${baseSize*0.82},${baseSize*0.63} 
                 ${baseSize/2},${baseSize - 2} Z" 
              fill="url(#highlightGradient)"/>
        
        <!-- Center circle with depth -->
        <circle cx="${baseSize/2}" cy="${baseSize*0.42}" r="${baseSize*0.15}" 
                fill="#ffffff" 
                stroke="#c0392b" 
                stroke-width="1"/>
        <circle cx="${baseSize/2}" cy="${baseSize*0.42}" r="${baseSize*0.08}" 
                fill="#e74c3c"/>
        
        <!-- Shine effect -->
        <ellipse cx="${baseSize*0.4}" cy="${baseSize*0.35}" rx="${baseSize*0.08}" ry="${baseSize*0.15}" 
                 fill="#ffffff" 
                 opacity="0.3"/>
      </svg>
    `;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`,
      scaledSize: new google.maps.Size(baseSize, baseSize + 4),
      anchor: new google.maps.Point(baseSize/2, baseSize - 2)
    };
  }

  /**
   * Creates a title for attraction markers
   */
  static createAttractionTitle(attractionName: string): string {
    return `🎯 Attraction: ${attractionName}`;
  }

  /**
   * Gets the z-index for attraction markers
   */
  static getAttractionZIndex(): number {
    return 25000; // Between hidden gems (30000) and destinations (35000)
  }
}
