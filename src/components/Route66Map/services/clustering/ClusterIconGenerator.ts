
export class ClusterIconGenerator {
  static getClusterIcon(markerCount: number): google.maps.Icon {
    const size = Math.min(50, Math.max(35, markerCount * 1.5 + 25));
    
    console.log(`🚗 Creating improved vintage car cluster icon for ${markerCount} markers`);
    
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <defs>
          <filter id="carShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="3" stdDeviation="2" flood-color="#000000" flood-opacity="0.25"/>
          </filter>
          
          <!-- Classic car orange gradient -->
          <linearGradient id="carBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FF6B35;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#FF8C42;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#E8540C;stop-opacity:1" />
          </linearGradient>
          
          <!-- Chrome gradient for bumpers -->
          <linearGradient id="chrome" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#C0C0C0;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#E8E8E8;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#B8B8B8;stop-opacity:1" />
          </linearGradient>
          
          <!-- Tire gradient -->
          <radialGradient id="tire" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#2C2C2C;stop-opacity:1" />
            <stop offset="80%" style="stop-color:#1A1A1A;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
          </linearGradient>
          
          <!-- Windshield -->
          <linearGradient id="windshield" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:0.7" />
            <stop offset="100%" style="stop-color:#4682B4;stop-opacity:0.5" />
          </linearGradient>
          
          <!-- Count badge background -->
          <radialGradient id="badge" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#F0F0F0;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Car shadow -->
        <ellipse cx="${size * 0.5}" cy="${size * 0.85}" rx="${size * 0.42}" ry="${size * 0.08}" 
                 fill="#000000" opacity="0.15"/>
        
        <!-- Main car body - classic 1950s style -->
        <path d="M${size * 0.15} ${size * 0.7}
                 L${size * 0.18} ${size * 0.55}
                 C${size * 0.2} ${size * 0.45} ${size * 0.25} ${size * 0.4} ${size * 0.35} ${size * 0.38}
                 L${size * 0.65} ${size * 0.38}
                 C${size * 0.75} ${size * 0.4} ${size * 0.8} ${size * 0.45} ${size * 0.82} ${size * 0.55}
                 L${size * 0.85} ${size * 0.7}
                 C${size * 0.85} ${size * 0.72} ${size * 0.83} ${size * 0.74} ${size * 0.8} ${size * 0.74}
                 L${size * 0.2} ${size * 0.74}
                 C${size * 0.17} ${size * 0.74} ${size * 0.15} ${size * 0.72} ${size * 0.15} ${size * 0.7} Z"
              fill="url(#carBody)"
              stroke="#D4550A"
              stroke-width="1"
              filter="url(#carShadow)"/>
        
        <!-- Roof line -->
        <path d="M${size * 0.25} ${size * 0.48}
                 C${size * 0.3} ${size * 0.42} ${size * 0.4} ${size * 0.4} ${size * 0.5} ${size * 0.4}
                 C${size * 0.6} ${size * 0.4} ${size * 0.7} ${size * 0.42} ${size * 0.75} ${size * 0.48}
                 L${size * 0.72} ${size * 0.58}
                 L${size * 0.28} ${size * 0.58}
                 Z"
              fill="url(#carBody)"
              stroke="#D4550A"
              stroke-width="0.5"/>
        
        <!-- Windshield -->
        <path d="M${size * 0.28} ${size * 0.48}
                 C${size * 0.32} ${size * 0.44} ${size * 0.42} ${size * 0.42} ${size * 0.5} ${size * 0.42}
                 C${size * 0.58} ${size * 0.42} ${size * 0.68} ${size * 0.44} ${size * 0.72} ${size * 0.48}
                 L${size * 0.7} ${size * 0.56}
                 L${size * 0.3} ${size * 0.56}
                 Z"
              fill="url(#windshield)"
              stroke="#4682B4"
              stroke-width="0.5"/>
        
        <!-- Front grille -->
        <rect x="${size * 0.12}" y="${size * 0.65}" width="${size * 0.76}" height="${size * 0.06}"
              fill="url(#chrome)"
              stroke="#A0A0A0"
              stroke-width="0.5"
              rx="${size * 0.01}"/>
        
        <!-- Headlights -->
        <circle cx="${size * 0.18}" cy="${size * 0.62}" r="${size * 0.035}"
                fill="#FFF8DC"
                stroke="#DAA520"
                stroke-width="1"/>
        <circle cx="${size * 0.82}" cy="${size * 0.62}" r="${size * 0.035}"
                fill="#FFF8DC"
                stroke="#DAA520"
                stroke-width="1"/>
        
        <!-- Headlight beams -->
        <circle cx="${size * 0.18}" cy="${size * 0.62}" r="${size * 0.02}"
                fill="#FFFFE0"/>
        <circle cx="${size * 0.82}" cy="${size * 0.62}" r="${size * 0.02}"
                fill="#FFFFE0"/>
        
        <!-- Tires -->
        <circle cx="${size * 0.25}" cy="${size * 0.75}" r="${size * 0.075}"
                fill="url(#tire)"
                stroke="#000000"
                stroke-width="1"/>
        <circle cx="${size * 0.75}" cy="${size * 0.75}" r="${size * 0.075}"
                fill="url(#tire)"
                stroke="#000000"
                stroke-width="1"/>
        
        <!-- Hubcaps -->
        <circle cx="${size * 0.25}" cy="${size * 0.75}" r="${size * 0.035}"
                fill="url(#chrome)"
                stroke="#909090"
                stroke-width="0.5"/>
        <circle cx="${size * 0.75}" cy="${size * 0.75}" r="${size * 0.035}"
                fill="url(#chrome)"
                stroke="#909090"
                stroke-width="0.5"/>
        
        <!-- Door handles -->
        <rect x="${size * 0.32}" y="${size * 0.56}" width="${size * 0.015}" height="${size * 0.04}"
              fill="#C0C0C0" rx="${size * 0.002}"/>
        <rect x="${size * 0.665}" y="${size * 0.56}" width="${size * 0.015}" height="${size * 0.04}"
              fill="#C0C0C0" rx="${size * 0.002}"/>
        
        <!-- Front bumper detail -->
        <rect x="${size * 0.1}" y="${size * 0.68}" width="${size * 0.8}" height="${size * 0.025}"
              fill="url(#chrome)"
              stroke="#A0A0A0"
              stroke-width="0.3"
              rx="${size * 0.01}"/>
        
        <!-- Count badge circle -->
        <circle cx="${size * 0.5}" cy="${size * 0.52}" r="${size * 0.11}"
                fill="url(#badge)"
                stroke="#FF6B35"
                stroke-width="2.5"/>
        
        <!-- Inner badge circle -->
        <circle cx="${size * 0.5}" cy="${size * 0.52}" r="${size * 0.075}"
                fill="#FFFFFF"
                opacity="0.95"/>
        
        <!-- Cluster count text -->
        <text x="${size * 0.5}" y="${size * 0.57}" text-anchor="middle"
              fill="#FF6B35"
              font-family="Arial, sans-serif"
              font-size="${Math.max(10, size * 0.22)}"
              font-weight="bold">${markerCount}</text>
        
        <!-- Car body highlight -->
        <path d="M${size * 0.25} ${size * 0.45}
                 C${size * 0.35} ${size * 0.42} ${size * 0.65} ${size * 0.42} ${size * 0.75} ${size * 0.45}
                 L${size * 0.7} ${size * 0.48}
                 C${size * 0.6} ${size * 0.45} ${size * 0.4} ${size * 0.45} ${size * 0.3} ${size * 0.48}
                 Z"
              fill="#FFFFFF"
              opacity="0.25"/>
      </svg>
    `;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`,
      scaledSize: new google.maps.Size(size, size),
      anchor: new google.maps.Point(size/2, size * 0.8)
    };
  }
}
