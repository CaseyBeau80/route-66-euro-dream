
import React from 'react';
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
  const scoreMessage = TriviaGameService.getScoreMessage(gameState.score, totalQuestions);
  const badge = TriviaGameService.getAchievementBadge(gameState.score, totalQuestions);
  const percentage = Math.round((gameState.score / totalQuestions) * 100);

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
      {/* Results Header */}
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
        <h3 className="text-3xl font-playfair font-bold text-route66-text-primary mb-4">
          🏁 Trip Complete!
        </h3>
        
        {/* Score Display */}
        <div className="mb-6">
          <div className="text-6xl font-bold text-route66-primary mb-2">
            {gameState.score}/{totalQuestions}
          </div>
          <div className="text-2xl text-route66-text-secondary font-special-elite">
            {percentage}% Correct
          </div>
        </div>
        
        {/* Achievement Badge */}
        <div className="mb-6">
          <div className="inline-block bg-gradient-to-r from-amber-400 to-amber-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
            🏆 {badge}
          </div>
        </div>
        
        {/* Score Message */}
        <p className="text-lg text-route66-text-primary font-courier-prime mb-6">
          {scoreMessage}
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onPlayAgain}
            className="bg-route66-primary hover:bg-route66-primary-dark text-white px-8 py-3 rounded-lg font-bold text-lg"
          >
            🎮 Play Again
          </Button>
          
          <Button
            variant="outline"
            onClick={handleShareScore}
            className="border-route66-primary text-route66-primary hover:bg-route66-primary hover:text-white px-8 py-3 rounded-lg font-bold text-lg"
          >
            📱 Share Score
          </Button>
        </div>
      </div>
      
      {/* Answer Review */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
        <h4 className="text-xl font-playfair font-bold text-route66-text-primary mb-4">
          📋 Your Answers
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {gameState.selectedAnswers.map((answer, index) => (
            <div
              key={answer.questionId}
              className={`p-2 rounded-lg text-center font-bold ${
                answer.isCorrect 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}
            >
              Q{index + 1}: {answer.isCorrect ? '✅' : '❌'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameResults;
