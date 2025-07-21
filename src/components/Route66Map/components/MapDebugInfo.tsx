import React from 'react';
import { useGlobalGoogleMapsContext } from '../../providers/GlobalGoogleMapsProvider';

const MapDebugInfo: React.FC = () => {
  const context = useGlobalGoogleMapsContext();
  
  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm z-[9999] max-w-sm">
      <h3 className="font-bold mb-2">🗺️ Map Debug Info</h3>
      <div className="space-y-1">
        <div>API Key Loading: {context.apiKeyLoading ? '⏳' : '✅'}</div>
        <div>Has API Key: {context.hasApiKey ? '✅' : '❌'}</div>
        <div>Maps Loaded: {context.isLoaded ? '✅' : '❌'}</div>
        <div>Load Error: {context.loadError ? '❌ ' + context.loadError.message : '✅'}</div>
        <div>Waypoints: {context.waypoints.length} loaded</div>
        <div>Data Loading: {context.isLoading ? '⏳' : '✅'}</div>
        <div>Data Error: {context.error ? '❌ ' + context.error : '✅'}</div>
      </div>
    </div>
  );
};

export default MapDebugInfo;