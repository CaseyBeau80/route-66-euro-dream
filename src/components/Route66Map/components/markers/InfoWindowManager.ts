
export class InfoWindowManager {
  private static instance: InfoWindowManager;
  private currentInfoWindow: google.maps.InfoWindow | null = null;

  private constructor() {}

  static getInstance(): InfoWindowManager {
    if (!InfoWindowManager.instance) {
      InfoWindowManager.instance = new InfoWindowManager();
    }
    return InfoWindowManager.instance;
  }

  createInfoWindow(
    content: string,
    marker: google.maps.Marker,
    map: google.maps.Map
  ): google.maps.InfoWindow {
    // Close any existing info window
    this.closeCurrentInfoWindow();

    const infoWindow = new google.maps.InfoWindow({
      content: content,
      maxWidth: 300
    });

    // Add click listener to marker
    marker.addListener('click', () => {
      this.closeCurrentInfoWindow();
      infoWindow.open(map, marker);
      this.currentInfoWindow = infoWindow;
    });

    return infoWindow;
  }

  closeCurrentInfoWindow(): void {
    if (this.currentInfoWindow) {
      this.currentInfoWindow.close();
      this.currentInfoWindow = null;
    }
  }

  static createHighwayInfoContent(text: string, state: string, description: string): string {
    return `
      <div class="p-2">
        <h3 class="font-bold text-black">${text}</h3>
        <p class="text-sm text-gray-600">${state}</p>
        <p class="text-xs text-gray-500">${description}</p>
      </div>
    `;
  }

  static createStopInfoContent(name: string, description: string): string {
    return `
      <div class="p-2">
        <h3 class="font-bold text-black">${name}</h3>
        <p class="text-sm text-gray-600">${description}</p>
      </div>
    `;
  }
}
