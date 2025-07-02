
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { UnitProvider } from "@/contexts/UnitContext";
import Index from "./pages/Index";
import TripDetailsPage from "./pages/TripDetailsPage";
import SharedTripPage from "./pages/SharedTripPage";


import FunFactsPage from "./pages/FunFactsPage";
import TriviaPage from "./pages/TriviaPage";
import NotFound from "./pages/NotFound";
import TestUploadPage from "./pages/test-upload";

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
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <UnitProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/shared-trip" element={<SharedTripPage />} />
                  
                  
                  <Route path="/fun-facts" element={<FunFactsPage />} />
                  <Route path="/trivia" element={<TriviaPage />} />
                  <Route path="/test-upload" element={<TestUploadPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </UnitProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
