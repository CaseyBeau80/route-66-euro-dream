
import React from 'react';

const BottomCelebrationElements: React.FC = () => {
  return (
    <div className="mt-12 flex flex-col items-center gap-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
      <div className="flex items-center gap-4">
        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
        <div className="text-4xl animate-birthday-bounce">🎊</div>
        <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full"></div>
      </div>
      <p className="text-blue-600 text-center max-w-md text-sm italic">
        "The Mother Road has been bringing people together for nearly 100 years. Let's celebrate this incredible journey!"
      </p>
    </div>
  );
};

export default BottomCelebrationElements;
