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
import NotFound from "./pages/NotFound";

console.log('🎯 App.tsx loading...');

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
  console.log('🏗️ App component rendering...');
  
  return (
    <div style={{ minHeight: '100vh', background: 'white' }}>
      <h1 style={{ padding: '20px', color: 'black' }}>Website Loading...</h1>
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
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </UnitProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;