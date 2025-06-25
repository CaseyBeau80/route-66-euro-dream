
export class AttractionIconCreator {
  /**
   * Creates a consistent map pin icon for attractions
   */
  static createAttractionIcon(isCloseZoom: boolean = false): google.maps.Icon {
    const baseSize = isCloseZoom ? 32 : 24;
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${baseSize}" height="${baseSize}" viewBox="0 0 ${baseSize} ${baseSize}">
        <!-- Pin shape -->
        <path d="M${baseSize/2},${baseSize-2} 
                 C${baseSize*0.2},${baseSize*0.6} 
                 ${baseSize*0.2},${baseSize*0.3} 
                 ${baseSize/2},${baseSize*0.3}
                 C${baseSize*0.8},${baseSize*0.3} 
                 ${baseSize*0.8},${baseSize*0.6} 
                 ${baseSize/2},${baseSize-2} Z" 
              fill="#dc2626" 
              stroke="#ffffff" 
              stroke-width="2"/>
        
        <!-- Pin icon (📍 emoji representation) -->
        <circle cx="${baseSize/2}" cy="${baseSize*0.45}" r="${baseSize*0.12}" fill="#ffffff"/>
        
        <!-- Drop shadow -->
        <ellipse cx="${baseSize/2}" cy="${baseSize-1}" rx="${baseSize*0.15}" ry="${baseSize*0.08}" 
                 fill="#000000" opacity="0.3"/>
      </svg>
    `;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`,
      scaledSize: new google.maps.Size(baseSize, baseSize),
      anchor: new google.maps.Point(baseSize/2, baseSize-2)
    };
  }

  /**
   * Creates a title for attraction markers
   */
  static createAttractionTitle(attractionName: string): string {
    return `Attraction: ${attractionName}`;
  }

  /**
   * Gets the z-index for attraction markers
   */
  static getAttractionZIndex(): number {
    return 25000; // Between hidden gems (30000) and destinations (35000)
  }
}
