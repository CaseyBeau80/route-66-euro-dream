
import React from 'react';
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
  const getOptionClass = (option: 'a' | 'b' | 'c') => {
    const baseClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-300 font-special-elite";
    
    if (!selectedAnswer) {
      return `${baseClass} border-gray-300 bg-white hover:border-route66-primary hover:bg-blue-50 hover:transform hover:scale-105`;
    }
    
    if (showExplanation) {
      if (option === question.correctAnswer) {
        return `${baseClass} border-green-500 bg-green-100 text-green-800 ring-2 ring-green-300`;
      } else if (option === selectedAnswer) {
        return `${baseClass} border-red-500 bg-red-100 text-red-800 ring-2 ring-red-300`;
      } else {
        return `${baseClass} border-gray-300 bg-gray-100 text-gray-600`;
      }
    }
    
    if (option === selectedAnswer) {
      return `${baseClass} border-route66-primary bg-blue-100 text-blue-800 ring-2 ring-blue-300`;
    }
    
    return `${baseClass} border-gray-300 bg-gray-100 text-gray-600`;
  };

  const getOptionIcon = (option: 'a' | 'b' | 'c') => {
    if (showExplanation && option === question.correctAnswer) {
      return '✅';
    } else if (showExplanation && option === selectedAnswer && option !== question.correctAnswer) {
      return '❌';
    }
    return '';
  };

  const getOptionLabel = (option: 'a' | 'b' | 'c') => {
    if (showExplanation && option === question.correctAnswer) {
      return 'CORRECT';
    } else if (showExplanation && option === selectedAnswer && option !== question.correctAnswer) {
      return 'YOUR CHOICE';
    }
    return '';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
      {/* Question Header with Category Badge */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold uppercase">
            {question.category}
          </span>
          <span className="text-sm text-gray-500 font-mono">ID: {question.id}</span>
        </div>
        <h3 className="text-xl font-playfair font-semibold text-route66-text-primary">
          {question.question}
        </h3>
      </div>
      
      {/* Options */}
      <div className="space-y-3 mb-6">
        {Object.entries(question.options).map(([key, value]) => {
          const option = key as 'a' | 'b' | 'c';
          return (
            <button
              key={option}
              onClick={() => !selectedAnswer && onSelectAnswer(option)}
              disabled={!!selectedAnswer}
              className={getOptionClass(option)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg uppercase bg-route66-navy text-white w-8 h-8 rounded-full flex items-center justify-center">
                    {key.toUpperCase()}
                  </span>
                  <span>{value}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getOptionLabel(option) && (
                    <span className="text-xs font-bold px-2 py-1 rounded bg-gray-200 text-gray-700">
                      {getOptionLabel(option)}
                    </span>
                  )}
                  <span className="text-xl">{getOptionIcon(option)}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Answer Summary (shown after selection) */}
      {selectedAnswer && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-800">
            <strong>Your answer:</strong> {selectedAnswer.toUpperCase()} - {question.options[selectedAnswer]}
          </div>
          {showExplanation && (
            <div className="text-sm text-blue-700 mt-1">
              <strong>Correct answer:</strong> {question.correctAnswer.toUpperCase()} - {question.options[question.correctAnswer]}
            </div>
          )}
        </div>
      )}
      
      {/* Explanation */}
      {showExplanation && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <p className="text-amber-800 font-courier-prime">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
