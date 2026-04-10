import React, { useEffect, Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { UnitProvider } from "@/contexts/UnitContext";
import { MapFiltersProvider } from "@/contexts/MapFiltersContext";
import SvgDefinitions from "@/components/shared/SvgDefinitions";
import { LayoutOptimizer } from "@/components/Route66Map/utils/LayoutOptimizer";
import { preloadCriticalData } from "@/services/sharedDataService";
import { SWRConfig } from 'swr';

// Critical page loaded immediately (homepage)
import Index from "./pages/Index";

// Route-based code splitting - lazy load non-critical pages
const LazyContactPage = lazy(() => import("./pages/ContactPage"));
const LazyAboutPage = lazy(() => import("./pages/AboutPage"));
const LazyBlogPage = lazy(() => import("./pages/BlogPage"));
const LazyBlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const LazySharedTripPage = lazy(() => import("./pages/SharedTripPage"));
const LazyNotFound = lazy(() => import("./pages/NotFound"));
const LazyRobotsTxtPage = lazy(() => import("./pages/RobotsTxtPage"));
const LazySitemapXmlPage = lazy(() => import("./pages/SitemapXmlPage"));
const LazyPrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const LazyAttractionPage = lazy(() => import("./pages/AttractionPage"));
const LazyStatePage = lazy(() => import("./pages/StatePage"));
const LazyStoryMapPage = lazy(() => import("./pages/StoryMapPage"));

// Route loading fallback
const RouteLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-route66-primary"></div>
  </div>
);

// Create QueryClient instance outside of component to avoid recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  // Initialize layout optimizer and preload critical data to reduce network dependency chains
  useEffect(() => {
    LayoutOptimizer.initialize();
    // Preload critical data immediately to break dependency chains
    preloadCriticalData();
    return () => LayoutOptimizer.cleanup();
  }, []);
  
  // SWR configuration for optimized data fetching and caching
  const swrConfig = {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute deduping interval
    focusThrottleInterval: 30000, // 30 seconds focus throttle
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SWRConfig value={swrConfig}>
        <HelmetProvider>
          <UnitProvider>
            <MapFiltersProvider>
            <TooltipProvider>
              <SvgDefinitions />
              <Toaster />
              <Sonner />
              <BrowserRouter>
              <Routes>
                {/* Critical route - loaded immediately */}
                <Route path="/" element={<Index />} />
                
                {/* Non-critical routes - lazy loaded for code splitting */}
                <Route path="/contact" element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <LazyContactPage />
                  </Suspense>
                } />
                <Route path="/about" element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <LazyAboutPage />
                  </Suspense>
                } />
                <Route path="/blog" element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <LazyBlogPage />
                  </Suspense>
                } />
                <Route path="/blog/:slug" element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <LazyBlogPostPage />
                  </Suspense>
                } />
                <Route path="/trip/:shareCode" element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <LazySharedTripPage />
                  </Suspense>
                } />
                <Route path="/robots.txt" element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <LazyRobotsTxtPage />
                  </Suspense>
                } />
                <Route path="/sitemap.xml" element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <LazySitemapXmlPage />
                  </Suspense>
                } />
                <Route path="/privacy" element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <LazyPrivacyPolicyPage />
                  </Suspense>
                } />
                <Route path="/attractions/:slug" element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <LazyAttractionPage />
                  </Suspense>
                } />
                {/* Hidden-gems → attractions redirects (explicit before catch-all) */}
                <Route path="/hidden-gems/arcadia-round-barn" element={<Navigate to="/attractions/arcadia-round-barn" replace />} />
                <Route path="/hidden-gems/cars-on-the-route" element={<Navigate to="/attractions/cars-on-the-route" replace />} />
                <Route path="/hidden-gems/chain-of-rocks-bridge" element={<Navigate to="/attractions/chain-of-rocks-bridge" replace />} />
                <Route path="/hidden-gems/elmers-bottle-tree-ranch" element={<Navigate to="/attractions/elmers-bottle-tree-ranch" replace />} />
                <Route path="/hidden-gems/galena-mining-historical-museum" element={<Navigate to="/attractions/galena-mining-historical-museum" replace />} />
                <Route path="/hidden-gems/route-66-state-park" element={<Navigate to="/attractions/route-66-state-park" replace />} />
                <Route path="/hidden-gems/standin-on-the-corner-park" element={<Navigate to="/attractions/standin-on-the-corner-park" replace />} />
                <Route path="/hidden-gems/route-66-association-hall-of-fame-museum" element={<Navigate to="/attractions/route-66-hall-of-fame-museum-pontiac" replace />} />
                <Route path="/hidden-gems/route-66-mother-road-museum" element={<Navigate to="/attractions/route-66-mother-road-museum-barstow" replace />} />
                <Route path="/hidden-gems/wigwam-motel-san-bernardino" element={<Navigate to="/attractions/wigwam-motel-rialto" replace />} />
                <Route path="/hidden-gems/big-texan-steak-ranch" element={<Navigate to="/attractions/the-big-texan-steak-ranch" replace />} />
                <Route path="/hidden-gems/leaning-water-tower" element={<Navigate to="/attractions/britten-leaning-water-tower" replace />} />
                <Route path="/hidden-gems/roys-motel-and-caf" element={<Navigate to="/attractions/roys-motel-cafe-amboy" replace />} />
                <Route path="/hidden-gems/route-66-museum" element={<Navigate to="/attractions/oklahoma-route-66-museum" replace />} />
                <Route path="/hidden-gems/odell-station" element={<Navigate to="/attractions/odell-standard-oil-gas-station" replace />} />
                <Route path="/hidden-gems/lucilles-historic-highway-gas-station" element={<Navigate to="/attractions/lucilles-service-station" replace />} />
                <Route path="/hidden-gems/garys-gay-parita" element={<Navigate to="/attractions/gay-parita-sinclair-gas-station" replace />} />
                <Route path="/hidden-gems/pops-soda-ranch" element={<Navigate to="/attractions/pops-arcadia" replace />} />
                <Route path="/hidden-gems/amarillo-route-66-historic-district" element={<Navigate to="/attractions/amarillo-sixth-street-route-66" replace />} />
                {/* Catch-all for remaining hidden-gem slugs */}
                <Route path="/hidden-gems/:slug" element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <LazyAttractionPage />
                  </Suspense>
                } />
                <Route path="/storymap" element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <LazyStoryMapPage />
                  </Suspense>
                } />
                {/* State pages - explicit routes for each Route 66 state */}
                {['illinois', 'missouri', 'kansas', 'oklahoma', 'texas', 'new-mexico', 'arizona', 'california'].map(
                  (stateSlug) => (
                    <Route key={stateSlug} path={`/${stateSlug}`} element={
                      <Suspense fallback={<RouteLoadingFallback />}>
                        <LazyStatePage />
                      </Suspense>
                    } />
                  )
                )}
                <Route path="*" element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <LazyNotFound />
                  </Suspense>
                } />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
            </MapFiltersProvider>
          </UnitProvider>
        </HelmetProvider>
      </SWRConfig>
    </QueryClientProvider>
  );
}

export default App;