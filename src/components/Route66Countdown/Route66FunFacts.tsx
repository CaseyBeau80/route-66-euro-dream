
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
      title: "NEON LEGACY",
      fact: "Home to America's most iconic neon signs, vintage motels, and classic diners that defined roadside culture."
    },
    {
      title: "CENTENNIAL CELEBRATION",
      fact: "2026 marks 100 years of the Mother Road - a century of American adventure and freedom."
    }
  ];

  return (
    <div 
      className="p-6 rounded-lg h-full"
      style={{
        background: `
          linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 50%, #F8F9FA 100%),
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 3px,
            rgba(220, 53, 69, 0.05) 3px,
            rgba(220, 53, 69, 0.05) 6px
          )
        `,
        border: '4px solid',
        borderImage: 'linear-gradient(135deg, #C0C0C0, #E8E8E8, #A8A8A8, #D3D3D3) 1',
        boxShadow: `
          inset 0 0 15px rgba(0,0,0,0.1),
          0 0 20px rgba(0,0,0,0.2),
          0 0 40px rgba(220, 53, 69, 0.1)
        `
      }}
    >
      <h3 
        className="text-xl font-bold mb-6 text-center tracking-wider"
        style={{
          fontFamily: "'Russo One', 'Arial Black', sans-serif",
          color: '#DC2626',
          textShadow: `
            2px 2px 0px #FFFFFF,
            4px 4px 6px rgba(0,0,0,0.4),
            0 0 10px rgba(255, 255, 255, 0.6)
          `,
          letterSpacing: '0.1em'
        }}
      >
        ROUTE 66 FACTS
      </h3>
      
      <div className="space-y-4">
        {funFacts.map((item, index) => (
          <div 
            key={index}
            className="p-4 rounded-lg transition-all duration-300 hover:scale-105 cursor-default"
            style={{
              background: `
                linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)
              `,
              border: '2px solid',
              borderImage: 'linear-gradient(135deg, #DC2626, #EF4444, #DC2626) 1',
              boxShadow: `
                inset 0 2px 4px rgba(255,255,255,0.3),
                0 2px 8px rgba(0,0,0,0.2),
                0 0 15px rgba(220, 38, 38, 0.1)
              `,
              animation: `fade-in 0.6s ease-out ${index * 0.1}s both`
            }}
          >
            <h4 
              className="text-sm font-bold mb-2 tracking-wide"
              style={{
                fontFamily: "'Russo One', 'Arial Black', sans-serif",
                color: '#1E40AF',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                letterSpacing: '0.05em'
              }}
            >
              {item.title}
            </h4>
            <p 
              className="text-xs leading-relaxed"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: '#374151',
                lineHeight: '1.5'
              }}
            >
              {item.fact}
            </p>
          </div>
        ))}
      </div>
      
      {/* Decorative elements */}
      <div className="mt-6 flex justify-center items-center gap-2">
        <div className="w-8 h-1 bg-gradient-to-r from-route66-vintage-red to-route66-orange rounded-full"></div>
        <div className="w-3 h-3 bg-route66-vintage-yellow rounded-full border-2 border-route66-vintage-brown"></div>
        <div className="w-8 h-1 bg-gradient-to-l from-route66-vintage-red to-route66-orange rounded-full"></div>
      </div>
    </div>
  );
};

export default Route66FunFacts;
