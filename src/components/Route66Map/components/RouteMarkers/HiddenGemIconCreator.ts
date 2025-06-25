
export class HiddenGemIconCreator {
  /**
   * Creates a consistent gem icon for hidden gems (💎 emoji representation)
   */
  static createHiddenGemIcon(isCloseZoom: boolean = false): google.maps.Icon {
    const baseSize = isCloseZoom ? 36 : 28;
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${baseSize}" height="${baseSize}" viewBox="0 0 ${baseSize} ${baseSize}">
        <!-- Gem shape (💎 representation) -->
        <g transform="translate(${baseSize/2}, ${baseSize/2})">
          <!-- Main gem body -->
          <polygon points="-8,-6 8,-6 12,0 8,8 -8,8 -12,0" 
                   fill="#40E0D0" 
                   stroke="#ffffff" 
                   stroke-width="2"/>
          
          <!-- Gem facets for sparkle effect -->
          <polygon points="-6,-4 0,-6 6,-4 0,0" 
                   fill="#87CEEB" 
                   opacity="0.8"/>
          <polygon points="-6,-4 0,0 -6,6" 
                   fill="#4682B4" 
                   opacity="0.6"/>
          <polygon points="6,-4 6,6 0,0" 
                   fill="#4682B4" 
                   opacity="0.6"/>
          <polygon points="0,0 6,6 -6,6" 
                   fill="#20B2AA" 
                   opacity="0.7"/>
          
          <!-- Sparkle highlights -->
          <circle cx="-3" cy="-2" r="1" fill="#ffffff" opacity="0.9"/>
          <circle cx="4" cy="-3" r="0.8" fill="#ffffff" opacity="0.8"/>
          <circle cx="1" cy="3" r="0.6" fill="#ffffff" opacity="0.7"/>
        </g>
        
        <!-- Drop shadow -->
        <ellipse cx="${baseSize/2}" cy="${baseSize-2}" rx="${baseSize*0.2}" ry="${baseSize*0.1}" 
                 fill="#000000" opacity="0.3"/>
      </svg>
    `;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`,
      scaledSize: new google.maps.Size(baseSize, baseSize),
      anchor: new google.maps.Point(baseSize/2, baseSize/2)
    };
  }

  /**
   * Creates a title for hidden gem markers
   */
  static createHiddenGemTitle(gemName: string): string {
    return `Hidden Gem: ${gemName}`;
  }

  /**
   * Gets the z-index for hidden gem markers
   */
  static getHiddenGemZIndex(): number {
    return 30000;
  }
}
