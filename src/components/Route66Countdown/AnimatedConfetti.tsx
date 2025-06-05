
import React from 'react';

const AnimatedConfetti: React.FC = () => {
  // Generate confetti pieces with different colors, sizes, and positions
  const confettiPieces = Array.from({ length: 50 }, (_, i) => {
    const colors = ['#dc2626', '#1d4ed8', '#ffffff', '#ffd700', '#ff4500'];
    const shapes = ['circle', 'square', 'triangle'];
    
    return {
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      size: Math.random() * 10 + 5, // 5-15px
      left: Math.random() * 100, // 0-100%
      animationDelay: Math.random() * 3, // 0-3s delay
      animationDuration: Math.random() * 3 + 4, // 4-7s duration
      horizontalMovement: (Math.random() - 0.5) * 100, // -50px to 50px
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall opacity-80"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.animationDelay}s`,
            animationDuration: `${piece.animationDuration}s`,
            '--horizontal-movement': `${piece.horizontalMovement}px`,
          } as React.CSSProperties}
        >
          {piece.shape === 'circle' && (
            <div
              className="rounded-full"
              style={{
                width: `${piece.size}px`,
                height: `${piece.size}px`,
                backgroundColor: piece.color,
                boxShadow: `0 0 ${piece.size}px ${piece.color}40`,
              }}
            />
          )}
          {piece.shape === 'square' && (
            <div
              className="transform rotate-45"
              style={{
                width: `${piece.size}px`,
                height: `${piece.size}px`,
                backgroundColor: piece.color,
                boxShadow: `0 0 ${piece.size}px ${piece.color}40`,
              }}
            />
          )}
          {piece.shape === 'triangle' && (
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `${piece.size / 2}px solid transparent`,
                borderRight: `${piece.size / 2}px solid transparent`,
                borderBottom: `${piece.size}px solid ${piece.color}`,
                filter: `drop-shadow(0 0 ${piece.size / 2}px ${piece.color}40)`,
              }}
            />
          )}
        </div>
      ))}

      {/* Custom CSS for confetti animation */}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) translateX(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(var(--horizontal-movement)) rotate(720deg);
            opacity: 0;
          }
        }
        
        .animate-confetti-fall {
          animation: confetti-fall linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AnimatedConfetti;
