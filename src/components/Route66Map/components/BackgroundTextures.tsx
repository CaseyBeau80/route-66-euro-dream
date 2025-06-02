
import React from 'react';

const BackgroundTextures: React.FC = () => {
  return (
    <>
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
    </>
  );
};

export default BackgroundTextures;
