
import React from 'react';
import { CACTUS_GROWTH_STAGES } from '../types/cactiTypes';
import CactusGrowth from './CactusGrowth';
import DesertBackground from './DesertBackground';

interface CactiGardenProps {
  correctAnswers: number;
  totalQuestions: number;
  showReward: boolean;
}

const CactiGarden: React.FC<CactiGardenProps> = ({ correctAnswers, totalQuestions, showReward }) => {
  const getCurrentStageIndex = () => {
    return Math.min(correctAnswers, CACTUS_GROWTH_STAGES.length - 1);
  };

  const currentStageIndex = getCurrentStageIndex();
  const currentStage = CACTUS_GROWTH_STAGES[currentStageIndex];

  return (
    <div className="relative bg-gradient-to-b from-blue-100 via-orange-100 to-yellow-200 rounded-xl p-6 overflow-hidden border-2 border-amber-300">
      <DesertBackground />
      
      <div className="relative z-10">
        {/* Garden header */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-playfair font-bold text-amber-900 mb-2">
            🌵 Your Desert Journey
          </h3>
          <p className="text-sm text-amber-700 font-special-elite">
            {correctAnswers}/{totalQuestions} questions correct
          </p>
          
          {/* Current stage info */}
          {currentStage && (
            <div className="mt-3 p-3 bg-white/70 rounded-lg border border-amber-200">
              <div className="text-md font-bold text-amber-800 flex items-center justify-center gap-2">
                <span className="text-xl">{currentStage.icon}</span>
                {currentStage.name}
              </div>
              <p className="text-xs text-amber-600 mt-1">
                {currentStage.description}
              </p>
            </div>
          )}
        </div>
        
        {/* Cactus growth stages */}
        <div className="flex justify-center items-end space-x-2 mb-4 overflow-x-auto">
          {CACTUS_GROWTH_STAGES.map((stage, index) => (
            <CactusGrowth
              key={stage.id}
              stage={stage}
              isActive={index === currentStageIndex && showReward}
              isUnlocked={correctAnswers >= stage.minCorrectAnswers}
            />
          ))}
        </div>
        
        {/* Achievement message */}
        {showReward && correctAnswers > 0 && (
          <div className="text-center p-4 bg-green-100 rounded-lg border-2 border-green-300 animate-fade-in">
            <div className="text-lg font-bold text-green-800 flex items-center justify-center gap-2">
              🎉 Correct Answer!
            </div>
            <p className="text-sm text-green-700 mt-1">
              Your desert cactus is growing stronger!
            </p>
          </div>
        )}
        
        {/* Perfect score celebration */}
        {correctAnswers === totalQuestions && totalQuestions > 0 && (
          <div className="text-center mt-4 p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg border-2 border-pink-300">
            <div className="text-xl font-bold text-pink-800 mb-2">
              🏆 Desert Master Achievement! 🏆
            </div>
            <p className="text-sm text-pink-700">
              You've grown the most magnificent desert cactus on Route 66!
            </p>
            <div className="text-2xl mt-2 animate-bounce">
              🌵✨🌸✨🌵
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CactiGarden;
