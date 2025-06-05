
import React from 'react';
import { GameState } from '../types';

interface TriviaHeaderProps {
  gameState: GameState;
  totalQuestions: number;
}

const TriviaHeader: React.FC<TriviaHeaderProps> = ({ gameState, totalQuestions }) => {
  const currentQuestionNumber = gameState.currentQuestionIndex + 1;

  return (
    <div className="text-center mb-8">
      {/* Main title */}
      <div className="relative inline-block mb-4">
        <h2 className="font-playfair text-4xl md:text-5xl font-bold text-route66-text-primary relative">
          <span className="bg-gradient-to-r from-red-600 via-white to-blue-600 bg-clip-text text-transparent">
            Route 66 Trivia Game
          </span>
        </h2>
        
        {/* Neon glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-white to-blue-500 bg-clip-text text-transparent opacity-50 blur-sm">
          Route 66 Trivia Game
        </div>
        
        {/* Decorative underline */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-red-500 via-white to-blue-500 rounded-full"></div>
      </div>
      
      {/* Progress indicator */}
      {!gameState.isGameComplete && (
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="bg-route66-navy text-white px-4 py-2 rounded-lg font-courier-prime font-bold">
            🛣️ Trivia Stop #{currentQuestionNumber}
          </div>
          <div className="text-route66-text-secondary font-special-elite">
            Question {currentQuestionNumber} of {totalQuestions}
          </div>
        </div>
      )}
      
      {/* Score display */}
      <div className="flex items-center justify-center gap-2 text-route66-text-secondary">
        <span className="font-courier-prime text-sm">Current Score:</span>
        <span className="bg-amber-500 text-white px-3 py-1 rounded-full font-bold">
          {gameState.score}/{currentQuestionNumber - (gameState.showExplanation ? 0 : 1)}
        </span>
      </div>
      
      {/* Decorative elements */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="w-8 h-px bg-red-400"></div>
        <span className="text-white text-lg">⭐</span>
        <div className="w-8 h-px bg-blue-400"></div>
      </div>
    </div>
  );
};

export default TriviaHeader;
