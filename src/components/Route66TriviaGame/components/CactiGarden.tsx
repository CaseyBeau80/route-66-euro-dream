
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

  const getDesertMotivationalMessage = () => {
    const progress = (correctAnswers / totalQuestions) * 100;
    if (progress === 100) return "🏜️ Desert Master! You've conquered the southwestern wilderness!";
    if (progress >= 80) return "🌺 Your desert knowledge blooms like rare cactus flowers!";
    if (progress >= 60) return "🌵 Standing strong like the desert guardians of Route 66!";
    if (progress >= 40) return "🌿 Growing resilient in the harsh beauty of the Southwest!";
    if (progress > 0) return "🌱 Your desert journey has begun in the Mojave sands!";
    return "🏜️ Every desert adventure starts with a single step into the sand...";
  };

  const getRegionalContext = () => {
    if (correctAnswers === 0) return "Start your journey in the California Mojave Desert";
    if (correctAnswers === 1) return "Travel through the Arizona borderlands";
    if (correctAnswers === 2) return "Explore the vast Sonoran Desert";
    if (correctAnswers === 3) return "Cross into the New Mexico high desert";
    if (correctAnswers === 4) return "Reach the Texas Panhandle plains";
    return "Master of the entire southwestern desert corridor";
  };

  return (
    <div className="relative bg-gradient-to-b from-orange-200 via-amber-100 to-red-200 rounded-xl p-6 overflow-hidden border-2 border-amber-400 shadow-lg">
      <DesertBackground />
      
      <div className="relative z-10">
        {/* Enhanced desert-themed header */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-playfair font-bold text-amber-900 mb-2 flex items-center justify-center gap-2">
            <span className="animate-pulse">🏜️</span>
            Southwest Desert Journey
            <span className="animate-pulse" style={{ animationDelay: '0.5s' }}>🌅</span>
          </h3>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-sm text-amber-800 font-special-elite">
              {correctAnswers}/{totalQuestions} desert milestones
            </span>
            {correctAnswers > 0 && (
              <span className="text-orange-500 animate-bounce">
                {"🌟".repeat(Math.min(correctAnswers, 3))}
              </span>
            )}
          </div>
          
          {/* Desert progress bar */}
          <div className="w-full max-w-xs mx-auto mb-3">
            <div className="h-3 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full overflow-hidden border border-orange-300">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 via-red-400 to-amber-500 transition-all duration-1000 ease-out relative"
                style={{ width: `${(correctAnswers / totalQuestions) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-50 animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Regional context */}
          <div className="text-xs text-orange-700 font-special-elite italic mb-2">
            📍 {getRegionalContext()}
          </div>
          
          {/* Current stage info with desert styling */}
          {currentStage && (
            <div className={`mt-3 p-4 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 backdrop-blur-sm rounded-lg border border-orange-300 shadow-md transition-all duration-500 ${celebratingStage === currentStageIndex ? 'animate-birthday-glow scale-105' : ''}`}>
              <div className="text-md font-bold text-amber-900 flex items-center justify-center gap-2 mb-1">
                <span className={`text-xl ${celebratingStage === currentStageIndex ? 'animate-birthday-bounce' : ''}`}>
                  🌵
                </span>
                {currentStage.name}
                {celebratingStage === currentStageIndex && (
                  <span className="animate-bounce">🎉</span>
                )}
              </div>
              <p className="text-xs text-amber-700 mb-2">
                {currentStage.description}
              </p>
              <p className="text-xs text-orange-600 italic">
                "{currentStage.flavorText}"
              </p>
            </div>
          )}
        </div>
        
        {/* Enhanced desert cactus growth stages */}
        <div className="flex justify-center items-end space-x-2 mb-4 overflow-x-auto min-h-[120px] py-2">
          {CACTUS_GROWTH_STAGES.map((stage, index) => (
            <CactusGrowth
              key={stage.id}
              stage={stage}
              stageIndex={index}
              isActive={index === currentStageIndex && (showReward || celebratingStage === index)}
              isUnlocked={correctAnswers >= stage.minCorrectAnswers}
            />
          ))}
        </div>
        
        {/* Enhanced motivational message */}
        <div className="text-center mb-4">
          <p className="text-sm text-amber-800 font-special-elite italic">
            {getDesertMotivationalMessage()}
          </p>
        </div>
        
        {/* Enhanced achievement message */}
        {showReward && correctAnswers > 0 && (
          <div className="text-center p-4 bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 rounded-lg border-2 border-green-400 animate-scale-in shadow-lg">
            <div className="text-lg font-bold text-green-800 flex items-center justify-center gap-2">
              <span className="animate-bounce">🎉</span>
              Desert Milestone Reached!
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🌟</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Your desert garden grows stronger with each correct answer!
            </p>
            
            {/* Desert sparkles */}
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
        
        {/* Perfect score celebration with desert mastery theme */}
        {correctAnswers === totalQuestions && totalQuestions > 0 && (
          <div className="text-center mt-4 p-6 bg-gradient-to-r from-amber-100 via-orange-100 to-red-100 rounded-lg border-2 border-amber-400 shadow-lg animate-birthday-glow">
            <div className="text-xl font-bold text-amber-800 mb-2 flex items-center justify-center gap-2">
              <span className="animate-birthday-bounce">🏆</span>
              Desert Master Achievement!
              <span className="animate-birthday-bounce" style={{ animationDelay: '0.3s' }}>🏆</span>
            </div>
            <p className="text-sm text-amber-700 mb-3">
              You've mastered the entire Southwest desert corridor from California to Texas!
            </p>
            <div className="text-2xl mb-2">
              {[...Array(7)].map((_, i) => (
                <span
                  key={i}
                  className="inline-block animate-birthday-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {['🏜️', '🌵', '✨', '🌅', '✨', '🌵', '🏜️'][i]}
                </span>
              ))}
            </div>
            <p className="text-xs text-amber-600 italic">
              You've become a true guardian of the Route 66 desert wisdom!
            </p>
          </div>
        )}
        
        {/* Desert survival tips for engagement */}
        {correctAnswers < totalQuestions && (
          <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-xs text-orange-700 text-center italic">
              🌵 Desert Wisdom: Each correct answer helps your cactus adapt to the harsh but beautiful Southwest landscape!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CactiGarden;
