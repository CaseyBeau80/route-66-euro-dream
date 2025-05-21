
import React from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';

interface Town {
  name: string;
  latLng: [number, number];
}

interface TownMarkersProps {
  towns: Town[];
  activeMarker: number | null;
  onMarkerClick: (index: number) => void;
}

const TownMarkers: React.FC<TownMarkersProps> = ({ 
  towns, 
  activeMarker, 
  onMarkerClick 
}) => {
  return (
    <>
      {towns.map((town, index) => (
        <Marker
          key={`town-marker-${index}`}
          position={{ lat: town.latLng[0], lng: town.latLng[1] }}
          onClick={() => onMarkerClick(index)}
          icon={{
            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzhjMWIxYiIgZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCA5LjVhMi41IDIuNSAwIDAgMSAwLTUgMi41IDIuNSAwIDAgMSAwIDV6Ii8+PC9zdmc+',
            scaledSize: new google.maps.Size(30, 30)
          }}
        >
          {activeMarker === index && (
            <InfoWindow onCloseClick={() => onMarkerClick(index)}>
              <div className="p-1">
                <h3 className="font-semibold text-sm">{town.name}</h3>
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </>
  );
};

export default TownMarkers;
