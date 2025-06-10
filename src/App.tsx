
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UnitProvider } from "@/contexts/UnitContext";
import Index from "./pages/Index";
import TripCalculator from "./pages/TripCalculator";
import TripDetailsPage from "./pages/TripDetailsPage";
import CountdownPage from "./pages/CountdownPage";
import TimelinePage from "./pages/TimelinePage";
import FunFactsPage from "./pages/FunFactsPage";
import TriviaPage from "./pages/TriviaPage";
import HorizontalJourneyPage from "./pages/HorizontalJourneyPage";
import NotFound from "./pages/NotFound";
import TestUploadPage from "./pages/test-upload";

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
              <Route path="/trip/:shareCode" element={<TripDetailsPage />} />
              <Route path="/countdown" element={<CountdownPage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/fun-facts" element={<FunFactsPage />} />
              <Route path="/trivia" element={<TriviaPage />} />
              <Route path="/horizontal-journey" element={<HorizontalJourneyPage />} />
              <Route path="/test-upload" element={<TestUploadPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UnitProvider>
    </QueryClientProvider>
  );
}

export default App;
