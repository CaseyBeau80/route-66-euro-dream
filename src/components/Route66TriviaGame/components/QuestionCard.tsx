
import React, { useState, useEffect } from 'react';
import { TriviaQuestion } from '../types';

interface QuestionCardProps {
  question: TriviaQuestion;
  onSelectAnswer: (option: 'a' | 'b' | 'c') => void;
  selectedAnswer?: 'a' | 'b' | 'c';
  showExplanation: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onSelectAnswer,
  selectedAnswer,
  showExplanation
}) => {
  const [hoveredOption, setHoveredOption] = useState<'a' | 'b' | 'c' | null>(null);
  const [answerRevealed, setAnswerRevealed] = useState(false);

  // Trigger answer reveal animation
  useEffect(() => {
    if (showExplanation && !answerRevealed) {
      setAnswerRevealed(true);
    }
  }, [showExplanation, answerRevealed]);

  const getOptionClass = (option: 'a' | 'b' | 'c') => {
    const baseClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-300 font-special-elite relative overflow-hidden group";
    
    if (!selectedAnswer) {
      const hoverClass = hoveredOption === option 
        ? "border-route66-primary bg-blue-50 scale-[1.02] shadow-lg" 
        : "border-gray-300 bg-white hover:border-route66-primary hover:bg-blue-50 hover:scale-[1.01] hover:shadow-md";
      return `${baseClass} ${hoverClass}`;
    }
    
    if (showExplanation) {
      if (option === question.correctAnswer) {
        return `${baseClass} border-green-500 bg-green-100 text-green-800 ring-2 ring-green-300 shadow-lg animate-scale-in`;
      } else if (option === selectedAnswer) {
        return `${baseClass} border-red-500 bg-red-100 text-red-800 ring-2 ring-red-300 shadow-lg animate-scale-in`;
      } else {
        return `${baseClass} border-gray-300 bg-gray-100 text-gray-600 opacity-70`;
      }
    }
    
    if (option === selectedAnswer) {
      return `${baseClass} border-route66-primary bg-blue-100 text-blue-800 ring-2 ring-blue-300 shadow-lg`;
    }
    
    return `${baseClass} border-gray-300 bg-gray-100 text-gray-600`;
  };

  const getOptionIcon = (option: 'a' | 'b' | 'c') => {
    if (showExplanation && option === question.correctAnswer) {
      return <span className="text-xl animate-bounce">✅</span>;
    } else if (showExplanation && option === selectedAnswer && option !== question.correctAnswer) {
      return <span className="text-xl animate-pulse">❌</span>;
    }
    return null;
  };

  const getOptionLabel = (option: 'a' | 'b' | 'c') => {
    if (showExplanation && option === question.correctAnswer) {
      return <span className="text-xs font-bold px-2 py-1 rounded bg-green-200 text-green-800 animate-fade-in">CORRECT</span>;
    } else if (showExplanation && option === selectedAnswer && option !== question.correctAnswer) {
      return <span className="text-xs font-bold px-2 py-1 rounded bg-red-200 text-red-800 animate-fade-in">YOUR CHOICE</span>;
    }
    return null;
  };

  const handleOptionClick = (option: 'a' | 'b' | 'c') => {
    if (!selectedAnswer) {
      onSelectAnswer(option);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, option: 'a' | 'b' | 'c') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOptionClick(option);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border-2 border-gray-200 animate-fade-in">
      {/* Enhanced question header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-sm font-bold uppercase border border-blue-300">
            {question.category}
          </span>
          {showExplanation && selectedAnswer === question.correctAnswer && (
            <span className="text-green-600 animate-bounce">🎉</span>
          )}
        </div>
        <h3 className="text-xl font-playfair font-semibold text-route66-text-primary leading-relaxed">
          {question.question}
        </h3>
      </div>
      
      {/* Enhanced options with animations */}
      <div className="space-y-3 mb-6">
        {Object.entries(question.options).map(([key, value]) => {
          const option = key as 'a' | 'b' | 'c';
          return (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              onKeyDown={(e) => handleKeyPress(e, option)}
              onMouseEnter={() => !selectedAnswer && setHoveredOption(option)}
              onMouseLeave={() => setHoveredOption(null)}
              disabled={!!selectedAnswer}
              className={getOptionClass(option)}
              aria-label={`Option ${key.toUpperCase()}: ${value}`}
              tabIndex={selectedAnswer ? -1 : 0}
            >
              {/* Hover shine effect */}
              {!selectedAnswer && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              )}
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <span className={`font-bold text-lg uppercase bg-route66-navy text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    hoveredOption === option && !selectedAnswer ? 'scale-110 shadow-lg' : ''
                  }`}>
                    {key.toUpperCase()}
                  </span>
                  <span className="flex-1">{value}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getOptionLabel(option)}
                  {getOptionIcon(option)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Enhanced answer summary */}
      {selectedAnswer && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in">
          <div className="text-sm text-blue-800 mb-2">
            <strong>Your answer:</strong> {selectedAnswer.toUpperCase()} - {question.options[selectedAnswer]}
          </div>
          {showExplanation && (
            <div className="text-sm text-blue-700">
              <strong>Correct answer:</strong> {question.correctAnswer.toUpperCase()} - {question.options[question.correctAnswer]}
            </div>
          )}
        </div>
      )}
      
      {/* Enhanced explanation with animation */}
      {showExplanation && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-inner animate-scale-in">
          <div className="flex items-start gap-3">
            <span className="text-amber-600 text-xl flex-shrink-0 animate-pulse">💡</span>
            <div>
              <h4 className="font-bold text-amber-800 mb-2">Did you know?</h4>
              <p className="text-amber-800 font-courier-prime leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Keyboard hints */}
      {!selectedAnswer && (
        <div className="mt-4 text-center text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
          💡 Keyboard shortcuts: Press <kbd className="bg-white px-1 rounded border">1</kbd>, <kbd className="bg-white px-1 rounded border">2</kbd>, <kbd className="bg-white px-1 rounded border">3</kbd> or <kbd className="bg-white px-1 rounded border">A</kbd>, <kbd className="bg-white px-1 rounded border">B</kbd>, <kbd className="bg-white px-1 rounded border">C</kbd> to answer
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
