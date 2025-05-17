
import { useEffect, useState } from "react";
import { Route, MapPin } from "lucide-react";

// Major cities along Route 66
const route66Cities = [
  { name: "Chicago, IL", description: "Starting point of Route 66" },
  { name: "St. Louis, MO", description: "Gateway to the West" },
  { name: "Oklahoma City, OK", description: "Heart of Route 66 country" },
  { name: "Amarillo, TX", description: "Home to the Cadillac Ranch" },
  { name: "Albuquerque, NM", description: "Largest city in New Mexico" },
  { name: "Flagstaff, AZ", description: "Gateway to the Grand Canyon" },
  { name: "Los Angeles, CA", description: "End of the historic Route 66" },
];

// States that Route 66 passes through
const route66States = [
  "Illinois", 
  "Missouri", 
  "Kansas", 
  "Oklahoma", 
  "Texas", 
  "New Mexico", 
  "Arizona", 
  "California"
];

const Route66Map = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  return (
    <section id="map-section" className="py-12 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-route66 text-route66-red text-center mb-8">Explore Route 66</h2>
        <p className="text-lg text-center mb-8 max-w-3xl mx-auto">
          The historic Route 66 stretches from Chicago to Santa Monica, spanning 8 states and over 2,400 miles of American history.
        </p>
        
        {/* Fallback map display - stylized representation */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="relative bg-gray-100 rounded-lg p-4 overflow-hidden" style={{ minHeight: "500px" }}>
            {/* Route line */}
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-route66-red transform -translate-y-1/2 rounded-full"></div>
            
            {/* Decorative elements */}
            <Route className="absolute top-1/2 left-1/4 text-route66-red h-8 w-8 transform -translate-y-1/2 -translate-x-1/2" />
            <Route className="absolute top-1/2 right-1/4 text-route66-red h-8 w-8 transform -translate-y-1/2 translate-x-1/2" />
            
            {/* Map image as background - using uploaded image */}
            <img 
              src="/lovable-uploads/20aec920-4e4d-4f65-a654-8887a4c6edd3.png" 
              alt="Route 66 Map"
              className="absolute inset-0 w-full h-full object-contain opacity-20" 
            />
            
            {/* City markers */}
            <div className="flex justify-between relative z-10 mt-8">
              {route66Cities.map((city, index) => (
                <div 
                  key={city.name} 
                  className={`flex flex-col items-center cursor-pointer transition-all duration-200 ${
                    selectedCity === city.name ? "scale-110" : ""
                  }`}
                  style={{ 
                    left: `${(index * 100) / (route66Cities.length - 1)}%`, 
                    position: "absolute",
                    transform: "translateX(-50%)"
                  }}
                  onClick={() => setSelectedCity(city.name === selectedCity ? null : city.name)}
                >
                  <MapPin size={24} className="text-route66-red mb-2" />
                  <div className="text-xs font-medium text-gray-800">{city.name}</div>
                  
                  {/* City info popup */}
                  {selectedCity === city.name && (
                    <div className="absolute top-full mt-2 bg-white p-3 rounded-lg shadow-lg z-20 w-48">
                      <h4 className="font-bold text-sm">{city.name}</h4>
                      <p className="text-xs text-gray-600">{city.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="w-full">
              <h3 className="text-xl font-medium text-center mb-4">The 8 States of Route 66</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {route66States.map((state) => (
                  <div key={state} className="px-4 py-2 bg-gray-100 rounded-full text-sm">
                    {state}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="map-legend mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-route66-red inline-block mr-1"></span>
              <span>Major Cities</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-[#cccccc] inline-block mr-1"></span>
              <span>States</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Route66Map;
