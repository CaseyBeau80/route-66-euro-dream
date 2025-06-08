
import React, { useState, useEffect } from 'react';
import { CACTUS_GROWTH_STAGES } from '../types/cactiTypes';
import CactusGrowth from './CactusGrowth';
import DesertBackground from './DesertBackground';

interface CactiGardenProps {
  correctAnswers: number;
  totalQuestions: number;
  showReward: boolean;
}

const CactiGarden: React.FC<CactiGardenProps> = ({ correctAnswers, totalQuestions, showReward }) => {
  const [celebratingStage, setCelebratingStage] = useState<number | null>(null);
  
  const getCurrentStageIndex = () => {
    return Math.min(correctAnswers, CACTUS_GROWTH_STAGES.length - 1);
  };

  const currentStageIndex = getCurrentStageIndex();
  const currentStage = CACTUS_GROWTH_STAGES[currentStageIndex];

  // Trigger celebration animation when reaching new stage
  useEffect(() => {
    if (showReward && correctAnswers > 0) {
      setCelebratingStage(currentStageIndex);
      const timer = setTimeout(() => {
        setCelebratingStage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showReward, correctAnswers, currentStageIndex]);

  const getMotivationalMessage = () => {
    const progress = (correctAnswers / totalQuestions) * 100;
    if (progress === 100) return "🌵 Desert Master! Your cactus garden is complete!";
    if (progress >= 80) return "🌸 Magnificent growth! Your cactus is blooming!";
    if (progress >= 60) return "🌱 Great progress! Your cactus is thriving!";
    if (progress >= 40) return "🌿 Nice work! Your cactus is growing strong!";
    if (progress > 0) return "🌱 First sprout! Your desert journey has begun!";
    return "🏜️ Plant your first seed with a correct answer!";
  };

  return (
    <div className="relative bg-gradient-to-b from-blue-100 via-orange-100 to-yellow-200 rounded-xl p-6 overflow-hidden border-2 border-amber-300 shadow-lg">
      <DesertBackground />
      
      <div className="relative z-10">
        {/* Enhanced garden header */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-playfair font-bold text-amber-900 mb-2 flex items-center justify-center gap-2">
            <span className="animate-pulse">🌵</span>
            Your Desert Journey
            <span className="animate-pulse" style={{ animationDelay: '0.5s' }}>🌵</span>
          </h3>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-sm text-amber-700 font-special-elite">
              {correctAnswers}/{totalQuestions} questions correct
            </span>
            {correctAnswers > 0 && (
              <span className="text-green-600 animate-bounce">
                {"⭐".repeat(Math.min(correctAnswers, 3))}
              </span>
            )}
          </div>
          
          {/* Progress bar for garden growth */}
          <div className="w-full max-w-xs mx-auto mb-3">
            <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000 ease-out"
                style={{ width: `${(correctAnswers / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Current stage info with enhanced styling */}
          {currentStage && (
            <div className={`mt-3 p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-amber-200 shadow-md transition-all duration-500 ${celebratingStage === currentStageIndex ? 'animate-birthday-glow scale-105' : ''}`}>
              <div className="text-md font-bold text-amber-800 flex items-center justify-center gap-2">
                <span className={`text-xl ${celebratingStage === currentStageIndex ? 'animate-birthday-bounce' : ''}`}>
                  {currentStage.icon}
                </span>
                {currentStage.name}
                {celebratingStage === currentStageIndex && (
                  <span className="animate-bounce">🎉</span>
                )}
              </div>
              <p className="text-xs text-amber-600 mt-1">
                {currentStage.description}
              </p>
            </div>
          )}
        </div>
        
        {/* Enhanced cactus growth stages */}
        <div className="flex justify-center items-end space-x-1 mb-4 overflow-x-auto min-h-[100px]">
          {CACTUS_GROWTH_STAGES.map((stage, index) => (
            <CactusGrowth
              key={stage.id}
              stage={stage}
              isActive={index === currentStageIndex && (showReward || celebratingStage === index)}
              isUnlocked={correctAnswers >= stage.minCorrectAnswers}
            />
          ))}
        </div>
        
        {/* Enhanced motivational message */}
        <div className="text-center mb-4">
          <p className="text-sm text-amber-700 font-special-elite italic">
            {getMotivationalMessage()}
          </p>
        </div>
        
        {/* Enhanced achievement message */}
        {showReward && correctAnswers > 0 && (
          <div className="text-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-300 animate-scale-in shadow-lg">
            <div className="text-lg font-bold text-green-800 flex items-center justify-center gap-2">
              <span className="animate-bounce">🎉</span>
              Correct Answer!
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🌟</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Your desert cactus is growing stronger! Keep going!
            </p>
            
            {/* Growth sparkles */}
            <div className="flex justify-center mt-2 gap-1">
              {[...Array(3)].map((_, i) => (
                <span
                  key={i}
                  className="text-yellow-400 animate-birthday-sparkle"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  ✨
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Perfect score celebration with enhanced effects */}
        {correctAnswers === totalQuestions && totalQuestions > 0 && (
          <div className="text-center mt-4 p-6 bg-gradient-to-r from-pink-100 via-purple-100 to-pink-100 rounded-lg border-2 border-pink-300 shadow-lg animate-birthday-glow">
            <div className="text-xl font-bold text-pink-800 mb-2 flex items-center justify-center gap-2">
              <span className="animate-birthday-bounce">🏆</span>
              Desert Master Achievement!
              <span className="animate-birthday-bounce" style={{ animationDelay: '0.3s' }}>🏆</span>
            </div>
            <p className="text-sm text-pink-700 mb-3">
              You've grown the most magnificent desert cactus on Route 66!
            </p>
            <div className="text-2xl mb-2">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="inline-block animate-birthday-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {['🌵', '✨', '🌸', '✨', '🌵'][i]}
                </span>
              ))}
            </div>
            <p className="text-xs text-pink-600 italic">
              Share your perfect garden with fellow Route 66 enthusiasts!
            </p>
          </div>
        )}
        
        {/* Growth tips for engagement */}
        {correctAnswers < totalQuestions && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 text-center italic">
              💡 Tip: Each correct answer helps your cactus grow through different desert stages!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CactiGarden;
