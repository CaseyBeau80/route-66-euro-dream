
import React from 'react';

const Route66FunFacts: React.FC = () => {
  const funFacts = [
    {
      title: "THE MOTHER ROAD",
      fact: "Route 66 was one of the original highways within the U.S. Highway System, established on November 11, 1926."
    },
    {
      title: "COAST TO COAST",
      fact: "Spanning 2,448 miles from Chicago to Santa Monica, crossing 8 states and 3 time zones."
    },
    {
      title: "CULTURAL ICON",
      fact: "Immortalized in literature, music, and film - from John Steinbeck's 'Grapes of Wrath' to the classic song 'Route 66'."
    },
    {
      title: "MODERN LEGACY",
      fact: "Home to America's most iconic roadside culture, vintage motels, and classic diners that defined American travel."
    },
    {
      title: "CENTENNIAL CELEBRATION",
      fact: "2026 marks 100 years of the Mother Road - a century of American adventure and freedom."
    }
  ];

  return (
    <div className="p-8 rounded-2xl h-full bg-route66-background border border-route66-border shadow-xl">
      <h3 className="text-2xl font-bold mb-8 text-center text-route66-text-primary">
        Route 66 Facts
      </h3>
      
      <div className="space-y-6">
        {funFacts.map((item, index) => (
          <div 
            key={index}
            className="p-6 rounded-xl transition-all duration-300 hover:scale-105 cursor-default bg-route66-background-alt border border-route66-border hover:border-route66-primary/30 hover:shadow-lg"
          >
            <h4 className="text-sm font-bold mb-3 tracking-wide text-route66-primary uppercase">
              {item.title}
            </h4>
            <p className="text-sm leading-relaxed text-route66-text-secondary">
              {item.fact}
            </p>
          </div>
        ))}
      </div>
      
      {/* Modern decorative elements */}
      <div className="mt-8 flex justify-center items-center gap-2">
        <div className="w-8 h-1 bg-gradient-to-r from-route66-primary to-route66-accent-orange rounded-full"></div>
        <div className="w-3 h-3 bg-route66-accent-yellow rounded-full border-2 border-route66-border"></div>
        <div className="w-8 h-1 bg-gradient-to-l from-route66-primary to-route66-accent-orange rounded-full"></div>
      </div>
    </div>
  );
};

export default Route66FunFacts;
