
import React from 'react';
import ClusterManager from '../markers/ClusterManager';
import HiddenGemsContainer from '../HiddenGemsContainer';
import AttractionsContainer from '../AttractionsContainer';
import DestinationCitiesContainer from '../DestinationCitiesContainer';

interface MapContentProps {
  map: google.maps.Map;
  useClusteringMode: boolean;
  attractions: any[];
  destinations: any[];
  isMapReady: boolean;
}

const MapContent: React.FC<MapContentProps> = ({
  map,
  useClusteringMode,
  attractions,
  destinations,
  isMapReady
}) => {
  if (!isMapReady) return null;

  return (
    <>
      {/* Conditional rendering based on clustering mode */}
      {useClusteringMode ? (
        <ClusterManager
          map={map}
          hiddenGems={[]} // ClusterManager will load real data internally
          attractions={attractions}
          destinations={destinations}
          onGemClick={(gem) => {
            console.log('✨ Hidden gem selected (clustered):', gem.title);
          }}
          onAttractionClick={(attraction) => {
            console.log('🎯 Attraction selected (clustered):', attraction.name);
          }}
          onDestinationClick={(destination) => {
            console.log('🏛️ Destination city selected (clustered):', destination.name);
          }}
        />
      ) : (
        <>
          {/* Render Hidden Gems with hover cards */}
          <HiddenGemsContainer 
            map={map}
            onGemClick={(gem) => {
              console.log('✨ Hidden gem selected:', gem.title);
            }}
          />
          
          {/* Render Destination Cities with hover cards */}
          <DestinationCitiesContainer
            map={map}
            waypoints={destinations}
            onDestinationClick={(destination) => {
              console.log('🏛️ Destination city selected:', destination.name);
            }}
          />
          
          {/* Render Attractions with improved zoom-based filtering */}
          <AttractionsContainer
            map={map}
            waypoints={attractions}
            onAttractionClick={(attraction) => {
              console.log('🎯 Attraction selected:', attraction.name);
            }}
          />
        </>
      )}
    </>
  );
};

export default MapContent;
