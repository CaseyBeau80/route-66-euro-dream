
import { MarkerData, StopData } from './RouteDataManager';

export class MarkerCreator {
  static createHighwayMarker(
    marker: MarkerData, 
    map: google.maps.Map, 
    enhanced: boolean = false
  ): google.maps.Marker {
    const iconSize = enhanced ? { width: 80, height: 30 } : { width: 60, height: 20 };
    const fontSize = enhanced ? "8" : "10";
    
    return new google.maps.Marker({
      position: marker.position,
      map: map,
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="${iconSize.width}" height="${iconSize.height}" viewBox="0 0 ${iconSize.width} ${iconSize.height}">
            <rect width="${iconSize.width}" height="${iconSize.height}" rx="${iconSize.height/2}" fill="#1976D2" stroke="#fff" stroke-width="${enhanced ? 2 : 1}"/>
            <text x="${iconSize.width/2}" y="${enhanced ? 12 : 14}" text-anchor="middle" fill="white" font-family="Arial" font-size="${fontSize}" font-weight="bold">${marker.text}</text>
            ${enhanced ? `<text x="${iconSize.width/2}" y="22" text-anchor="middle" fill="white" font-family="Arial" font-size="6">${marker.state}</text>` : ''}
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(iconSize.width, iconSize.height),
        anchor: new google.maps.Point(iconSize.width/2, iconSize.height/2)
      },
      title: `${marker.text} - ${marker.description}`,
      zIndex: 200
    });
  }

  static createStopMarker(stop: StopData, map: google.maps.Map): google.maps.Marker {
    return new google.maps.Marker({
      position: stop.position,
      map: map,
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" fill="#DC2626" stroke="#fff" stroke-width="2"/>
            <circle cx="10" cy="10" r="4" fill="#fff"/>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(20, 20),
        anchor: new google.maps.Point(10, 10)
      },
      title: `${stop.name} - ${stop.description}`,
      zIndex: 300
    });
  }
}
