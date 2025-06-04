
import { useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import Route66TripCalculator from "@/components/Route66TripCalculator";

const TripCalculator = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "nl">("en");

  return (
    <div className="min-h-screen bg-gradient-to-br from-route66-background via-route66-background-alt to-route66-background-section">
      {/* Navigation Bar */}
      <NavigationBar language={language} setLanguage={setLanguage} />
      
      {/* Main Content */}
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Modern Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-26 bg-route66-background rounded-lg border-2 border-route66-primary shadow-xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-1 border border-route66-border rounded-md"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full">
                      <div className="text-route66-text-muted text-xs font-semibold tracking-wider">ROUTE</div>
                      <div className="text-route66-primary text-2xl font-black leading-none">66</div>
                      <div className="text-route66-text-muted text-[8px] font-medium">TRIP PLANNER</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-lg bg-route66-primary/20 opacity-20 blur-lg animate-pulse"></div>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-route66-text-primary mb-4">
                Route 66 Trip Planner
              </h1>
              <p className="text-lg text-route66-text-secondary max-w-2xl mx-auto leading-relaxed">
                Plan your perfect Route 66 adventure. Calculate distances, discover the best stops, and create your custom itinerary along the Mother Road.
              </p>
            </div>
            
            {/* Modern Trip Calculator Container */}
            <div className="bg-route66-background rounded-xl shadow-lg border border-route66-border p-6">
              <Route66TripCalculator />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCalculator;
