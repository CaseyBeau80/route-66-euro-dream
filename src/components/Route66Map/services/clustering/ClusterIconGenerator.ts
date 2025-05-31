
export class ClusterIconGenerator {
  static getClusterIcon(markerCount: number): google.maps.Icon {
    const size = Math.min(50, Math.max(35, markerCount * 1.5 + 25));
    
    console.log(`🚗 Creating nostalgic car cluster icon for ${markerCount} markers`);
    
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <defs>
          <filter id="carShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
          
          <!-- Vintage car paint gradient -->
          <linearGradient id="carPaint" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#DC2626;stop-opacity:1" />
            <stop offset="30%" style="stop-color:#EF4444;stop-opacity:1" />
            <stop offset="70%" style="stop-color:#B91C1C;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#991B1B;stop-opacity:1" />
          </linearGradient>
          
          <!-- Chrome bumper gradient -->
          <linearGradient id="chrome" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#E5E7EB;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#F9FAFB;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#D1D5DB;stop-opacity:1" />
          </linearGradient>
          
          <!-- Tire gradient -->
          <radialGradient id="tire" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#374151;stop-opacity:1" />
            <stop offset="70%" style="stop-color:#1F2937;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#111827;stop-opacity:1" />
          </radialGradient>
          
          <!-- Windshield gradient -->
          <linearGradient id="windshield" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#DBEAFE;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#93C5FD;stop-opacity:0.6" />
          </linearGradient>
        </defs>
        
        <!-- Main car body (vintage coupe shape) -->
        <path d="M${size * 0.15} ${size * 0.65}
                 L${size * 0.2} ${size * 0.45}
                 C${size * 0.25} ${size * 0.35} ${size * 0.35} ${size * 0.3} ${size * 0.5} ${size * 0.3}
                 C${size * 0.65} ${size * 0.3} ${size * 0.75} ${size * 0.35} ${size * 0.8} ${size * 0.45}
                 L${size * 0.85} ${size * 0.65}
                 C${size * 0.85} ${size * 0.7} ${size * 0.8} ${size * 0.75} ${size * 0.75} ${size * 0.75}
                 L${size * 0.25} ${size * 0.75}
                 C${size * 0.2} ${size * 0.75} ${size * 0.15} ${size * 0.7} ${size * 0.15} ${size * 0.65} Z"
              fill="url(#carPaint)"
              stroke="#991B1B"
              stroke-width="1"
              filter="url(#carShadow)"/>
        
        <!-- Windshield -->
        <path d="M${size * 0.25} ${size * 0.45}
                 C${size * 0.3} ${size * 0.38} ${size * 0.4} ${size * 0.35} ${size * 0.5} ${size * 0.35}
                 C${size * 0.6} ${size * 0.35} ${size * 0.7} ${size * 0.38} ${size * 0.75} ${size * 0.45}
                 L${size * 0.7} ${size * 0.55}
                 L${size * 0.3} ${size * 0.55}
                 Z"
              fill="url(#windshield)"
              stroke="#60A5FA"
              stroke-width="0.5"/>
        
        <!-- Front bumper -->
        <rect x="${size * 0.12}" y="${size * 0.62}" width="${size * 0.76}" height="${size * 0.08}"
              fill="url(#chrome)"
              stroke="#9CA3AF"
              stroke-width="0.5"/>
        
        <!-- Headlights -->
        <circle cx="${size * 0.2}" cy="${size * 0.6}" r="${size * 0.04}"
                fill="#FEF3C7"
                stroke="#F59E0B"
                stroke-width="1"/>
        <circle cx="${size * 0.8}" cy="${size * 0.6}" r="${size * 0.04}"
                fill="#FEF3C7"
                stroke="#F59E0B"
                stroke-width="1"/>
        
        <!-- Tires -->
        <circle cx="${size * 0.25}" cy="${size * 0.75}" r="${size * 0.08}"
                fill="url(#tire)"
                stroke="#000000"
                stroke-width="1"/>
        <circle cx="${size * 0.75}" cy="${size * 0.75}" r="${size * 0.08}"
                fill="url(#tire)"
                stroke="#000000"
                stroke-width="1"/>
        
        <!-- Hub caps -->
        <circle cx="${size * 0.25}" cy="${size * 0.75}" r="${size * 0.04}"
                fill="url(#chrome)"
                stroke="#9CA3AF"
                stroke-width="0.5"/>
        <circle cx="${size * 0.75}" cy="${size * 0.75}" r="${size * 0.04}"
                fill="url(#chrome)"
                stroke="#9CA3AF"
                stroke-width="0.5"/>
        
        <!-- Side details (door handles) -->
        <circle cx="${size * 0.35}" cy="${size * 0.55}" r="${size * 0.015}"
                fill="#9CA3AF"/>
        <circle cx="${size * 0.65}" cy="${size * 0.55}" r="${size * 0.015}"
                fill="#9CA3AF"/>
        
        <!-- Number badge on the hood -->
        <circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.12}"
                fill="#FEF3C7"
                stroke="#DC2626"
                stroke-width="2"/>
        <circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.08}"
                fill="#FFFFFF"
                opacity="0.9"/>
        
        <!-- Cluster count -->
        <text x="${size * 0.5}" y="${size * 0.55}" text-anchor="middle"
              fill="#DC2626"
              font-family="Arial, sans-serif"
              font-size="${Math.max(8, size * 0.2)}"
              font-weight="bold">${markerCount}</text>
        
        <!-- Vintage shine effect on car body -->
        <path d="M${size * 0.3} ${size * 0.4}
                 C${size * 0.4} ${size * 0.35} ${size * 0.6} ${size * 0.35} ${size * 0.7} ${size * 0.4}
                 L${size * 0.65} ${size * 0.45}
                 C${size * 0.55} ${size * 0.4} ${size * 0.45} ${size * 0.4} ${size * 0.35} ${size * 0.45}
                 Z"
              fill="#FFFFFF"
              opacity="0.3"/>
      </svg>
    `;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`,
      scaledSize: new google.maps.Size(size, size),
      anchor: new google.maps.Point(size/2, size * 0.8) // Anchor near the bottom of the car
    };
  }
}
