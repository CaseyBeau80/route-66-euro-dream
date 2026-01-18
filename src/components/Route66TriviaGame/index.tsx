
import React, { useState, useEffect } from 'react';
import { GameSession } from './types';
import { TriviaGameService } from './services/TriviaGameService';
import TriviaHeader from './components/TriviaHeader';
import QuestionCard from './components/QuestionCard';
import GameResults from './components/GameResults';
import CactiGarden from './components/CactiGarden';
import CelebrationEffects from './components/CelebrationEffects';
import EnhancedProgressIndicator from './components/EnhancedProgressIndicator';
import { Button } from '@/components/ui/button';

const Route66TriviaGame: React.FC = () => {
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [questionTransition, setQuestionTransition] = useState(false);

  const startNewGame = () => {
    const newSession = TriviaGameService.createNewSession();
    setGameSession(newSession);
    setShowCelebration(false);
    console.log('🎮 Route 66 Trivia: Starting new game session with 5 questions');
  };

  const handleQuitGame = () => {
    setGameSession(null);
    setShowCelebration(false);
    console.log('🚪 Route 66 Trivia: Player quit the game');
  };

  const selectAnswer = (option: 'a' | 'b' | 'c') => {
    if (!gameSession) return;
    
    const updatedSession = TriviaGameService.selectAnswer(gameSession, option);
    setGameSession(updatedSession);
    
    const currentAnswer = updatedSession.gameState.selectedAnswers[updatedSession.gameState.selectedAnswers.length - 1];
    console.log(`🎯 Answer selected: ${option}, Correct: ${currentAnswer?.isCorrect}`);

    // Track GA4 event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'trivia_question_answered', {
        answer_selected: option,
        is_correct: currentAnswer?.isCorrect,
        question_index: updatedSession.gameState.selectedAnswers.length
      });
    }
    
    // Show celebration for correct answers
    if (currentAnswer?.isCorrect) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
    
    // Log if game auto-completed
    if (updatedSession.gameState.isGameComplete) {
      console.log('🏁 Game auto-completed after last question answered!');
      // Show final celebration
      setTimeout(() => {
        setShowCelebration(true);
      }, 1000);
    }
  };

  const nextQuestion = () => {
    if (!gameSession) return;
    
    // Trigger transition animation
    setQuestionTransition(true);
    
    setTimeout(() => {
      const updatedSession = TriviaGameService.nextQuestion(gameSession);
      setGameSession(updatedSession);
      setQuestionTransition(false);
      
      if (updatedSession.gameState.isGameComplete) {
        console.log(`🏁 Game complete! Final score: ${updatedSession.gameState.score}/${updatedSession.questions.length}`);
      }
    }, 300);
  };

  // Enhanced keyboard navigation with quit and restart shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameSession) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startNewGame();
        }
        return;
      }

      // Quit game with Q key
      if (e.key.toLowerCase() === 'q' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        handleQuitGame();
        return;
      }

      // Restart game with R key
      if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        startNewGame();
        return;
      }

      const currentQuestion = gameSession.questions[gameSession.gameState.currentQuestionIndex];
      const currentAnswer = gameSession.gameState.selectedAnswers.find(
        answer => answer.questionId === currentQuestion?.id
      );

      // Answer selection with keyboard
      if (!currentAnswer && ['1', '2', '3', 'a', 'b', 'c'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        let option: 'a' | 'b' | 'c';
        if (['1', 'a'].includes(e.key.toLowerCase())) option = 'a';
        else if (['2', 'b'].includes(e.key.toLowerCase())) option = 'b';
        else option = 'c';
        selectAnswer(option);
      }

      // Next question navigation
      if (gameSession.gameState.showExplanation && !gameSession.gameState.isGameComplete) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
          e.preventDefault();
          nextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameSession]);

  if (!gameSession) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-900 via-blue-800 to-red-900 relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-white/10 to-blue-500/30"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center">
            {/* Enhanced welcome title with animation */}
            <h2 className="font-playfair text-5xl md:text-6xl font-bold mb-4 relative animate-fade-in">
              <span className="bg-gradient-to-r from-red-400 via-white to-blue-400 bg-clip-text text-transparent animate-subtle-gradient">
                Route 66 Trivia Game
              </span>
              <div className="absolute -top-4 -right-4 text-yellow-400 animate-bounce">
                ✨
              </div>
            </h2>
            
            {/* Enhanced subtitle */}
            <p className="text-white text-xl font-special-elite mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Test your knowledge of America's Mother Road!
            </p>
            
            {/* Enhanced game description */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20 animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-white text-lg font-courier-prime font-bold mb-4 flex items-center justify-center gap-2">
                <span role="img" aria-label="target" className="animate-bounce">🎯</span> 
                How to Play
              </h3>
              <div className="text-white/90 space-y-2 font-special-elite">
                <p className="flex items-center justify-center gap-2">
                  <span className="text-blue-300">•</span> Answer 5 multiple-choice questions about Route 66
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span className="text-blue-300">•</span> Learn fun facts after each answer
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span className="text-blue-300">•</span> Grow your desert cactus with correct answers! 
                  <span role="img" aria-label="cactus" className="animate-pulse">🌵</span>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span className="text-blue-300">•</span> Earn your Route 66 achievement badge!
                </p>
                <div className="mt-4 p-3 bg-amber-500/20 rounded-lg border border-amber-300/30">
                  <p className="text-amber-200 text-sm">
                    💡 Use keyboard shortcuts: Press 1-3 or A-C to answer, Enter/Space to continue, R to restart, Q to quit
                  </p>
                </div>
              </div>
            </div>
            
            {/* Enhanced start button */}
            <div className="md:static md:transform-none sticky bottom-6 left-0 right-0 z-50 px-6 md:px-0 animate-scale-in" style={{ animationDelay: '0.6s' }}>
              <Button
                onClick={startNewGame}
                className="group w-full md:w-auto bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white px-12 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent relative overflow-hidden"
                aria-label="Start your Route 66 trivia journey"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span role="img" aria-label="checkered flag" className="animate-highway-blink">🏁</span> 
                Start Your Journey
              </Button>
            </div>
            
            {/* Enhanced decorative elements */}
            <div className="flex items-center justify-center gap-4 mt-8 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-red-400 animate-pulse"></div>
              <span role="img" aria-label="highway" className="text-white text-2xl animate-nostalgic-glow">🛣️</span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-blue-400 animate-pulse"></div>
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
      {/* Enhanced background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-white/10 to-blue-500/30"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Enhanced progress indicator with game controls */}
        <EnhancedProgressIndicator 
          gameState={gameSession.gameState} 
          totalQuestions={gameSession.questions.length}
          onRestart={startNewGame}
          onQuit={handleQuitGame}
        />
        
        {gameSession.gameState.isGameComplete ? (
          <div className="space-y-6 animate-fade-in">
            <GameResults
              gameState={gameSession.gameState}
              totalQuestions={gameSession.questions.length}
              onPlayAgain={startNewGame}
            />
            
            {/* Enhanced final cacti garden display */}
            <div className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <CactiGarden
                correctAnswers={gameSession.gameState.score}
                totalQuestions={gameSession.questions.length}
                showReward={false}
              />
            </div>
          </div>
        ) : (
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-300 ${questionTransition ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
            {/* Question area - takes 2 columns on large screens */}
            <div className="lg:col-span-2 space-y-6">
              <QuestionCard
                question={currentQuestion}
                onSelectAnswer={selectAnswer}
                selectedAnswer={currentAnswer?.selectedOption}
                showExplanation={gameSession.gameState.showExplanation}
              />
              
              {/* Enhanced next button with better styling */}
              {gameSession.gameState.showExplanation && !gameSession.gameState.isGameComplete && (
                <div className="text-center animate-fade-in">
                  <Button
                    onClick={nextQuestion}
                    className="group bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <span role="img" aria-label="highway" className="animate-bounce">🛣️</span> 
                    Next Question
                    <span className="ml-2 text-sm opacity-75">(Enter)</span>
                  </Button>
                </div>
              )}
            </div>
            
            {/* Enhanced cacti garden - takes 1 column on large screens */}
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

      {/* Celebration effects overlay */}
      <CelebrationEffects
        isVisible={showCelebration}
        score={gameSession.gameState.score}
        totalQuestions={gameSession.questions.length}
      />
    </section>
  );
};

export default Route66TriviaGame;
