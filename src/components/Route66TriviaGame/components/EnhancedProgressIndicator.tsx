
import React from 'react';
import { GameState } from '../types';
import GameControls from './GameControls';

interface EnhancedProgressIndicatorProps {
  gameState: GameState;
  totalQuestions: number;
  onRestart?: () => void;
  onQuit?: () => void;
}

const EnhancedProgressIndicator: React.FC<EnhancedProgressIndicatorProps> = ({ 
  gameState, 
  totalQuestions,
  onRestart,
  onQuit
}) => {
  const currentProgress = ((gameState.currentQuestionIndex + 1) / totalQuestions) * 100;
  
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20">
      {/* Question counter with milestone indicators and game controls */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-white font-courier-prime text-sm">
            Question {gameState.currentQuestionIndex + 1} of {totalQuestions}
          </span>
          {gameState.currentQuestionIndex >= 2 && (
            <span className="text-yellow-400 animate-bounce">🔥</span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-white font-bold">
            Score: {gameState.score}/{totalQuestions}
          </div>
          
          {/* Game Controls */}
          {onRestart && onQuit && (
            <GameControls
              onRestart={onRestart}
              onQuit={onQuit}
              currentScore={gameState.score}
              totalQuestions={totalQuestions}
              className="hidden sm:flex"
            />
          )}
        </div>
      </div>
      
      {/* Mobile game controls */}
      {onRestart && onQuit && (
        <div className="sm:hidden mb-3">
          <GameControls
            onRestart={onRestart}
            onQuit={onQuit}
            currentScore={gameState.score}
            totalQuestions={totalQuestions}
            className="flex justify-center"
          />
        </div>
      )}
      
      {/* Enhanced progress bar */}
      <div className="relative w-full h-3 bg-white/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-full transition-all duration-700 ease-out relative"
          style={{ width: `${currentProgress}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shield-shine" />
        </div>
        
        {/* Milestone markers */}
        {[...Array(totalQuestions)].map((_, index) => (
          <div
            key={index}
            className={`absolute top-0 w-px h-full ${
              index <= gameState.currentQuestionIndex ? 'bg-yellow-300' : 'bg-white/40'
            }`}
            style={{ left: `${((index + 1) / totalQuestions) * 100}%` }}
          />
        ))}
      </div>
      
      {/* Streak indicator */}
      {gameState.score > 0 && (
        <div className="flex items-center justify-center mt-2 gap-1">
          {[...Array(gameState.score)].map((_, i) => (
            <span 
              key={i} 
              className="text-green-400 animate-scale-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              ⭐
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedProgressIndicator;
