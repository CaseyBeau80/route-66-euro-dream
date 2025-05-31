
export class ClusterIconGenerator {
  static getClusterIcon(markerCount: number): google.maps.Icon {
    const size = Math.min(50, Math.max(35, markerCount * 1.5 + 25));
    
    console.log(`🚗 Creating cluster icon with uploaded car image for ${markerCount} markers, size: ${size}`);
    
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="1" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
        </defs>
        
        <!-- Car image background -->
        <image href="/lovable-uploads/0a31764a-ace1-4bcf-973c-cba1bac689fe.png" 
               x="${size * 0.1}" y="${size * 0.3}" 
               width="${size * 0.8}" height="${size * 0.5}"
               preserveAspectRatio="xMidYMid meet"
               filter="url(#shadow)"/>
        
        <!-- Count badge background -->
        <circle cx="${size * 0.5}" cy="${size * 0.15}" r="${size * 0.12}"
                fill="#FFFFFF" stroke="#8B5A3C" stroke-width="2"/>
        
        <!-- Inner badge circle -->
        <circle cx="${size * 0.5}" cy="${size * 0.15}" r="${size * 0.08}"
                fill="#FFFFFF" opacity="0.9"/>
        
        <!-- Cluster count text -->
        <text x="${size * 0.5}" y="${size * 0.2}" text-anchor="middle"
              fill="#8B5A3C" font-family="Arial, sans-serif" 
              font-size="${Math.max(8, size * 0.2)}" font-weight="bold">${markerCount}</text>
      </svg>
    `;

    const dataUri = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`;
    
    console.log(`🚗 Generated car icon data URI with uploaded image, length: ${dataUri.length}`);

    return {
      url: dataUri,
      scaledSize: new google.maps.Size(size, size),
      anchor: new google.maps.Point(size/2, size * 0.8)
    };
  }
}
