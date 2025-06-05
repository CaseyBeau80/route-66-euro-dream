
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
            {/* Modern Header with Blue Theme */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-26 bg-white rounded-lg border-2 border-route66-primary shadow-xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
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
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-route66-primary mb-4">
                Plan Your Route 66 Adventure
              </h1>
              <p className="text-lg text-route66-text-secondary max-w-2xl mx-auto leading-relaxed mb-6">
                Create your perfect Mother Road journey with our comprehensive trip planning tools
              </p>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg border border-route66-border p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-route66-primary text-2xl mb-2">🛣️</div>
                  <h3 className="font-bold text-route66-text-primary mb-2">Custom Routes</h3>
                  <p className="text-sm text-route66-text-secondary">Plan your perfect Route 66 journey with personalized stops and attractions</p>
                </div>
                
                <div className="bg-white rounded-lg border border-route66-border p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-route66-primary text-2xl mb-2">⏱️</div>
                  <h3 className="font-bold text-route66-text-primary mb-2">Time Estimates</h3>
                  <p className="text-sm text-route66-text-secondary">Get accurate travel times and duration estimates for your entire trip</p>
                </div>
                
                <div className="bg-white rounded-lg border border-route66-border p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-route66-primary text-2xl mb-2">📍</div>
                  <h3 className="font-bold text-route66-text-primary mb-2">Must-See Stops</h3>
                  <p className="text-sm text-route66-text-secondary">Discover iconic landmarks, hidden gems, and authentic Route 66 experiences</p>
                </div>
                
                <div className="bg-white rounded-lg border border-route66-border p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-route66-primary text-2xl mb-2">🧮</div>
                  <h3 className="font-bold text-route66-text-primary mb-2">Cost Calculator</h3>
                  <p className="text-sm text-route66-text-secondary">Budget your adventure with fuel costs, accommodations, and attraction fees</p>
                </div>
              </div>
            </div>
            
            {/* Trip Calculator Container */}
            <div className="bg-white rounded-xl shadow-lg border border-route66-border p-6">
              <Route66TripCalculator />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCalculator;
