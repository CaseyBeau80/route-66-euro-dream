
export class HiddenGemIconCreator {
  /**
   * Creates a premium diamond gem icon for hidden gems with realistic faceting (💎 representation)
   * Ultra-high resolution SVG with professional jeweler-quality rendering
   */
  static createHiddenGemIcon(isCloseZoom: boolean = false): google.maps.Icon {
    const baseSize = isCloseZoom ? 44 : 36;
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${baseSize}" height="${baseSize}" viewBox="0 0 ${baseSize} ${baseSize}" style="shape-rendering: geometricPrecision;">
        <defs>
          <!-- Premium gradient definitions for realistic gem -->
          <linearGradient id="gemMainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#40E0D0;stop-opacity:1" />
            <stop offset="20%" style="stop-color:#48D1CC;stop-opacity:1" />
            <stop offset="60%" style="stop-color:#20B2AA;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#008B8B;stop-opacity:1" />
          </linearGradient>
          
          <linearGradient id="gemTopFacet" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#E0FFFF;stop-opacity:0.9" />
            <stop offset="50%" style="stop-color:#B0E0E6;stop-opacity:0.7" />
            <stop offset="100%" style="stop-color:#87CEEB;stop-opacity:0.8" />
          </linearGradient>
          
          <linearGradient id="gemLeftFacet" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#4682B4;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#5F9EA0;stop-opacity:0.6" />
          </linearGradient>
          
          <linearGradient id="gemRightFacet" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#5F9EA0;stop-opacity:0.6" />
            <stop offset="100%" style="stop-color:#4682B4;stop-opacity:0.4" />
          </linearGradient>
          
          <radialGradient id="sparkleEffect" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
            <stop offset="60%" style="stop-color:#ffffff;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
          </radialGradient>
          
          <!-- Professional lighting effects -->
          <filter id="gemGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="gemShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-color="rgba(0,0,0,0.3)"/>
          </filter>
        </defs>
        
        <!-- Gem shadow -->
        <ellipse cx="${baseSize/2}" cy="${baseSize - 3}" rx="${baseSize * 0.28}" ry="${baseSize * 0.1}" 
                 fill="#000000" opacity="0.25"/>
        
        <!-- Outer glow for premium effect -->
        <g transform="translate(${baseSize/2}, ${baseSize/2})" filter="url(#gemGlow)">
          <polygon points="-${baseSize*0.32},-${baseSize*0.28} ${baseSize*0.32},-${baseSize*0.28} ${baseSize*0.42},-${baseSize*0.08} ${baseSize*0.32},${baseSize*0.35} -${baseSize*0.32},${baseSize*0.35} -${baseSize*0.42},-${baseSize*0.08}" 
                   fill="#40E0D0" 
                   opacity="0.4"/>
        </g>
        
        <!-- Main gem body with professional faceting -->
        <g transform="translate(${baseSize/2}, ${baseSize/2})" filter="url(#gemShadow)">
          <!-- Base gem shape with precise coordinates -->
          <polygon points="-${baseSize*0.3},-${baseSize*0.26} ${baseSize*0.3},-${baseSize*0.26} ${baseSize*0.4},-${baseSize*0.06} ${baseSize*0.3},${baseSize*0.32} -${baseSize*0.3},${baseSize*0.32} -${baseSize*0.4},-${baseSize*0.06}" 
                   fill="url(#gemMainGradient)" 
                   stroke="#ffffff" 
                   stroke-width="1"
                   vector-effect="non-scaling-stroke"/>
          
          <!-- Top facet (table) -->
          <polygon points="-${baseSize*0.24},-${baseSize*0.2} 0,-${baseSize*0.26} ${baseSize*0.24},-${baseSize*0.2} 0,-${baseSize*0.06}" 
                   fill="url(#gemTopFacet)"
                   stroke="rgba(255,255,255,0.3)"
                   stroke-width="0.5"/>
          
          <!-- Left crown facet -->
          <polygon points="-${baseSize*0.24},-${baseSize*0.2} 0,-${baseSize*0.06} -${baseSize*0.24},${baseSize*0.26} -${baseSize*0.36},-${baseSize*0.06}" 
                   fill="url(#gemLeftFacet)"
                   stroke="rgba(255,255,255,0.2)"
                   stroke-width="0.5"/>
          
          <!-- Right crown facet -->
          <polygon points="${baseSize*0.24},-${baseSize*0.2} ${baseSize*0.36},-${baseSize*0.06} ${baseSize*0.24},${baseSize*0.26} 0,-${baseSize*0.06}" 
                   fill="url(#gemRightFacet)"
                   stroke="rgba(255,255,255,0.2)"
                   stroke-width="0.5"/>
          
          <!-- Bottom pavilion facet -->
          <polygon points="0,-${baseSize*0.06} ${baseSize*0.24},${baseSize*0.26} -${baseSize*0.24},${baseSize*0.26}" 
                   fill="#20B2AA" 
                   opacity="0.85"
                   stroke="rgba(255,255,255,0.1)"
                   stroke-width="0.5"/>
          
          <!-- Inner facets for premium realism -->
          <polygon points="-${baseSize*0.12},-${baseSize*0.14} 0,-${baseSize*0.2} ${baseSize*0.12},-${baseSize*0.14} 0,-${baseSize*0.03}" 
                   fill="#B0E0E6" 
                   opacity="0.7"/>
          <polygon points="-${baseSize*0.12},-${baseSize*0.14} 0,-${baseSize*0.03} -${baseSize*0.12},${baseSize*0.14}" 
                   fill="#87CEEB" 
                   opacity="0.6"/>
          <polygon points="${baseSize*0.12},-${baseSize*0.14} ${baseSize*0.12},${baseSize*0.14} 0,-${baseSize*0.03}" 
                   fill="#87CEEB" 
                   opacity="0.5"/>
        </g>
        
        <!-- Premium sparkle effects -->
        <g transform="translate(${baseSize/2}, ${baseSize/2})">
          <!-- Primary sparkles -->
          <circle cx="-${baseSize*0.12}" cy="-${baseSize*0.08}" r="${baseSize*0.04}" fill="url(#sparkleEffect)"/>
          <circle cx="${baseSize*0.15}" cy="-${baseSize*0.12}" r="${baseSize*0.035}" fill="url(#sparkleEffect)"/>
          <circle cx="${baseSize*0.06}" cy="${baseSize*0.08}" r="${baseSize*0.03}" fill="url(#sparkleEffect)"/>
          <circle cx="-${baseSize*0.08}" cy="${baseSize*0.06}" r="${baseSize*0.025}" fill="url(#sparkleEffect)"/>
          
          <!-- Star sparkles for premium jewelry effect -->
          <g opacity="0.9" fill="#ffffff">
            <path d="M-${baseSize*0.18},-${baseSize*0.03} L-${baseSize*0.15},-${baseSize*0.08} L-${baseSize*0.12},-${baseSize*0.03} L-${baseSize*0.15},${baseSize*0.02} Z"/>
            <path d="M${baseSize*0.21},-${baseSize*0.06} L${baseSize*0.24},-${baseSize*0.11} L${baseSize*0.27},-${baseSize*0.06} L${baseSize*0.24},-${baseSize*0.01} Z"/>
            <path d="M${baseSize*0.03},${baseSize*0.15} L${baseSize*0.06},${baseSize*0.1} L${baseSize*0.09},${baseSize*0.15} L${baseSize*0.06},${baseSize*0.2} Z"/>
          </g>
          
          <!-- Central brilliant highlight -->
          <ellipse cx="0" cy="-${baseSize*0.09}" rx="${baseSize*0.06}" ry="${baseSize*0.08}" 
                   fill="#ffffff" 
                   opacity="0.5"/>
                   
          <!-- Professional light reflection -->
          <path d="M-${baseSize*0.06},-${baseSize*0.2} Q0,-${baseSize*0.24} ${baseSize*0.06},-${baseSize*0.2} Q0,-${baseSize*0.14} -${baseSize*0.06},-${baseSize*0.2}"
                fill="#ffffff"
                opacity="0.3"/>
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
