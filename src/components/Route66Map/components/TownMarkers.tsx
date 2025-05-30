
import React from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';

interface Town {
  name: string;
  latLng: [number, number];
}

interface TownMarkersProps {
  towns: Town[];
  activeMarker: string | null;
  onMarkerClick: (markerId: string | number) => void;
}

const TownMarkers: React.FC<TownMarkersProps> = ({ 
  towns, 
  activeMarker, 
  onMarkerClick 
}) => {
  return (
    <>
      {towns.map((town, index) => {
        const markerId = index.toString();
        return (
          <Marker
            key={`town-marker-${index}`}
            position={{ lat: town.latLng[0], lng: town.latLng[1] }}
            onClick={() => onMarkerClick(markerId)}
            icon={{
              // Use a dark red pin marker similar to the reference image
              url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI0I5MUMxQyIgZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCAxMS41YTIuNSAyLjUgMCAwIDEgMC01IDIuNSAyLjUgMCAwIDEgMCA1eiIvPjwvc3ZnPg==',
              scaledSize: new google.maps.Size(32, 32),
              anchor: new google.maps.Point(16, 32) // Anchor at the bottom center of the icon
            }}
            zIndex={100}
          >
            {activeMarker === markerId && (
              <InfoWindow onCloseClick={() => onMarkerClick(markerId)}>
                <div className="p-1">
                  <h3 className="font-semibold text-sm">{town.name}</h3>
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
      })}
    </>
  );
};

export default TownMarkers;
