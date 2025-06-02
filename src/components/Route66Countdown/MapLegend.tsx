
import React from 'react';

const MapLegend: React.FC = () => {
  const legendItems = [
    {
      icon: <div className="w-4 h-4 bg-route66-vintage-red rounded-full border-2 border-white shadow-md"></div>,
      label: "Historic Towns",
      description: "Major stops along Route 66"
    },
    {
      icon: <div className="w-6 h-2 bg-route66-orange rounded-sm shadow-md"></div>,
      label: "Route 66 Path",
      description: "The Mother Road's original route"
    },
    {
      icon: <div className="w-4 h-4 bg-route66-vintage-turquoise rounded-full border-2 border-white shadow-md"></div>,
      label: "Hidden Gems",
      description: "Secret spots & local treasures"
    },
    {
      icon: <span className="text-route66-vintage-yellow text-lg">🗺️</span>,
      label: "Interactive Map",
      description: "Click states to explore"
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
            rgba(30, 64, 175, 0.05) 3px,
            rgba(30, 64, 175, 0.05) 6px
          )
        `,
        border: '4px solid',
        borderImage: 'linear-gradient(135deg, #C0C0C0, #E8E8E8, #A8A8A8, #D3D3D3) 1',
        boxShadow: `
          inset 0 0 15px rgba(0,0,0,0.1),
          0 0 20px rgba(0,0,0,0.2),
          0 0 40px rgba(30, 64, 175, 0.1)
        `
      }}
    >
      <h3 
        className="text-xl font-bold mb-6 text-center tracking-wider"
        style={{
          fontFamily: "'Russo One', 'Arial Black', sans-serif",
          color: '#1E40AF',
          textShadow: `
            2px 2px 0px #FFFFFF,
            4px 4px 6px rgba(0,0,0,0.4),
            0 0 10px rgba(255, 255, 255, 0.6)
          `,
          letterSpacing: '0.1em'
        }}
      >
        MAP LEGEND
      </h3>
      
      <div className="space-y-4">
        {legendItems.map((item, index) => (
          <div 
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-default"
            style={{
              background: `
                linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)
              `,
              border: '2px solid',
              borderImage: 'linear-gradient(135deg, #1E40AF, #3B82F6, #1E40AF) 1',
              boxShadow: `
                inset 0 2px 4px rgba(255,255,255,0.3),
                0 2px 8px rgba(0,0,0,0.2),
                0 0 15px rgba(30, 64, 175, 0.1)
              `,
              animation: `fade-in 0.6s ease-out ${index * 0.1}s both`
            }}
          >
            <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">
              {item.icon}
            </div>
            <div className="flex-1">
              <h4 
                className="text-sm font-bold mb-1 tracking-wide"
                style={{
                  fontFamily: "'Russo One', 'Arial Black', sans-serif",
                  color: '#DC2626',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  letterSpacing: '0.05em'
                }}
              >
                {item.label}
              </h4>
              <p 
                className="text-xs leading-relaxed"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: '#374151',
                  lineHeight: '1.4'
                }}
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation tip */}
      <div 
        className="mt-6 p-3 rounded-lg text-center"
        style={{
          background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
          border: '2px solid #F59E0B',
          boxShadow: 'inset 0 2px 4px rgba(245, 158, 11, 0.2)'
        }}
      >
        <p 
          className="text-xs font-semibold"
          style={{
            fontFamily: "'Inter', sans-serif",
            color: '#92400E'
          }}
        >
          💡 Ctrl + scroll to zoom map
        </p>
      </div>
      
      {/* Decorative elements */}
      <div className="mt-4 flex justify-center items-center gap-2">
        <div className="w-8 h-1 bg-gradient-to-r from-route66-vintage-blue to-route66-vintage-turquoise rounded-full"></div>
        <div className="w-3 h-3 bg-route66-vintage-yellow rounded-full border-2 border-route66-vintage-brown"></div>
        <div className="w-8 h-1 bg-gradient-to-l from-route66-vintage-blue to-route66-vintage-turquoise rounded-full"></div>
      </div>
    </div>
  );
};

export default MapLegend;
