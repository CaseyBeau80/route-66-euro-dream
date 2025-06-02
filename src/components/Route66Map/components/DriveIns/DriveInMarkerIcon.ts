
export const getDriveInMarkerIcon = (status?: string): google.maps.Icon => {
  const isActive = status === 'active' || status === 'open';
  const iconColor = isActive ? '#FF4444' : '#888888'; // Red for active, gray for closed
  const screenColor = isActive ? '#FFFFFF' : '#CCCCCC';
  
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
        <defs>
          <filter id="driveInShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
          </filter>
        </defs>
        
        <!-- Main circle background -->
        <circle cx="14" cy="14" r="12" fill="${iconColor}" stroke="#FFFFFF" stroke-width="2" filter="url(#driveInShadow)"/>
        
        <!-- Drive-in screen -->
        <rect x="6" y="8" width="16" height="10" rx="1" fill="${screenColor}" stroke="#333333" stroke-width="0.5"/>
        <rect x="7" y="9" width="14" height="8" fill="#000000"/>
        
        <!-- Movie projector beam effect -->
        <path d="M 4 14 L 7 11 L 7 17 Z" fill="#FFFF00" opacity="0.6"/>
        
        <!-- Film strip decoration -->
        <rect x="8" y="9.5" width="1" height="1" fill="${screenColor}"/>
        <rect x="10" y="9.5" width="1" height="1" fill="${screenColor}"/>
        <rect x="12" y="9.5" width="1" height="1" fill="${screenColor}"/>
        <rect x="8" y="15.5" width="1" height="1" fill="${screenColor}"/>
        <rect x="10" y="15.5" width="1" height="1" fill="${screenColor}"/>
        <rect x="12" y="15.5" width="1" height="1" fill="${screenColor}"/>
        
        <!-- Status indicator -->
        <circle cx="22" cy="6" r="3" fill="${isActive ? '#00FF00' : '#FF0000'}" stroke="#FFFFFF" stroke-width="1"/>
        
        <!-- Vintage cinema text -->
        <text x="14" y="25" text-anchor="middle" fill="#333333" font-family="Arial" font-size="6" font-weight="bold">🎬</text>
      </svg>
    `)}`,
    scaledSize: new google.maps.Size(28, 28),
    anchor: new google.maps.Point(14, 14)
  };
};

export const getDriveInMarkerTitle = (driveIn: any): string => {
  const statusText = driveIn.status === 'active' ? 'Open' : 'Closed';
  return `🎬 ${driveIn.name} - ${statusText} Drive-In Theater\n📍 ${driveIn.city_name}, ${driveIn.state}`;
};

export const getDriveInMarkerZIndex = (status?: string): number => {
  // Active drive-ins get higher z-index for better visibility
  return status === 'active' ? 1500 : 1400;
};
