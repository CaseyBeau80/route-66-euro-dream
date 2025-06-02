
import React, { useState, useEffect } from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import WeatherWidget from './WeatherWidget';
import WeatherApiKeyInput from './WeatherApiKeyInput';
import { WeatherService } from '../services/WeatherService';

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

  const triggerJiggleAnimation = (markerId: string) => {
    const markerInstance = markersRef.current[markerId];
    if (markerInstance) {
      console.log(`🏘️ Town marker jiggle: ${towns[parseInt(markerId)]?.name} - applying custom jiggle`);
      
      // Find the marker's DOM element by getting its position and searching for nearby elements
      const position = markerInstance.getPosition();
      if (position) {
        // Get the map instance from the marker
        const map = markerInstance.getMap() as google.maps.Map;
        if (map) {
          const mapDiv = map.getDiv();
          
          // Use a more targeted approach to find the marker element
          setTimeout(() => {
            // Look for marker images in the map container
            const markerElements = mapDiv.querySelectorAll('img[src*="data:image/svg+xml"]');
            
            // Apply jiggle animation to all found marker elements
            // (this is a broad approach since we can't easily identify specific markers)
            markerElements.forEach((element, index) => {
              const imgElement = element as HTMLElement;
              
              // Check if this element is likely our marker by checking its position
              const rect = imgElement.getBoundingClientRect();
              const mapRect = mapDiv.getBoundingClientRect();
              
              // If the element is within the map bounds, apply the animation
              if (rect.top >= mapRect.top && rect.bottom <= mapRect.bottom &&
                  rect.left >= mapRect.left && rect.right <= mapRect.right) {
                
                console.log(`🎯 Applying jiggle to marker element ${index}`);
                
                // Apply the jiggle animation
                imgElement.style.animation = 'none';
                imgElement.offsetHeight; // Force reflow
                imgElement.style.animation = 'marker-jiggle 0.8s ease-in-out';
                
                // Clean up animation after it completes
                setTimeout(() => {
                  imgElement.style.animation = '';
                }, 800);
              }
            });
          }, 50);
        }
      }
    }
  };

  const handleMarkerMouseOver = (markerId: string) => {
    console.log(`🐭 Mouse over town marker: ${towns[parseInt(markerId)]?.name}`);
    triggerJiggleAnimation(markerId);
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
