
export class CustomOverlay {
  private div: HTMLDivElement;
  private position: google.maps.LatLng;
  private onPositionUpdate: (x: number, y: number) => void;
  private overlay: google.maps.OverlayView;
  private lastValidPosition: { x: number; y: number } | null = null;

  constructor(
    position: google.maps.LatLng, 
    div: HTMLDivElement,
    onPositionUpdate: (x: number, y: number) => void
  ) {
    this.position = position;
    this.div = div;
    this.onPositionUpdate = onPositionUpdate;
    
    // Create the overlay instance with improved coordinate transformation
    this.overlay = new (class extends google.maps.OverlayView {
      private customOverlay: CustomOverlay;
      
      constructor(customOverlay: CustomOverlay) {
        super();
        this.customOverlay = customOverlay;
      }
      
      onAdd() {
        const panes = this.getPanes();
        if (panes) {
          panes.overlayMouseTarget.appendChild(this.customOverlay.div);
        }
      }

      draw() {
        const overlayProjection = this.getProjection();
        if (overlayProjection) {
          const point = overlayProjection.fromLatLngToDivPixel(this.customOverlay.position);
          if (point && this.customOverlay.div) {
            // Improved coordinate transformation with validation
            const x = Math.round(point.x);
            const y = Math.round(point.y);
            
            // Validate coordinates are within reasonable bounds
            const viewport = {
              width: window.innerWidth,
              height: window.innerHeight
            };
            
            const isValidPosition = x >= -100 && x <= viewport.width + 100 && 
                                  y >= -100 && y <= viewport.height + 100;
            
            if (isValidPosition) {
              this.customOverlay.div.style.left = (x - 20) + 'px';
              this.customOverlay.div.style.top = (y - 20) + 'px';
              
              // Calculate hover position with better offset
              const hoverX = x + 15;
              const hoverY = y - 15;
              
              // Only update if position changed significantly (debouncing at coordinate level)
              if (!this.customOverlay.lastValidPosition || 
                  Math.abs(hoverX - this.customOverlay.lastValidPosition.x) > 5 ||
                  Math.abs(hoverY - this.customOverlay.lastValidPosition.y) > 5) {
                
                this.customOverlay.lastValidPosition = { x: hoverX, y: hoverY };
                this.customOverlay.onPositionUpdate(hoverX, hoverY);
                
                console.log(`📍 Updated coordinate transformation for marker:`, { x: hoverX, y: hoverY });
              }
            } else {
              console.warn(`⚠️ Invalid coordinates detected:`, { x, y, viewport });
            }
          }
        }
      }

      onRemove() {
        if (this.customOverlay.div && this.customOverlay.div.parentNode) {
          this.customOverlay.div.parentNode.removeChild(this.customOverlay.div);
        }
      }
    })(this);
  }

  setMap(map: google.maps.Map | null) {
    this.overlay.setMap(map);
  }

  draw() {
    if (this.overlay) {
      (this.overlay as any).draw();
    }
  }
}
