
import { useEffect, useState } from 'react';
import { ComprehensiveRouteServiceProps } from './types';
import { HybridRouteCalculator } from './hybridRouteCalculator';
import { RouteValidator } from './routeValidator';

const HybridRouteService = ({ 
  map, 
  directionsService,
  onRouteCalculated 
}: ComprehensiveRouteServiceProps) => {
  const [renderers, setRenderers] = useState<google.maps.DirectionsRenderer[]>([]);
  const [routeStatus, setRouteStatus] = useState<string>('Initializing...');

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
        setRouteStatus('Route calculation failed');
        if (onRouteCalculated) {
          onRouteCalculated(false);
        }
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

  return null;
};

export default HybridRouteService;
