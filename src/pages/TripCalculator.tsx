
import { useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import TripCalculatorForm from "@/components/TripCalculator/TripCalculatorForm";
import TripCalculatorResults from "@/components/TripCalculator/TripCalculatorResults";
import { useTripCalculation } from "@/components/TripCalculator/hooks/useTripCalculation";

const TripCalculator = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "nl">("en");
  const {
    formData,
    setFormData,
    calculation,
    availableEndLocations,
    calculateTrip,
    isCalculateDisabled
  } = useTripCalculation();

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
                ROUTE 66 TRIP CALCULATOR
              </h1>
              <p className="font-travel text-lg text-route66-gray max-w-2xl mx-auto">
                Plan your perfect Route 66 adventure. Calculate distances, costs, and discover the best stops along the Mother Road.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-route66-vintage-yellow">
                <TripCalculatorForm 
                  formData={formData}
                  setFormData={setFormData}
                  availableEndLocations={availableEndLocations}
                  onCalculate={calculateTrip}
                  isCalculateDisabled={isCalculateDisabled}
                />
              </div>
              
              {calculation && (
                <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-route66-vintage-yellow">
                  <TripCalculatorResults calculation={calculation} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCalculator;
