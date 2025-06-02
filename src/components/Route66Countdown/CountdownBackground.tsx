
import React from 'react';

const CountdownBackground: React.FC = () => {
  return (
    <>
      {/* Americana paper background with chrome frame */}
      <div 
        className="absolute inset-0 rounded-xl"
        style={{
          background: `
            linear-gradient(45deg, #f8f9fa 0%, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%, #f8f9fa 100%),
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              rgba(220, 53, 69, 0.05) 2px,
              rgba(220, 53, 69, 0.05) 4px
            )
          `,
          border: '8px solid',
          borderImage: 'linear-gradient(135deg, #C0C0C0, #E8E8E8, #A8A8A8, #D3D3D3, #C0C0C0) 1',
          boxShadow: `
            inset 0 0 20px rgba(0,0,0,0.1),
            0 0 30px rgba(0,0,0,0.3),
            0 0 60px rgba(220, 53, 69, 0.2)
          `
        }}
      />

      {/* Chrome corner brackets */}
      <div className="absolute top-2 left-2 w-12 h-12 border-t-4 border-l-4 rounded-tl-lg opacity-80"
           style={{ borderColor: '#E8E8E8', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }} />
      <div className="absolute top-2 right-2 w-12 h-12 border-t-4 border-r-4 rounded-tr-lg opacity-80"
           style={{ borderColor: '#E8E8E8', filter: 'drop-shadow(-2px 2px 4px rgba(0,0,0,0.3))' }} />
      <div className="absolute bottom-2 left-2 w-12 h-12 border-b-4 border-l-4 rounded-bl-lg opacity-80"
           style={{ borderColor: '#E8E8E8', filter: 'drop-shadow(2px -2px 4px rgba(0,0,0,0.3))' }} />
      <div className="absolute bottom-2 right-2 w-12 h-12 border-b-4 border-r-4 rounded-br-lg opacity-80"
           style={{ borderColor: '#E8E8E8', filter: 'drop-shadow(-2px -2px 4px rgba(0,0,0,0.3))' }} />
    </>
  );
};

export default CountdownBackground;
