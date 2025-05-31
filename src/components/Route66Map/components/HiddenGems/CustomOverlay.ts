
export class CustomOverlay extends google.maps.OverlayView {
  private div: HTMLDivElement;
  private position: google.maps.LatLng;
  private onPositionUpdate: (x: number, y: number) => void;

  constructor(
    position: google.maps.LatLng, 
    div: HTMLDivElement,
    onPositionUpdate: (x: number, y: number) => void
  ) {
    super();
    this.position = position;
    this.div = div;
    this.onPositionUpdate = onPositionUpdate;
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
        this.onPositionUpdate(point.x, point.y);
      }
    }
  }

  onRemove() {
    if (this.div && this.div.parentNode) {
      this.div.parentNode.removeChild(this.div);
    }
  }
}
