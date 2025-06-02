
import React from 'react';

const VintageBorders: React.FC = () => {
  return (
    <>
      {/* Vintage Border Effects */}
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(90deg, #FFD700 0%, #FF6B35 25%, #48CAE4 50%, #FF6B35 75%, #FFD700 100%)',
          opacity: 0.8
        }}
      />
      <div 
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(90deg, #DC2626 0%, #8B4513 25%, #F5F5DC 50%, #8B4513 75%, #DC2626 100%)',
          opacity: 0.6
        }}
      />

      {/* Corner Decorative Elements */}
      <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-route66-vintage-yellow opacity-60 rounded-tl-lg" />
      <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-route66-vintage-yellow opacity-60 rounded-tr-lg" />
      <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-route66-vintage-yellow opacity-60 rounded-bl-lg" />
      <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-route66-vintage-yellow opacity-60 rounded-br-lg" />
    </>
  );
};

export default VintageBorders;
