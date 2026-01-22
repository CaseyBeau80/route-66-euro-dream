import React, { useEffect, Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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