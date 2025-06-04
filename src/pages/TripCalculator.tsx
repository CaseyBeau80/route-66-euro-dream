
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
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-26 bg-route66-vintage-beige rounded-lg border-4 border-black shadow-xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-1 border-2 border-black rounded-md"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full">
                      <div className="text-black text-xs font-bold font-americana tracking-wider">ROUTE</div>
                      <div className="text-black text-2xl font-black leading-none font-route66">66</div>
                      <div className="text-black text-[8px] font-travel">TRIP PLANNER</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-lg bg-route66-yellow opacity-20 blur-lg animate-pulse"></div>
                </div>
              </div>
              
              <h1 className="font-route66 text-3xl md:text-4xl lg:text-5xl text-route66-red mb-4">
                ROUTE 66 TRIP PLANNER
              </h1>
              <p className="font-travel text-lg text-route66-gray max-w-2xl mx-auto">
                Plan your perfect Route 66 adventure. Calculate distances, discover the best stops, and create your custom itinerary along the Mother Road.
              </p>
            </div>
            
            {/* Trip Calculator Container */}
            <div 
              className="rounded-lg shadow-lg p-6"
              style={{
                background: `
                  linear-gradient(145deg, #FFFFFF 0%, #F8F8F8 50%, #FFFFFF 100%)
                `,
                border: '4px solid #8B4513',
                boxShadow: `
                  inset 0 0 20px rgba(139, 69, 19, 0.1),
                  0 15px 30px rgba(0, 0, 0, 0.2),
                  0 0 40px rgba(139, 69, 19, 0.1)
                `
              }}
            >
              <Route66TripCalculator />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCalculator;
