
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
              <div className="flex justify-center items-center gap-4 mb-6">
                {/* Removed Route 66 shield icon and Unit Toggle */}
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
                  <h3 className="font-bold text-route66-text-primary mb-2">Trip Planner</h3>
                  <p className="text-sm text-route66-text-secondary">Budget your adventure with fuel costs, accommodations, and attraction fees</p>
                </div>
              </div>
            </div>
            
            {/* Trip Planner Container */}
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
