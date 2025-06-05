
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, MapPin, Database } from 'lucide-react';
import { useDestinationCities } from '../hooks/useDestinationCities';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';

interface MapDebugPanelProps {
  map?: google.maps.Map;
}

const MapDebugPanel: React.FC<MapDebugPanelProps> = ({ map }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { destinationCities, isLoading: citiesLoading } = useDestinationCities();
  const { waypoints, isLoading: waypointsLoading } = useSupabaseRoute66();

  const santaFeInCities = destinationCities.find(city => 
    city.name.toLowerCase().includes('santa fe')
  );

  const santaFeInWaypoints = waypoints.find(waypoint => 
    waypoint.name.toLowerCase().includes('santa fe')
  );

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 max-w-md">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Database className="w-4 h-4" />
          Map Debug Panel
        </h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Map Status */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Map Status</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Google Maps:</span>
              <span className={!!window.google?.maps ? 'text-green-600' : 'text-red-600'}>
                {!!window.google?.maps ? '✓ Ready' : '✗ Not Ready'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Map Instance:</span>
              <span className={!!map ? 'text-green-600' : 'text-red-600'}>
                {!!map ? '✓ Available' : '✗ Missing'}
              </span>
            </div>
          </div>
        </div>

        {/* Destination Cities Status */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Destination Cities</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Loading:</span>
              <span className={citiesLoading ? 'text-yellow-600' : 'text-green-600'}>
                {citiesLoading ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Count:</span>
              <span className="text-blue-600">{destinationCities.length}</span>
            </div>
          </div>
        </div>

        {/* Santa Fe Status */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Santa Fe Status
          </h4>
          <div className="text-sm space-y-2">
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-medium">In destination_cities:</div>
              {santaFeInCities ? (
                <div className="text-green-600 mt-1">
                  ✓ Found: {santaFeInCities.name}, {santaFeInCities.state}
                  <br />
                  Coords: {santaFeInCities.latitude}, {santaFeInCities.longitude}
                </div>
              ) : (
                <div className="text-red-600 mt-1">✗ Not found</div>
              )}
            </div>
            
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-medium">In route66_waypoints:</div>
              {santaFeInWaypoints ? (
                <div className="text-blue-600 mt-1">
                  ✓ Found: {santaFeInWaypoints.name}, {santaFeInWaypoints.state}
                  <br />
                  Major Stop: {santaFeInWaypoints.is_major_stop ? 'Yes' : 'No'}
                </div>
              ) : (
                <div className="text-gray-600 mt-1">✗ Not found</div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Quick Actions</h4>
          <button
            onClick={() => {
              console.log('🔄 Force refresh destination cities data');
              window.location.reload();
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapDebugPanel;
