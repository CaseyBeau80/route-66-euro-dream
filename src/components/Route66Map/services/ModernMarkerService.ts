/**
 * Modern Google Maps Marker Service
 * Uses the new AdvancedMarkerElement API to replace deprecated google.maps.Marker
 */

export interface MarkerConfig {
  position: google.maps.LatLng | google.maps.LatLngLiteral;
  map: google.maps.Map;
  title?: string;
  content?: HTMLElement;
  gmpClickable?: boolean;
  zIndex?: number;
}

export class ModernMarkerService {
  /**
   * Creates a modern marker using AdvancedMarkerElement
   */
  static createMarker(config: MarkerConfig): google.maps.marker.AdvancedMarkerElement {
    console.log('🔧 ModernMarkerService: Creating AdvancedMarkerElement');
    
    // Ensure we have the modern marker library
    if (!window.google?.maps?.marker?.AdvancedMarkerElement) {
      throw new Error('AdvancedMarkerElement not available. Please ensure the marker library is loaded.');
    }

    try {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: config.position,
        map: config.map,
        title: config.title,
        content: config.content,
        gmpClickable: config.gmpClickable ?? true,
        zIndex: config.zIndex
      });

      console.log('✅ ModernMarkerService: AdvancedMarkerElement created successfully');
      return marker;
    } catch (error) {
      console.error('❌ ModernMarkerService: Failed to create AdvancedMarkerElement:', error);
      throw error;
    }
  }

  /**
   * Creates a marker with custom icon
   */
  static createMarkerWithIcon(config: MarkerConfig & { iconElement: HTMLElement }): google.maps.marker.AdvancedMarkerElement {
    return this.createMarker({
      ...config,
      content: config.iconElement
    });
  }

  /**
   * Creates a text-based marker
   */
  static createTextMarker(config: MarkerConfig & { text: string, className?: string }): google.maps.marker.AdvancedMarkerElement {
    const textElement = document.createElement('div');
    textElement.textContent = config.text;
    if (config.className) {
      textElement.className = config.className;
    }

    return this.createMarker({
      ...config,
      content: textElement
    });
  }

  /**
   * Adds click event listener to marker
   */
  static addClickListener(
    marker: google.maps.marker.AdvancedMarkerElement, 
    callback: () => void
  ): google.maps.MapsEventListener {
    return marker.addListener('click', callback);
  }

  /**
   * Adds hover event listeners to marker
   */
  static addHoverListeners(
    marker: google.maps.marker.AdvancedMarkerElement,
    onMouseEnter: () => void,
    onMouseLeave: () => void
  ): google.maps.MapsEventListener[] {
    return [
      marker.addListener('gmp-click', onMouseEnter), // Use gmp-click for interaction
      marker.addListener('gmp-click', onMouseLeave)   // Advanced markers handle differently
    ];
  }

  /**
   * Sets marker position
   */
  static setPosition(marker: google.maps.marker.AdvancedMarkerElement, position: google.maps.LatLng | google.maps.LatLngLiteral): void {
    marker.position = position;
  }

  /**
   * Sets marker visibility
   */
  static setVisible(marker: google.maps.marker.AdvancedMarkerElement, visible: boolean): void {
    marker.map = visible ? marker.map : null;
  }

  /**
   * Removes marker from map
   */
  static removeMarker(marker: google.maps.marker.AdvancedMarkerElement): void {
    marker.map = null;
  }

  /**
   * Gets marker position
   */
  static getPosition(marker: google.maps.marker.AdvancedMarkerElement): google.maps.LatLng | null {
    return marker.position as google.maps.LatLng;
  }

  /**
   * Animates marker (bounce effect)
   */
  static animateMarker(marker: google.maps.marker.AdvancedMarkerElement, duration: number = 1000): void {
    // AdvancedMarkerElement doesn't have built-in animation like old markers
    // We'll create a custom animation by manipulating the content element
    const content = marker.content as HTMLElement;
    if (content) {
      content.style.transition = `transform ${duration}ms ease-in-out`;
      content.style.transform = 'scale(1.2)';
      
      setTimeout(() => {
        content.style.transform = 'scale(1)';
      }, duration / 2);
    }
  }

  /**
   * Checks if marker is within map bounds
   */
  static isInBounds(marker: google.maps.marker.AdvancedMarkerElement, bounds: google.maps.LatLngBounds): boolean {
    const position = this.getPosition(marker);
    return position ? bounds.contains(position) : false;
  }
}