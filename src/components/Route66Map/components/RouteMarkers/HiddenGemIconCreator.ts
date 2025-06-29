
export class HiddenGemIconCreator {
  static createHiddenGemIcon(isCloseZoom: boolean = false) {
    const baseSize = isCloseZoom ? 44 : 36;
    
    console.log(`💎 Creating realistic diamond hidden gem icon - Size: ${baseSize}x${baseSize}, Close zoom: ${isCloseZoom}`);
    
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${baseSize}" height="${baseSize}" viewBox="0 0 ${baseSize} ${baseSize}">
          <defs>
            <linearGradient id="diamondGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#e8f4ff;stop-opacity:1" />
              <stop offset="30%" style="stop-color:#b3d9ff;stop-opacity:1" />
              <stop offset="60%" style="stop-color:#66b3ff;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#0066cc;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="diamondGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.8" />
              <stop offset="50%" style="stop-color:#cce6ff;stop-opacity:0.6" />
              <stop offset="100%" style="stop-color:#0066cc;stop-opacity:0.9" />
            </linearGradient>
            <filter id="gemShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="2" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
            </filter>
            <filter id="sparkle" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <!-- Diamond facets for realistic look -->
          <g filter="url(#gemShadow)">
            <!-- Top facet -->
            <path d="M${baseSize/2} ${baseSize * 0.1} L${baseSize * 0.25} ${baseSize * 0.4} L${baseSize * 0.75} ${baseSize * 0.4} Z" 
                  fill="url(#diamondGradient1)" 
                  stroke="rgba(255,255,255,0.5)" 
                  stroke-width="0.5"/>
            
            <!-- Left facet -->
            <path d="M${baseSize * 0.25} ${baseSize * 0.4} L${baseSize * 0.1} ${baseSize * 0.6} L${baseSize/2} ${baseSize * 0.9} Z" 
                  fill="url(#diamondGradient2)" 
                  stroke="rgba(255,255,255,0.3)" 
                  stroke-width="0.5"/>
            
            <!-- Right facet -->
            <path d="M${baseSize * 0.75} ${baseSize * 0.4} L${baseSize/2} ${baseSize * 0.9} L${baseSize * 0.9} ${baseSize * 0.6} Z" 
                  fill="url(#diamondGradient1)" 
                  stroke="rgba(255,255,255,0.3)" 
                  stroke-width="0.5"/>
            
            <!-- Center highlight -->
            <path d="M${baseSize * 0.25} ${baseSize * 0.4} L${baseSize * 0.75} ${baseSize * 0.4} L${baseSize/2} ${baseSize * 0.9} Z" 
                  fill="url(#diamondGradient2)" 
                  stroke="rgba(255,255,255,0.6)" 
                  stroke-width="0.5"/>
          </g>
          
          <!-- Sparkle highlights -->
          <g filter="url(#sparkle)">
            <circle cx="${baseSize * 0.35}" cy="${baseSize * 0.3}" r="1.5" fill="white" opacity="0.9"/>
            <circle cx="${baseSize * 0.65}" cy="${baseSize * 0.45}" r="1" fill="white" opacity="0.7"/>
            <circle cx="${baseSize * 0.45}" cy="${baseSize * 0.7}" r="0.8" fill="white" opacity="0.8"/>
          </g>
          
          <!-- Gem emoji overlay for extra sparkle -->
          <text x="${baseSize/2}" y="${baseSize * 0.58}" 
                text-anchor="middle" 
                fill="rgba(255,255,255,0.3)" 
                font-family="Arial" 
                font-size="${baseSize * 0.3}" 
                font-weight="bold">💎</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(baseSize, baseSize),
      // Offset hidden gems to the bottom-right
      anchor: new google.maps.Point(baseSize/2 - 12, baseSize/2 - 12)
    };
  }

  static createHiddenGemTitle(gemName: string): string {
    return `💎 Hidden Gem: ${gemName}`;
  }

  static getHiddenGemZIndex(): number {
    return 24000;
  }
}
