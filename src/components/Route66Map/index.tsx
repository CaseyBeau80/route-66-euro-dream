import React, { useEffect, useRef } from 'react';

const Route66Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('🚀 NUCLEAR ROUTE66MAP: Loading with hardcoded API key');
    
    // NUCLEAR APPROACH - Load Google Maps API directly with hardcoded key
    const loadGoogleMaps = () => {
      const apiKey = 'AIzaSyCj2hJjT8wA0G3gBmUaK7qmhKX8Uv3mDH8';
      
      // Set API key in localStorage for other components
      localStorage.setItem('google_maps_api_key', apiKey);
      
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=maps&callback=initRoute66Map`;
      script.async = true;
      script.defer = true;

      // Create global callback
      (window as any).initRoute66Map = () => {
        console.log('🗺️ NUCLEAR: Google Maps API loaded successfully!');
        initializeMap();
      };

      script.onerror = () => {
        console.error('❌ NUCLEAR: Failed to load Google Maps API');
        // Show error instead of API key form
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f0f0f0; border-radius: 8px;">
              <div style="text-center; padding: 32px;">
                <h3 style="color: #dc2626; margin-bottom: 8px;">Map Loading Error</h3>
                <p style="color: #6b7280; font-size: 14px;">Please refresh the page to try again.</p>
              </div>
            </div>
          `;
        }
      };

      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      console.log('🗺️ NUCLEAR: Initializing Route 66 map...');
      
      const mapOptions: google.maps.MapOptions = {
        zoom: 6,
        center: { lat: 35.0, lng: -95.0 }, // Center of Route 66
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [{ color: '#f49ac2' }]
          },
          {
            featureType: 'all',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#746855' }]
          }
        ]
      };

      const map = new google.maps.Map(mapRef.current, mapOptions);

      // Add Route 66 markers
      const route66Cities = [
        { lat: 41.8781, lng: -87.6298, name: 'Chicago, IL' },
        { lat: 38.6270, lng: -90.1994, name: 'St. Louis, MO' },
        { lat: 36.1627, lng: -95.9931, name: 'Tulsa, OK' },
        { lat: 35.2271, lng: -101.8313, name: 'Amarillo, TX' },
        { lat: 35.0844, lng: -106.6504, name: 'Albuquerque, NM' },
        { lat: 35.1983, lng: -111.6513, name: 'Flagstaff, AZ' },
        { lat: 34.0522, lng: -118.2437, name: 'Los Angeles, CA' }
      ];

      route66Cities.forEach(city => {
        new google.maps.Marker({
          position: { lat: city.lat, lng: city.lng },
          map: map,
          title: city.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
                <text x="12" y="16" text-anchor="middle" fill="white" font-size="8" font-weight="bold">66</text>
              </svg>
            `),
            scaledSize: new google.maps.Size(24, 24)
          }
        });
      });

      console.log('🎯 NUCLEAR: Route 66 map initialized successfully!');
    };

    loadGoogleMaps();
  }, []);

  return (
    <div className="w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full min-h-[750px] rounded-lg"
        style={{ background: '#f0f0f0' }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Route 66 Map</h3>
            <p className="text-gray-600 text-sm">NUCLEAR loading with hardcoded API key...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Route66Map;