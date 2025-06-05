
import React from 'react';

const CountdownBackground: React.FC = () => {
  return (
    <>
      {/* Patriotic paper background with chrome frame */}
      <div 
        className="absolute inset-0 rounded-xl"
        style={{
          background: `
            linear-gradient(45deg, #f8f9fa 0%, #e9ecef 20%, #f8f9fa 40%, #e3f2fd 60%, #f8f9fa 80%, #e9ecef 100%),
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              rgba(220, 53, 69, 0.06) 2px,
              rgba(220, 53, 69, 0.06) 4px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 3px,
              rgba(29, 78, 216, 0.04) 3px,
              rgba(29, 78, 216, 0.04) 6px
            )
          `,
          border: '8px solid',
          borderImage: 'linear-gradient(135deg, #dc2626, #FFFFFF, #1d4ed8, #FFFFFF, #dc2626) 1',
          boxShadow: `
            inset 0 0 20px rgba(0,0,0,0.1),
            0 0 30px rgba(0,0,0,0.3),
            0 0 40px rgba(220, 53, 69, 0.2),
            0 0 50px rgba(29, 78, 216, 0.15)
          `
        }}
      />

      {/* Patriotic corner brackets */}
      <div className="absolute top-2 left-2 w-12 h-12 border-t-4 border-l-4 rounded-tl-lg opacity-80"
           style={{ 
             borderColor: '#dc2626', 
             filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3)) drop-shadow(0 0 8px rgba(220, 38, 38, 0.4))' 
           }} />
      <div className="absolute top-2 right-2 w-12 h-12 border-t-4 border-r-4 rounded-tr-lg opacity-80"
           style={{ 
             borderColor: '#1d4ed8', 
             filter: 'drop-shadow(-2px 2px 4px rgba(0,0,0,0.3)) drop-shadow(0 0 8px rgba(29, 78, 216, 0.4))' 
           }} />
      <div className="absolute bottom-2 left-2 w-12 h-12 border-b-4 border-l-4 rounded-bl-lg opacity-80"
           style={{ 
             borderColor: '#1d4ed8', 
             filter: 'drop-shadow(2px -2px 4px rgba(0,0,0,0.3)) drop-shadow(0 0 8px rgba(29, 78, 216, 0.4))' 
           }} />
      <div className="absolute bottom-2 right-2 w-12 h-12 border-b-4 border-r-4 rounded-br-lg opacity-80"
           style={{ 
             borderColor: '#dc2626', 
             filter: 'drop-shadow(-2px -2px 4px rgba(0,0,0,0.3)) drop-shadow(0 0 8px rgba(220, 38, 38, 0.4))' 
           }} />

      {/* Subtle patriotic stars pattern */}
      <div 
        className="absolute inset-4 opacity-10 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, #dc2626 2px, transparent 2px),
            radial-gradient(circle at 60% 40%, #1d4ed8 1px, transparent 1px),
            radial-gradient(circle at 80% 80%, #dc2626 1.5px, transparent 1.5px),
            radial-gradient(circle at 40% 90%, #1d4ed8 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px, 80px 80px, 70px 70px, 90px 90px'
        }}
      />
    </>
  );
};

export default CountdownBackground;
