
export class ClusterIconGenerator {
  static getClusterIcon(markerCount: number, clusterLevel: 'ultra' | 'large' | 'medium' | 'small' = 'medium'): google.maps.Icon {
    // Enhanced size calculation based on cluster level and marker count
    const baseSizes = {
      ultra: 80,
      large: 70,
      medium: 60,
      small: 50
    };
    
    const baseSize = baseSizes[clusterLevel];
    const countMultiplier = Math.min(1.5, Math.max(0.8, Math.log10(markerCount) * 0.5));
    const size = Math.min(100, Math.max(baseSize, baseSize * countMultiplier));
    
    console.log(`🚗 Creating enhanced ${clusterLevel} green vintage car cluster icon for ${markerCount} markers, size: ${size}`);
    
    // Enhanced colors for better visibility at different zoom levels
    const colors = {
      ultra: { main: '#16a34a', accent: '#22c55e', shadow: '#15803d' },
      large: { main: '#16a34a', accent: '#22c55e', shadow: '#15803d' },
      medium: { main: '#16a34a', accent: '#22c55e', shadow: '#15803d' },
      small: { main: '#16a34a', accent: '#22c55e', shadow: '#15803d' }
    };
    
    const colorScheme = colors[clusterLevel];
    
    // Enhanced stroke widths for better visibility
    const strokeWidths = {
      ultra: 3,
      large: 2.5,
      medium: 2,
      small: 1.5
    };
    
    const strokeWidth = strokeWidths[clusterLevel];
    
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.4"/>
          </filter>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Enhanced car shadow -->
        <ellipse cx="${size * 0.5}" cy="${size * 0.85}" rx="${size * 0.45}" ry="${size * 0.08}" 
                 fill="#000000" opacity="0.3"/>
        
        <!-- Main car body with enhanced visibility -->
        <rect x="${size * 0.12}" y="${size * 0.55}" width="${size * 0.76}" height="${size * 0.2}"
              fill="${colorScheme.accent}" stroke="${colorScheme.main}" stroke-width="${strokeWidth}" 
              rx="${size * 0.04}" filter="url(#shadow)"/>
        
        <!-- Enhanced car roof -->
        <rect x="${size * 0.22}" y="${size * 0.4}" width="${size * 0.56}" height="${size * 0.15}"
              fill="${colorScheme.accent}" stroke="${colorScheme.main}" stroke-width="${strokeWidth}" 
              rx="${size * 0.03}"/>
        
        <!-- Enhanced windshield -->
        <rect x="${size * 0.26}" y="${size * 0.43}" width="${size * 0.48}" height="${size * 0.1}"
              fill="#87ceeb" stroke="#4682b4" stroke-width="${strokeWidth * 0.7}" 
              rx="${size * 0.02}" opacity="0.9"/>
        
        <!-- Enhanced front bumper -->
        <rect x="${size * 0.08}" y="${size * 0.7}" width="${size * 0.84}" height="${size * 0.05}"
              fill="#e5e7eb" stroke="#9ca3af" stroke-width="${strokeWidth * 0.8}"/>
        
        <!-- Enhanced front grille -->
        <rect x="${size * 0.1}" y="${size * 0.6}" width="${size * 0.8}" height="${size * 0.1}"
              fill="#374151" stroke="${colorScheme.main}" stroke-width="${strokeWidth * 0.8}" 
              rx="${size * 0.015}"/>
        
        <!-- Enhanced headlights -->
        <circle cx="${size * 0.18}" cy="${size * 0.63}" r="${size * 0.04}"
                fill="#fff8dc" stroke="#f59e0b" stroke-width="${strokeWidth * 0.6}"/>
        <circle cx="${size * 0.82}" cy="${size * 0.63}" r="${size * 0.04}"
                fill="#fff8dc" stroke="#f59e0b" stroke-width="${strokeWidth * 0.6}"/>
        
        <!-- Enhanced wheels with better visibility -->
        <circle cx="${size * 0.25}" cy="${size * 0.77}" r="${size * 0.07}"
                fill="#1f2937" stroke="#000000" stroke-width="${strokeWidth * 0.8}"/>
        <circle cx="${size * 0.75}" cy="${size * 0.77}" r="${size * 0.07}"
                fill="#1f2937" stroke="#000000" stroke-width="${strokeWidth * 0.8}"/>
        
        <!-- Enhanced hubcaps -->
        <circle cx="${size * 0.25}" cy="${size * 0.77}" r="${size * 0.03}"
                fill="#d1d5db" stroke="#9ca3af" stroke-width="${strokeWidth * 0.5}"/>
        <circle cx="${size * 0.75}" cy="${size * 0.77}" r="${size * 0.03}"
                fill="#d1d5db" stroke="#9ca3af" stroke-width="${strokeWidth * 0.5}"/>
        
        <!-- Enhanced side mirrors -->
        <rect x="${size * 0.2}" y="${size * 0.5}" width="${size * 0.025}" height="${size * 0.05}"
              fill="${colorScheme.accent}" stroke="${colorScheme.main}" stroke-width="${strokeWidth * 0.6}"/>
        <rect x="${size * 0.775}" y="${size * 0.5}" width="${size * 0.025}" height="${size * 0.05}"
              fill="${colorScheme.accent}" stroke="${colorScheme.main}" stroke-width="${strokeWidth * 0.6}"/>
        
        <!-- Enhanced count badge with glow effect -->
        <circle cx="${size * 0.5}" cy="${size * 0.22}" r="${size * 0.18}"
                fill="#ffffff" stroke="${colorScheme.main}" stroke-width="${strokeWidth + 1}" 
                filter="url(#glow)" opacity="0.95"/>
        
        <!-- Inner badge circle with enhanced contrast -->
        <circle cx="${size * 0.5}" cy="${size * 0.22}" r="${size * 0.14}"
                fill="#ffffff" stroke="${colorScheme.accent}" stroke-width="${strokeWidth * 0.5}" 
                opacity="0.98"/>
        
        <!-- Enhanced cluster count text with better sizing -->
        <text x="${size * 0.5}" y="${size * 0.3}" text-anchor="middle"
              fill="${colorScheme.shadow}" font-family="Arial, sans-serif" 
              font-size="${Math.max(14, size * 0.25)}" font-weight="bold" 
              stroke="#ffffff" stroke-width="0.5">${markerCount}</text>
      </svg>
    `;

    const dataUri = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`;
    
    console.log(`🚗 Generated enhanced ${clusterLevel} green vintage car cluster icon, size: ${size}, data URI length: ${dataUri.length}`);

    return {
      url: dataUri,
      scaledSize: new google.maps.Size(size, size),
      anchor: new google.maps.Point(size/2, size * 0.82)
    };
  }
}
