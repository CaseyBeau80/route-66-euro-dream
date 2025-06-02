
import React, { useState, useEffect } from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import WeatherWidget from './WeatherWidget';
import WeatherApiKeyInput from './WeatherApiKeyInput';
import { WeatherService } from '../services/WeatherService';
import { MarkerAnimationUtils } from '../utils/markerAnimationUtils';

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
  const [hasWeatherApiKey, setHasWeatherApiKey] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [weatherRefreshKey, setWeatherRefreshKey] = useState(0);
  const markersRef = React.useRef<{ [key: string]: google.maps.Marker }>({});

  useEffect(() => {
    const weatherService = WeatherService.getInstance();
    const hasKey = weatherService.hasApiKey();
    console.log('🔑 TownMarkers: Checking API key availability:', hasKey);
    setHasWeatherApiKey(hasKey);
  }, []);

  const handleApiKeySet = () => {
    console.log('🔑 TownMarkers: API key has been set, refreshing weather widgets');
    setHasWeatherApiKey(true);
    setShowApiKeyInput(false);
    // Force weather widgets to refresh by updating the key
    setWeatherRefreshKey(prev => prev + 1);
  };

  const handleMarkerMouseOver = (markerId: string) => {
    const townName = towns[parseInt(markerId)]?.name;
    console.log(`🐭 Mouse over town marker: ${townName}`);
    
    const markerInstance = markersRef.current[markerId];
    if (markerInstance && townName) {
      MarkerAnimationUtils.triggerEnhancedJiggle(markerInstance, townName);
    }
  };

  return (
    <>
      {towns.map((town, index) => {
        const markerId = index.toString();
        return (
          <Marker
            key={`town-marker-${index}`}
            position={{ lat: town.latLng[0], lng: town.latLng[1] }}
            onClick={() => onMarkerClick(markerId)}
            onLoad={(marker) => {
              // Store the marker reference when it loads
              markersRef.current[markerId] = marker;
              console.log(`📍 Town marker loaded: ${town.name}`);
            }}
            onMouseOver={() => {
              handleMarkerMouseOver(markerId);
            }}
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
                <div className="p-2 min-w-[250px]">
                  <h3 className="font-semibold text-lg mb-3">{town.name}</h3>
                  
                  {hasWeatherApiKey ? (
                    <WeatherWidget 
                      key={`weather-${index}-${weatherRefreshKey}`}
                      lat={town.latLng[0]} 
                      lng={town.latLng[1]} 
                      cityName={town.name}
                      collapsible={true}
                    />
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Enable weather widget to see current conditions
                      </p>
                      <button
                        onClick={() => setShowApiKeyInput(true)}
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                      >
                        Configure Weather API
                      </button>
                    </div>
                  )}
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
      })}
      
      {showApiKeyInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4">
              <WeatherApiKeyInput onApiKeySet={handleApiKeySet} />
              <button
                onClick={() => setShowApiKeyInput(false)}
                className="mt-3 w-full text-center text-gray-500 hover:text-gray-700 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TownMarkers;
