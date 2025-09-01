// Lazy loaded components for code splitting and performance optimization
import { lazy } from 'react';

// Heavy map components - defer loading until needed
export const LazyRoute66Map = lazy(() => import('./Route66Map'));
export const LazyInteractiveMapSection = lazy(() => import('./InteractiveMap/InteractiveMapSection'));

// Below-the-fold sections - load after initial render
export const LazyUnifiedRoute66Carousel = lazy(() => import('./UnifiedRoute66Carousel'));
export const LazyTripPlannerSection = lazy(() => import('./TripPlannerSection'));
export const LazySocialSection = lazy(() => import('./SocialSection/SocialSection'));
export const LazyFunSection = lazy(() => import('./FunSection/FunSection'));
export const LazyTollRoads = lazy(() => import('./TollRoads'));

// Optional: Create a loading fallback component
export const ComponentLoadingFallback = () => (
  <div className="flex items-center justify-center h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-route66-primary"></div>
  </div>
);