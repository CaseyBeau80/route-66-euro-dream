
import React, { useState } from 'react';
import { GameSession } from './types';
import { TriviaGameService } from './services/TriviaGameService';
import TriviaHeader from './components/TriviaHeader';
import QuestionCard from './components/QuestionCard';
import GameResults from './components/GameResults';
import CactiGarden from './components/CactiGarden';
import { Button } from '@/components/ui/button';

const Route66TriviaGame: React.FC = () => {
  const [gameSession, setGameSession] = useState<GameSession | null>(null);

  const startNewGame = () => {
    const newSession = TriviaGameService.createNewSession();
    setGameSession(newSession);
    console.log('🎮 Route 66 Trivia: Starting new game session with 5 questions');
  };

  const selectAnswer = (option: 'a' | 'b' | 'c') => {
    if (!gameSession) return;
    
    const updatedSession = TriviaGameService.selectAnswer(gameSession, option);
    setGameSession(updatedSession);
    
    console.log(`🎯 Answer selected: ${option}, Correct: ${updatedSession.gameState.selectedAnswers[updatedSession.gameState.selectedAnswers.length - 1]?.isCorrect}`);
  };

  const nextQuestion = () => {
    if (!gameSession) return;
    
    const updatedSession = TriviaGameService.nextQuestion(gameSession);
    setGameSession(updatedSession);
    
    if (updatedSession.gameState.isGameComplete) {
      console.log(`🏁 Game complete! Final score: ${updatedSession.gameState.score}/${updatedSession.questions.length}`);
    }
  };

  if (!gameSession) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-900 via-blue-800 to-red-900 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-white/10 to-blue-500/30"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center">
            {/* Welcome Title */}
            <h2 className="font-playfair text-5xl md:text-6xl font-bold mb-4 relative">
              <span className="bg-gradient-to-r from-red-400 via-white to-blue-400 bg-clip-text text-transparent">
                Route 66 Trivia Game
              </span>
            </h2>
            
            {/* Subtitle */}
            <p className="text-white text-xl font-special-elite mb-8">
              Test your knowledge of America's Mother Road!
            </p>
            
            {/* Game Description */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
              <h3 className="text-white text-lg font-courier-prime font-bold mb-4">
                🎯 How to Play
              </h3>
              <div className="text-white/90 space-y-2 font-special-elite">
                <p>• Answer 5 multiple-choice questions about Route 66</p>
                <p>• Learn fun facts after each answer</p>
                <p>• Grow your desert cactus with correct answers! 🌵</p>
                <p>• Earn your Route 66 achievement badge!</p>
              </div>
            </div>
            
            {/* Start Button */}
            <Button
              onClick={startNewGame}
              className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white px-12 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              🏁 Start Your Journey
            </Button>
            
            {/* Decorative elements */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="w-12 h-px bg-red-400"></div>
              <span className="text-white text-2xl">🛣️</span>
              <div className="w-12 h-px bg-blue-400"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentQuestion = gameSession.questions[gameSession.gameState.currentQuestionIndex];
  const currentAnswer = gameSession.gameState.selectedAnswers.find(
    answer => answer.questionId === currentQuestion?.id
  );

  return (
    <section className="py-16 bg-gradient-to-br from-blue-900 via-blue-800 to-red-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-white/10 to-blue-500/30"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <TriviaHeader 
          gameState={gameSession.gameState} 
          totalQuestions={gameSession.questions.length} 
        />
        
        {gameSession.gameState.isGameComplete ? (
          <div className="space-y-6">
            <GameResults
              gameState={gameSession.gameState}
              totalQuestions={gameSession.questions.length}
              onPlayAgain={startNewGame}
            />
            
            {/* Final cacti garden display */}
            <CactiGarden
              correctAnswers={gameSession.gameState.score}
              totalQuestions={gameSession.questions.length}
              showReward={false}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Question area - takes 2 columns on large screens */}
            <div className="lg:col-span-2 space-y-6">
              <QuestionCard
                question={currentQuestion}
                onSelectAnswer={selectAnswer}
                selectedAnswer={currentAnswer?.selectedOption}
                showExplanation={gameSession.gameState.showExplanation}
              />
              
              {gameSession.gameState.showExplanation && (
                <div className="text-center">
                  <Button
                    onClick={nextQuestion}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    {gameSession.gameState.currentQuestionIndex < gameSession.questions.length - 1 
                      ? '🛣️ Next Question' 
                      : '🏁 See Results'
                    }
                  </Button>
                </div>
              )}
            </div>
            
            {/* Cacti garden - takes 1 column on large screens */}
            <div className="lg:col-span-1">
              <CactiGarden
                correctAnswers={gameSession.gameState.score}
                totalQuestions={gameSession.questions.length}
                showReward={gameSession.gameState.cactiState.showReward}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Route66TriviaGame;
