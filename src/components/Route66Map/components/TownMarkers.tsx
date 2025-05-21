
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
      {towns.map((town, index) => {
        // Extract town name without state
        const townName = town.name.split(',')[0];
        
        return (
          <Marker
            key={`town-marker-${index}`}
            position={{ lat: town.latLng[0], lng: town.latLng[1] }}
            onClick={() => onMarkerClick(index)}
            icon={{
              // Route 66 shield-inspired marker
              url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzNCI+PHBhdGggZmlsbD0iI0QyMjIyMiIgZD0iTTE2LDBjOC44MzcsMCwxNiw3LjE2MywxNiwxNmMwLDguODM3LTcuMTYzLDE2LTE2LDE2UzAsMjQuODM3LDAsMTZDMCw3LjE2Myw3LjE2MywwLDE2LDB6Ii8+PHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTIzLDExSDlhMSwxLDAsMCwwLTEsMXYxMGExLDEsMCwwLDAsMSwxSDIzYTEsMSwwLDAsMCwxLTFWMTJBMSwxLDAsMCwwLDIzLDExeiIvPjx0ZXh0IHg9IjE2IiB5PSIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzAwMDAwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZvbnQtd2VpZ2h0PSJib2xkIj42NjwvdGV4dD48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMTYsMzQgTDEyLDI1IEwyMCwyNSBaIi8+PC9zdmc+',
              scaledSize: new google.maps.Size(34, 40),
              anchor: new google.maps.Point(17, 34),
              labelOrigin: new google.maps.Point(16, 10)
            }}
            label={{
              text: index <= 9 ? (index + 1).toString() : '',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            {activeMarker === index && (
              <InfoWindow onCloseClick={() => onMarkerClick(index)}>
                <div className="p-2 font-route66 text-center" style={{ backgroundColor: '#f5f2ea', borderRadius: '4px', border: '2px solid #c2410c' }}>
                  <h3 className="text-xl font-bold text-[#c2410c] mb-1">{townName}</h3>
                  <p className="text-sm text-gray-700">Historic Route 66</p>
                  <div className="mt-1 bg-[#c2410c] text-white text-xs px-2 py-0.5 rounded">
                    Click for details
                  </div>
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
