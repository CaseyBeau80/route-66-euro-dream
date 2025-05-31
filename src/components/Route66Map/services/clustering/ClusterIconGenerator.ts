
export class ClusterIconGenerator {
  static getClusterIcon(markerCount: number): google.maps.Icon {
    const size = Math.min(50, Math.max(35, markerCount * 1.5 + 25));
    
    console.log(`🚗 Creating reliable vintage car cluster icon for ${markerCount} markers, size: ${size}`);
    
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="1" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
        </defs>
        
        <!-- Car shadow -->
        <ellipse cx="${size * 0.5}" cy="${size * 0.8}" rx="${size * 0.35}" ry="${size * 0.05}" 
                 fill="#000000" opacity="0.2"/>
        
        <!-- Main car body (vintage red) -->
        <rect x="${size * 0.2}" y="${size * 0.55}" width="${size * 0.6}" height="${size * 0.15}"
              fill="#8B0000" stroke="#654321" stroke-width="1" rx="${size * 0.02}" filter="url(#shadow)"/>
        
        <!-- Car roof -->
        <rect x="${size * 0.28}" y="${size * 0.45}" width="${size * 0.44}" height="${size * 0.1}"
              fill="#8B0000" stroke="#654321" stroke-width="1" rx="${size * 0.015}"/>
        
        <!-- Windshield -->
        <rect x="${size * 0.3}" y="${size * 0.47}" width="${size * 0.4}" height="${size * 0.06}"
              fill="#B0E0E6" stroke="#4682B4" stroke-width="0.5" rx="${size * 0.01}" opacity="0.7"/>
        
        <!-- Front bumper -->
        <rect x="${size * 0.15}" y="${size * 0.62}" width="${size * 0.7}" height="${size * 0.03}"
              fill="#C0C0C0" stroke="#A0A0A0" stroke-width="0.5"/>
        
        <!-- Headlights -->
        <circle cx="${size * 0.22}" cy="${size * 0.58}" r="${size * 0.025}"
                fill="#FFF8DC" stroke="#DAA520" stroke-width="0.5"/>
        <circle cx="${size * 0.78}" cy="${size * 0.58}" r="${size * 0.025}"
                fill="#FFF8DC" stroke="#DAA520" stroke-width="0.5"/>
        
        <!-- Wheels -->
        <circle cx="${size * 0.3}" cy="${size * 0.72}" r="${size * 0.05}"
                fill="#2F2F2F" stroke="#000000" stroke-width="0.5"/>
        <circle cx="${size * 0.7}" cy="${size * 0.72}" r="${size * 0.05}"
                fill="#2F2F2F" stroke="#000000" stroke-width="0.5"/>
        
        <!-- Hubcaps -->
        <circle cx="${size * 0.3}" cy="${size * 0.72}" r="${size * 0.02}"
                fill="#C0C0C0"/>
        <circle cx="${size * 0.7}" cy="${size * 0.72}" r="${size * 0.02}"
                fill="#C0C0C0"/>
        
        <!-- Count badge background -->
        <circle cx="${size * 0.5}" cy="${size * 0.25}" r="${size * 0.15}"
                fill="#FFFFFF" stroke="#8B0000" stroke-width="2" filter="url(#shadow)"/>
        
        <!-- Inner badge circle -->
        <circle cx="${size * 0.5}" cy="${size * 0.25}" r="${size * 0.11}"
                fill="#FFFFFF" opacity="0.95"/>
        
        <!-- Cluster count text -->
        <text x="${size * 0.5}" y="${size * 0.32}" text-anchor="middle"
              fill="#8B0000" font-family="Arial, sans-serif" 
              font-size="${Math.max(10, size * 0.25)}" font-weight="bold">${markerCount}</text>
      </svg>
    `;

    const dataUri = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`;
    
    console.log(`🚗 Generated reliable vintage car cluster icon, data URI length: ${dataUri.length}`);

    return {
      url: dataUri,
      scaledSize: new google.maps.Size(size, size),
      anchor: new google.maps.Point(size/2, size * 0.8)
    };
  }
}
