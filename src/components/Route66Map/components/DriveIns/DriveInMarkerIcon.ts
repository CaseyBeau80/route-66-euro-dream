
export const getDriveInMarkerIcon = (status?: string): google.maps.Icon => {
  const isActive = status === 'active' || status === 'open';
  const iconColor = isActive ? '#FF4444' : '#888888'; // Red for active, gray for closed
  const wheelColor = isActive ? '#333333' : '#666666';
  
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="28" viewBox="0 0 32 28">
        <defs>
          <filter id="driveInShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
          </filter>
          <linearGradient id="carBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${iconColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${isActive ? '#cc2222' : '#555555'};stop-opacity:1" />
          </linearGradient>
          <radialGradient id="wheelGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
            <stop offset="70%" style="stop-color:${wheelColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
          </radialGradient>
        </defs>
        
        <!-- Main circle background -->
        <circle cx="16" cy="14" r="13" fill="#FFFFFF" stroke="${iconColor}" stroke-width="2" filter="url(#driveInShadow)"/>
        
        <!-- Classic 1950s convertible car body -->
        <path d="M6 18 L6 16 C6 15 7 14 8 14 L9 14 C9.5 13 10.5 12 12 12 L20 12 C21.5 12 22.5 13 23 14 L24 14 C25 14 26 15 26 16 L26 18 L25 18 L25 19 C25 19.5 24.5 20 24 20 L23 20 C22.5 20 22 19.5 22 19 L22 18 L10 18 L10 19 C10 19.5 9.5 20 9 20 L8 20 C7.5 20 7 19.5 7 19 L7 18 L6 18 Z" 
              fill="url(#carBodyGradient)" 
              stroke="#ffffff" 
              stroke-width="0.8"/>
        
        <!-- Classic convertible windshield -->
        <path d="M9.5 14 L11 12.5 L21 12.5 L22.5 14" 
              stroke="#87ceeb" 
              stroke-width="1.5" 
              fill="none" 
              opacity="0.7"/>
        
        <!-- Chrome bumper -->
        <rect x="5" y="17" width="22" height="1.5" 
              fill="#e6e6e6" 
              stroke="#cccccc" 
              stroke-width="0.3"/>
        
        <!-- Front wheel -->
        <circle cx="9.5" cy="18.5" r="2.2" 
                fill="url(#wheelGradient)" 
                stroke="${wheelColor}" 
                stroke-width="0.5"/>
        <circle cx="9.5" cy="18.5" r="0.9" 
                fill="#ffffff"/>
        
        <!-- Rear wheel -->
        <circle cx="22.5" cy="18.5" r="2.2" 
                fill="url(#wheelGradient)" 
                stroke="${wheelColor}" 
                stroke-width="0.5"/>
        <circle cx="22.5" cy="18.5" r="0.9" 
                fill="#ffffff"/>
        
        <!-- Classic chrome details -->
        <circle cx="7" cy="15.5" r="0.4" fill="#ffffff" opacity="0.9"/>
        <circle cx="25" cy="15.5" r="0.4" fill="#ffffff" opacity="0.9"/>
        
        <!-- Side chrome line -->
        <line x1="8" y1="15.5" x2="24" y2="15.5" 
              stroke="#ffffff" 
              stroke-width="0.3" 
              opacity="0.6"/>
        
        <!-- Status indicator -->
        <circle cx="26" cy="6" r="3" fill="${isActive ? '#00FF00' : '#FF0000'}" stroke="#FFFFFF" stroke-width="1"/>
        
        <!-- Drive-in text label -->
        <text x="16" y="25" text-anchor="middle" fill="${iconColor}" font-family="Arial" font-size="5" font-weight="bold">DRIVE-IN</text>
      </svg>
    `)}`,
    scaledSize: new google.maps.Size(32, 28),
    anchor: new google.maps.Point(16, 14)
  };
};

export const getDriveInMarkerTitle = (driveIn: any): string => {
  const statusText = driveIn.status === 'active' ? 'Open' : 'Closed';
  return `🚗 ${driveIn.name} - ${statusText} Drive-In Theater\n📍 ${driveIn.city_name}, ${driveIn.state}`;
};

export const getDriveInMarkerZIndex = (status?: string): number => {
  // Active drive-ins get higher z-index for better visibility
  return status === 'active' ? 1500 : 1400;
};
