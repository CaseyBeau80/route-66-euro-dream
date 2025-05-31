
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Star, MapPin, ExternalLink } from 'lucide-react';
import { HiddenGem } from './types';

interface HiddenGemCustomOverlayProps {
  gem: HiddenGem;
  map: google.maps.Map;
  onClose: () => void;
  onWebsiteClick: (website: string) => void;
}

class CustomOverlay extends google.maps.OverlayView {
  private position: google.maps.LatLng;
  private container: HTMLDivElement | null = null;
  private content: React.ReactNode;

  constructor(position: google.maps.LatLng, content: React.ReactNode) {
    super();
    this.position = position;
    this.content = content;
  }

  onAdd() {
    this.container = document.createElement('div');
    this.container.style.position = 'absolute';
    this.container.style.zIndex = '9999';
    
    const panes = this.getPanes();
    if (panes) {
      panes.overlayMouseTarget.appendChild(this.container);
    }
  }

  draw() {
    if (!this.container) return;

    const projection = this.getProjection();
    const point = projection.fromLatLngToDivPixel(this.position);

    if (point) {
      this.container.style.left = point.x + 'px';
      this.container.style.top = (point.y - 80) + 'px'; // Position 80px above the marker
      this.container.style.transform = 'translateX(-50%)'; // Center horizontally
    }
  }

  onRemove() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    }
  }

  getContainer() {
    return this.container;
  }
}

const HiddenGemCustomOverlay: React.FC<HiddenGemCustomOverlayProps> = ({
  gem,
  map,
  onClose,
  onWebsiteClick
}) => {
  const overlayRef = useRef<CustomOverlay | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(`🎯 Creating custom overlay for ${gem.title} at ${gem.latitude}, ${gem.longitude}`);
    
    const position = new google.maps.LatLng(Number(gem.latitude), Number(gem.longitude));
    
    const overlayContent = (
      <div 
        ref={contentRef}
        className="vintage-roadside-sign w-[270px] max-w-[85vw] bg-white border-2 border-route66-blue rounded-lg shadow-lg overflow-hidden"
        style={{
          maxHeight: '50vh',
          overflowY: 'auto'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-6 h-6 bg-route66-red text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors z-10"
          style={{ fontSize: '12px', fontWeight: 'bold' }}
        >
          ×
        </button>

        {/* Compact Header Banner */}
        <div className="bg-gradient-to-r from-route66-blue to-blue-800 text-white px-3 py-1.5 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-route66-red rounded-full flex items-center justify-center border border-white shadow-sm">
                <Star className="h-2 w-2 text-white" fill="currentColor" />
              </div>
              <span className="text-xs font-bold tracking-wide uppercase">Hidden Gem</span>
            </div>
            <div className="text-xs font-bold bg-white text-route66-blue px-1.5 py-0.5 rounded transform -rotate-2 shadow-sm">
              ROUTE 66
            </div>
          </div>
        </div>
        
        {/* Compact Main Content */}
        <div className="p-2.5 bg-white">
          {/* Title Section */}
          <div className="mb-2 text-center">
            <h3 className="font-black text-sm text-route66-blue leading-tight uppercase tracking-wide border-b-2 border-route66-red pb-1 mb-1.5 break-words">
              {gem.title}
            </h3>
            <div className="flex items-center justify-center gap-1.5 text-gray-700">
              <MapPin className="h-3 w-3 text-route66-red flex-shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wide">{gem.city_name}</span>
            </div>
          </div>
          
          {/* Compact Description */}
          {gem.description && (
            <div className="mb-2 p-2 bg-gray-50 border border-dashed border-route66-blue rounded max-h-20 overflow-y-auto">
              <p className="text-xs text-gray-800 leading-relaxed font-medium text-left break-words">
                {gem.description}
              </p>
            </div>
          )}
          
          {/* Compact Website Button */}
          {gem.website && (
            <div className="text-center mb-1">
              <button
                onClick={() => onWebsiteClick(gem.website!)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-route66-red text-white font-bold text-xs rounded-full border border-route66-blue hover:bg-red-700 transition-all duration-200 shadow transform hover:scale-105 uppercase tracking-wide"
              >
                <ExternalLink className="h-2.5 w-2.5" />
                Visit Website
              </button>
            </div>
          )}
          
          {/* Compact Bottom Banner */}
          <div className="bg-gradient-to-r from-route66-blue to-blue-800 text-white px-2 py-1.5 -mx-2.5 -mb-2.5 text-center rounded-b-lg">
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-3 h-3 bg-route66-red rounded-full flex items-center justify-center border border-white">
                <span className="text-xs font-black text-white">66</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">
                America's Main Street
              </span>
              <div className="w-3 h-3 bg-route66-red rounded-full flex items-center justify-center border border-white">
                <span className="text-xs font-black text-white">66</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Custom scrollbar styles */}
        <style>
          {`
            .vintage-roadside-sign {
              font-family: 'Arial Black', Arial, sans-serif;
            }
            
            .vintage-roadside-sign::-webkit-scrollbar {
              width: 4px;
            }
            
            .vintage-roadside-sign::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 2px;
            }
            
            .vintage-roadside-sign::-webkit-scrollbar-thumb {
              background: #1E3A5F;
              border-radius: 2px;
            }
            
            .vintage-roadside-sign::-webkit-scrollbar-thumb:hover {
              background: #2C5F41;
            }
          `}
        </style>
      </div>
    );

    overlayRef.current = new CustomOverlay(position, overlayContent);
    overlayRef.current.setMap(map);

    return () => {
      if (overlayRef.current) {
        overlayRef.current.setMap(null);
        overlayRef.current = null;
      }
    };
  }, [gem, map, onClose, onWebsiteClick]);

  // Render the content into the overlay container once it's created
  useEffect(() => {
    if (overlayRef.current) {
      const container = overlayRef.current.getContainer();
      if (container && contentRef.current) {
        // The content is already rendered in the overlay
      }
    }
  }, []);

  return null; // This component doesn't render anything directly
};

export default HiddenGemCustomOverlay;
