
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
            this.customOverlay.div.style.left = (point.x - 20) + 'px';
            this.customOverlay.div.style.top = (point.y - 20) + 'px';
            
            // Update hover card position
            this.customOverlay.onPositionUpdate(point.x, point.y);
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
