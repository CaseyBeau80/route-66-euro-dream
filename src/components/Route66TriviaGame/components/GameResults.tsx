
import React, { useState, useEffect } from 'react';
import { GameState } from '../types';
import { TriviaGameService } from '../services/TriviaGameService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface GameResultsProps {
  gameState: GameState;
  totalQuestions: number;
  onPlayAgain: () => void;
}

const GameResults: React.FC<GameResultsProps> = ({
  gameState,
  totalQuestions,
  onPlayAgain
}) => {
  const { toast } = useToast();
  const [showStatsAnimation, setShowStatsAnimation] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  
  const scoreMessage = TriviaGameService.getScoreMessage(gameState.score, totalQuestions);
  const badge = TriviaGameService.getAchievementBadge(gameState.score, totalQuestions);
  const percentage = Math.round((gameState.score / totalQuestions) * 100);

  // Animate score counting
  useEffect(() => {
    setShowStatsAnimation(true);
    const timer = setTimeout(() => {
      let current = 0;
      const increment = gameState.score / 20; // Animate over 20 steps
      const counter = setInterval(() => {
        current += increment;
        if (current >= gameState.score) {
          setAnimatedScore(gameState.score);
          clearInterval(counter);
        } else {
          setAnimatedScore(Math.floor(current));
        }
      }, 50);
      
      return () => clearInterval(counter);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [gameState.score]);

  const getBadgeColor = () => {
    if (percentage === 100) return 'from-yellow-400 to-yellow-600';
    if (percentage >= 80) return 'from-blue-400 to-blue-600';
    if (percentage >= 60) return 'from-green-400 to-green-600';
    if (percentage >= 40) return 'from-purple-400 to-purple-600';
    return 'from-gray-400 to-gray-600';
  };

  const getScoreEmoji = () => {
    if (percentage === 100) return '🏆';
    if (percentage >= 80) return '⭐';
    if (percentage >= 60) return '🛣️';
    if (percentage >= 40) return '🚗';
    return '🗺️';
  };

  const handleShareScore = async () => {
    const shareText = `I just scored ${gameState.score}/${totalQuestions} (${percentage}%) on the Route 66 Trivia Game! 🛣️ Can you beat my score?`;
    
    // Try Web Share API first if available
    if (navigator.share && navigator.canShare) {
      try {
        await navigator.share({
          title: 'Route 66 Trivia Game Score',
          text: shareText,
          url: window.location.href
        });
        
        toast({
          title: "Score Shared! 🎉",
          description: "Thanks for sharing your Route 66 knowledge!",
        });
        return;
      } catch (error) {
        // If user cancels sharing, don't show error
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        // Fall through to clipboard fallback for other errors
        console.log('Web Share API failed, falling back to clipboard');
      }
    }
    
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "Score Copied! 📋",
        description: "Your score has been copied to clipboard. Paste it anywhere to share!",
      });
    } catch (clipboardError) {
      // Final fallback - create a text selection
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        toast({
          title: "Score Ready to Share! 📝",
          description: "Your score text has been selected. Press Ctrl+C (or Cmd+C) to copy!",
        });
      } catch (execError) {
        toast({
          title: "Share Your Score Manually 🏆",
          description: shareText,
          duration: 8000,
        });
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  return (
    <div className="text-center space-y-6">
      {/* Enhanced results header */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 border-2 border-gray-200 relative overflow-hidden animate-scale-in">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
        
        <div className="relative z-10">
          <h3 className="text-3xl font-playfair font-bold text-route66-text-primary mb-4 flex items-center justify-center gap-3">
            <span className="animate-bounce">{getScoreEmoji()}</span>
            Trip Complete!
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🏁</span>
          </h3>
          
          {/* Enhanced score display with animation */}
          <div className="mb-6">
            <div className={`text-6xl font-bold text-route66-primary mb-2 transition-all duration-500 ${showStatsAnimation ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
              {animatedScore}/{totalQuestions}
            </div>
            <div className="text-2xl text-route66-text-secondary font-special-elite">
              {percentage}% Correct
            </div>
            
            {/* Visual score bar */}
            <div className="w-full max-w-md mx-auto mt-4">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${getBadgeColor()} transition-all duration-1000 ease-out`}
                  style={{ 
                    width: showStatsAnimation ? `${percentage}%` : '0%',
                    transitionDelay: '0.5s'
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Enhanced achievement badge */}
          <div className={`mb-6 animate-scale-in`} style={{ animationDelay: '0.8s' }}>
            <div className={`inline-block bg-gradient-to-r ${getBadgeColor()} text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg relative`}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shield-shine rounded-full" />
              <span className="relative flex items-center gap-2">
                🏆 {badge}
              </span>
            </div>
          </div>
          
          {/* Performance feedback with personality */}
          <div className={`mb-6 animate-fade-in`} style={{ animationDelay: '1s' }}>
            <p className="text-lg text-route66-text-primary font-courier-prime mb-2">
              {scoreMessage}
            </p>
            
            {/* Personalized encouragement */}
            {percentage === 100 && (
              <p className="text-sm text-route66-text-secondary italic">
                You've truly mastered the Mother Road! Share your perfect score! 🌟
              </p>
            )}
            {percentage >= 80 && percentage < 100 && (
              <p className="text-sm text-route66-text-secondary italic">
                Excellent work! You're ready for the real Route 66 adventure! 🚗
              </p>
            )}
            {percentage >= 60 && percentage < 80 && (
              <p className="text-sm text-route66-text-secondary italic">
                Great job! A few more trips and you'll be a Route 66 expert! 🛣️
              </p>
            )}
            {percentage < 60 && (
              <p className="text-sm text-route66-text-secondary italic">
                Every expert was once a beginner. Ready for another adventure? 🌵
              </p>
            )}
          </div>
          
          {/* Enhanced action buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center animate-fade-in`} style={{ animationDelay: '1.2s' }}>
            <Button
              onClick={onPlayAgain}
              className="group bg-route66-primary hover:bg-route66-primary-dark text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative flex items-center gap-2">
                🎮 Play Again
                <span className="text-sm opacity-75">(R)</span>
              </span>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleShareScore}
              className="group border-route66-primary text-route66-primary hover:bg-route66-primary hover:text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative flex items-center gap-2">
                📱 Share Score
              </span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Enhanced answer review */}
      <div className={`bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border-2 border-gray-200 animate-fade-in`} style={{ animationDelay: '0.4s' }}>
        <h4 className="text-xl font-playfair font-bold text-route66-text-primary mb-4 flex items-center justify-center gap-2">
          📋 Your Journey Summary
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-4">
          {gameState.selectedAnswers.map((answer, index) => (
            <div
              key={answer.questionId}
              className={`p-3 rounded-lg text-center font-bold transition-all duration-300 hover:scale-105 ${
                answer.isCorrect 
                  ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                  : 'bg-red-100 text-red-800 border-2 border-red-300'
              } animate-scale-in`}
              style={{ animationDelay: `${1.4 + index * 0.1}s` }}
            >
              <div className="text-lg mb-1">
                {answer.isCorrect ? '✅' : '❌'}
              </div>
              <div className="text-xs">
                Q{index + 1}
              </div>
            </div>
          ))}
        </div>
        
        {/* Performance stats */}
        <div className="flex justify-center gap-8 text-sm text-route66-text-secondary">
          <div className="text-center">
            <div className="font-bold text-green-600">{gameState.score}</div>
            <div>Correct</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-red-600">{totalQuestions - gameState.score}</div>
            <div>Missed</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-blue-600">{percentage}%</div>
            <div>Accuracy</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameResults;
