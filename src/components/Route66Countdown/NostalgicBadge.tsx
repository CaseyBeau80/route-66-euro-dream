
import React from 'react';
import { Star } from 'lucide-react';

const NostalgicBadge: React.FC = () => {
  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Stamp-style Badge */}
      <div 
        className="relative bg-gradient-to-br from-red-600 via-white to-blue-600 p-1 rounded-lg shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300"
        style={{
          background: `
            conic-gradient(from 0deg at 50% 50%, 
              #dc2626 0deg, #dc2626 60deg, 
              #ffffff 60deg, #ffffff 120deg,
              #1d4ed8 120deg, #1d4ed8 180deg,
              #ffffff 180deg, #ffffff 240deg,
              #dc2626 240deg, #dc2626 300deg,
              #ffffff 300deg, #ffffff 360deg
            )
          `,
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))'
        }}
      >
        <div className="bg-white p-4 rounded-md relative overflow-hidden">
          {/* Perforated edge effect */}
          <div 
            className="absolute inset-0 border-2 border-dashed border-gray-300"
            style={{
              borderImage: 'repeating-linear-gradient(45deg, #ccc 0px, #ccc 5px, transparent 5px, transparent 10px) 2'
            }}
          ></div>
          
          {/* Badge content */}
          <div className="relative z-10 text-center">
            <div className="flex justify-center mb-2">
              <Star className="w-6 h-6 text-yellow-500 fill-current" />
            </div>
            <div 
              className="text-xs font-black text-red-600 tracking-wider uppercase"
              style={{
                fontFamily: "'Black Ops One', 'Impact', sans-serif"
              }}
            >
              OFFICIAL
            </div>
            <div 
              className="text-lg font-black text-blue-700 tracking-wider"
              style={{
                fontFamily: "'Black Ops One', 'Impact', sans-serif"
              }}
            >
              ROUTE 66
            </div>
            <div 
              className="text-xs font-bold text-red-600 tracking-wider"
              style={{
                fontFamily: "'Russo One', 'Arial Black', sans-serif"
              }}
            >
              CENTENNIAL
            </div>
          </div>
          
          {/* Vintage texture overlay */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: `
                repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 1px,
                  rgba(139, 69, 19, 0.1) 1px,
                  rgba(139, 69, 19, 0.1) 2px
                )
              `
            }}
          ></div>
        </div>
      </div>
      
      {/* Glow effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-red-500 via-white to-blue-500 rounded-lg blur-md opacity-30 -z-10"
        style={{
          animation: 'patriotic-glow 2s ease-in-out infinite alternate'
        }}
      ></div>
    </div>
  );
};

export default NostalgicBadge;
