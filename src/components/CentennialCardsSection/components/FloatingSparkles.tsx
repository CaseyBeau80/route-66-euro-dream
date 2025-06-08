
import React from 'react';
import { Sparkles } from 'lucide-react';

const FloatingSparkles: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(12)].map((_, i) => (
      <Sparkles
        key={i}
        className={`absolute w-4 h-4 text-blue-400 animate-birthday-sparkle opacity-60`}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 2}s`
        }}
      />
    ))}
  </div>
);

export default FloatingSparkles;
