
export class HiddenGemIconCreator {
  /**
   * Creates a premium diamond gem icon for hidden gems with realistic faceting (💎 representation)
   */
  static createHiddenGemIcon(isCloseZoom: boolean = false): google.maps.Icon {
    const baseSize = isCloseZoom ? 40 : 32;
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${baseSize}" height="${baseSize}" viewBox="0 0 ${baseSize} ${baseSize}">
        <defs>
          <!-- Premium gradient definitions -->
          <linearGradient id="gemBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#40E0D0;stop-opacity:1" />
            <stop offset="30%" style="stop-color:#48D1CC;stop-opacity:1" />
            <stop offset="70%" style="stop-color:#20B2AA;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#008B8B;stop-opacity:1" />
          </linearGradient>
          
          <linearGradient id="gemTopGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:0.9" />
            <stop offset="50%" style="stop-color:#87CEFA;stop-opacity:0.7" />
            <stop offset="100%" style="stop-color:#4682B4;stop-opacity:0.8" />
          </linearGradient>
          
          <radialGradient id="sparkleGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
            <stop offset="70%" style="stop-color:#ffffff;stop-opacity:0.6" />
            <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
          </radialGradient>
          
          <!-- Filter for glow effect -->
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Drop shadow -->
        <ellipse cx="${baseSize/2}" cy="${baseSize - 3}" rx="${baseSize*0.25}" ry="${baseSize*0.12}" 
                 fill="#000000" opacity="0.3"/>
        
        <!-- Outer glow -->
        <g transform="translate(${baseSize/2}, ${baseSize/2})" filter="url(#glow)">
          <polygon points="-10,-8 10,-8 14,-2 10,10 -10,10 -14,-2" 
                   fill="#40E0D0" 
                   opacity="0.4"/>
        </g>
        
        <!-- Main gem body with premium faceting -->
        <g transform="translate(${baseSize/2}, ${baseSize/2})">
          <!-- Base gem shape -->
          <polygon points="-10,-8 10,-8 14,-2 10,10 -10,10 -14,-2" 
                   fill="url(#gemBodyGradient)" 
                   stroke="#ffffff" 
                   stroke-width="1.5"/>
          
          <!-- Top facet with gradient -->
          <polygon points="-8,-6 0,-8 8,-6 0,-2" 
                   fill="url(#gemTopGradient)"/>
          
          <!-- Left facet with depth -->
          <polygon points="-8,-6 0,-2 -8,8 -12,-2" 
                   fill="#4682B4" 
                   opacity="0.7"/>
          
          <!-- Right facet with depth -->
          <polygon points="8,-6 12,-2 8,8 0,-2" 
                   fill="#4682B4" 
                   opacity="0.6"/>
          
          <!-- Bottom facet -->
          <polygon points="0,-2 8,8 -8,8" 
                   fill="#20B2AA" 
                   opacity="0.8"/>
          
          <!-- Inner facets for premium look -->
          <polygon points="-4,-4 0,-6 4,-4 0,-1" 
                   fill="#B0E0E6" 
                   opacity="0.6"/>
          <polygon points="-4,-4 0,-1 -4,4" 
                   fill="#87CEEB" 
                   opacity="0.5"/>
          <polygon points="4,-4 4,4 0,-1" 
                   fill="#87CEEB" 
                   opacity="0.4"/>
        </g>
        
        <!-- Premium sparkle effects -->
        <g transform="translate(${baseSize/2}, ${baseSize/2})">
          <!-- Main sparkles -->
          <circle cx="-4" cy="-3" r="1.5" fill="url(#sparkleGradient)"/>
          <circle cx="5" cy="-4" r="1.2" fill="url(#sparkleGradient)"/>
          <circle cx="2" cy="3" r="1" fill="url(#sparkleGradient)"/>
          <circle cx="-3" cy="2" r="0.8" fill="url(#sparkleGradient)"/>
          
          <!-- Star sparkles for premium effect -->
          <g opacity="0.8">
            <path d="M-6,-1 L-5.5,-2 L-5,-1 L-5.5,0 Z" fill="#ffffff"/>
            <path d="M7,-2 L7.5,-3 L8,-2 L7.5,-1 Z" fill="#ffffff"/>
            <path d="M1,5 L1.5,4 L2,5 L1.5,6 Z" fill="#ffffff"/>
          </g>
          
          <!-- Central highlight -->
          <ellipse cx="0" cy="-3" rx="2" ry="3" 
                   fill="#ffffff" 
                   opacity="0.4"/>
        </g>
      </svg>
    `;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`,
      scaledSize: new google.maps.Size(baseSize, baseSize),
      anchor: new google.maps.Point(baseSize/2, baseSize/2),
      optimized: true
    };
  }

  /**
   * Creates a title for hidden gem markers
   */
  static createHiddenGemTitle(gemName: string): string {
    return `💎 Hidden Gem: ${gemName}`;
  }

  /**
   * Gets the z-index for hidden gem markers
   */
  static getHiddenGemZIndex(): number {
    return 30000;
  }
}
