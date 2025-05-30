
import { useEffect, useState } from 'react';
import { ComprehensiveRouteServiceProps } from './types';
import { SegmentsService } from './segmentsService';
import { RouteCalculator } from './routeCalculator';

const ComprehensiveRouteService = ({ 
  map, 
  directionsService,
  onRouteCalculated 
}: ComprehensiveRouteServiceProps) => {
  const [renderers, setRenderers] = useState<google.maps.DirectionsRenderer[]>([]);

  useEffect(() => {
    if (!map || !directionsService || typeof google === 'undefined') return;

    // Clear any existing renderers
    renderers.forEach(renderer => renderer.setMap(null));
    setRenderers([]);

    const segments = SegmentsService.getHighwaySegments();
    const newRenderers: google.maps.DirectionsRenderer[] = [];

    // Create renderers for each segment
    segments.forEach(() => {
      const renderer = SegmentsService.createDirectionsRenderer();
      renderer.setMap(map);
      newRenderers.push(renderer);
    });

    setRenderers(newRenderers);

    // Calculate routes using the RouteCalculator
    const calculator = new RouteCalculator(directionsService, map, onRouteCalculated);
    calculator.calculateRoutes(segments, newRenderers);

    return () => {
      newRenderers.forEach(renderer => renderer.setMap(null));
    };
  }, [map, directionsService, onRouteCalculated]);

  return null;
};

export default ComprehensiveRouteService;
