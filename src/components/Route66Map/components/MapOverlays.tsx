
import { useEffect } from 'react';
import { nostalgicIcons } from '../config/MapConfig';

interface MapOverlaysProps {
  map: google.maps.Map;
}

const MapOverlays = ({ map }: MapOverlaysProps) => {
  useEffect(() => {
    if (!map) return;
    
    // Define the Route 66 corridor with a tight buffer around the 8 states
    const route66Corridor = new google.maps.LatLngBounds(
      new google.maps.LatLng(32.0, -124.5),  // SW - Southern California
      new google.maps.LatLng(42.5, -87.0)    // NE - Chicago area
    );
    
    // Apply bounds restrictions
    map.setOptions({
      restriction: {
        latLngBounds: route66Corridor,
        strictBounds: true  // Strictly enforce the bounds
      }
    });

    // Create a semi-transparent overlay for non-Route 66 states
    const nonRoute66Overlay = new google.maps.Rectangle({
      bounds: {
        north: 85,  // Far north (covers the entire map height)
        south: -85, // Far south
        east: 180,  // Far east (covers the entire map width)
        west: -180  // Far west
      },
      strokeOpacity: 0,
      fillColor: "#CCCCCC",
      fillOpacity: 0.45, // Increased opacity for stronger graying out
      map: map,
      zIndex: -1  // Place behind other elements
    });
    
    // Add nostalgic Americana icons to the map
    const iconMarkers: google.maps.Marker[] = [];
    
    nostalgicIcons.forEach(icon => {
      // Determine icon URL based on type
      let iconUrl = '';
      
      switch(icon.type) {
        case 'diner':
          iconUrl = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzgwMjIwMCIgZD0iTTE4LDIySDYuNVYzMEg0VjIySDJ2LThIN1YxMGgxMHY0aDVWMjJ6IE03LDIxLjUzSDV2LTFIMlY5LjQ3SDdWMjEuNTN6IE0xOSwyMUgxNHYxaDR2MWgtNnYtMWgtM3YtMWgtMlYxMGw0LTRoOGwzLDR2MTFIMTl6Ii8+PC9zdmc+';
          break;
        case 'motel':
          iconUrl = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzA4NTg2MCIgZD0iTTE5LDdoLTE0djdoM3Y3aDJ2LTdoNHY3aDJ2LTdoM1Y3eiBNMTksNWgtMnYtMmgtMnYyaC1ydjJoLTJ2LTJoLTJ2Mmgtdjhuao=';
          break;
        case 'car':
          iconUrl = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzY2MzMwMCIgZD0iTTE3IDRIMTRsMS43NyA1SDIwbC0xLjYzLTQuOThDMTguMTcgNC4wOSAxNy42NiA0IDE3IDRabS00IDNIMTRWNEM5LjgxIDQgOC42OCA0LjI1IDcuNjIgNC45OEM3LjI3IDUuMTYgNyA1LjUgNi43OCA1Ljg0TDQgMTJWMjBhMSAxIDAgMCAwIDEgMWgyYTEgMSAwIDAgMCAxLTFWMTlIMTZ2MWExIDEgMCAwIDAgMSAxaDJhMSAxIDAgMCAwIDEtMVYxMmwtLjkxLTIuNzJMMTMgN1ptLTguNzUuNUM4LjQ2IDcuMjcgOC44IDcgOSA3aDJsMiA1SDYuOTlsMS4yNi0zLjVaTTEwIDE2SDggdi0xaDJ2MVptNiAwSDExdi0xaDVWMTZaIi8+PC9zdmc+';
          break;
        case 'cowboy':
          iconUrl = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzRkMzMxNyIgZD0iTTEwIDJhMyAzIDAgMCAxIDMgM2MwIC4yNC0uMDQuNDctLjA5LjdsMi4zMi0uNThDMTUuODQgNS4wNCAxNi41IDQgMTggNGgyYy0yLjUgMS02IDItNiA2aC0yYTUgNSAwIDAgMS01IDV2LTQuNkw4LjU1IDEzQTIgMiAwIDAgMSA3IDE0LjU2VjIxaC0ydi01aDFsLTIuNS01SDJsLTIgMTBoMTlsLTEuNzUtNy41TDE5IDEzaC0ybC0yLTNsLTIuNSAxLjI1TDEwIDZhMSAxIDAgMCAwLTEgMUg3VjRMNiAzSDN2MS41bDMgMmEzIDMgMCAwIDEtMy0zaC4wNEExIDEgMCAwIDEgNCAyaC45QTQgNCAwIDAgMSA5IDBoMmwzIDEgMS0xaDFsLTIgMyAuOCAxSDEzYTEgMSAwIDAgMS0xLTFoLTJaIi8+PC9zdmc+';
          break;
        case 'native':
          iconUrl = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzVkNGEzYiIgZD0iTTE0LDE2djJoLTJ2MmgtMnYyaC0ydi0ySDZ2LTJINHYtMkg2di0yaC0ydi0yaDJ2LTJINHYtMmgyVjZINHYtMmgydi0yaDJ2MmgyVjJoMnYyaDJ2Mmgydi0yaDJ2MmgydjJoLTJ2MmgydjJoLTJ2Mmgydi0yaC0yem0tNC0yVjhoLTJ2Nmgyem0wLDZWMThoLTJ2MmgyeiIvPjwvc3ZnPg==';
          break;
        case 'landmark':
          iconUrl = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzY2NDA4MCIgZD0iTTEzIDloMS41Yy44MyAwIDEuNS45NCAxLjUgMi4xdjQuOTlDMTYgMTcuMDYgMTUuMzMgMTggMTQuNSAxOEgxM3YyaDlWOWgtOVY5em0wLTMlCjIwaCAxOVY1bC05LTQtOSA0djFoOVY2eiIvPjwvc3ZnPg==';
          break;
        case 'music':
          iconUrl = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzhhNTQ1ZCIgZD0iTTE5IDNINXYyLjRMMTAuNCA5SDVjLTEuNjYgMC0zIDEuMzQtMyAzdjdoLjAzQTMgMyAwIDAgMCA1IDE5aDFhMyAzIDAgMCAwIDMtM1Y4LjUsSDluNWgxMC42TDE5IDNNOSAxNmMwIC41NS0uNDUgMS0xIDFzLTEtLjQ1LTEtMSAuNDUtMSAxLTEgMSAuNDUgMSAxbTYtMWMtLjU1IDAtMSAuNDUtMSAxcy40NSAxIDEgMSAxLS40NSAxLTEtLjQ1LTEtMS0xeiIvPjwvc3ZnPg==';
          break;
        case 'roadside':
          iconUrl = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzk5MzMwMCIgZD0iTTEyLDJBMTAsMTAgMCAwLDAgMiwxMlYyMkgyMlYxMkExMCwxMCAwIDAsMCAxMiwyWiIvPjwvc3ZnPg==';
          break;
        default:
          iconUrl = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzBmNTI2ZCIgZD0iTTEyIDRhOCA4IDAgMSAwIDAgMTYgOCA4IDAgMCAwIDAtMTZ6Ii8+PC9zdmc+';
      }
      
      const marker = new google.maps.Marker({
        position: { lat: icon.latLng[0], lng: icon.latLng[1] },
        map: map,
        title: icon.title,
        icon: {
          url: iconUrl,
          scaledSize: new google.maps.Size(36, 36),
          anchor: new google.maps.Point(18, 18)
        },
        animation: google.maps.Animation.DROP,
        opacity: 0.85
      });
      
      // Add custom info window with vintage styling
      const infoContent = `
        <div style="font-family: 'Racing Sans One', cursive; padding: 10px; background: #f5f2ea; border: 2px solid #c2410c; border-radius: 8px;">
          <h3 style="margin: 0 0 5px; color: #c2410c; font-size: 16px;">${icon.title}</h3>
          <p style="margin: 0; color: #333; font-size: 12px;">Route 66 ${icon.type}</p>
        </div>
      `;
      
      const infoWindow = new google.maps.InfoWindow({
        content: infoContent
      });
      
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
      
      iconMarkers.push(marker);
    });
    
    // Return cleanup function
    return () => {
      nonRoute66Overlay.setMap(null);
      iconMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map]);
  
  return null; // This is a non-visual component
};

export default MapOverlays;
