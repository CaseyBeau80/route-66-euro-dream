
import React, { useEffect, useRef, useState } from 'react';
import { createVintageRoute66Icon } from './VintageRoute66Icon';
import { HiddenGem } from './types';

interface HiddenGemCustomMarkerProps {
  gem: HiddenGem;
  isActive: boolean;
  onMarkerClick: (gem: HiddenGem) => void;
  onWebsiteClick: (website: string) => void;
  map: google.maps.Map;
}

const HiddenGemCustomMarker: React.FC<HiddenGemCustomMarkerProps> = ({
  gem,
  isActive,
  onMarkerClick,
  onWebsiteClick,
  map
}) => {
  const markerRef = useRef<google.maps.Marker | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const customOverlayRef = useRef<google.maps.OverlayView | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!map) return;

    // Create the marker
    const marker = new google.maps.Marker({
      position: { lat: Number(gem.latitude), lng: Number(gem.longitude) },
      map: map,
      icon: createVintageRoute66Icon(),
      title: `Hidden Gem: ${gem.title}`,
      zIndex: 1000
    });

    markerRef.current = marker;

    // Create overlay element for hover detection with larger area
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.width = '40px';
    overlay.style.height = '40px';
    overlay.style.cursor = 'pointer';
    overlay.style.zIndex = '999999';
    overlay.style.backgroundColor = 'transparent';
    overlay.style.borderRadius = '50%';
    overlayRef.current = overlay;

    // Custom overlay class with improved positioning
    class CustomOverlay extends google.maps.OverlayView {
      private div: HTMLDivElement;
      private position: google.maps.LatLng;

      constructor(position: google.maps.LatLng, div: HTMLDivElement) {
        super();
        this.position = position;
        this.div = div;
      }

      onAdd() {
        const panes = this.getPanes();
        if (panes) {
          panes.overlayMouseTarget.appendChild(this.div);
        }
      }

      draw() {
        const overlayProjection = this.getProjection();
        if (overlayProjection) {
          const point = overlayProjection.fromLatLngToDivPixel(this.position);
          if (point && this.div) {
            this.div.style.left = (point.x - 20) + 'px';
            this.div.style.top = (point.y - 20) + 'px';
            
            // Update hover card position
            setHoverPosition({ x: point.x, y: point.y });
          }
        }
      }

      onRemove() {
        if (this.div && this.div.parentNode) {
          this.div.parentNode.removeChild(this.div);
        }
      }
    }

    const customOverlay = new CustomOverlay(
      new google.maps.LatLng(Number(gem.latitude), Number(gem.longitude)),
      overlay
    );

    customOverlay.setMap(map);
    customOverlayRef.current = customOverlay;

    // Enhanced event listeners with debouncing
    const handleMouseEnter = () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      console.log(`🎯 Hover started for gem: ${gem.title}`);
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      hoverTimeoutRef.current = setTimeout(() => {
        console.log(`🎯 Hover ended for gem: ${gem.title}`);
        setIsHovered(false);
      }, 150); // Small delay to prevent flickering
    };

    const handleClick = () => {
      console.log(`🎯 Clicked gem: ${gem.title}`);
      onMarkerClick(gem);
    };

    overlay.addEventListener('mouseenter', handleMouseEnter);
    overlay.addEventListener('mouseleave', handleMouseLeave);
    overlay.addEventListener('click', handleClick);
    marker.addListener('click', handleClick);

    // Update overlay position when map changes
    const updatePosition = () => {
      if (customOverlay) {
        customOverlay.draw();
      }
    };

    map.addListener('zoom_changed', updatePosition);
    map.addListener('bounds_changed', updatePosition);

    // Cleanup function
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      if (customOverlayRef.current) {
        customOverlayRef.current.setMap(null);
      }
      overlay.removeEventListener('mouseenter', handleMouseEnter);
      overlay.removeEventListener('mouseleave', handleMouseLeave);
      overlay.removeEventListener('click', handleClick);
      map.removeListener('zoom_changed', updatePosition);
      map.removeListener('bounds_changed', updatePosition);
    };
  }, [gem, map, onMarkerClick]);

  console.log(`Rendering custom gem marker: ${gem.title} at ${gem.latitude}, ${gem.longitude}, hovered: ${isHovered}`);

  return (
    <>
      {isHovered && (
        <div 
          className="fixed pointer-events-none transition-all duration-200 ease-out"
          style={{
            left: `${hoverPosition.x}px`,
            top: `${hoverPosition.y - 180}px`,
            transform: 'translateX(-50%)',
            zIndex: 999999,
            opacity: isHovered ? 1 : 0,
          }}
        >
          <div className="w-80 max-w-[90vw] bg-white border-2 border-blue-600 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center border border-white shadow-sm">
                    <span className="text-xs font-black text-white">★</span>
                  </div>
                  <span className="text-sm font-bold tracking-wide uppercase">Hidden Gem</span>
                </div>
                <div className="text-xs font-bold bg-white text-blue-600 px-2 py-1 rounded transform -rotate-2 shadow-sm">
                  ROUTE 66
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="p-4 bg-white">
              {/* Title Section */}
              <div className="mb-3 text-center">
                <h3 className="font-black text-lg text-blue-600 leading-tight uppercase tracking-wide border-b-2 border-red-600 pb-2 mb-2 break-words">
                  {gem.title}
                </h3>
                <div className="flex items-center justify-center gap-2 text-gray-700">
                  <span className="text-sm font-bold uppercase tracking-wide">{gem.city_name}</span>
                </div>
              </div>
              
              {/* Description */}
              {gem.description && (
                <div className="mb-4 p-3 bg-gray-50 border border-dashed border-blue-600 rounded">
                  <p className="text-sm text-gray-800 leading-relaxed font-medium text-left break-words">
                    {gem.description.length > 150 
                      ? `${gem.description.substring(0, 150)}...` 
                      : gem.description
                    }
                  </p>
                </div>
              )}
              
              {/* Website Button */}
              {gem.website && (
                <div className="text-center mb-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onWebsiteClick(gem.website!);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-bold text-sm rounded-full border border-blue-600 hover:bg-red-700 transition-all duration-200 shadow transform hover:scale-105 uppercase tracking-wide pointer-events-auto"
                  >
                    Visit Website
                  </button>
                </div>
              )}
              
              {/* Bottom Banner */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-3 py-2 -mx-4 -mb-4 text-center rounded-b-lg">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center border border-white">
                    <span className="text-xs font-black text-white">66</span>
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wider">
                    America's Main Street
                  </span>
                  <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center border border-white">
                    <span className="text-xs font-black text-white">66</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HiddenGemCustomMarker;
