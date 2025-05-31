

export class ClusterIconGenerator {
  static getClusterIcon(markerCount: number): google.maps.Icon {
    const size = Math.min(60, Math.max(40, markerCount * 1.5 + 30)); // Made it bigger
    
    console.log(`🚗 Creating blue vintage car cluster icon for ${markerCount} markers, size: ${size}`);
    
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
        </defs>
        
        <!-- Car shadow -->
        <ellipse cx="${size * 0.5}" cy="${size * 0.82}" rx="${size * 0.4}" ry="${size * 0.06}" 
                 fill="#000000" opacity="0.2"/>
        
        <!-- Main car body (blue) -->
        <rect x="${size * 0.15}" y="${size * 0.55}" width="${size * 0.7}" height="${size * 0.18}"
              fill="#2563eb" stroke="#1d4ed8" stroke-width="1.5" rx="${size * 0.03}" filter="url(#shadow)"/>
        
        <!-- Car roof -->
        <rect x="${size * 0.25}" y="${size * 0.42}" width="${size * 0.5}" height="${size * 0.13}"
              fill="#2563eb" stroke="#1d4ed8" stroke-width="1.5" rx="${size * 0.025}"/>
        
        <!-- Windshield -->
        <rect x="${size * 0.28}" y="${size * 0.45}" width="${size * 0.44}" height="${size * 0.08}"
              fill="#87ceeb" stroke="#4682b4" stroke-width="1" rx="${size * 0.015}" opacity="0.8"/>
        
        <!-- Front bumper -->
        <rect x="${size * 0.1}" y="${size * 0.68}" width="${size * 0.8}" height="${size * 0.04}"
              fill="#c0c0c0" stroke="#999999" stroke-width="1"/>
        
        <!-- Front grille -->
        <rect x="${size * 0.12}" y="${size * 0.6}" width="${size * 0.76}" height="${size * 0.08}"
              fill="#333333" stroke="#1d4ed8" stroke-width="1" rx="${size * 0.01}"/>
        
        <!-- Headlights -->
        <circle cx="${size * 0.2}" cy="${size * 0.62}" r="${size * 0.035}"
                fill="#fff8dc" stroke="#daa520" stroke-width="1"/>
        <circle cx="${size * 0.8}" cy="${size * 0.62}" r="${size * 0.035}"
                fill="#fff8dc" stroke="#daa520" stroke-width="1"/>
        
        <!-- Wheels -->
        <circle cx="${size * 0.27}" cy="${size * 0.75}" r="${size * 0.06}"
                fill="#2f2f2f" stroke="#000000" stroke-width="1"/>
        <circle cx="${size * 0.73}" cy="${size * 0.75}" r="${size * 0.06}"
                fill="#2f2f2f" stroke="#000000" stroke-width="1"/>
        
        <!-- Hubcaps -->
        <circle cx="${size * 0.27}" cy="${size * 0.75}" r="${size * 0.025}"
                fill="#c0c0c0"/>
        <circle cx="${size * 0.73}" cy="${size * 0.75}" r="${size * 0.025}"
                fill="#c0c0c0"/>
        
        <!-- Side mirrors -->
        <rect x="${size * 0.23}" y="${size * 0.52}" width="${size * 0.02}" height="${size * 0.04}"
              fill="#2563eb" stroke="#1d4ed8" stroke-width="0.5"/>
        <rect x="${size * 0.75}" y="${size * 0.52}" width="${size * 0.02}" height="${size * 0.04}"
              fill="#2563eb" stroke="#1d4ed8" stroke-width="0.5"/>
        
        <!-- Count badge background -->
        <circle cx="${size * 0.5}" cy="${size * 0.22}" r="${size * 0.16}"
                fill="#ffffff" stroke="#2563eb" stroke-width="2.5" filter="url(#shadow)"/>
        
        <!-- Inner badge circle -->
        <circle cx="${size * 0.5}" cy="${size * 0.22}" r="${size * 0.12}"
                fill="#ffffff" opacity="0.95"/>
        
        <!-- Cluster count text -->
        <text x="${size * 0.5}" y="${size * 0.29}" text-anchor="middle"
              fill="#2563eb" font-family="Arial, sans-serif" 
              font-size="${Math.max(12, size * 0.28)}" font-weight="bold">${markerCount}</text>
      </svg>
    `;

    const dataUri = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`;
    
    console.log(`🚗 Generated blue vintage car cluster icon, data URI length: ${dataUri.length}`);

    return {
      url: dataUri,
      scaledSize: new google.maps.Size(size, size),
      anchor: new google.maps.Point(size/2, size * 0.8)
    };
  }
}

