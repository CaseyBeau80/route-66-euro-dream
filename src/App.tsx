
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UnitProvider } from "@/contexts/UnitContext";
import Index from "./pages/Index";
import TripCalculator from "./pages/TripCalculator";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UnitProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/trip-calculator" element={<TripCalculator />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UnitProvider>
    </QueryClientProvider>
  );
}

export default App;
