
import React from 'react';

interface CelebrationEffectsProps {
  isVisible: boolean;
  score: number;
  totalQuestions: number;
}

const CelebrationEffects: React.FC<CelebrationEffectsProps> = ({ isVisible, score, totalQuestions }) => {
  const percentage = (score / totalQuestions) * 100;
  
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Confetti for perfect score */}
      {percentage === 100 && (
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={`confetti-${i}`}
              className="absolute w-2 h-2 animate-birthday-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#ef4444', '#3b82f6', '#f59e0b', '#10b981'][Math.floor(Math.random() * 4)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}
      
      {/* Sparkles for high scores */}
      {percentage >= 80 && (
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute text-yellow-400 text-xl animate-birthday-sparkle"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}
      
      {/* Route 66 shields floating animation for completion */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={`shield-${i}`}
            className="absolute text-2xl opacity-20 animate-route66-cruise"
            style={{
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          >
            🛡️
          </div>
        ))}
      </div>
    </div>
  );
};

export default CelebrationEffects;
