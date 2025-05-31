
import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Star, MapPin, ExternalLink } from 'lucide-react';
import { HiddenGem } from './types';

interface HiddenGemCustomOverlayProps {
  gem: HiddenGem;
  map: google.maps.Map;
  onClose: () => void;
  onWebsiteClick: (website: string) => void;
}

const HiddenGemCustomOverlay: React.FC<HiddenGemCustomOverlayProps> = ({
  gem,
  map,
  onClose,
  onWebsiteClick
}) => {
  const overlayRef = useRef<any>(null);
  const rootRef = useRef<any>(null);

  useEffect(() => {
    // Check if Google Maps API is loaded
    if (!window.google || !window.google.maps) {
      console.error('Google Maps API not loaded');
      return;
    }

    console.log(`🎯 Creating custom overlay for ${gem.title} at ${gem.latitude}, ${gem.longitude}`);
    
    // Define the CustomOverlay class inside the useEffect to ensure google is available
    class CustomOverlay extends google.maps.OverlayView {
      private position: google.maps.LatLng;
      private container: HTMLDivElement | null = null;

      constructor(position: google.maps.LatLng) {
        super();
        this.position = position;
      }

      onAdd() {
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';
        this.container.style.zIndex = '9999';
        
        const panes = this.getPanes();
        if (panes) {
          panes.overlayMouseTarget.appendChild(this.container);
          
          // Create React root and render content
          if (this.container) {
            rootRef.current = createRoot(this.container);
            rootRef.current.render(
              <div 
                className="vintage-roadside-sign w-[350px] max-w-[90vw] bg-white border-2 border-route66-blue rounded-lg shadow-lg overflow-hidden"
              >
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-2 right-2 w-6 h-6 bg-route66-red text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors z-10"
                  style={{ fontSize: '12px', fontWeight: 'bold' }}
                >
                  ×
                </button>

                {/* Header Banner */}
                <div className="bg-gradient-to-r from-route66-blue to-blue-800 text-white px-4 py-2 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-route66-red rounded-full flex items-center justify-center border border-white shadow-sm">
                        <Star className="h-2.5 w-2.5 text-white" fill="currentColor" />
                      </div>
                      <span className="text-sm font-bold tracking-wide uppercase">Hidden Gem</span>
                    </div>
                    <div className="text-xs font-bold bg-white text-route66-blue px-2 py-1 rounded transform -rotate-2 shadow-sm">
                      ROUTE 66
                    </div>
                  </div>
                </div>
                
                {/* Main Content */}
                <div className="p-4 bg-white">
                  {/* Title Section */}
                  <div className="mb-3 text-center">
                    <h3 className="font-black text-lg text-route66-blue leading-tight uppercase tracking-wide border-b-2 border-route66-red pb-2 mb-2 break-words">
                      {gem.title}
                    </h3>
                    <div className="flex items-center justify-center gap-2 text-gray-700">
                      <MapPin className="h-4 w-4 text-route66-red flex-shrink-0" />
                      <span className="text-sm font-bold uppercase tracking-wide">{gem.city_name}</span>
                    </div>
                  </div>
                  
                  {/* Description */}
                  {gem.description && (
                    <div className="mb-4 p-3 bg-gray-50 border border-dashed border-route66-blue rounded">
                      <p className="text-sm text-gray-800 leading-relaxed font-medium text-left break-words">
                        {gem.description}
                      </p>
                    </div>
                  )}
                  
                  {/* Website Button */}
                  {gem.website && (
                    <div className="text-center mb-2">
                      <button
                        onClick={() => onWebsiteClick(gem.website!)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-route66-red text-white font-bold text-sm rounded-full border border-route66-blue hover:bg-red-700 transition-all duration-200 shadow transform hover:scale-105 uppercase tracking-wide"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Visit Website
                      </button>
                    </div>
                  )}
                  
                  {/* Bottom Banner */}
                  <div className="bg-gradient-to-r from-route66-blue to-blue-800 text-white px-3 py-2 -mx-4 -mb-4 text-center rounded-b-lg">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 bg-route66-red rounded-full flex items-center justify-center border border-white">
                        <span className="text-xs font-black text-white">66</span>
                      </div>
                      <span className="text-sm font-bold uppercase tracking-wider">
                        America's Main Street
                      </span>
                      <div className="w-4 h-4 bg-route66-red rounded-full flex items-center justify-center border border-white">
                        <span className="text-xs font-black text-white">66</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Custom styles */}
                <style>
                  {`
                    .vintage-roadside-sign {
                      font-family: 'Arial Black', Arial, sans-serif;
                    }
                  `}
                </style>
              </div>
            );
          }
        }
      }

      draw() {
        if (!this.container) return;

        const projection = this.getProjection();
        const point = projection.fromLatLngToDivPixel(this.position);

        if (point) {
          this.container.style.left = point.x + 'px';
          this.container.style.top = (point.y - 120) + 'px'; // Position higher above the marker to accommodate larger size
          this.container.style.transform = 'translateX(-50%)'; // Center horizontally
        }
      }

      onRemove() {
        if (rootRef.current) {
          rootRef.current.unmount();
          rootRef.current = null;
        }
        if (this.container && this.container.parentNode) {
          this.container.parentNode.removeChild(this.container);
          this.container = null;
        }
      }

      getContainer() {
        return this.container;
      }
    }

    const position = new google.maps.LatLng(Number(gem.latitude), Number(gem.longitude));
    overlayRef.current = new CustomOverlay(position);
    overlayRef.current.setMap(map);

    return () => {
      if (overlayRef.current) {
        overlayRef.current.setMap(null);
        overlayRef.current = null;
      }
      if (rootRef.current) {
        rootRef.current.unmount();
        rootRef.current = null;
      }
    };
  }, [gem, map, onClose, onWebsiteClick]);

  return null; // This component doesn't render anything directly
};

export default HiddenGemCustomOverlay;
