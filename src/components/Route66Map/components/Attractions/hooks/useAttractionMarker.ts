
import { useRef, useMemo } from 'react';
import { Attraction } from '../types';

export const useAttractionMarker = (attraction: Attraction) => {
  const markerRef = useRef<google.maps.Marker | null>(null);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);

  // Memoize marker properties to prevent unnecessary recreations
  const markerConfig = useMemo(() => {
    const isDriveIn = attraction.name.toLowerCase().includes('drive-in');
    
    if (isDriveIn) {
      // Nostalgic drive-in theater icon inspired by vintage aesthetic
      const iconSize = 32;
      const driveInSvgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconSize} ${iconSize}">
          <!-- Vintage background circle -->
          <circle cx="16" cy="16" r="15" 
                  fill="#2c1810" 
                  stroke="#d4af37" 
                  stroke-width="2"/>
          
          <!-- Inner vintage border -->
          <circle cx="16" cy="16" r="12" 
                  fill="none" 
                  stroke="#8b4513" 
                  stroke-width="1"/>
          
          <!-- Drive-in screen -->
          <rect x="8" y="10" width="16" height="10" 
                fill="#1a1a1a" 
                stroke="#d4af37" 
                stroke-width="1.5" 
                rx="1"/>
          
          <!-- Screen glow effect -->
          <rect x="9" y="11" width="14" height="8" 
                fill="#87ceeb" 
                opacity="0.3" 
                rx="0.5"/>
          
          <!-- Vintage car silhouettes -->
          <rect x="5" y="21" width="4" height="2" 
                fill="#8b4513" 
                rx="1"/>
          <rect x="11" y="21" width="4" height="2" 
                fill="#8b4513" 
                rx="1"/>
          <rect x="17" y="21" width="4" height="2" 
                fill="#8b4513" 
                rx="1"/>
          <rect x="23" y="21" width="4" height="2" 
                fill="#8b4513" 
                rx="1"/>
          
          <!-- Speaker posts -->
          <line x1="6" y1="20" x2="6" y2="17" 
                stroke="#d4af37" 
                stroke-width="1"/>
          <line x1="26" y1="20" x2="26" y2="17" 
                stroke="#d4af37" 
                stroke-width="1"/>
          
          <!-- Vintage movie reel symbol in center -->
          <circle cx="16" cy="14" r="3" 
                  fill="none" 
                  stroke="#d4af37" 
                  stroke-width="1"/>
          <circle cx="16" cy="14" r="1" 
                  fill="#d4af37"/>
          <circle cx="13.5" cy="11.5" r="0.8" 
                  fill="none" 
                  stroke="#d4af37" 
                  stroke-width="0.5"/>
          <circle cx="18.5" cy="11.5" r="0.8" 
                  fill="none" 
                  stroke="#d4af37" 
                  stroke-width="0.5"/>
          <circle cx="13.5" cy="16.5" r="0.8" 
                  fill="none" 
                  stroke="#d4af37" 
                  stroke-width="0.5"/>
          <circle cx="18.5" cy="16.5" r="0.8" 
                  fill="none" 
                  stroke="#d4af37" 
                  stroke-width="0.5"/>
        </svg>
      `;

      return {
        position: { lat: attraction.latitude, lng: attraction.longitude },
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(driveInSvgContent)}`,
          scaledSize: new google.maps.Size(iconSize, iconSize),
          anchor: new google.maps.Point(iconSize/2, iconSize/2)
        },
        title: `${attraction.name} - ${attraction.state} (Drive-In Theater)`,
        zIndex: 30000, // Higher zIndex to prevent overlapping
        optimized: false,
        isDriveIn: true
      };
    } else {
      // Regular attraction icon with adjusted zIndex
      const iconSize = 16;
      const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconSize} ${iconSize}">
          <circle cx="8" cy="8" r="7" 
                  fill="#FEF3C7" 
                  stroke="#DC2626" 
                  stroke-width="2"/>
          <circle cx="8" cy="8" r="4" 
                  fill="#DC2626" 
                  opacity="0.9"/>
        </svg>
      `;

      return {
        position: { lat: attraction.latitude, lng: attraction.longitude },
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgContent)}`,
          scaledSize: new google.maps.Size(iconSize, iconSize),
          anchor: new google.maps.Point(iconSize/2, iconSize/2)
        },
        title: `${attraction.name} - ${attraction.state}`,
        zIndex: 25000, // Lower than drive-ins but still high
        optimized: false,
        isDriveIn: false
      };
    }
  }, [attraction.latitude, attraction.longitude, attraction.name, attraction.state]);

  return {
    markerRef,
    listenersRef,
    markerConfig
  };
};
