
export class NativeAmericanIconCreator {
  /**
   * Creates an earth-toned feather icon for Native American heritage sites
   * Respectful design with terracotta, turquoise, and sand colors
   */
  static createNativeAmericanIcon(isCloseZoom: boolean = false): google.maps.Icon {
    const baseSize = isCloseZoom ? 44 : 36;
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${baseSize}" height="${baseSize}" viewBox="0 0 ${baseSize} ${baseSize}" style="shape-rendering: geometricPrecision;">
        <defs>
          <!-- Earth-toned gradient for feather body -->
          <linearGradient id="featherMainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#CD5C5C;stop-opacity:1" />
            <stop offset="40%" style="stop-color:#B84C4C;stop-opacity:1" />
            <stop offset="70%" style="stop-color:#8B4513;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#654321;stop-opacity:1" />
          </linearGradient>
          
          <!-- Turquoise accent gradient -->
          <linearGradient id="turquoiseAccent" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#40E0D0;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#008B8B;stop-opacity:1" />
          </linearGradient>
          
          <!-- Sand color for quill -->
          <linearGradient id="quillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#F5DEB3;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#D2B48C;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#C4A77D;stop-opacity:1" />
          </linearGradient>
          
          <!-- Glow effect -->
          <filter id="featherGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <!-- Drop shadow -->
          <filter id="featherShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.35)"/>
          </filter>
        </defs>
        
        <!-- Shadow ellipse -->
        <ellipse cx="${baseSize/2}" cy="${baseSize - 2}" rx="${baseSize * 0.2}" ry="${baseSize * 0.06}" 
                 fill="#000000" opacity="0.2"/>
        
        <!-- Main feather group -->
        <g transform="translate(${baseSize/2}, ${baseSize/2})" filter="url(#featherShadow)">
          <!-- Feather body (elegant curved shape) -->
          <path d="
            M 0 -${baseSize * 0.38}
            C ${baseSize * 0.15} -${baseSize * 0.28}, ${baseSize * 0.22} -${baseSize * 0.12}, ${baseSize * 0.18} ${baseSize * 0.08}
            C ${baseSize * 0.14} ${baseSize * 0.22}, ${baseSize * 0.08} ${baseSize * 0.32}, 0 ${baseSize * 0.38}
            C -${baseSize * 0.08} ${baseSize * 0.32}, -${baseSize * 0.14} ${baseSize * 0.22}, -${baseSize * 0.18} ${baseSize * 0.08}
            C -${baseSize * 0.22} -${baseSize * 0.12}, -${baseSize * 0.15} -${baseSize * 0.28}, 0 -${baseSize * 0.38}
            Z
          " 
          fill="url(#featherMainGradient)" 
          stroke="#40E0D0" 
          stroke-width="1.5"/>
          
          <!-- Central quill (rachis) -->
          <line x1="0" y1="-${baseSize * 0.34}" x2="0" y2="${baseSize * 0.36}" 
                stroke="url(#quillGradient)" 
                stroke-width="${baseSize * 0.06}" 
                stroke-linecap="round"/>
          
          <!-- Barbs on left side -->
          <g stroke="url(#quillGradient)" stroke-width="0.8" opacity="0.7">
            <line x1="0" y1="-${baseSize * 0.26}" x2="-${baseSize * 0.14}" y2="-${baseSize * 0.18}"/>
            <line x1="0" y1="-${baseSize * 0.14}" x2="-${baseSize * 0.16}" y2="-${baseSize * 0.04}"/>
            <line x1="0" y1="0" x2="-${baseSize * 0.15}" y2="${baseSize * 0.1}"/>
            <line x1="0" y1="${baseSize * 0.14}" x2="-${baseSize * 0.12}" y2="${baseSize * 0.22}"/>
          </g>
          
          <!-- Barbs on right side -->
          <g stroke="url(#quillGradient)" stroke-width="0.8" opacity="0.7">
            <line x1="0" y1="-${baseSize * 0.26}" x2="${baseSize * 0.14}" y2="-${baseSize * 0.18}"/>
            <line x1="0" y1="-${baseSize * 0.14}" x2="${baseSize * 0.16}" y2="-${baseSize * 0.04}"/>
            <line x1="0" y1="0" x2="${baseSize * 0.15}" y2="${baseSize * 0.1}"/>
            <line x1="0" y1="${baseSize * 0.14}" x2="${baseSize * 0.12}" y2="${baseSize * 0.22}"/>
          </g>
          
          <!-- Turquoise decorative band near top -->
          <rect x="-${baseSize * 0.05}" y="-${baseSize * 0.3}" 
                width="${baseSize * 0.1}" height="${baseSize * 0.06}" 
                rx="${baseSize * 0.015}"
                fill="url(#turquoiseAccent)" 
                stroke="#ffffff" 
                stroke-width="0.5"/>
          
          <!-- Small turquoise bead accent -->
          <circle cx="0" cy="-${baseSize * 0.18}" r="${baseSize * 0.025}" 
                  fill="#40E0D0" 
                  stroke="#ffffff" 
                  stroke-width="0.3"/>
        </g>
        
        <!-- Highlight effects -->
        <g transform="translate(${baseSize/2}, ${baseSize/2})">
          <!-- Top highlight -->
          <ellipse cx="0" cy="-${baseSize * 0.28}" rx="${baseSize * 0.04}" ry="${baseSize * 0.02}" 
                   fill="#ffffff" opacity="0.4"/>
          
          <!-- Side glint -->
          <circle cx="${baseSize * 0.08}" cy="-${baseSize * 0.1}" r="${baseSize * 0.015}" 
                  fill="#ffffff" opacity="0.5"/>
        </g>
      </svg>
    `;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`,
      scaledSize: new google.maps.Size(baseSize, baseSize),
      anchor: new google.maps.Point(baseSize / 2, baseSize / 2)
    };
  }

  /**
   * Creates a title for native american site markers
   */
  static createNativeAmericanTitle(siteName: string, tribeNation?: string | null): string {
    if (tribeNation) {
      return `🪶 ${siteName} (${tribeNation})`;
    }
    return `🪶 Native American Heritage: ${siteName}`;
  }

  /**
   * Gets the z-index for native american site markers (above attractions, below hidden gems)
   */
  static getNativeAmericanZIndex(): number {
    return 28000;
  }
}
