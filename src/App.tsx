import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { UnitProvider } from "@/contexts/UnitContext";
import Index from "./pages/Index";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import SharedTripPage from "./pages/SharedTripPage";
import NotFound from "./pages/NotFound";
import RobotsTxtPage from "./pages/RobotsTxtPage";
import SitemapXmlPage from "./pages/SitemapXmlPage";

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
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <UnitProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/trip/:shareCode" element={<SharedTripPage />} />
                <Route path="/robots.txt" element={<RobotsTxtPage />} />
                <Route path="/sitemap.xml" element={<SitemapXmlPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </UnitProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;