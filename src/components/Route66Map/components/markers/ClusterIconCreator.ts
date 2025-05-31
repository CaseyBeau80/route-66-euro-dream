
export class ClusterIconCreator {
  static createClusterIcon(markers: Array<{ type: string; data: any }>): google.maps.Icon {
    const count = markers.length;
    const size = Math.min(50 + (count * 3), 80); // Larger cluster icons to accommodate detail
    
    // Determine cluster type based on majority marker type
    const typeCounts = markers.reduce((acc, marker) => {
      acc[marker.type] = (acc[marker.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const dominantType = Object.entries(typeCounts).reduce((a, b) => 
      typeCounts[a[0]] > typeCounts[b[0]] ? a : b
    )[0];

    // Create a detailed cluster icon that hints at the content
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <defs>
          <filter id="clusterShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="3" stdDeviation="2" flood-color="#000000" flood-opacity="0.4"/>
          </filter>
          
          <!-- Vintage paper texture -->
          <radialGradient id="vintagePaper" cx="40%" cy="30%" r="70%">
            <stop offset="0%" style="stop-color:#FFF8DC;stop-opacity:1" />
            <stop offset="60%" style="stop-color:#F5F5DC;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#DEB887;stop-opacity:1" />
          </radialGradient>
          
          <!-- Route 66 shield shape for cluster -->
          <radialGradient id="shieldGradient" cx="50%" cy="40%" r="60%">
            <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.9" />
            <stop offset="50%" style="stop-color:#F8F6F0;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#E6E4DE;stop-opacity:0.7" />
          </radialGradient>
        </defs>
        
        <!-- Outer Route 66 shield shape -->
        <path d="M${size/2} ${size * 0.1}
                 L${size * 0.25} ${size * 0.1}
                 C${size * 0.15} ${size * 0.1} ${size * 0.1} ${size * 0.2} ${size * 0.1} ${size * 0.3}
                 L${size * 0.1} ${size * 0.55}
                 C${size * 0.1} ${size * 0.75} ${size * 0.2} ${size * 0.85} ${size * 0.35} ${size * 0.9}
                 C${size * 0.42} ${size * 0.92} ${size * 0.48} ${size * 0.93} ${size/2} ${size * 0.93}
                 C${size * 0.52} ${size * 0.93} ${size * 0.58} ${size * 0.92} ${size * 0.65} ${size * 0.9}
                 C${size * 0.8} ${size * 0.85} ${size * 0.9} ${size * 0.75} ${size * 0.9} ${size * 0.55}
                 L${size * 0.9} ${size * 0.3}
                 C${size * 0.9} ${size * 0.2} ${size * 0.85} ${size * 0.1} ${size * 0.75} ${size * 0.1}
                 L${size/2} ${size * 0.1} Z" 
              fill="url(#vintagePaper)" 
              stroke="#8B4513" 
              stroke-width="3"
              filter="url(#clusterShadow)"/>
        
        <!-- Inner highlight -->
        <path d="M${size/2} ${size * 0.15}
                 L${size * 0.3} ${size * 0.15}
                 C${size * 0.22} ${size * 0.15} ${size * 0.17} ${size * 0.22} ${size * 0.17} ${size * 0.3}
                 L${size * 0.17} ${size * 0.5}
                 C${size * 0.17} ${size * 0.65} ${size * 0.25} ${size * 0.75} ${size * 0.37} ${size * 0.8}
                 C${size * 0.43} ${size * 0.82} ${size * 0.47} ${size * 0.83} ${size/2} ${size * 0.83}
                 C${size * 0.53} ${size * 0.83} ${size * 0.57} ${size * 0.82} ${size * 0.63} ${size * 0.8}
                 C${size * 0.75} ${size * 0.75} ${size * 0.83} ${size * 0.65} ${size * 0.83} ${size * 0.5}
                 L${size * 0.83} ${size * 0.3}
                 C${size * 0.83} ${size * 0.22} ${size * 0.78} ${size * 0.15} ${size * 0.7} ${size * 0.15}
                 L${size/2} ${size * 0.15} Z" 
              fill="url(#shieldGradient)" 
              stroke="#654321" 
              stroke-width="1"/>
        
        <!-- Count number -->
        <text x="${size/2}" y="${size * 0.45}" text-anchor="middle" 
              fill="#654321" 
              font-family="Arial, sans-serif" 
              font-size="${Math.max(size/6, 12)}" 
              font-weight="bold">${count}</text>
        
        <!-- Small "ITEMS" text -->
        <text x="${size/2}" y="${size * 0.6}" text-anchor="middle" 
              fill="#8B4513" 
              font-family="Arial, sans-serif" 
              font-size="${Math.max(size/12, 6)}" 
              font-weight="bold">ITEMS</text>
        
        <!-- Route 66 indicator at bottom -->
        <text x="${size/2}" y="${size * 0.75}" text-anchor="middle" 
              fill="#654321" 
              font-family="Arial, sans-serif" 
              font-size="${Math.max(size/10, 8)}" 
              font-weight="900">66</text>
        
        <!-- Type indicator dots -->
        <circle cx="${size * 0.7}" cy="${size * 0.25}" r="3" 
                fill="${dominantType === 'gem' ? '#8B5CF6' : dominantType === 'destination' ? '#3B82F6' : '#EF4444'}" 
                opacity="0.8"/>
      </svg>
    `;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`,
      scaledSize: new google.maps.Size(size, size),
      anchor: new google.maps.Point(size/2, size * 0.9)
    };
  }
}
