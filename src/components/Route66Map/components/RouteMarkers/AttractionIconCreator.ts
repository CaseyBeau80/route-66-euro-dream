
export class AttractionIconCreator {
  /**
   * Creates an enhanced professional map pin icon for attractions (📍 representation)
   * High-resolution SVG with crisp lines and proper scaling
   */
  static createAttractionIcon(isCloseZoom: boolean = false): google.maps.Icon {
    const baseSize = isCloseZoom ? 42 : 32;
    const pinHeight = baseSize * 1.2;
    
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${baseSize}" height="${pinHeight}" viewBox="0 0 ${baseSize} ${pinHeight}" style="shape-rendering: geometricPrecision;">
        <defs>
          <!-- High-quality gradients for depth -->
          <linearGradient id="pinBodyGradient" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" style="stop-color:#ff4444;stop-opacity:1" />
            <stop offset="25%" style="stop-color:#ff3333;stop-opacity:1" />
            <stop offset="75%" style="stop-color:#cc2222;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#aa1111;stop-opacity:1" />
          </linearGradient>
          
          <radialGradient id="pinHighlight" cx="35%" cy="25%" r="40%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.6" />
            <stop offset="50%" style="stop-color:#ffffff;stop-opacity:0.2" />
            <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
          </radialGradient>
          
          <filter id="pinShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.4)"/>
          </filter>
          
          <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Pin shadow on ground -->
        <ellipse cx="${baseSize/2}" cy="${pinHeight - 2}" rx="${baseSize * 0.2}" ry="${baseSize * 0.06}" 
                 fill="#000000" opacity="0.2"/>
        
        <!-- Pin body with crisp edges -->
        <g filter="url(#pinShadow)">
          <!-- Main pin teardrop shape -->
          <path d="M${baseSize/2},${pinHeight - 4} 
                   C${baseSize * 0.15},${pinHeight * 0.6} 
                   ${baseSize * 0.15},${baseSize * 0.4} 
                   ${baseSize/2},${baseSize * 0.4}
                   C${baseSize * 0.85},${baseSize * 0.4} 
                   ${baseSize * 0.85},${pinHeight * 0.6} 
                   ${baseSize/2},${pinHeight - 4} Z" 
                fill="url(#pinBodyGradient)" 
                stroke="#ffffff" 
                stroke-width="1.5"
                vector-effect="non-scaling-stroke"/>
          
          <!-- Pin highlight for 3D effect -->
          <path d="M${baseSize/2},${pinHeight - 4} 
                   C${baseSize * 0.15},${pinHeight * 0.6} 
                   ${baseSize * 0.15},${baseSize * 0.4} 
                   ${baseSize/2},${baseSize * 0.4}
                   C${baseSize * 0.85},${baseSize * 0.4} 
                   ${baseSize * 0.85},${pinHeight * 0.6} 
                   ${baseSize/2},${pinHeight - 4} Z" 
                fill="url(#pinHighlight)"/>
        </g>
        
        <!-- Center circle with crisp definition -->
        <circle cx="${baseSize/2}" cy="${baseSize * 0.52}" r="${baseSize * 0.16}" 
                fill="#ffffff" 
                stroke="#cc2222" 
                stroke-width="1.2"
                vector-effect="non-scaling-stroke"/>
        <circle cx="${baseSize/2}" cy="${baseSize * 0.52}" r="${baseSize * 0.08}" 
                fill="#ff4444"/>
        
        <!-- Subtle glow effect for visibility -->
        <g filter="url(#pinGlow)" opacity="0.6">
          <path d="M${baseSize/2},${pinHeight - 4} 
                   C${baseSize * 0.15},${pinHeight * 0.6} 
                   ${baseSize * 0.15},${baseSize * 0.4} 
                   ${baseSize/2},${baseSize * 0.4}
                   C${baseSize * 0.85},${baseSize * 0.4} 
                   ${baseSize * 0.85},${pinHeight * 0.6} 
                   ${baseSize/2},${pinHeight - 4} Z" 
                fill="#ff4444" 
                opacity="0.3"/>
        </g>
        
        <!-- Retro shine for Americana feel -->
        <ellipse cx="${baseSize * 0.38}" cy="${baseSize * 0.45}" rx="${baseSize * 0.08}" ry="${baseSize * 0.12}" 
                 fill="#ffffff" 
                 opacity="0.4"
                 transform="rotate(-15 ${baseSize * 0.38} ${baseSize * 0.45})"/>
      </svg>
    `;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`,
      scaledSize: new google.maps.Size(baseSize, pinHeight),
      anchor: new google.maps.Point(baseSize/2, pinHeight - 4),
      optimized: true
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
