
export class CustomOverlay {
  private div: HTMLDivElement;
  private position: google.maps.LatLng;
  private onPositionUpdate: (x: number, y: number) => void;
  private overlay: google.maps.OverlayView;

  constructor(
    position: google.maps.LatLng, 
    div: HTMLDivElement,
    onPositionUpdate: (x: number, y: number) => void
  ) {
    this.position = position;
    this.div = div;
    this.onPositionUpdate = onPositionUpdate;
    
    // Create the overlay instance only when constructor is called
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
            // Ensure the point coordinates are valid
            const x = Math.max(0, Math.min(point.x, 2000)); // Clamp to reasonable bounds
            const y = Math.max(0, Math.min(point.y, 2000)); // Clamp to reasonable bounds
            
            this.customOverlay.div.style.left = (x - 20) + 'px';
            this.customOverlay.div.style.top = (y - 20) + 'px';
            
            // Use the clamped coordinates for hover positioning
            // Add a small offset for the hover card to appear near the cursor
            this.customOverlay.onPositionUpdate(x + 10, y - 10);
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
