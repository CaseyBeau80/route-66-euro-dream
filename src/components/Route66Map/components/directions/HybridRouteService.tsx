
import { useEffect, useState } from 'react';
import { ComprehensiveRouteServiceProps } from './types';
import { HybridRouteCalculator } from './hybridRouteCalculator';
import { RouteValidator } from './routeValidator';
import StaticRoute66Service from './StaticRoute66Service';

const HybridRouteService = ({ 
  map, 
  directionsService,
  onRouteCalculated 
}: ComprehensiveRouteServiceProps) => {
  const [renderers, setRenderers] = useState<google.maps.DirectionsRenderer[]>([]);
  const [routeStatus, setRouteStatus] = useState<string>('Initializing...');
  const [useStaticFallback, setUseStaticFallback] = useState(false);

  useEffect(() => {
    if (!map || !directionsService || typeof google === 'undefined') return;

    console.log('🚗 HybridRouteService: Starting hybrid Route 66 calculation');
    setRouteStatus('Calculating route with precise coordinates...');

    // Clear any existing renderers
    renderers.forEach(renderer => renderer.setMap(null));
    setRenderers([]);

    const calculator = new HybridRouteCalculator(directionsService, map, (success, fallbackUsed, segments) => {
      if (success) {
        console.log(`✅ Route calculation completed. Fallback used: ${fallbackUsed}`);
        setRouteStatus(fallbackUsed ? 'Route calculated with city fallback' : 'Route calculated with precise coordinates');
        
        // Validate the calculated route
        const validator = new RouteValidator();
        const validation = validator.validateRoute(segments);
        console.log('📊 Route validation:', validation);
        
        if (onRouteCalculated) {
          onRouteCalculated(success);
        }
      } else {
        console.log('❌ Directions API failed, falling back to static polyline');
        setRouteStatus('Using static Route 66 polyline (Directions API unavailable)');
        setUseStaticFallback(true);
      }
    });

    const newRenderers = calculator.calculateHybridRoute();
    setRenderers(newRenderers);

    return () => {
      newRenderers.forEach(renderer => renderer.setMap(null));
    };
  }, [map, directionsService, onRouteCalculated]);

  // Display route status in console
  useEffect(() => {
    console.log(`🛣️ Route Status: ${routeStatus}`);
  }, [routeStatus]);

  // Render static fallback if Directions API fails
  if (useStaticFallback) {
    return (
      <StaticRoute66Service 
        map={map} 
        onRouteReady={(success) => {
          if (onRouteCalculated) {
            onRouteCalculated(success);
          }
        }} 
      />
    );
  }

  return null;
};

export default HybridRouteService;
