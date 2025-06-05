
import React from 'react';
import { Car, Globe, Music, Calendar } from 'lucide-react';

const Route66FunFacts: React.FC = () => {
  const funFacts = [
    {
      title: "THE MOTHER ROAD",
      fact: "Route 66 was one of the original highways within the U.S. Highway System, established on November 11, 1926.",
      icon: <Car className="w-8 h-8" />,
      color: "from-red-500 to-red-700"
    },
    {
      title: "COAST TO COAST",
      fact: "Spanning 2,448 miles from Chicago to Santa Monica, crossing 8 states and 3 time zones.",
      icon: <Globe className="w-8 h-8" />,
      color: "from-blue-500 to-blue-700"
    },
    {
      title: "CULTURAL ICON",
      fact: "Immortalized in literature, music, and film - from John Steinbeck's 'Grapes of Wrath' to the classic song 'Route 66'.",
      icon: <Music className="w-8 h-8" />,
      color: "from-purple-500 to-purple-700"
    },
    {
      title: "MODERN LEGACY",
      fact: "Home to America's most iconic roadside culture, vintage motels, and classic diners that defined American travel.",
      icon: <Car className="w-8 h-8" />,
      color: "from-green-500 to-green-700"
    },
    {
      title: "CENTENNIAL CELEBRATION",
      fact: "2026 marks 100 years of the Mother Road - a century of American adventure and freedom.",
      icon: <Calendar className="w-8 h-8" />,
      color: "from-yellow-500 to-yellow-700"
    }
  ];

  return (
    <div className="p-8 rounded-2xl h-full bg-black/40 backdrop-blur-md border border-white/20 shadow-2xl">
      <h3 
        className="text-2xl font-bold mb-8 text-center text-white"
        style={{
          fontFamily: "'Russo One', 'Arial Black', sans-serif",
          textShadow: `
            2px 2px 0px #000000,
            4px 4px 6px rgba(0,0,0,0.8),
            0 0 15px rgba(255, 255, 255, 0.8)
          `
        }}
      >
        Route 66 Facts
      </h3>
      
      {/* Horizontal Scrolling Container */}
      <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
        <div className="flex gap-6 w-max">
          {funFacts.map((item, index) => (
            <div 
              key={index}
              className="flex-shrink-0 w-80 p-6 rounded-xl transition-all duration-300 hover:scale-105 cursor-default bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 hover:shadow-2xl group"
              style={{
                minHeight: '200px'
              }}
            >
              {/* Icon with gradient background */}
              <div 
                className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                {item.icon}
              </div>
              
              <h4 
                className="text-sm font-bold mb-3 tracking-wide text-white uppercase"
                style={{
                  fontFamily: "'Russo One', 'Arial Black', sans-serif",
                  textShadow: `
                    1px 1px 0px #000000,
                    2px 2px 4px rgba(0,0,0,0.8)
                  `
                }}
              >
                {item.title}
              </h4>
              
              <p 
                className="text-sm leading-relaxed text-white/90"
                style={{
                  textShadow: `
                    1px 1px 0px #000000,
                    2px 2px 4px rgba(0,0,0,0.6)
                  `
                }}
              >
                {item.fact}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <div className="text-white/60 text-sm font-medium">
          ← Scroll for more facts →
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="mt-8 flex justify-center items-center gap-2">
        <div className="w-8 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full"></div>
        <div className="w-3 h-3 bg-white rounded-full border-2 border-white/30"></div>
        <div className="w-8 h-1 bg-gradient-to-l from-blue-500 to-blue-700 rounded-full"></div>
      </div>
    </div>
  );
};

export default Route66FunFacts;
