
import React from 'react';

const AtmosphericElements: React.FC = () => {
  return (
    <div className="absolute inset-0">
      {/* Desert Highway Silhouette */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-16 opacity-20"
        style={{
          background: 'linear-gradient(to top, rgba(139,69,19,0.4) 0%, transparent 100%)',
          clipPath: 'polygon(0 100%, 100% 100%, 95% 60%, 80% 70%, 60% 50%, 40% 65%, 20% 45%, 5% 65%, 0 50%)'
        }}
      />
      
      {/* Vintage Neon Glow Effects */}
      <div className="absolute top-4 left-1/4 w-8 h-8 rounded-full bg-route66-vintage-turquoise opacity-20 animate-pulse" style={{ animationDelay: '0s', animationDuration: '4s' }} />
      <div className="absolute top-8 right-1/3 w-6 h-6 rounded-full bg-route66-vintage-yellow opacity-15 animate-pulse" style={{ animationDelay: '2s', animationDuration: '6s' }} />
      <div className="absolute bottom-6 left-1/6 w-4 h-4 rounded-full bg-route66-vintage-red opacity-25 animate-pulse" style={{ animationDelay: '1s', animationDuration: '5s' }} />
    </div>
  );
};

export default AtmosphericElements;
