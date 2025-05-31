
export class ClusterIconGenerator {
  static getClusterIcon(markerCount: number): google.maps.Icon {
    const size = Math.min(50, Math.max(35, markerCount * 1.5 + 25));
    
    console.log(`🚗 Creating simplified vintage car cluster icon for ${markerCount} markers, size: ${size}`);
    
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="1" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
        </defs>
        
        <!-- Car shadow -->
        <ellipse cx="${size * 0.5}" cy="${size * 0.85}" rx="${size * 0.4}" ry="${size * 0.06}" 
                 fill="#000000" opacity="0.2"/>
        
        <!-- Main car body -->
        <rect x="${size * 0.15}" y="${size * 0.6}" width="${size * 0.7}" height="${size * 0.15}"
              fill="#FF6B35" stroke="#E8540C" stroke-width="1" rx="${size * 0.02}" filter="url(#shadow)"/>
        
        <!-- Car roof -->
        <rect x="${size * 0.25}" y="${size * 0.45}" width="${size * 0.5}" height="${size * 0.15}"
              fill="#FF6B35" stroke="#E8540C" stroke-width="1" rx="${size * 0.02}"/>
        
        <!-- Windshield -->
        <rect x="${size * 0.28}" y="${size * 0.47}" width="${size * 0.44}" height="${size * 0.11}"
              fill="#87CEEB" stroke="#4682B4" stroke-width="0.5" rx="${size * 0.01}" opacity="0.8"/>
        
        <!-- Front grille -->
        <rect x="${size * 0.12}" y="${size * 0.65}" width="${size * 0.76}" height="${size * 0.04}"
              fill="#C0C0C0" stroke="#A0A0A0" stroke-width="0.5" rx="${size * 0.01}"/>
        
        <!-- Headlights -->
        <circle cx="${size * 0.18}" cy="${size * 0.62}" r="${size * 0.03}"
                fill="#FFF8DC" stroke="#DAA520" stroke-width="0.5"/>
        <circle cx="${size * 0.82}" cy="${size * 0.62}" r="${size * 0.03}"
                fill="#FFF8DC" stroke="#DAA520" stroke-width="0.5"/>
        
        <!-- Tires -->
        <circle cx="${size * 0.25}" cy="${size * 0.75}" r="${size * 0.06}"
                fill="#1A1A1A" stroke="#000000" stroke-width="0.5"/>
        <circle cx="${size * 0.75}" cy="${size * 0.75}" r="${size * 0.06}"
                fill="#1A1A1A" stroke="#000000" stroke-width="0.5"/>
        
        <!-- Hubcaps -->
        <circle cx="${size * 0.25}" cy="${size * 0.75}" r="${size * 0.025}"
                fill="#C0C0C0" stroke="#909090" stroke-width="0.3"/>
        <circle cx="${size * 0.75}" cy="${size * 0.75}" r="${size * 0.025}"
                fill="#C0C0C0" stroke="#909090" stroke-width="0.3"/>
        
        <!-- Count badge background -->
        <circle cx="${size * 0.5}" cy="${size * 0.52}" r="${size * 0.12}"
                fill="#FFFFFF" stroke="#FF6B35" stroke-width="2"/>
        
        <!-- Inner badge circle -->
        <circle cx="${size * 0.5}" cy="${size * 0.52}" r="${size * 0.08}"
                fill="#FFFFFF" opacity="0.9"/>
        
        <!-- Cluster count text -->
        <text x="${size * 0.5}" y="${size * 0.57}" text-anchor="middle"
              fill="#FF6B35" font-family="Arial, sans-serif" 
              font-size="${Math.max(8, size * 0.2)}" font-weight="bold">${markerCount}</text>
      </svg>
    `;

    const dataUri = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`;
    
    console.log(`🚗 Generated car icon data URI length: ${dataUri.length}`);

    return {
      url: dataUri,
      scaledSize: new google.maps.Size(size, size),
      anchor: new google.maps.Point(size/2, size * 0.8)
    };
  }
}
