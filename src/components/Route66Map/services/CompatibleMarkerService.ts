/**
 * Compatible Marker Service
 * Provides a compatibility layer that uses AdvancedMarkerElement 
 * while maintaining the same API as the old google.maps.Marker
 */

interface LegacyMarkerOptions {
  position: google.maps.LatLng | google.maps.LatLngLiteral;
  map: google.maps.Map;
  title?: string;
  icon?: string | google.maps.Icon | google.maps.Symbol;
  zIndex?: number;
  visible?: boolean;
  clickable?: boolean;
  animation?: google.maps.Animation;
}

/**
 * A compatibility wrapper that makes AdvancedMarkerElement work like the old Marker
 */
export class CompatibleMarker {
  private _advancedMarker: google.maps.marker.AdvancedMarkerElement;
  private _map: google.maps.Map;
  private _position: google.maps.LatLng | google.maps.LatLngLiteral;
  private _title?: string;
  private _zIndex?: number;
  private _visible: boolean = true;
  private _listeners: google.maps.MapsEventListener[] = [];

  constructor(options: LegacyMarkerOptions) {
    this._map = options.map;
    this._position = options.position;
    this._title = options.title;
    this._zIndex = options.zIndex;
    this._visible = options.visible ?? true;

    // Create content element for the marker
    const content = this.createMarkerContent(options);

    try {
      // Create AdvancedMarkerElement
      this._advancedMarker = new google.maps.marker.AdvancedMarkerElement({
        position: this._position,
        map: this._visible ? this._map : null,
        title: this._title,
        content: content,
        zIndex: this._zIndex,
        gmpClickable: options.clickable ?? true
      });

      console.log('✅ CompatibleMarker: Created successfully using AdvancedMarkerElement');
    } catch (error) {
      console.error('❌ CompatibleMarker: Failed to create AdvancedMarkerElement:', error);
      throw error;
    }
  }

  private createMarkerContent(options: LegacyMarkerOptions): HTMLElement {
    const div = document.createElement('div');
    div.style.cursor = 'pointer';
    
    if (options.icon && typeof options.icon === 'string') {
      // Handle string icon (URL)
      const img = document.createElement('img');
      img.src = options.icon;
      img.style.width = '32px';
      img.style.height = '32px';
      div.appendChild(img);
    } else {
      // Default marker appearance
      div.innerHTML = '📍';
      div.style.fontSize = '24px';
      div.style.lineHeight = '1';
    }
    
    return div;
  }

  // Compatibility methods that match the old google.maps.Marker API
  getPosition(): google.maps.LatLng | null {
    return this._advancedMarker.position as google.maps.LatLng;
  }

  setPosition(position: google.maps.LatLng | google.maps.LatLngLiteral): void {
    this._position = position;
    this._advancedMarker.position = position;
  }

  getMap(): google.maps.Map | null {
    return this._map;
  }

  setMap(map: google.maps.Map | null): void {
    this._map = map as google.maps.Map;
    this._advancedMarker.map = map;
  }

  getVisible(): boolean {
    return this._visible;
  }

  setVisible(visible: boolean): void {
    this._visible = visible;
    this._advancedMarker.map = visible ? this._map : null;
  }

  getTitle(): string | undefined {
    return this._title;
  }

  setTitle(title: string): void {
    this._title = title;
    this._advancedMarker.title = title;
  }

  getZIndex(): number | undefined {
    return this._zIndex;
  }

  setZIndex(zIndex: number): void {
    this._zIndex = zIndex;
    this._advancedMarker.zIndex = zIndex;
  }

  // Animation compatibility (simplified)
  setAnimation(animation: google.maps.Animation | null): void {
    if (animation === google.maps.Animation.BOUNCE) {
      this.animateBounce();
    }
  }

  private animateBounce(): void {
    const content = this._advancedMarker.content as HTMLElement;
    if (content) {
      content.style.transition = 'transform 0.3s ease-in-out';
      content.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        content.style.transform = 'translateY(0)';
      }, 300);
    }
  }

  // Event listener compatibility
  addListener(eventName: string, callback: () => void): google.maps.MapsEventListener {
    let actualEventName = eventName;
    
    // Map old event names to new ones
    if (eventName === 'click') {
      actualEventName = 'gmp-click';
    } else if (eventName === 'mouseover') {
      actualEventName = 'gmp-click'; // AdvancedMarker uses gmp-click for interactions
    } else if (eventName === 'mouseout') {
      actualEventName = 'gmp-click'; // Simplified for compatibility
    }

    const listener = this._advancedMarker.addListener(actualEventName, callback);
    this._listeners.push(listener);
    return listener;
  }

  // Cleanup
  destroy(): void {
    this._listeners.forEach(listener => {
      google.maps.event.removeListener(listener);
    });
    this._listeners = [];
    this.setMap(null);
  }

  // Get the underlying AdvancedMarkerElement if needed
  getAdvancedMarker(): google.maps.marker.AdvancedMarkerElement {
    return this._advancedMarker;
  }
}

/**
 * Factory function that creates compatible markers
 * This can be used as a drop-in replacement for new google.maps.Marker()
 */
export function createCompatibleMarker(options: LegacyMarkerOptions): CompatibleMarker {
  return new CompatibleMarker(options);
}