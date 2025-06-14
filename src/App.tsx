
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { UnitProvider } from "@/contexts/UnitContext";
import Index from "./pages/Index";
import TripCalculator from "./pages/TripCalculator";
import TripDetailsPage from "./pages/TripDetailsPage";
import SharedTripPage from "./pages/SharedTripPage";
import CountdownPage from "./pages/CountdownPage";
import TimelinePage from "./pages/TimelinePage";
import FunFactsPage from "./pages/FunFactsPage";
import TriviaPage from "./pages/TriviaPage";
import NotFound from "./pages/NotFound";
import TestUploadPage from "./pages/test-upload";
import DirectSharedTripPage from './pages/DirectSharedTripPage';
import SerializedTripPage from './pages/SerializedTripPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <UnitProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/trip-calculator" element={<TripCalculator />} />
                <Route path="/trip/:shareCode" element={<TripDetailsPage />} />
                <Route path="/shared-trip" element={<SharedTripPage />} />
                <Route path="/countdown" element={<CountdownPage />} />
                <Route path="/timeline" element={<TimelinePage />} />
                <Route path="/fun-facts" element={<FunFactsPage />} />
                <Route path="/trivia" element={<TriviaPage />} />
                <Route path="/test-upload" element={<TestUploadPage />} />
                <Route path="/direct-trip" element={<DirectSharedTripPage />} />
                <Route path="/serialized-trip" element={<SerializedTripPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </TooltipProvider>
        </UnitProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
