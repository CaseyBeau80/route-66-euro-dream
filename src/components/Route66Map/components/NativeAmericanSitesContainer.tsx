
import React from 'react';
import { useNativeAmericanSites } from './NativeAmericanSites/useNativeAmericanSites';
import NativeAmericanCustomMarker from './NativeAmericanSites/NativeAmericanCustomMarker';
import { NativeAmericanSitesProps } from './NativeAmericanSites/types';

const NativeAmericanSitesContainer: React.FC<NativeAmericanSitesProps> = ({ map, onSiteClick }) => {
  const { sites, loading } = useNativeAmericanSites();

  if (loading) {
    console.log('⏳ Native American sites still loading...');
    return null;
  }

  console.log(`🪶 NativeAmericanSitesContainer: Rendering ${sites.length} heritage sites`);

  return (
    <>
      {sites.map((site) => {
        console.log(`🪶 Rendering marker for: ${site.name} at ${site.latitude}, ${site.longitude}`);
        return (
          <NativeAmericanCustomMarker
            key={`native-site-marker-${site.id}`}
            site={site}
            onMarkerClick={onSiteClick}
            onWebsiteClick={(website) => window.open(website, '_blank')}
            map={map}
          />
        );
      })}
    </>
  );
};

export default NativeAmericanSitesContainer;
