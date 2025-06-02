
import React from 'react';

const NostalgicRoute66Banner: React.FC = () => {
  return (
    <div className="relative w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Textured Background Layer */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(220, 38, 38, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(72, 202, 228, 0.12) 0%, transparent 50%),
            linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.3) 25%, transparent 50%, rgba(0,0,0,0.2) 75%, transparent 100%),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 8px,
              rgba(255,255,255,0.02) 8px,
              rgba(255,255,255,0.02) 12px
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 12px,
              rgba(0,0,0,0.1) 12px,
              rgba(0,0,0,0.1) 16px
            )
          `,
          filter: 'contrast(1.1) brightness(0.95)'
        }}
      />

      {/* Vintage Road Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at top, rgba(255,215,0,0.1) 0%, transparent 60%),
            radial-gradient(ellipse at bottom, rgba(220,38,38,0.08) 0%, transparent 60%),
            linear-gradient(
              45deg,
              rgba(0,0,0,0.1) 25%,
              transparent 25%,
              transparent 75%,
              rgba(0,0,0,0.1) 75%
            )
          `,
          backgroundSize: '40px 40px, 60px 60px, 20px 20px'
        }}
      />

      {/* Atmospheric Elements */}
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

      {/* Main Content Container */}
      <div className="relative z-10 flex items-center justify-center py-3 px-4">
        {/* Central Title */}
        <div className="flex-1 text-center px-4">
          <h2 
            className="text-lg font-bold tracking-wider leading-tight"
            style={{
              fontFamily: "'Russo One', 'Arial Black', sans-serif",
              color: '#F5F5DC',
              textShadow: `
                2px 2px 0px #8B4513,
                4px 4px 0px #DC2626,
                6px 6px 8px rgba(0,0,0,0.8),
                0 0 15px rgba(255,215,0,0.4),
                0 0 25px rgba(72,202,228,0.3)
              `,
              letterSpacing: '0.15em',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
            }}
          >
            ROUTE 66 INTERACTIVE MAP
          </h2>
          
          {/* Vintage Subtitle */}
          <div 
            className="text-xs mt-1 tracking-widest opacity-90"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: '#F5F5DC',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
              letterSpacing: '0.2em'
            }}
          >
            THE MOTHER ROAD EXPERIENCE
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default NostalgicRoute66Banner;
