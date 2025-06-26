
import React, { useState, useEffect } from 'react';
import { X, MapPin, Navigation, Maximize2 } from 'lucide-react';
import { InteractiveGoogleMap } from '@/components/InteractiveGoogleMap';
import type { TimelineMilestone } from '@/data/timelineData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StoryMapProps {
  currentMilestone: TimelineMilestone;
  onClose: () => void;
}

// Key Route 66 locations with coordinates for different eras
const route66Locations = {
  1926: { lat: 41.8781, lng: -87.6298, name: 'Chicago, IL', description: 'Eastern terminus of Route 66' },
  1930: { lat: 35.2271, lng: -101.8313, name: 'Amarillo, TX', description: 'Heart of the Dust Bowl migration' },
  1937: { lat: 35.0844, lng: -106.6504, name: 'Albuquerque, NM', description: 'First fully paved section completed' },
  1946: { lat: 34.0549, lng: -118.2426, name: 'Los Angeles, CA', description: 'Western terminus celebration' },
  1950: { lat: 36.1627, lng: -115.1391, name: 'Las Vegas, NV', description: 'Golden age of road travel' },
  1960: { lat: 35.2220, lng: -101.8313, name: 'Amarillo, TX', description: 'Route 66 TV series filming' },
  1956: { lat: 38.9072, lng: -77.0369, name: 'Washington, DC', description: 'Interstate Highway Act signed' },
  1970: { lat: 35.1495, lng: -112.1871, name: 'Williams, AZ', description: 'Towns being bypassed' },
  1985: { lat: 35.1495, lng: -112.1871, name: 'Williams, AZ', description: 'Last section decommissioned' },
  1990: { lat: 35.2271, lng: -101.8313, name: 'Amarillo, TX', description: 'Preservation efforts begin' },
  1999: { lat: 38.6270, lng: -90.1994, name: 'St. Louis, MO', description: 'National preservation federation formed' },
  2008: { lat: 38.9072, lng: -77.0369, name: 'Washington, DC', description: 'Federal preservation program established' },
  2026: { lat: 34.0195, lng: -118.4912, name: 'Santa Monica, CA', description: 'Centennial celebration' }
};

export const StoryMap: React.FC<StoryMapProps> = ({ currentMilestone, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: 39.8283, lng: -98.5795 });
  const [mapZoom, setMapZoom] = useState(4);

  useEffect(() => {
    // Update map center based on current milestone
    const location = route66Locations[currentMilestone.year as keyof typeof route66Locations];
    if (location) {
      setMapCenter({ lat: location.lat, lng: location.lng });
      setMapZoom(8);
    } else {
      // Default to center of US
      setMapCenter({ lat: 39.8283, lng: -98.5795 });
      setMapZoom(4);
    }
  }, [currentMilestone]);

  const currentLocation = route66Locations[currentMilestone.year as keyof typeof route66Locations];

  const handleMapLoad = (map: google.maps.Map) => {
    // Add Route 66 path
    const route66Path = [
      { lat: 41.8781, lng: -87.6298 }, // Chicago
      { lat: 38.6270, lng: -90.1994 }, // St. Louis
      { lat: 36.1540, lng: -95.9928 }, // Tulsa
      { lat: 35.4676, lng: -97.5164 }, // Oklahoma City
      { lat: 35.2271, lng: -101.8313 }, // Amarillo
      { lat: 35.0844, lng: -106.6504 }, // Albuquerque
      { lat: 35.1983, lng: -111.6513 }, // Flagstaff
      { lat: 34.0195, lng: -118.4912 }  // Santa Monica
    ];

    const polyline = new google.maps.Polyline({
      path: route66Path,
      geodesic: true,
      strokeColor: '#DC2626',
      strokeOpacity: 0.8,
      strokeWeight: 4,
    });

    polyline.setMap(map);

    // Add marker for current location
    if (currentLocation) {
      const marker = new google.maps.Marker({
        position: { lat: currentLocation.lat, lng: currentLocation.lng },
        map: map,
        title: currentLocation.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="#DC2626"/>
              <circle cx="12" cy="12" r="4" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(24, 24),
          anchor: new google.maps.Point(12, 12)
        }
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-bold text-lg">${currentLocation.name}</h3>
            <p class="text-sm text-gray-600">${currentLocation.description}</p>
            <p class="text-xs text-gray-500 mt-1">${currentMilestone.year}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      // Auto-open info window
      setTimeout(() => {
        infoWindow.open(map, marker);
      }, 1000);
    }
  };

  return (
    <div className={`bg-white shadow-2xl transition-all duration-300 ${
      isFullscreen 
        ? 'fixed inset-4 z-50 rounded-lg' 
        : 'h-full rounded-lg border border-route66-border'
    }`}>
      {/* Map header */}
      <div className="bg-route66-primary text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5" />
          <div>
            <h3 className="font-bold text-lg">{currentMilestone.title}</h3>
            <p className="text-route66-primary-light text-sm">{currentMilestone.year}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-white hover:bg-white/20"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Map container */}
      <div className="relative" style={{ height: isFullscreen ? 'calc(100% - 80px)' : '400px' }}>
        <InteractiveGoogleMap
          center={mapCenter}
          zoom={mapZoom}
          onMapLoad={handleMapLoad}
          className="w-full h-full"
        />

        {/* Location info overlay */}
        {currentLocation && (
          <Card className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm border-route66-border/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Navigation className="w-5 h-5 text-route66-primary" />
                <div>
                  <h4 className="font-semibold text-route66-text-primary">{currentLocation.name}</h4>
                  <p className="text-sm text-route66-text-muted">{currentLocation.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
