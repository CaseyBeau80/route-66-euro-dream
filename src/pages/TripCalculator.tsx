
import { useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import Route66TripCalculator from "@/components/Route66TripCalculator";

const TripCalculator = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "nl">("en");

  return (
    <div className="min-h-screen bg-gradient-to-br from-route66-cream via-route66-tan to-route66-vintage-beige vintage-paper-texture">
      {/* Navigation Bar */}
      <NavigationBar language={language} setLanguage={setLanguage} />
      
      {/* Main Content */}
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-route66 text-4xl md:text-5xl text-route66-red mb-4">
                ROUTE 66 TRIP PLANNER
              </h1>
              <p className="font-travel text-lg text-route66-gray max-w-2xl mx-auto">
                Plan your perfect Route 66 adventure. Calculate distances, discover the best stops, and create your custom itinerary along the Mother Road.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-route66-vintage-yellow">
              <Route66TripCalculator />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCalculator;
