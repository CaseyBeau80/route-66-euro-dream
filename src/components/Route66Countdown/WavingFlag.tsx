
import React from 'react';

const WavingFlag: React.FC = () => {
  return (
    <div className="relative inline-block">
      {/* Flag pole */}
      <div 
        className="w-1 h-20 bg-gradient-to-b from-gray-600 to-gray-800 relative"
        style={{
          boxShadow: '2px 0 4px rgba(0,0,0,0.3)'
        }}
      >
        {/* Flag */}
        <div 
          className="absolute top-2 left-1 w-16 h-10 bg-gradient-to-r from-red-600 via-white to-blue-600 origin-left transform-gpu"
          style={{
            background: `
              linear-gradient(to bottom,
                #dc2626 0%, #dc2626 33%,
                #ffffff 33%, #ffffff 66%,
                #1d4ed8 66%, #1d4ed8 100%
              )
            `,
            clipPath: 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)',
            animation: 'flag-wave 2s ease-in-out infinite',
            transformOrigin: 'left center',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.3)'
          }}
        >
          {/* Flag texture overlay */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: `
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 2px,
                  rgba(0,0,0,0.1) 2px,
                  rgba(0,0,0,0.1) 4px
                )
              `
            }}
          />
          
          {/* Stars on blue section */}
          <div className="absolute top-1 left-1 text-white text-xs">
            ★
          </div>
          <div className="absolute top-1 left-4 text-white text-xs">
            ★
          </div>
          <div className="absolute bottom-1 left-1 text-white text-xs">
            ★
          </div>
          <div className="absolute bottom-1 left-4 text-white text-xs">
            ★
          </div>
        </div>
        
        {/* Pole finial */}
        <div 
          className="absolute -top-2 -left-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full"
          style={{
            boxShadow: '0 0 8px rgba(255, 215, 0, 0.6)'
          }}
        />
      </div>

      {/* Custom CSS for flag waving animation */}
      <style>{`
        @keyframes flag-wave {
          0%, 100% {
            transform: rotateY(0deg) skewY(0deg);
          }
          25% {
            transform: rotateY(-5deg) skewY(1deg);
          }
          50% {
            transform: rotateY(0deg) skewY(0deg);
          }
          75% {
            transform: rotateY(5deg) skewY(-1deg);
          }
        }
      `}</style>
    </div>
  );
};

export default WavingFlag;
